from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import (
    CustomTokenObtainPairSerializer,
    RegisterCustomerSerializer,
    RegisterProviderSerializer,
    UserSerializer,
)

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Login endpoint: authenticates email & password, returns JWT tokens and user metadata.
    """
    serializer_class = CustomTokenObtainPairSerializer


class RegisterCustomerView(generics.CreateAPIView):
    """
    Customer self-registration endpoint.
    """
    queryset = User.objects.all()
    serializer_class = RegisterCustomerSerializer
    permission_classes = [permissions.AllowAny]


class RegisterProviderView(generics.CreateAPIView):
    """
    Provider registration endpoint. Creates user and linked pending ProviderProfile.
    """
    queryset = User.objects.all()
    serializer_class = RegisterProviderSerializer
    permission_classes = [permissions.AllowAny]


class CurrentUserView(generics.RetrieveUpdateAPIView):
    """
    Endpoint for viewing or updating the currently authenticated user's profile.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
