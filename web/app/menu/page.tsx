import { getDesserts, getCategories, getOccasions } from '@/lib/api';
import type { DessertItem, DessertCategory, OccasionTag } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function MenuPage() {
  const [desserts, categories, occasions] = await Promise.all([
    getDesserts(),
    getCategories(),
    getOccasions(),
  ]);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Our Menu</h1>
      <p style={styles.subtitle}>Fresh-baked desserts, made to order. Filter by category or occasion.</p>

      {/* Filters */}
      <div style={styles.filters}>
        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Category:</span>
          <div style={styles.filterTags}>
            <a href="/menu" style={styles.filterTag}>All</a>
            {categories.map((cat) => (
              <a key={cat.id} href={`/menu?category=${cat.slug}`} style={styles.filterTag}>
                {cat.name}
              </a>
            ))}
          </div>
        </div>
        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Occasion:</span>
          <div style={styles.filterTags}>
            <a href="/menu" style={styles.filterTag}>All</a>
            {occasions.map((occ) => (
              <a key={occ.id} href={`/menu?occasion=${occ.slug}`} style={styles.filterTag}>
                {occ.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Dessert Grid */}
      <div style={styles.grid}>
        {desserts.map((item) => (
          <div key={item.id} style={styles.card}>
            {item.photos.length > 0 && (
              <div style={styles.imagePlaceholder}>
                {item.photos[0].alt_text || item.name}
              </div>
            )}
            <div style={styles.cardBody}>
              <div style={styles.cardHeader}>
                <h3>{item.name}</h3>
                <span style={styles.price}>${item.price}</span>
              </div>
              {item.serving_size && <p style={styles.serving}>{item.serving_size}</p>}
              <p style={styles.description}>{item.description}</p>
              {item.occasions.length > 0 && (
                <div style={styles.tags}>
                  {item.occasions.map((occ) => (
                    <span key={occ.id} style={styles.tag}>
                      {occ.name}
                    </span>
                  ))}
                </div>
              )}
              <div style={styles.cardActions}>
                <span style={styles.availability}>
                  {item.availability === 'both' ? '🚗 Delivery + Pickup' : item.availability === 'delivery' ? '🚗 Delivery' : '🏪 Pickup'}
                </span>
                <a href="/order" style={styles.orderBtn}>
                  Order
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {desserts.length === 0 && <p style={styles.empty}>No desserts found. Check back soon!</p>}
    </div>
  );
}

const styles = {
  page: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 1.5rem',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem',
    color: 'var(--color-primary)',
  },
  subtitle: {
    color: 'var(--color-text-light)',
    marginBottom: '2rem',
  },
  filters: {
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap' as const,
  },
  filterLabel: {
    fontWeight: 600,
    fontSize: '0.9rem',
  },
  filterTags: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap' as const,
  },
  filterTag: {
    padding: '0.35rem 0.85rem',
    borderRadius: '20px',
    background: 'var(--color-secondary)',
    fontSize: '0.85rem',
    color: 'var(--color-text)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    background: 'var(--color-white)',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  imagePlaceholder: {
    height: '200px',
    background: 'var(--color-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-text-light)',
    fontStyle: 'italic' as const,
  },
  cardBody: {
    padding: '1.25rem',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem',
  },
  price: {
    fontWeight: 700,
    color: 'var(--color-primary)',
    fontSize: '1.1rem',
  },
  serving: {
    fontSize: '0.85rem',
    color: 'var(--color-text-light)',
    marginBottom: '0.5rem',
  },
  description: {
    fontSize: '0.95rem',
    color: 'var(--color-text-light)',
    marginBottom: '0.75rem',
  },
  tags: {
    display: 'flex',
    gap: '0.4rem',
    flexWrap: 'wrap' as const,
    marginBottom: '0.75rem',
  },
  tag: {
    fontSize: '0.75rem',
    padding: '0.2rem 0.6rem',
    borderRadius: '12px',
    background: 'var(--color-secondary)',
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availability: {
    fontSize: '0.85rem',
    color: 'var(--color-text-light)',
  },
  orderBtn: {
    background: 'var(--color-primary)',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: '0.9rem',
  },
  empty: {
    textAlign: 'center' as const,
    padding: '3rem',
    color: 'var(--color-text-light)',
  },
};
