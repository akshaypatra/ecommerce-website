from django.urls import path
from . import views

urlpatterns = [
    path('', views.OrderListView.as_view(), name='order-list'),
    path('create/', views.CreateOrderView.as_view(), name='order-create'),
    path('admin/', views.AdminOrderListView.as_view(), name='order-admin-list'),
    path('<uuid:order_id>/', views.OrderDetailView.as_view(), name='order-detail'),
    path('<uuid:order_id>/status/', views.UpdateOrderStatusView.as_view(), name='order-status'),
    path('<uuid:order_id>/invoice/', views.InvoiceDownloadView.as_view(), name='order-invoice'),
    path('<uuid:order_id>/cancel/', views.CancelOrderView.as_view(), name='order-cancel'),
    path('<uuid:order_id>/revert-payment/', views.AdminRevertPaymentView.as_view(), name='order-revert-payment'),
]
