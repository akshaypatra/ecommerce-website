from django.urls import path
from . import views

urlpatterns = [
    # Razorpay
    path('razorpay/create/', views.RazorpayCreateOrderView.as_view(), name='razorpay-create'),
    path('razorpay/verify/', views.RazorpayVerifyView.as_view(), name='razorpay-verify'),
    path('razorpay/webhook/', views.RazorpayWebhookView.as_view(), name='razorpay-webhook'),

    # Stripe
    path('stripe/create/', views.StripeCreatePaymentIntentView.as_view(), name='stripe-create'),
    path('stripe/webhook/', views.StripeWebhookView.as_view(), name='stripe-webhook'),

    # Generic
    path('<uuid:order_id>/', views.PaymentDetailView.as_view(), name='payment-detail'),
]
