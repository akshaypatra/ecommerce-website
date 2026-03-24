from rest_framework import serializers
from .models import Order, OrderItem, OrderStatusHistory
from users.serializers import AddressSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_price', 'quantity', 'subtotal']


class OrderStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatusHistory
        fields = ['status', 'note', 'created_at']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_history = OrderStatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_id', 'user',
            'shipping_full_name', 'shipping_phone',
            'shipping_address_line1', 'shipping_address_line2',
            'shipping_city', 'shipping_state', 'shipping_pincode', 'shipping_country',
            'status', 'payment_status', 'payment_method',
            'subtotal', 'discount', 'shipping_charge', 'total',
            'notes', 'tracking_number',
            'items', 'status_history',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'order_id', 'user', 'payment_status', 'subtotal', 'total', 'created_at', 'updated_at']


class CreateOrderSerializer(serializers.Serializer):
    address_id = serializers.IntegerField()
    notes = serializers.CharField(required=False, allow_blank=True)
    shipping_charge = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)


class UpdateOrderStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Order.STATUS_CHOICES)
    note = serializers.CharField(required=False, allow_blank=True)
    tracking_number = serializers.CharField(required=False, allow_blank=True)
