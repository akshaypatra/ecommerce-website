from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('order', 'user', 'gateway', 'status', 'amount', 'currency', 'created_at')
    list_filter = ('gateway', 'status')
    search_fields = ('order__order_id', 'user__email', 'gateway_order_id', 'gateway_payment_id')
    readonly_fields = ('created_at', 'updated_at', 'raw_response')
    ordering = ('-created_at',)
