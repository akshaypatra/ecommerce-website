from rest_framework import viewsets, status, filters
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, Count, Q

from users.models import User, Address
from products.models import Category, Product, ProductImage, Review
from cart.models import Cart, CartItem
from orders.models import Order, OrderItem, OrderStatusHistory
from payments.models import Payment

from .serializers import (
    AdminUserSerializer, AdminUserCreateSerializer, AdminAddressSerializer,
    AdminCategorySerializer, AdminProductSerializer, AdminProductImageSerializer,
    AdminReviewSerializer,
    AdminCartSerializer, AdminCartItemSerializer,
    AdminOrderListSerializer, AdminOrderDetailSerializer,
    AdminOrderItemSerializer, AdminOrderStatusHistorySerializer,
    AdminPaymentSerializer,
)


class AdminPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


# ─── Dashboard ───────────────────────────────────────────────
@api_view(['GET'])
@permission_classes([IsAdminUser])
def dashboard_stats(request):
    total_revenue = Order.objects.filter(
        payment_status='paid'
    ).aggregate(total=Sum('total'))['total'] or 0

    orders_by_status = dict(
        Order.objects.values_list('status').annotate(count=Count('id')).order_by('status')
    )
    payments_by_status = dict(
        Payment.objects.values_list('status').annotate(count=Count('id')).order_by('status')
    )

    recent_orders = Order.objects.select_related('user').order_by('-created_at')[:10]
    recent_users = User.objects.order_by('-date_joined')[:10]

    data = {
        'total_users': User.objects.count(),
        'total_products': Product.objects.count(),
        'total_orders': Order.objects.count(),
        'total_revenue': str(total_revenue),
        'total_categories': Category.objects.count(),
        'total_reviews': Review.objects.count(),
        'total_payments': Payment.objects.count(),
        'active_carts': Cart.objects.count(),
        'recent_orders': AdminOrderListSerializer(recent_orders, many=True).data,
        'recent_users': AdminUserSerializer(recent_users, many=True).data,
        'orders_by_status': orders_by_status,
        'payments_by_status': payments_by_status,
    }
    return Response(data)


# ─── Users ───────────────────────────────────────────────────
class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    permission_classes = [IsAdminUser]
    pagination_class = AdminPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['email', 'first_name', 'last_name', 'phone']
    filterset_fields = ['is_active', 'is_staff', 'is_superuser']
    ordering_fields = ['email', 'date_joined', 'first_name']

    def get_serializer_class(self):
        if self.action == 'create':
            return AdminUserCreateSerializer
        return AdminUserSerializer

    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        user = self.get_object()
        user.is_active = not user.is_active
        user.save(update_fields=['is_active'])
        return Response({'is_active': user.is_active})

    @action(detail=True, methods=['post'])
    def toggle_staff(self, request, pk=None):
        user = self.get_object()
        user.is_staff = not user.is_staff
        user.save(update_fields=['is_staff'])
        return Response({'is_staff': user.is_staff})


# ─── Addresses ───────────────────────────────────────────────
class AdminAddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.select_related('user').all().order_by('-created_at')
    serializer_class = AdminAddressSerializer
    permission_classes = [IsAdminUser]
    pagination_class = AdminPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['user__email', 'full_name', 'city']
    filterset_fields = ['address_type', 'country']


# ─── Categories ──────────────────────────────────────────────
class AdminCategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = AdminCategorySerializer
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    pagination_class = AdminPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name']
    filterset_fields = ['is_active', 'parent']


# ─── Products ────────────────────────────────────────────────
class AdminProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category').prefetch_related('images', 'reviews').all()
    serializer_class = AdminProductSerializer
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    pagination_class = AdminPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'sku', 'description']
    filterset_fields = ['is_active', 'is_featured', 'category']
    ordering_fields = ['name', 'price', 'stock', 'created_at']

    def perform_create(self, serializer):
        product = serializer.save()
        images = self.request.FILES.getlist('images')
        for i, img in enumerate(images):
            ProductImage.objects.create(
                product=product, image=img,
                is_primary=(i == 0 and not product.images.filter(is_primary=True).exists()),
                order=i,
            )

    def perform_update(self, serializer):
        product = serializer.save()
        images = self.request.FILES.getlist('images')
        for i, img in enumerate(images):
            ProductImage.objects.create(
                product=product, image=img,
                is_primary=(i == 0 and not product.images.filter(is_primary=True).exists()),
                order=product.images.count() + i,
            )

    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        product = self.get_object()
        product.is_active = not product.is_active
        product.save(update_fields=['is_active'])
        return Response({'is_active': product.is_active})

    @action(detail=True, methods=['post'])
    def toggle_featured(self, request, pk=None):
        product = self.get_object()
        product.is_featured = not product.is_featured
        product.save(update_fields=['is_featured'])
        return Response({'is_featured': product.is_featured})


# ─── Product Images ──────────────────────────────────────────
class AdminProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.select_related('product').all()
    serializer_class = AdminProductImageSerializer
    permission_classes = [IsAdminUser]
    pagination_class = AdminPagination
    filterset_fields = ['product', 'is_primary']


# ─── Reviews ─────────────────────────────────────────────────
class AdminReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.select_related('product', 'user').all().order_by('-created_at')
    serializer_class = AdminReviewSerializer
    permission_classes = [IsAdminUser]
    pagination_class = AdminPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['product__name', 'user__email', 'title']
    filterset_fields = ['rating', 'product']


# ─── Carts ───────────────────────────────────────────────────
class AdminCartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.select_related('user').prefetch_related('items__product').all()
    serializer_class = AdminCartSerializer
    permission_classes = [IsAdminUser]
    pagination_class = AdminPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['user__email']


# ─── Orders ──────────────────────────────────────────────────
class AdminOrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.select_related('user').prefetch_related(
        'items__product', 'status_history__changed_by'
    ).all()
    permission_classes = [IsAdminUser]
    pagination_class = AdminPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['order_id', 'user__email', 'shipping_full_name']
    filterset_fields = ['status', 'payment_status', 'payment_method']
    ordering_fields = ['created_at', 'total', 'status']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return AdminOrderDetailSerializer
        return AdminOrderListSerializer

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        note = request.data.get('note', '')
        valid_statuses = [s[0] for s in Order.STATUS_CHOICES]
        if new_status not in valid_statuses:
            return Response(
                {'error': f'Invalid status. Must be one of: {valid_statuses}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        order.status = new_status
        order.save(update_fields=['status'])
        OrderStatusHistory.objects.create(
            order=order, status=new_status, note=note, changed_by=request.user
        )
        return Response(AdminOrderDetailSerializer(order).data)


# ─── Payments ────────────────────────────────────────────────
class AdminPaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.select_related('order', 'user').all()
    serializer_class = AdminPaymentSerializer
    permission_classes = [IsAdminUser]
    pagination_class = AdminPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['order__order_id', 'user__email', 'gateway_order_id', 'gateway_payment_id']
    filterset_fields = ['gateway', 'status']
    ordering_fields = ['created_at', 'amount']
