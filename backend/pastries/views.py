from decimal import Decimal

from django.db import transaction
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    BusinessSettings,
    DessertCategory,
    DessertItem,
    FulfillmentWindow,
    OccasionTag,
    Order,
    OrderItem,
    QuoteRequest,
    ServiceArea,
    UserAddress,
    UserProfile,
)
from .serializers import (
    BusinessSettingsSerializer,
    DessertCategorySerializer,
    DessertItemSerializer,
    FulfillmentWindowSerializer,
    OccasionTagSerializer,
    OrderCreateSerializer,
    OrderSerializer,
    QuoteRequestAdminSerializer,
    QuoteRequestSerializer,
    ServiceAreaSerializer,
    UserAddressSerializer,
    UserProfileSerializer,
)


# ---------------------------------------------------------------------------
# Catalog (public read)
# ---------------------------------------------------------------------------


class DessertCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DessertCategory.objects.filter(is_active=True)
    serializer_class = DessertCategorySerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"


class OccasionTagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = OccasionTag.objects.filter(is_active=True)
    serializer_class = OccasionTagSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"


class DessertItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DessertItem.objects.filter(is_active=True).select_related("category").prefetch_related(
        "occasions", "photos"
    )
    serializer_class = DessertItemSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get("category")
        occasion = self.request.query_params.get("occasion")
        if category:
            qs = qs.filter(category__slug=category)
        if occasion:
            qs = qs.filter(occasions__slug=occasion).distinct()
        return qs


class FulfillmentWindowViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FulfillmentWindow.objects.filter(is_active=True)
    serializer_class = FulfillmentWindowSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        window_type = self.request.query_params.get("type")
        if window_type:
            qs = qs.filter(window_type=window_type)
        return qs


class ServiceAreaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ServiceArea.objects.all()
    serializer_class = ServiceAreaSerializer
    permission_classes = [AllowAny]


class BusinessSettingsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        settings_obj = BusinessSettings.get_solo()
        return Response(BusinessSettingsSerializer(settings_obj).data)


# ---------------------------------------------------------------------------
# User (authenticated)
# ---------------------------------------------------------------------------


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        return Response(UserProfileSerializer(profile).data)


class UserAddressViewSet(viewsets.ModelViewSet):
    serializer_class = UserAddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserAddress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ---------------------------------------------------------------------------
# Orders
# ---------------------------------------------------------------------------


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    queryset = Order.objects.none()

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.select_related("user").prefetch_related("items")
        return (
            Order.objects.filter(user=self.request.user)
            .select_related("user")
            .prefetch_related("items")
        )

    def create(self, request, *args, **kwargs):
        create_ser = OrderCreateSerializer(data=request.data)
        create_ser.is_valid(raise_exception=True)
        data = create_ser.validated_data

        with transaction.atomic():
            order = Order.objects.create(
                user=request.user,
                fulfillment_type=data["fulfillment_type"],
                scheduled_for=data["scheduled_for"],
                address_line1=data.get("address_line1", ""),
                address_line2=data.get("address_line2", ""),
                city=data.get("city", ""),
                state=data.get("state", ""),
                postal_code=data.get("postal_code", ""),
                country=data.get("country", "US"),
                notes=data.get("notes", ""),
                placed_at=timezone.now(),
            )

            subtotal = Decimal("0.00")
            for item_data in data["items"]:
                dessert = DessertItem.objects.get(pk=item_data["dessert_item_id"])
                qty = item_data["quantity"]
                line_total = dessert.price * qty
                subtotal += line_total
                OrderItem.objects.create(
                    order=order,
                    dessert_item=dessert,
                    name_snapshot=dessert.name,
                    unit_price=dessert.price,
                    quantity=qty,
                    line_total=line_total,
                    notes=item_data.get("notes", ""),
                )

            settings_obj = BusinessSettings.get_solo()
            tax = subtotal * settings_obj.tax_rate_percent / Decimal("100")
            if data["fulfillment_type"] == Order.FulfillmentType.DELIVERY:
                fee = settings_obj.delivery_fee_flat
            else:
                fee = settings_obj.pickup_fee_flat
            tip = data.get("tip", Decimal("0.00"))
            total = subtotal + tax + fee + tip + settings_obj.service_fee_flat

            order.subtotal = subtotal
            order.tax_total = tax
            order.fee_total = fee
            order.tip_total = tip
            order.total = total
            order.save()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


# ---------------------------------------------------------------------------
# Quote Requests
# ---------------------------------------------------------------------------


class QuoteRequestViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    filter_fields = ["status"]

    def get_queryset(self):
        if self.request.user.is_staff:
            return QuoteRequest.objects.all()
        return QuoteRequest.objects.filter(email=self.request.query_params.get("email", ""))

    def get_serializer_class(self):
        if self.request.user.is_staff:
            return QuoteRequestAdminSerializer
        return QuoteRequestSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["patch"], permission_classes=[IsAuthenticated])
    def update_status(self, request, pk=None):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
        quote = self.get_object()
        status_value = request.data.get("status")
        if status_value not in QuoteRequest.Status.values:
            return Response({"status": "Invalid status."}, status=status.HTTP_400_BAD_REQUEST)
        quote.status = status_value
        if status_value == QuoteRequest.Status.PROPOSED:
            quote.proposal_sent_at = timezone.now()
        quote.save()
        return Response(QuoteRequestAdminSerializer(quote).data)
