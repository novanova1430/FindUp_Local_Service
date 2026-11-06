from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import ServiceCategory, ServiceItem
from .serializers import ServiceCategorySerializer, ServiceItemSerializer
from apps.accounts.permissions import IsAdministrator, IsApprovedProvider


class ServiceCategoryListView(generics.ListCreateAPIView):
    queryset = ServiceCategory.objects.filter(is_active=True)
    serializer_class = ServiceCategorySerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdministrator()]
        return [permissions.AllowAny()]


class ServiceCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAdministrator()]
        return [permissions.AllowAny()]


class ServiceItemListView(generics.ListCreateAPIView):
    queryset = ServiceItem.objects.filter(is_active=True)
    serializer_class = ServiceItemSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'pricing_type', 'provider']
    search_fields = ['name', 'description', 'category__name']
    ordering_fields = ['base_price', 'created_at', 'name']

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        if hasattr(self.request.user, 'provider_profile'):
            serializer.save(provider=self.request.user.provider_profile)
        else:
            serializer.save()


class ServiceItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ServiceItem.objects.all()
    serializer_class = ServiceItemSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
