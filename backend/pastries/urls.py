from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"categories", views.DessertCategoryViewSet, basename="category")
router.register(r"occasions", views.OccasionTagViewSet, basename="occasion")
router.register(r"desserts", views.DessertItemViewSet, basename="dessert")
router.register(r"windows", views.FulfillmentWindowViewSet, basename="window")
router.register(r"service-areas", views.ServiceAreaViewSet, basename="service-area")
router.register(r"orders", views.OrderViewSet, basename="order")
router.register(r"quotes", views.QuoteRequestViewSet, basename="quote")
router.register(r"addresses", views.UserAddressViewSet, basename="address")

urlpatterns = [
    path("", include(router.urls)),
    path("settings/", views.BusinessSettingsView.as_view(), name="business-settings"),
    path("me/", views.UserProfileView.as_view(), name="user-profile"),
]
