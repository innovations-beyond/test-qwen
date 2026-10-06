export interface DessertItem {
  id: number;
  category: DessertCategory | null;
  category_name: string;
  occasions: OccasionTag[];
  name: string;
  description: string;
  price: string;
  serving_size: string;
  availability: 'delivery' | 'pickup' | 'both';
  is_active: boolean;
  sort_order: number;
  lead_time_hours: number;
  photos: DessertPhoto[];
  created_at: string;
}

export interface DessertCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  sort_order: number;
  is_active: boolean;
}

export interface OccasionTag {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
}

export interface DessertPhoto {
  id: number;
  image: string | null;
  image_url: string;
  alt_text: string;
  sort_order: number;
}

export interface BusinessSettings {
  business_name: string;
  tagline: string;
  phone: string;
  email: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  minimum_lead_hours: number;
  tax_rate_percent: string;
  delivery_fee_flat: string;
  pickup_fee_flat: string;
  service_fee_flat: string;
  hero_image_url: string;
  hero_image_alt: string;
  about_text: string;
}

export interface Order {
  id: number;
  fulfillment_type: 'delivery' | 'pickup';
  status: 'new' | 'confirmed' | 'in_progress' | 'ready' | 'completed' | 'cancelled';
  scheduled_for: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  subtotal: string;
  tax_total: string;
  fee_total: string;
  tip_total: string;
  total: string;
  currency: string;
  notes: string;
  items: OrderItem[];
  placed_at: string | null;
  created_at: string;
}

export interface OrderItem {
  id: number;
  name_snapshot: string;
  unit_price: string;
  quantity: number;
  line_total: string;
  notes: string;
}

export interface QuoteRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  event_date: string;
  event_time: string | null;
  guest_count: number;
  venue_name: string;
  venue_address: string;
  event_type: string;
  dietary_restrictions: string;
  budget_range: string;
  dessert_preferences: string;
  special_requests: string;
  status: string;
  created_at: string;
}
