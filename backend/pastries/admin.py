from django.contrib import admin

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


class DessertItemPhotoInline(admin.TabularInline):
    model = DessertItemPhoto
    extra = 0


@admin.register(DessertItem)
class DessertItemAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "price", "availability", "is_active", "sort_order"]
    list_filter = ["category", "availability", "is_active"]
    search_fields = ["name", "description"]
    inlines = [DessertItemPhotoInline]
    filter_horizontal = ["occasions"]


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ["name_snapshot", "unit_price", "quantity", "line_total"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["id", "status", "fulfillment_type", "scheduled_for", "total", "placed_at"]
    list_filter = ["status", "fulfillment_type"]
    search_fields = ["guest_name", "guest_email", "user__email"]
    inlines = [OrderItemInline]
    readonly_fields = ["stripe_session_id", "stripe_payment_intent_id", "stripe_payment_status"]


@admin.register(QuoteRequest)
class QuoteRequestAdmin(admin.ModelAdmin):
    list_display = ["name", "email", "event_date", "guest_count", "status", "created_at"]
    list_filter = ["status", "event_type"]
    search_fields = ["name", "email", "venue_name"]
    readonly_fields = ["proposal_sent_at"]


@admin.register(BusinessSettings)
class BusinessSettingsAdmin(admin.ModelAdmin):
    pass


@admin.register(DessertCategory)
class DessertCategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "sort_order", "is_active"]
    prepopulated_fields = {"slug": ["name"]}


@admin.register(OccasionTag)
class OccasionTagAdmin(admin.ModelAdmin):
    list_display = ["name", "sort_order", "is_active"]
    prepopulated_fields = {"slug": ["name"]}


@admin.register(FulfillmentWindow)
class FulfillmentWindowAdmin(admin.ModelAdmin):
    list_display = ["window_type", "weekday", "start_time", "end_time", "is_active"]
    list_filter = ["window_type", "weekday", "is_active"]


@admin.register(ServiceArea)
class ServiceAreaAdmin(admin.ModelAdmin):
    list_display = ["label", "state", "postal_code", "radius_miles"]


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "display_name", "phone"]


@admin.register(UserAddress)
class UserAddressAdmin(admin.ModelAdmin):
    list_display = ["user", "label", "city", "state", "postal_code"]
