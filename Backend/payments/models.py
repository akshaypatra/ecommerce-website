from django.db import models
from django.conf import settings
from orders.models import Order


class Payment(models.Model):
    GATEWAY_CHOICES = [
        ('razorpay', 'Razorpay'),
        ('stripe', 'Stripe'),
        ('cod', 'Cash on Delivery'),
    ]
    STATUS_CHOICES = [
        ('created', 'Created'),
        ('pending', 'Pending'),
        ('captured', 'Captured'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payments')
    gateway = models.CharField(max_length=20, choices=GATEWAY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='created')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=5, default='INR')

    # Gateway-specific IDs
    gateway_order_id = models.CharField(max_length=200, blank=True)   # razorpay order id / stripe payment intent id
    gateway_payment_id = models.CharField(max_length=200, blank=True)  # razorpay payment id / stripe charge id
    gateway_signature = models.CharField(max_length=500, blank=True)   # razorpay signature

    raw_response = models.JSONField(null=True, blank=True)  # full gateway response
    failure_reason = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'payments'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.gateway} | {self.order.order_id} | {self.status}'
