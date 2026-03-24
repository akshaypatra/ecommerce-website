from django.urls import path
from . import views

urlpatterns = [
    # Categories
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('categories/create/', views.CategoryCreateView.as_view(), name='category-create'),
    path('categories/<int:pk>/', views.CategoryDetailView.as_view(), name='category-detail'),

    # Products
    path('', views.ProductListView.as_view(), name='product-list'),
    path('create/', views.ProductCreateView.as_view(), name='product-create'),
    path('<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('<int:pk>/manage/', views.ProductUpdateDeleteView.as_view(), name='product-manage'),
    path('<int:pk>/images/', views.ProductImageUploadView.as_view(), name='product-images'),
    path('<int:pk>/reviews/', views.ReviewListCreateView.as_view(), name='product-reviews'),
]
