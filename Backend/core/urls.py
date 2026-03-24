"""
URL configuration for core project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth Service
    path('api/auth/', include('users.urls')),

    # Product Service
    path('api/products/', include('products.urls')),

    # Cart Service
    path('api/cart/', include('cart.urls')),

    # Order Service
    path('api/orders/', include('orders.urls')),

    # Payment Service
    path('api/payments/', include('payments.urls')),

    # Social Auth (Google OAuth redirect)
    path('social-auth/', include('social_django.urls', namespace='social')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
