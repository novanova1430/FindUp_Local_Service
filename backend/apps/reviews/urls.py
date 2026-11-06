from django.urls import path
from .views import ReviewListCreateView, ReviewToggleVisibilityView

urlpatterns = [
    path('', ReviewListCreateView.as_view(), name='review-list-create'),
    path('<int:pk>/toggle-visibility/', ReviewToggleVisibilityView.as_view(), name='review-toggle-visibility'),
]
