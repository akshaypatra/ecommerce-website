from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.AdminUserViewSet, basename='admin-users')
router.register(r'addresses', views.AdminAddressViewSet, basename='admin-addresses')
router.register(r'categories', views.AdminCategoryViewSet, basename='admin-categories')
router.register(r'products', views.AdminProductViewSet, basename='admin-products')
router.register(r'product-images', views.AdminProductImageViewSet, basename='admin-product-images')
router.register(r'reviews', views.AdminReviewViewSet, basename='admin-reviews')
router.register(r'carts', views.AdminCartViewSet, basename='admin-carts')
router.register(r'orders', views.AdminOrderViewSet, basename='admin-orders')
router.register(r'payments', views.AdminPaymentViewSet, basename='admin-payments')

urlpatterns = [
    path('dashboard/', views.dashboard_stats, name='admin-dashboard'),
    path('', include(router.urls)),
]
