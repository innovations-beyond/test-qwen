import type {
  BusinessSettings,
  DessertCategory,
  DessertItem,
  OccasionTag,
  Order,
  QuoteRequest,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    next: { revalidate: 60 },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getDesserts(params?: { category?: string; occasion?: string }): Promise<DessertItem[]> {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.occasion) query.set('occasion', params.occasion);
  const qs = query.toString();
  return fetchJson<DessertItem[]>(`/desserts/${qs ? `?${qs}` : ''}`);
}

export async function getCategories(): Promise<DessertCategory[]> {
  return fetchJson<DessertCategory[]>('/categories/');
}

export async function getOccasions(): Promise<OccasionTag[]> {
  return fetchJson<OccasionTag[]>('/occasions/');
}

export async function getBusinessSettings(): Promise<BusinessSettings> {
  return fetchJson<BusinessSettings>('/settings/');
}

export async function createOrder(orderData: Record<string, unknown>): Promise<Order> {
  return fetchJson<Order>('/orders/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
}

export async function createQuoteRequest(quoteData: Record<string, unknown>): Promise<QuoteRequest> {
  return fetchJson<QuoteRequest>('/quotes/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quoteData),
  });
}
