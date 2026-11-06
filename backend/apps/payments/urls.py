from django.urls import path
from .views import PaymentListView, ProcessPaymentView

urlpatterns = [
    path('', PaymentListView.as_view(), name='payment-list'),
    path('process/', ProcessPaymentView.as_view(), name='payment-process'),
]
