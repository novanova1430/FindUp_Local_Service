from rest_framework import generics, permissions, viewsets
from .models import CustomerProfile, SavedAddress
from .serializers import CustomerProfileSerializer, SavedAddressSerializer
from apps.accounts.permissions import IsCustomer


class CustomerProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = CustomerProfileSerializer
    permission_classes = [IsCustomer]

    def get_object(self):
        profile, _ = CustomerProfile.objects.get_or_create(user=self.request.user)
        return profile


class SavedAddressViewSet(viewsets.ModelViewSet):
    serializer_class = SavedAddressSerializer
    permission_classes = [IsCustomer]

    def get_queryset(self):
        profile, _ = CustomerProfile.objects.get_or_create(user=self.request.user)
        return SavedAddress.objects.filter(customer=profile)

    def perform_create(self, serializer):
        profile, _ = CustomerProfile.objects.get_or_create(user=self.request.user)
        if serializer.validated_data.get('is_default', False):
            SavedAddress.objects.filter(customer=profile).update(is_default=False)
        serializer.save(customer=profile)
