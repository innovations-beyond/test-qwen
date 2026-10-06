export interface DessertItem {
  id: number;
  category_name: string;
  name: string;
  description: string;
  price: string;
  serving_size: string;
  availability: 'delivery' | 'pickup' | 'both';
  is_active: boolean;
  lead_time_hours: number;
  photos: { id: number; image: string | null; image_url: string; alt_text: string }[];
  occasions: { id: number; name: string; slug: string }[];
  created_at: string;
}
