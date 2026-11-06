from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomerProfileView, SavedAddressViewSet

router = DefaultRouter()
router.register(r'addresses', SavedAddressViewSet, basename='customer-addresses')

urlpatterns = [
    path('profile/', CustomerProfileView.as_view(), name='customer-profile'),
    path('', include(router.urls)),
]
