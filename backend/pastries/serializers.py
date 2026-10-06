from rest_framework import serializers

from .models import (
    BusinessSettings,
    DessertCategory,
    DessertItem,
    DessertItemPhoto,
    FulfillmentWindow,
    OccasionTag,
    Order,
    OrderItem,
    QuoteRequest,
    ServiceArea,
    UserAddress,
    UserProfile,
)


# ---------------------------------------------------------------------------
# Catalog
# ---------------------------------------------------------------------------


class DessertCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DessertCategory
        fields = ["id", "name", "slug", "description", "sort_order", "is_active"]


class OccasionTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = OccasionTag
        fields = ["id", "name", "slug", "sort_order", "is_active"]


class DessertItemPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DessertItemPhoto
        fields = ["id", "image", "image_url", "alt_text", "sort_order"]


class DessertItemSerializer(serializers.ModelSerializer):
    category = DessertCategorySerializer(read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    occasions = OccasionTagSerializer(many=True, read_only=True)
    photos = DessertItemPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = DessertItem
        fields = [
            "id",
            "category",
            "category_name",
            "occasions",
            "name",
            "description",
            "price",
            "serving_size",
            "availability",
            "is_active",
            "sort_order",
            "lead_time_hours",
            "photos",
            "created_at",
        ]


class DessertItemAdminSerializer(serializers.ModelSerializer):
    occasions_ids = serializers.PrimaryKeyRelatedField(
        queryset=OccasionTag.objects.all(), many=True, source="occasions", required=False
    )

    class Meta:
        model = DessertItem
        fields = [
            "id",
            "category",
            "occasions_ids",
            "name",
            "description",
            "price",
            "serving_size",
            "availability",
            "is_active",
            "sort_order",
            "lead_time_hours",
        ]


# ---------------------------------------------------------------------------
# Service Area & Windows
# ---------------------------------------------------------------------------


class ServiceAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceArea
        fields = ["id", "label", "state", "postal_code", "radius_miles"]


class FulfillmentWindowSerializer(serializers.ModelSerializer):
    class Meta:
        model = FulfillmentWindow
        fields = ["id", "window_type", "weekday", "start_time", "end_time", "is_active", "sort_order"]


# ---------------------------------------------------------------------------
# Business Settings
# ---------------------------------------------------------------------------


class BusinessSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessSettings
        fields = [
            "business_name",
            "tagline",
            "phone",
            "email",
            "address_line1",
            "address_line2",
            "city",
            "state",
            "postal_code",
            "minimum_lead_hours",
            "tax_rate_percent",
            "delivery_fee_flat",
            "pickup_fee_flat",
            "service_fee_flat",
            "hero_image_url",
            "hero_image_alt",
            "about_text",
        ]


# ---------------------------------------------------------------------------
# User
# ---------------------------------------------------------------------------


class UserAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAddress
        fields = ["id", "label", "line1", "line2", "city", "state", "postal_code", "country"]


class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    addresses = UserAddressSerializer(many=True, read_only=True)

    class Meta:
        model = UserProfile
        fields = ["id", "email", "username", "display_name", "phone", "addresses"]


# ---------------------------------------------------------------------------
# Orders
# ---------------------------------------------------------------------------


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["id", "name_snapshot", "unit_price", "quantity", "line_total", "notes"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "fulfillment_type",
            "status",
            "scheduled_for",
            "address_line1",
            "address_line2",
            "city",
            "state",
            "postal_code",
            "country",
            "subtotal",
            "tax_total",
            "fee_total",
            "tip_total",
            "total",
            "currency",
            "notes",
            "items",
            "placed_at",
            "created_at",
        ]


class OrderCreateSerializer(serializers.Serializer):
    fulfillment_type = serializers.ChoiceField(choices=Order.FulfillmentType.choices)
    scheduled_for = serializers.DateTimeField()
    address_line1 = serializers.CharField(required=False, allow_blank=True)
    address_line2 = serializers.CharField(required=False, allow_blank=True, default="")
    city = serializers.CharField(required=False, allow_blank=True)
    state = serializers.CharField(required=False, allow_blank=True)
    postal_code = serializers.CharField(required=False, allow_blank=True)
    country = serializers.CharField(required=False, default="US")
    tip = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=0)
    notes = serializers.CharField(required=False, allow_blank=True, default="")
    items = serializers.ListField(child=serializers.DictField(), allow_empty=False)

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("At least one item is required.")
        for item in value:
            if "dessert_item_id" not in item or "quantity" not in item:
                raise serializers.ValidationError(
                    "Each item must have 'dessert_item_id' and 'quantity'."
                )
        return value


# ---------------------------------------------------------------------------
# Quote Requests
# ---------------------------------------------------------------------------


class QuoteRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuoteRequest
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "event_date",
            "event_time",
            "guest_count",
            "venue_name",
            "venue_address",
            "event_type",
            "dietary_restrictions",
            "budget_range",
            "dessert_preferences",
            "special_requests",
            "status",
            "created_at",
        ]
        read_only_fields = ["status", "created_at"]


class QuoteRequestAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuoteRequest
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "event_date",
            "event_time",
            "guest_count",
            "venue_name",
            "venue_address",
            "event_type",
            "dietary_restrictions",
            "budget_range",
            "dessert_preferences",
            "special_requests",
            "status",
            "proposal_sent_at",
            "proposal_notes",
            "internal_notes",
            "created_at",
        ]
