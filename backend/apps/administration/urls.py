from django.urls import path
from .views import (
    AdminDashboardStatsView,
    AdminProviderListView,
    AdminProviderVerificationView,
    AdminCustomerListView,
    AdminCustomerActionView,
)

urlpatterns = [
    path('stats/', AdminDashboardStatsView.as_view(), name='admin-stats'),
    path('providers/', AdminProviderListView.as_view(), name='admin-provider-list'),
    path('providers/<int:pk>/verify/', AdminProviderVerificationView.as_view(), name='admin-provider-verify'),
    path('customers/', AdminCustomerListView.as_view(), name='admin-customer-list'),
    path('customers/<int:pk>/action/', AdminCustomerActionView.as_view(), name='admin-customer-action'),
]
