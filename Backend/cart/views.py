from django.core.cache import cache
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from products.models import Product
from .models import Cart, CartItem
from .serializers import CartSerializer, AddToCartSerializer, CartItemSerializer

CART_CACHE_PREFIX = 'cart_user_'
CART_CACHE_TTL = 600  # 10 minutes


def get_cart_cache_key(user_id):
    return f'{CART_CACHE_PREFIX}{user_id}'


class CartView(APIView):
    """
    GET  /api/cart/        - View cart
    DELETE /api/cart/      - Clear entire cart
    """
    permission_classes = [permissions.IsAuthenticated]

    def _serialize_cart(self, cart, request):
        return CartSerializer(cart, context={'request': request}).data

    def get(self, request):
        cache_key = get_cart_cache_key(request.user.id)
        cached = cache.get(cache_key)
        if cached:
            return Response(cached)

        cart, _ = Cart.objects.get_or_create(user=request.user)
        data = self._serialize_cart(cart, request)
        cache.set(cache_key, data, CART_CACHE_TTL)
        return Response(data)

    def delete(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart.items.all().delete()
        cache.delete(get_cart_cache_key(request.user.id))
        return Response({'detail': 'Cart cleared.'}, status=status.HTTP_204_NO_CONTENT)


class AddToCartView(APIView):
    """POST /api/cart/add/"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product_id = serializer.validated_data['product_id']
        quantity = serializer.validated_data['quantity']

        try:
            product = Product.objects.get(pk=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response({'detail': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)

        if product.stock < quantity:
            return Response(
                {'detail': f'Only {product.stock} items available.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cart, _ = Cart.objects.get_or_create(user=request.user)
        item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            new_qty = item.quantity + quantity
            if product.stock < new_qty:
                return Response(
                    {'detail': f'Cannot add more. Only {product.stock} in stock.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            item.quantity = new_qty
            item.save()
        else:
            item.quantity = quantity
            item.save()

        cache.delete(get_cart_cache_key(request.user.id))
        return Response(CartItemSerializer(item, context={'request': request}).data, status=status.HTTP_201_CREATED)


class UpdateCartItemView(APIView):
    """
    PATCH /api/cart/items/<item_id>/  - update quantity
    DELETE /api/cart/items/<item_id>/ - remove item
    """
    permission_classes = [permissions.IsAuthenticated]

    def _get_item(self, request, item_id):
        try:
            return CartItem.objects.get(pk=item_id, cart__user=request.user)
        except CartItem.DoesNotExist:
            return None

    def patch(self, request, item_id):
        item = self._get_item(request, item_id)
        if not item:
            return Response({'detail': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)

        quantity = request.data.get('quantity')
        if not quantity or int(quantity) < 1:
            return Response({'detail': 'Quantity must be >= 1.'}, status=status.HTTP_400_BAD_REQUEST)

        quantity = int(quantity)
        if item.product.stock < quantity:
            return Response({'detail': f'Only {item.product.stock} in stock.'}, status=status.HTTP_400_BAD_REQUEST)

        item.quantity = quantity
        item.save()
        cache.delete(get_cart_cache_key(request.user.id))
        return Response(CartItemSerializer(item, context={'request': request}).data)

    def delete(self, request, item_id):
        item = self._get_item(request, item_id)
        if not item:
            return Response({'detail': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)
        item.delete()
        cache.delete(get_cart_cache_key(request.user.id))
        return Response(status=status.HTTP_204_NO_CONTENT)
