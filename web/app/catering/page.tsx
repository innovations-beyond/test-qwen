export default function CateringPage() {
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Dessert Catering</h1>
      <p style={styles.subtitle}>
        From intimate gatherings to grand celebrations, we bring the sweet finish to your event.
      </p>

      <section style={styles.section}>
        <h2>What We Offer</h2>
        <div style={styles.grid}>
          <div style={styles.card}>
            <h3>Dessert Stations</h3>
            <p>
              Beautifully arranged displays of macarons, tarts, petit fours, and seasonal treats.
              Our team sets up, serves, and breaks down.
            </p>
          </div>
          <div style={styles.card}>
            <h3>Cake Cutting & Presentation</h3>
            <p>
              Custom cakes designed for your event, with professional cutting and plating service
              for weddings and formal occasions.
            </p>
          </div>
          <div style={styles.card}>
            <h3>Dessert Buffets</h3>
            <p>
              A curated spread of individual desserts — perfect for corporate events, galas, and
              large parties. Scales from 20 to 500+ guests.
            </p>
          </div>
          <div style={styles.card}>
            <h3>Custom Creations</h3>
            <p>
              Have a specific vision? We&rsquo;ll work with you to design a dessert experience that
              matches your theme, palette, and taste.
            </p>
          </div>
        </div>
      </section>

      <section style={styles.process}>
        <h2>How It Works</h2>
        <div style={styles.steps}>
          <div style={styles.step}>
            <span style={styles.stepNum}>1</span>
            <h4>Request a Quote</h4>
            <p>Tell us about your event — date, guest count, venue, and preferences.</p>
          </div>
          <div style={styles.step}>
            <span style={styles.stepNum}>2</span>
            <h4>Receive a Proposal</h4>
            <p>We&rsquo;ll email you a custom proposal with menu options and pricing within 2 business days.</p>
          </div>
          <div style={styles.step}>
            <span style={styles.stepNum}>3</span>
            <h4>Confirm & Celebrate</h4>
            <p>Approve your proposal, and we&rsquo;ll handle the rest. You just enjoy the sweets.</p>
          </div>
        </div>
      </section>

      <section style={styles.cta}>
        <h2>Planning an Event?</h2>
        <p>Let&rsquo;s craft the perfect dessert experience for your guests.</p>
        <a href="/quote" style={styles.btn}>
          Request a Quote
        </a>
      </section>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '3rem 1.5rem',
  },
  title: {
    fontSize: '2.5rem',
    color: 'var(--color-primary)',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.15rem',
    color: 'var(--color-text-light)',
    marginBottom: '3rem',
  },
  section: {
    marginBottom: '3rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginTop: '1.5rem',
  },
  card: {
    background: 'var(--color-white)',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  process: {
    marginBottom: '3rem',
  },
  steps: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginTop: '1.5rem',
  },
  step: {
    textAlign: 'center' as const,
  },
  stepNum: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'var(--color-primary)',
    color: 'white',
    fontWeight: 700,
    marginBottom: '0.75rem',
  },
  cta: {
    background: 'var(--color-secondary)',
    borderRadius: '16px',
    padding: '3rem',
    textAlign: 'center' as const,
  },
  btn: {
    display: 'inline-block',
    marginTop: '1rem',
    background: 'var(--color-primary)',
    color: 'white',
    padding: '0.875rem 2rem',
    borderRadius: '8px',
    fontWeight: 600,
  },
};
