export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Desserts Worth Celebrating</h1>
          <p style={styles.heroSubtitle}>
            Custom cakes, artisan pastries, and full dessert catering for your next event.
            <br />
            Or just a box of brownies delivered to your door.
          </p>
          <div style={styles.heroActions}>
            <a href="/menu" style={styles.btnPrimary}>
              Browse the Menu
            </a>
            <a href="/quote" style={styles.btnSecondary}>
              Plan Your Event
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={styles.section}>
        <div style={styles.grid}>
          <div style={styles.card}>
            <h3>À la Carte Delivery</h3>
            <p>Order individual cakes, cookies, pastries, and more. Delivered fresh to your door or ready for pickup.</p>
          </div>
          <div style={styles.card}>
            <h3>Event Catering</h3>
            <p>Full dessert stations, live cake cutting, and curated dessert buffets for weddings, corporate events, and parties.</p>
          </div>
          <div style={styles.card}>
            <h3>Custom Creations</h3>
            <p>Tell us your vision and we&rsquo;ll craft a dessert experience tailored to your occasion and guests.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={styles.ctaSection}>
        <h2>Ready to Sweeten Your Event?</h2>
        <p>Browse our menu or request a custom quote for your next celebration.</p>
        <a href="/menu" style={styles.btnPrimary}>
          See What&rsquo;s Fresh
        </a>
      </section>
    </div>
  );
}

const styles = {
  hero: {
    background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-bg) 100%)',
    padding: '5rem 1.5rem',
    textAlign: 'center' as const,
  },
  heroContent: {
    maxWidth: '700px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '3rem',
    marginBottom: '1rem',
    color: 'var(--color-primary)',
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    color: 'var(--color-text-light)',
    marginBottom: '2rem',
  },
  heroActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap' as const,
  },
  btnPrimary: {
    background: 'var(--color-primary)',
    color: 'white',
    padding: '0.875rem 2rem',
    borderRadius: '8px',
    fontWeight: 600,
  },
  btnSecondary: {
    background: 'var(--color-white)',
    color: 'var(--color-primary)',
    padding: '0.875rem 2rem',
    borderRadius: '8px',
    fontWeight: 600,
    border: '2px solid var(--color-primary)',
  },
  section: {
    padding: '4rem 1.5rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
  },
  card: {
    background: 'var(--color-white)',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  ctaSection: {
    background: 'var(--color-primary)',
    color: 'white',
    textAlign: 'center' as const,
    padding: '4rem 1.5rem',
    marginTop: '2rem',
  },
};
