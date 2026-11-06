from django.urls import path
from .views import (
    PublicProviderListView,
    PublicProviderDetailView,
    ProviderDashboardProfileView,
    ProviderWorkingHoursView,
    ProviderBlackoutDatesView,
)

urlpatterns = [
    path('public/', PublicProviderListView.as_view(), name='public-provider-list'),
    path('public/<int:pk>/', PublicProviderDetailView.as_view(), name='public-provider-detail'),
    path('me/', ProviderDashboardProfileView.as_view(), name='provider-me'),
    path('me/working-hours/', ProviderWorkingHoursView.as_view(), name='provider-working-hours'),
    path('me/blackout-dates/', ProviderBlackoutDatesView.as_view(), name='provider-blackout-dates'),
]
