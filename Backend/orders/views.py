from django.http import HttpResponse
from django.utils import timezone
from datetime import timedelta
from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from cart.models import Cart
from users.models import Address
from .models import Order, OrderItem, OrderStatusHistory
from .serializers import OrderSerializer, CreateOrderSerializer, UpdateOrderStatusSerializer
from .invoice import generate_invoice_pdf


class CreateOrderView(APIView):
    """
    POST /api/orders/create/
    Creates an order from the user's cart.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Fetch cart
        try:
            cart = Cart.objects.prefetch_related('items__product').get(user=request.user)
        except Cart.DoesNotExist:
            return Response({'detail': 'Cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        if not cart.items.exists():
            return Response({'detail': 'Cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch address
        try:
            address = Address.objects.get(pk=serializer.validated_data['address_id'], user=request.user)
        except Address.DoesNotExist:
            return Response({'detail': 'Address not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Validate stock
        for item in cart.items.all():
            if item.product.stock < item.quantity:
                return Response(
                    {'detail': f'Insufficient stock for {item.product.name}.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Create Order
        order = Order.objects.create(
            user=request.user,
            shipping_full_name=address.full_name,
            shipping_phone=address.phone,
            shipping_address_line1=address.address_line1,
            shipping_address_line2=address.address_line2,
            shipping_city=address.city,
            shipping_state=address.state,
            shipping_pincode=address.pincode,
            shipping_country=address.country,
            notes=serializer.validated_data.get('notes', ''),
            shipping_charge=serializer.validated_data.get('shipping_charge', 0),
        )

        # Create OrderItems & deduct stock
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                product_name=cart_item.product.name,
                product_price=cart_item.product.effective_price,
                quantity=cart_item.quantity,
            )
            cart_item.product.stock -= cart_item.quantity
            cart_item.product.save(update_fields=['stock'])

        # Calculate totals
        order.calculate_totals()

        # Record initial status history
        OrderStatusHistory.objects.create(order=order, status='pending', note='Order placed.')

        # Clear cart
        cart.items.all().delete()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderListView(generics.ListAPIView):
    """GET /api/orders/  - List current user's orders"""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items', 'status_history')


class OrderDetailView(generics.RetrieveAPIView):
    """GET /api/orders/<order_id>/"""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'order_id'

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items', 'status_history')


class UpdateOrderStatusView(APIView):
    """
    PATCH /api/orders/<order_id>/status/  (Admin only)
    Update order status and optionally tracking number.
    """
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, order_id):
        try:
            order = Order.objects.get(order_id=order_id)
        except Order.DoesNotExist:
            return Response({'detail': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UpdateOrderStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        old_status = order.status
        new_status = serializer.validated_data['status']
        order.status = new_status

        tracking = serializer.validated_data.get('tracking_number', '')
        if tracking:
            order.tracking_number = tracking

        order.save(update_fields=['status', 'tracking_number'])

        OrderStatusHistory.objects.create(
            order=order,
            status=new_status,
            note=serializer.validated_data.get('note', f'Status changed from {old_status} to {new_status}'),
            changed_by=request.user,
        )

        return Response(OrderSerializer(order).data)


class CancelOrderView(APIView):
    """
    POST /api/orders/<order_id>/cancel/
    User can cancel an order within 24 hours of placing it.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, order_id):
        try:
            order = Order.objects.get(order_id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({'detail': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Already cancelled or delivered
        if order.status in ('cancelled', 'delivered', 'refunded'):
            return Response(
                {'detail': f'Order cannot be cancelled. Current status: {order.status}.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check 24-hour window
        time_since_order = timezone.now() - order.created_at
        if time_since_order > timedelta(hours=24):
            return Response(
                {'detail': 'Cancellation window has expired. Orders can only be cancelled within 24 hours of placing.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        old_status = order.status
        order.status = 'cancelled'
        order.save(update_fields=['status'])

        # Restore product stock
        for item in order.items.all():
            item.product.stock += item.quantity
            item.product.save(update_fields=['stock'])

        OrderStatusHistory.objects.create(
            order=order,
            status='cancelled',
            note=f'Cancelled by customer (was {old_status}). Reason: {request.data.get("reason", "No reason provided")}',
            changed_by=request.user,
        )

        return Response(OrderSerializer(order).data)


class AdminRevertPaymentView(APIView):
    """
    POST /api/orders/<order_id>/revert-payment/  (Admin only)
    Admin can revert/refund payment for a cancelled order.
    """
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, order_id):
        try:
            order = Order.objects.get(order_id=order_id)
        except Order.DoesNotExist:
            return Response({'detail': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        if order.status != 'cancelled':
            return Response(
                {'detail': 'Payment can only be reverted for cancelled orders.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if order.payment_status == 'refunded':
            return Response(
                {'detail': 'Payment has already been refunded.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.payment_status = 'refunded'
        order.status = 'refunded'
        order.save(update_fields=['payment_status', 'status'])

        OrderStatusHistory.objects.create(
            order=order,
            status='refunded',
            note=f'Payment refunded by admin. Amount: ₹{order.total}',
            changed_by=request.user,
        )

        return Response(OrderSerializer(order).data)


class AdminOrderListView(generics.ListAPIView):
    """GET /api/orders/admin/  (Admin only) - All orders"""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAdminUser]
    filterset_fields = ['status', 'payment_status']
    search_fields = ['user__email', 'order_id', 'shipping_full_name']
    ordering_fields = ['created_at', 'total']

    def get_queryset(self):
        return Order.objects.all().prefetch_related('items', 'status_history').select_related('user')


class InvoiceDownloadView(APIView):
    """GET /api/orders/<order_id>/invoice/  - Download PDF invoice"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, order_id):
        try:
            order = Order.objects.prefetch_related('items').get(order_id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({'detail': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        if order.payment_status != 'paid':
            return Response({'detail': 'Invoice available only for paid orders.'}, status=status.HTTP_400_BAD_REQUEST)

        pdf_bytes = generate_invoice_pdf(order)
        response = HttpResponse(pdf_bytes, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="invoice_{str(order.order_id)[:8]}.pdf"'
        return response
