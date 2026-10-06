export default function AboutPage() {
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>About Joelle&rsquo;s Pastries</h1>
      
      <section style={styles.section}>
        <p style={styles.lead}>
          Joelle&rsquo;s Pastries was born from a simple belief: every gathering deserves a
          memorable sweet finish. What started as weekend baking for friends and family has grown
          into a full-service dessert catering and delivery operation.
        </p>
        <p>
          Every dessert is made to order using premium ingredients — real butter, single-origin
          chocolate, seasonal fruits, and nothing artificial. Whether it&rsquo;s a single box of
          brownies for your office or a 300-guest wedding dessert station, we treat every order
          with the same care.
        </p>
      </section>

      <section style={styles.section}>
        <h2>Our Promise</h2>
        <ul style={styles.list}>
          <li>Fresh-baked, always made to order</li>
          <li>Premium, locally-sourced ingredients</li>
          <li>Accommodating of dietary restrictions (GF, vegan, nut-free on request)</li>
          <li>Professional setup and service for events</li>
          <li>On-time delivery, every time</li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2>Get in Touch</h2>
        <p>
          Questions about an order or event? Reach out and we&rsquo;ll get back to you within one
          business day.
        </p>
        <p style={styles.contact}>
          <strong>Email:</strong> orders@joellespastries.com
          <br />
          <strong>Phone:</strong> (555) 123-4567
        </p>
      </section>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: '750px',
    margin: '0 auto',
    padding: '3rem 1.5rem',
  },
  title: {
    fontSize: '2.5rem',
    color: 'var(--color-primary)',
    marginBottom: '2rem',
  },
  section: {
    marginBottom: '2.5rem',
  },
  lead: {
    fontSize: '1.15rem',
    marginBottom: '1rem',
  },
  list: {
    paddingLeft: '1.5rem',
    lineHeight: 2,
  },
  contact: {
    marginTop: '1rem',
    lineHeight: 1.8,
  },
};
