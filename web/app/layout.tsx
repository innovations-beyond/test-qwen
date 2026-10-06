import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Joelle's Pastries | Dessert Catering & Delivery",
  description:
    'Custom cakes, pastries, and full dessert catering for events. Order à la carte desserts delivered to your door or request a quote for your next event.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={styles.header}>
          <div style={styles.headerInner}>
            <a href="/" style={styles.logo}>
              Joelle&rsquo;s Pastries
            </a>
            <nav style={styles.nav}>
              <a href="/menu">Menu</a>
              <a href="/catering">Catering</a>
              <a href="/about">About</a>
              <a href="/quote" style={styles.ctaBtn}>
                Request a Quote
              </a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer style={styles.footer}>
          <div style={styles.footerInner}>
            <p>&copy; {new Date().getFullYear()} Joelle&rsquo;s Pastries. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

const styles = {
  header: {
    background: 'var(--color-white)',
    borderBottom: '1px solid var(--color-border)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
  },
  headerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--color-primary)',
  },
  nav: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
  },
  ctaBtn: {
    background: 'var(--color-primary)',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
  },
  footer: {
    background: 'var(--color-secondary)',
    marginTop: '4rem',
    padding: '2rem 0',
  },
  footerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem',
    textAlign: 'center' as const,
    color: 'var(--color-text-light)',
  },
};
