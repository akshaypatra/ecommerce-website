from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id', 'order', 'gateway', 'status', 'amount', 'currency',
            'gateway_order_id', 'gateway_payment_id', 'created_at',
        ]
        read_only_fields = fields


class RazorpayInitSerializer(serializers.Serializer):
    order_id = serializers.UUIDField()


class RazorpayVerifySerializer(serializers.Serializer):
    razorpay_order_id = serializers.CharField()
    razorpay_payment_id = serializers.CharField()
    razorpay_signature = serializers.CharField()


class StripeInitSerializer(serializers.Serializer):
    order_id = serializers.UUIDField()
    currency = serializers.CharField(default='inr', max_length=5)
