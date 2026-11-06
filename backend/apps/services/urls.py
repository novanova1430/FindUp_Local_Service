from django.urls import path
from .views import (
    ServiceCategoryListView,
    ServiceCategoryDetailView,
    ServiceItemListView,
    ServiceItemDetailView,
)

urlpatterns = [
    path('categories/', ServiceCategoryListView.as_view(), name='category-list'),
    path('categories/<int:pk>/', ServiceCategoryDetailView.as_view(), name='category-detail'),
    path('', ServiceItemListView.as_view(), name='service-list'),
    path('<int:pk>/', ServiceItemDetailView.as_view(), name='service-detail'),
]
