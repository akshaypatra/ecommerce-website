from django.core.cache import cache
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions, status, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Category, Product, ProductImage, Review
from .serializers import (
    CategorySerializer, ProductListSerializer,
    ProductDetailSerializer, ProductWriteSerializer, ReviewSerializer,
)
from .filters import ProductFilter

CATEGORY_CACHE_KEY = 'categories_list'
PRODUCT_LIST_CACHE_KEY = 'product_list'
CACHE_TTL = 300  # 5 minutes


class CategoryListView(APIView):
    """
    GET /api/products/categories/
    Returns all root categories (with nested children).
    Cached in Redis for 5 minutes.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        cached = cache.get(CATEGORY_CACHE_KEY)
        if cached:
            return Response(cached)

        queryset = Category.objects.filter(is_active=True, parent__isnull=True).prefetch_related('children')
        serializer = CategorySerializer(queryset, many=True, context={'request': request})
        data = serializer.data
        cache.set(CATEGORY_CACHE_KEY, data, CACHE_TTL)
        return Response(data)


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET / PATCH / DELETE /api/products/categories/<pk>/"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'pk'

    def perform_update(self, serializer):
        serializer.save()
        cache.delete(CATEGORY_CACHE_KEY)

    def perform_destroy(self, instance):
        instance.delete()
        cache.delete(CATEGORY_CACHE_KEY)


class CategoryCreateView(generics.CreateAPIView):
    """POST /api/products/categories/create/"""
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        serializer.save()
        cache.delete(CATEGORY_CACHE_KEY)


class ProductListView(generics.ListAPIView):
    """
    GET /api/products/
    Supports: search, filter by category/price/rating, ordering.
    Product list is cached in Redis.
    """
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'category__name']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']

    def get_queryset(self):
        return Product.objects.filter(is_active=True).select_related('category').prefetch_related('images', 'reviews')

    def list(self, request, *args, **kwargs):
        # Only cache unfiltered/unsearched default listing
        query_params = request.query_params
        if not any(query_params.values()):
            cached = cache.get(PRODUCT_LIST_CACHE_KEY)
            if cached:
                return Response(cached)
            response = super().list(request, *args, **kwargs)
            cache.set(PRODUCT_LIST_CACHE_KEY, response.data, CACHE_TTL)
            return response
        return super().list(request, *args, **kwargs)


class ProductDetailView(generics.RetrieveAPIView):
    """GET /api/products/<pk>/"""
    serializer_class = ProductDetailSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Product.objects.filter(is_active=True).select_related('category').prefetch_related('images', 'reviews__user')


class ProductCreateView(generics.CreateAPIView):
    """POST /api/products/create/  (Admin only)"""
    serializer_class = ProductWriteSerializer
    permission_classes = [permissions.IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        serializer.save()
        cache.delete(PRODUCT_LIST_CACHE_KEY)


class ProductUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """PATCH / DELETE /api/products/<pk>/manage/  (Admin only)"""
    serializer_class = ProductWriteSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Product.objects.all()

    def perform_update(self, serializer):
        serializer.save()
        cache.delete(PRODUCT_LIST_CACHE_KEY)
        cache.delete(f'product_detail_{self.kwargs["pk"]}')

    def perform_destroy(self, instance):
        cache.delete(PRODUCT_LIST_CACHE_KEY)
        cache.delete(f'product_detail_{instance.pk}')
        instance.delete()


class ProductImageUploadView(APIView):
    """POST /api/products/<pk>/images/  (Admin only)"""
    permission_classes = [permissions.IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, pk):
        product = Product.objects.get(pk=pk)
        images = request.FILES.getlist('images')
        is_primary = request.data.get('is_primary', False)
        created = []
        for img in images:
            pi = ProductImage.objects.create(product=product, image=img, is_primary=bool(is_primary))
            created.append({'id': pi.id, 'image': request.build_absolute_uri(pi.image.url)})
        return Response(created, status=status.HTTP_201_CREATED)


class ReviewListCreateView(generics.ListCreateAPIView):
    """GET / POST /api/products/<pk>/reviews/"""
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        return Review.objects.filter(product_id=self.kwargs['pk']).select_related('user')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, product_id=self.kwargs['pk'])
