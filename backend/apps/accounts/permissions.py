from rest_framework import permissions
from .models import CustomUser


class IsCustomer(permissions.BasePermission):
    """Allows access only to authenticated users with CUSTOMER role."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == CustomUser.Role.CUSTOMER
        )


class IsProvider(permissions.BasePermission):
    """Allows access only to authenticated users with PROVIDER role."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == CustomUser.Role.PROVIDER
        )


class IsApprovedProvider(permissions.BasePermission):
    """Allows access only to verified/approved service providers."""
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated and request.user.role == CustomUser.Role.PROVIDER):
            return False
        return hasattr(request.user, 'provider_profile') and request.user.provider_profile.verification_status == 'APPROVED'


class IsAdministrator(permissions.BasePermission):
    """Allows access only to authenticated users with ADMIN role."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role == CustomUser.Role.ADMIN or request.user.is_superuser)
        )
