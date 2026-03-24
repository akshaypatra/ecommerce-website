import hmac
import hashlib
import json
import razorpay
import stripe
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from orders.models import Order, OrderStatusHistory
from .models import Payment
from .serializers import (
    RazorpayInitSerializer, RazorpayVerifySerializer,
    StripeInitSerializer, PaymentSerializer,
)

stripe.api_key = settings.STRIPE_SECRET_KEY


# ─────────────────────────────── RAZORPAY ────────────────────────────────────

class RazorpayCreateOrderView(APIView):
    """
    POST /api/payments/razorpay/create/
    Creates a Razorpay order and returns the order details needed by frontend.
    Flow: Backend creates Razorpay order → Frontend opens checkout → Verify on backend
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = RazorpayInitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            order = Order.objects.get(order_id=serializer.validated_data['order_id'], user=request.user)
        except Order.DoesNotExist:
            return Response({'detail': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        if order.payment_status == 'paid':
            return Response({'detail': 'Order already paid.'}, status=status.HTTP_400_BAD_REQUEST)

        # Amount in paise (Razorpay uses smallest currency unit)
        amount_paise = int(order.total * 100)

        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        rz_order = client.order.create({
            'amount': amount_paise,
            'currency': 'INR',
            'receipt': str(order.order_id),
            'notes': {'order_id': str(order.order_id), 'user': request.user.email},
        })

        # Save payment record
        payment, _ = Payment.objects.update_or_create(
            order=order,
            defaults={
                'user': request.user,
                'gateway': 'razorpay',
                'status': 'created',
                'amount': order.total,
                'currency': 'INR',
                'gateway_order_id': rz_order['id'],
                'raw_response': rz_order,
            }
        )

        order.payment_method = 'razorpay'
        order.save(update_fields=['payment_method'])

        return Response({
            'razorpay_key': settings.RAZORPAY_KEY_ID,
            'razorpay_order_id': rz_order['id'],
            'amount': amount_paise,
            'currency': 'INR',
            'order_id': str(order.order_id),
            'name': request.user.full_name or request.user.email,
            'email': request.user.email,
            'contact': request.user.phone,
        })


class RazorpayVerifyView(APIView):
    """
    POST /api/payments/razorpay/verify/
    Verifies the Razorpay payment signature after successful checkout.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = RazorpayVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        rz_order_id = serializer.validated_data['razorpay_order_id']
        rz_payment_id = serializer.validated_data['razorpay_payment_id']
        rz_signature = serializer.validated_data['razorpay_signature']

        # Verify signature
        msg = f'{rz_order_id}|{rz_payment_id}'
        generated_signature = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            msg.encode(),
            hashlib.sha256,
        ).hexdigest()

        if not hmac.compare_digest(generated_signature, rz_signature):
            return Response({'detail': 'Invalid payment signature.'}, status=status.HTTP_400_BAD_REQUEST)

        # Update payment record
        try:
            payment = Payment.objects.get(gateway_order_id=rz_order_id, user=request.user)
        except Payment.DoesNotExist:
            return Response({'detail': 'Payment record not found.'}, status=status.HTTP_404_NOT_FOUND)

        payment.gateway_payment_id = rz_payment_id
        payment.gateway_signature = rz_signature
        payment.status = 'captured'
        payment.save()

        # Update order
        order = payment.order
        order.payment_status = 'paid'
        order.status = 'confirmed'
        order.save(update_fields=['payment_status', 'status'])

        OrderStatusHistory.objects.create(
            order=order, status='confirmed',
            note='Payment received via Razorpay.',
        )

        return Response({'detail': 'Payment verified successfully.', 'payment': PaymentSerializer(payment).data})


@method_decorator(csrf_exempt, name='dispatch')
class RazorpayWebhookView(APIView):
    """
    POST /api/payments/razorpay/webhook/
    Handles Razorpay webhooks (payment.captured, payment.failed).
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        payload = request.body
        webhook_secret = getattr(settings, 'RAZORPAY_WEBHOOK_SECRET', '')

        if webhook_secret:
            received_sig = request.headers.get('X-Razorpay-Signature', '')
            expected_sig = hmac.new(
                webhook_secret.encode(),
                payload,
                hashlib.sha256,
            ).hexdigest()
            if not hmac.compare_digest(expected_sig, received_sig):
                return Response({'detail': 'Invalid signature.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            data = json.loads(payload)
        except json.JSONDecodeError:
            return Response({'detail': 'Invalid JSON.'}, status=status.HTTP_400_BAD_REQUEST)

        event = data.get('event')
        entity = data.get('payload', {}).get('payment', {}).get('entity', {})
        rz_order_id = entity.get('order_id', '')

        try:
            payment = Payment.objects.get(gateway_order_id=rz_order_id)
        except Payment.DoesNotExist:
            return Response(status=status.HTTP_200_OK)

        if event == 'payment.captured':
            payment.status = 'captured'
            payment.gateway_payment_id = entity.get('id', '')
            payment.raw_response = data
            payment.save()
            payment.order.payment_status = 'paid'
            payment.order.status = 'confirmed'
            payment.order.save(update_fields=['payment_status', 'status'])

        elif event == 'payment.failed':
            payment.status = 'failed'
            payment.failure_reason = entity.get('error_description', '')
            payment.save()
            payment.order.payment_status = 'failed'
            payment.order.save(update_fields=['payment_status'])

        return Response(status=status.HTTP_200_OK)


# ─────────────────────────────── STRIPE ──────────────────────────────────────

class StripeCreatePaymentIntentView(APIView):
    """
    POST /api/payments/stripe/create/
    Creates a Stripe PaymentIntent and returns client_secret to the frontend.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = StripeInitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            order = Order.objects.get(
                order_id=serializer.validated_data['order_id'],
                user=request.user,
            )
        except Order.DoesNotExist:
            return Response({'detail': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        if order.payment_status == 'paid':
            return Response({'detail': 'Order already paid.'}, status=status.HTTP_400_BAD_REQUEST)

        currency = serializer.validated_data.get('currency', 'inr').lower()
        amount_cents = int(order.total * 100)

        intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency=currency,
            metadata={
                'order_id': str(order.order_id),
                'user_id': str(request.user.id),
                'user_email': request.user.email,
            },
        )

        payment, _ = Payment.objects.update_or_create(
            order=order,
            defaults={
                'user': request.user,
                'gateway': 'stripe',
                'status': 'pending',
                'amount': order.total,
                'currency': currency.upper(),
                'gateway_order_id': intent['id'],
                'raw_response': dict(intent),
            }
        )

        order.payment_method = 'stripe'
        order.save(update_fields=['payment_method'])

        return Response({
            'client_secret': intent['client_secret'],
            'payment_intent_id': intent['id'],
            'amount': amount_cents,
            'currency': currency,
            'publishable_key': settings.STRIPE_PUBLISHABLE_KEY,
        })


@method_decorator(csrf_exempt, name='dispatch')
class StripeWebhookView(APIView):
    """
    POST /api/payments/stripe/webhook/
    Handles Stripe webhooks (payment_intent.succeeded, payment_intent.payment_failed).
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE', '')
        webhook_secret = settings.STRIPE_WEBHOOK_SECRET

        try:
            event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
        except (ValueError, stripe.error.SignatureVerificationError) as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        intent = event.get('data', {}).get('object', {})
        intent_id = intent.get('id', '')

        try:
            payment = Payment.objects.get(gateway_order_id=intent_id, gateway='stripe')
        except Payment.DoesNotExist:
            return Response(status=status.HTTP_200_OK)

        if event['type'] == 'payment_intent.succeeded':
            payment.status = 'captured'
            payment.gateway_payment_id = intent.get('latest_charge', '')
            payment.raw_response = intent
            payment.save()

            order = payment.order
            order.payment_status = 'paid'
            order.status = 'confirmed'
            order.save(update_fields=['payment_status', 'status'])

            OrderStatusHistory.objects.create(
                order=order, status='confirmed',
                note='Payment received via Stripe.',
            )

        elif event['type'] == 'payment_intent.payment_failed':
            payment.status = 'failed'
            payment.failure_reason = intent.get('last_payment_error', {}).get('message', '')
            payment.save()
            payment.order.payment_status = 'failed'
            payment.order.save(update_fields=['payment_status'])

        return Response(status=status.HTTP_200_OK)


class PaymentDetailView(APIView):
    """GET /api/payments/<order_id>/  - Retrieve payment details for an order"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, order_id):
        try:
            payment = Payment.objects.get(order__order_id=order_id, user=request.user)
        except Payment.DoesNotExist:
            return Response({'detail': 'Payment not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(PaymentSerializer(payment).data)
