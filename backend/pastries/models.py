from __future__ import annotations

from datetime import timedelta
from decimal import Decimal

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from solo.models import SingletonModel


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


# ---------------------------------------------------------------------------
# Business Settings
# ---------------------------------------------------------------------------


class BusinessSettings(SingletonModel):
    business_name = models.CharField(max_length=255, default="Joelle's Pastries")
    tagline = models.CharField(max_length=500, blank=True)
    phone = models.CharField(max_length=40, blank=True)
    email = models.EmailField(blank=True)
    address_line1 = models.CharField(max_length=255, blank=True)
    address_line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=120, blank=True)
    state = models.CharField(max_length=2, blank=True)
    postal_code = models.CharField(max_length=10, blank=True)

    minimum_lead_hours = models.PositiveIntegerField(default=48)
    tax_rate_percent = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("6.00"))
    delivery_fee_flat = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("15.00"))
    pickup_fee_flat = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    service_fee_flat = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))

    hero_image_url = models.URLField(blank=True)
    hero_image_alt = models.CharField(max_length=255, blank=True)
    about_text = models.TextField(blank=True)

    class Meta:
        verbose_name = "Business Settings"
        verbose_name_plural = "Business Settings"

    def __str__(self) -> str:
        return self.business_name


# ---------------------------------------------------------------------------
# User Profile
# ---------------------------------------------------------------------------


class UserProfile(BaseModel):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    display_name = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=40, blank=True)
    stripe_customer_id = models.CharField(max_length=255, blank=True)

    def __str__(self) -> str:
        return self.display_name or self.user.get_username()


class UserAddress(BaseModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="addresses")
    label = models.CharField(max_length=120, blank=True)
    line1 = models.CharField(max_length=255)
    line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=120)
    state = models.CharField(max_length=2)
    postal_code = models.CharField(max_length=10)
    country = models.CharField(max_length=2, default="US")

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "User Address"
        verbose_name_plural = "User Addresses"

    def __str__(self) -> str:
        return self.label or f"{self.line1}, {self.city}"


# ---------------------------------------------------------------------------
# Catalog
# ---------------------------------------------------------------------------


class DessertCategory(BaseModel):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True)
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["sort_order", "name"]
        verbose_name = "Dessert Category"
        verbose_name_plural = "Dessert Categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name) or "category"
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name


class OccasionTag(BaseModel):
    name = models.CharField(max_length=80, unique=True)
    slug = models.SlugField(max_length=80, unique=True, blank=True)
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["sort_order", "name"]
        verbose_name = "Occasion Tag"
        verbose_name_plural = "Occasion Tags"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name) or "occasion"
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name


class DessertItem(BaseModel):
    class Availability(models.TextChoices):
        DELIVERY = "delivery", "Delivery"
        PICKUP = "pickup", "Pickup"
        BOTH = "both", "Delivery & Pickup"

    category = models.ForeignKey(
        DessertCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name="items"
    )
    occasions = models.ManyToManyField(OccasionTag, blank=True, related_name="items")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    serving_size = models.CharField(max_length=120, blank=True, help_text="e.g. 'Serves 8-10' or '1 dozen'")
    availability = models.CharField(max_length=16, choices=Availability.choices, default=Availability.BOTH)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    lead_time_hours = models.PositiveIntegerField(default=48, help_text="Minimum hours notice required")

    class Meta:
        ordering = ["sort_order", "name"]
        verbose_name = "Dessert Item"
        verbose_name_plural = "Dessert Items"

    def __str__(self) -> str:
        return self.name


class DessertItemPhoto(BaseModel):
    item = models.ForeignKey(DessertItem, on_delete=models.CASCADE, related_name="photos")
    image = models.ImageField(upload_to="desserts/%Y/%m/", blank=True, null=True)
    image_url = models.URLField(blank=True)
    alt_text = models.CharField(max_length=255, blank=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "created_at"]
        verbose_name = "Dessert Photo"
        verbose_name_plural = "Dessert Photos"

    def __str__(self) -> str:
        return f"Photo for {self.item.name}"


# ---------------------------------------------------------------------------
# Service Area & Fulfillment Windows
# ---------------------------------------------------------------------------


class ServiceArea(BaseModel):
    label = models.CharField(max_length=120, blank=True)
    state = models.CharField(max_length=2, blank=True)
    postal_code = models.CharField(max_length=10, blank=True)
    radius_miles = models.PositiveIntegerField(blank=True, null=True)

    class Meta:
        ordering = ["state", "postal_code"]
        verbose_name = "Service Area"
        verbose_name_plural = "Service Areas"

    def __str__(self) -> str:
        parts = [p for p in [self.state, self.postal_code, self.label] if p]
        return ", ".join(parts) or "All areas"


class FulfillmentWindow(BaseModel):
    class Weekday(models.IntegerChoices):
        MON = 0, "Monday"
        TUE = 1, "Tuesday"
        WED = 2, "Wednesday"
        THU = 3, "Thursday"
        FRI = 4, "Friday"
        SAT = 5, "Saturday"
        SUN = 6, "Sunday"

    class WindowType(models.TextChoices):
        DELIVERY = "delivery", "Delivery"
        PICKUP = "pickup", "Pickup"

    window_type = models.CharField(max_length=16, choices=WindowType.choices)
    weekday = models.PositiveSmallIntegerField(choices=Weekday.choices)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["weekday", "sort_order", "start_time"]
        verbose_name = "Fulfillment Window"
        verbose_name_plural = "Fulfillment Windows"
        constraints = [
            models.UniqueConstraint(
                fields=["window_type", "weekday", "start_time"],
                name="uniq_window_type_day_start",
            )
        ]

    def clean(self):
        super().clean()
        if self.start_time >= self.end_time:
            raise ValidationError("Start time must be before end time.")

    def __str__(self) -> str:
        return f"{self.get_window_type_display()} {self.get_weekday_display()} {self.start_time}-{self.end_time}"


# ---------------------------------------------------------------------------
# Orders
# ---------------------------------------------------------------------------


class Order(BaseModel):
    class FulfillmentType(models.TextChoices):
        DELIVERY = "delivery", "Delivery"
        PICKUP = "pickup", "Pickup"

    class Status(models.TextChoices):
        NEW = "new", "New"
        CONFIRMED = "confirmed", "Confirmed"
        IN_PROGRESS = "in_progress", "In Progress"
        READY = "ready", "Ready"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="orders"
    )
    guest_name = models.CharField(max_length=255, blank=True)
    guest_email = models.EmailField(blank=True)
    guest_phone = models.CharField(max_length=40, blank=True)

    fulfillment_type = models.CharField(max_length=16, choices=FulfillmentType.choices)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.NEW, db_index=True)
    scheduled_for = models.DateTimeField()

    # Delivery / Pickup address
    address_line1 = models.CharField(max_length=255, blank=True)
    address_line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=120, blank=True)
    state = models.CharField(max_length=2, blank=True)
    postal_code = models.CharField(max_length=10, blank=True)
    country = models.CharField(max_length=2, default="US")

    # Totals
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    tax_total = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    fee_total = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    tip_total = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    total = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    currency = models.CharField(max_length=8, default="usd")

    # Stripe
    stripe_session_id = models.CharField(max_length=255, blank=True, unique=True, null=True)
    stripe_payment_intent_id = models.CharField(max_length=255, blank=True)
    stripe_payment_status = models.CharField(max_length=60, blank=True)

    notes = models.TextField(blank=True)
    placed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Order"
        verbose_name_plural = "Orders"

    def __str__(self) -> str:
        return f"Order #{self.id} ({self.get_status_display()})"

    @property
    def contact_email(self) -> str:
        if self.user and self.user.email:
            return self.user.email
        return self.guest_email


class OrderItem(BaseModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    dessert_item = models.ForeignKey(
        DessertItem, on_delete=models.SET_NULL, null=True, blank=True, related_name="order_items"
    )
    name_snapshot = models.CharField(max_length=255)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    line_total = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["created_at"]
        verbose_name = "Order Item"
        verbose_name_plural = "Order Items"

    def __str__(self) -> str:
        return f"{self.name_snapshot} x{self.quantity}"


# ---------------------------------------------------------------------------
# Quote Requests (Event Catering)
# ---------------------------------------------------------------------------


class QuoteRequest(BaseModel):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        CONTACTED = "contacted", "Contacted"
        PROPOSED = "proposed", "Proposal Sent"
        ACCEPTED = "accepted", "Accepted"
        DECLINED = "declined", "Declined"
        CANCELLED = "cancelled", "Cancelled"

    # Customer info
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=40, blank=True)

    # Event details
    event_date = models.DateField()
    event_time = models.TimeField(blank=True, null=True)
    guest_count = models.PositiveIntegerField()
    venue_name = models.CharField(max_length=255, blank=True)
    venue_address = models.CharField(max_length=500, blank=True)
    event_type = models.CharField(max_length=120, blank=True, help_text="e.g. Wedding, Corporate, Birthday")

    # Preferences
    dietary_restrictions = models.TextField(blank=True)
    budget_range = models.CharField(max_length=120, blank=True)
    dessert_preferences = models.TextField(blank=True, help_text="Preferred styles, flavors, themes")
    special_requests = models.TextField(blank=True)

    # Tracking
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PENDING, db_index=True)
    proposal_sent_at = models.DateTimeField(blank=True, null=True)
    proposal_notes = models.TextField(blank=True)
    internal_notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Quote Request"
        verbose_name_plural = "Quote Requests"

    def __str__(self) -> str:
        return f"Quote: {self.name} — {self.event_date}"
