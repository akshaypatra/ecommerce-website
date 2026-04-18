from rest_framework import serializers
from users.models import User, Address
from products.models import Category, Product, ProductImage, Review
from cart.models import Cart, CartItem
from orders.models import Order, OrderItem, OrderStatusHistory
from payments.models import Payment


# ─── User Serializers ────────────────────────────────────────
class AdminUserSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    orders_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'phone', 'avatar',
            'is_active', 'is_staff', 'is_superuser', 'date_joined', 'updated_at',
            'full_name', 'orders_count',
        ]
        read_only_fields = ['date_joined', 'updated_at']

    def get_orders_count(self, obj):
        return obj.orders.count() if hasattr(obj, 'orders') else 0


class AdminUserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'phone', 'password',
                  'is_active', 'is_staff', 'is_superuser']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class AdminAddressSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Address
        fields = '__all__'


# ─── Product Serializers ─────────────────────────────────────
class AdminCategorySerializer(serializers.ModelSerializer):
    products_count = serializers.SerializerMethodField()
    parent_name = serializers.CharField(source='parent.name', read_only=True, default=None)

    class Meta:
        model = Category
        fields = '__all__'

    def get_products_count(self, obj):
        return obj.products.count()


class AdminProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = '__all__'


class AdminProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True, default=None)
    images = AdminProductImageSerializer(many=True, read_only=True)
    average_rating = serializers.ReadOnlyField()
    effective_price = serializers.ReadOnlyField()
    reviews_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_reviews_count(self, obj):
        return obj.reviews.count()


class AdminReviewSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = Review
        fields = '__all__'


# ─── Cart Serializers ────────────────────────────────────────
class AdminCartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = '__all__'


class AdminCartSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    items = AdminCartItemSerializer(many=True, read_only=True)
    total_price = serializers.ReadOnlyField()
    total_items = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = '__all__'


# ─── Order Serializers ───────────────────────────────────────
class AdminOrderItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = '__all__'


class AdminOrderStatusHistorySerializer(serializers.ModelSerializer):
    changed_by_email = serializers.CharField(source='changed_by.email', read_only=True, default=None)

    class Meta:
        model = OrderStatusHistory
        fields = '__all__'


class AdminOrderListSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    items_count = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'order_id', 'user', 'user_email', 'status', 'payment_status',
            'payment_method', 'subtotal', 'discount', 'shipping_charge', 'total',
            'shipping_city', 'shipping_state', 'tracking_number',
            'created_at', 'updated_at', 'items_count',
        ]

    def get_items_count(self, obj):
        return obj.items.count()


class AdminOrderDetailSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    items = AdminOrderItemSerializer(many=True, read_only=True)
    status_history = AdminOrderStatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'


# ─── Payment Serializers ─────────────────────────────────────
class AdminPaymentSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    order_id_display = serializers.CharField(source='order.order_id', read_only=True)

    class Meta:
        model = Payment
        fields = '__all__'


# ─── Dashboard Serializers ───────────────────────────────────
class DashboardStatsSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    total_products = serializers.IntegerField()
    total_orders = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=14, decimal_places=2)
    total_categories = serializers.IntegerField()
    total_reviews = serializers.IntegerField()
    total_payments = serializers.IntegerField()
    active_carts = serializers.IntegerField()
    recent_orders = AdminOrderListSerializer(many=True)
    recent_users = AdminUserSerializer(many=True)
    orders_by_status = serializers.DictField()
    payments_by_status = serializers.DictField()
