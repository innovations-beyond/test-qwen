import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from ..models import DessertCategory, DessertItem, OccasionTag


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def category(db):
    return DessertCategory.objects.create(name="Cakes", slug="cakes")


@pytest.fixture
def item(db, category):
    return DessertItem.objects.create(
        name="Chocolate Fudge Cake",
        description="Rich and moist chocolate cake with fudge frosting",
        price="45.00",
        category=category,
        serving_size="Serves 8-10",
    )


class TestDessertAPI:
    def test_list_desserts(self, api_client, item):
        res = api_client.get("/api/desserts/")
        assert res.status_code == status.HTTP_200_OK
        data = res.json()
        assert data["count"] == 1
        assert data["results"][0]["name"] == "Chocolate Fudge Cake"

    def test_list_categories(self, api_client, category):
        res = api_client.get("/api/categories/")
        assert res.status_code == status.HTTP_200_OK
        data = res.json()
        assert data["count"] == 1
        assert data["results"][0]["name"] == "Cakes"

    def test_list_occasions(self, api_client):
        OccasionTag.objects.create(name="Birthday", slug="birthday")
        res = api_client.get("/api/occasions/")
        assert res.status_code == status.HTTP_200_OK
        assert res.json()["count"] == 1

    def test_filter_by_category(self, api_client, item, category):
        other_cat = DessertCategory.objects.create(name="Cookies", slug="cookies")
        DessertItem.objects.create(name="Oatmeal Cookie", price="12.00", category=other_cat)

        res = api_client.get("/api/desserts/?category=cakes")
        assert res.status_code == status.HTTP_200_OK
        assert res.json()["count"] == 1
        assert res.json()["results"][0]["name"] == "Chocolate Fudge Cake"

    def test_business_settings(self, api_client):
        res = api_client.get("/api/settings/")
        assert res.status_code == status.HTTP_200_OK
        assert res.json()["business_name"] == "Joelle's Pastries"


class TestQuoteAPI:
    def test_create_quote(self, api_client):
        res = api_client.post(
            "/api/quotes/",
            {
                "name": "Jane Doe",
                "email": "jane@example.com",
                "event_date": "2026-12-25",
                "guest_count": 100,
                "event_type": "Wedding",
            },
            format="json",
        )
        assert res.status_code == status.HTTP_201_CREATED
        assert res.json()["status"] == "pending"
        assert res.json()["name"] == "Jane Doe"

    def test_quote_requires_fields(self, api_client):
        res = api_client.post("/api/quotes/", {}, format="json")
        assert res.status_code == status.HTTP_400_BAD_REQUEST
