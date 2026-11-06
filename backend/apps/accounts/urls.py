from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView,
    RegisterCustomerView,
    RegisterProviderView,
    CurrentUserView,
)

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/customer/', RegisterCustomerView.as_view(), name='register_customer'),
    path('register/provider/', RegisterProviderView.as_view(), name='register_provider'),
    path('me/', CurrentUserView.as_view(), name='current_user'),
]
