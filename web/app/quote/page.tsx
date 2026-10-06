'use client';

import { useState } from 'react';
import { createQuoteRequest } from '@/lib/api';

interface FormData {
  // Step 1: Contact
  name: string;
  email: string;
  phone: string;
  // Step 2: Event Details
  event_date: string;
  event_time: string;
  guest_count: string;
  event_type: string;
  venue_name: string;
  venue_address: string;
  // Step 3: Preferences
  dietary_restrictions: string;
  budget_range: string;
  dessert_preferences: string;
  special_requests: string;
}

const initialData: FormData = {
  name: '',
  email: '',
  phone: '',
  event_date: '',
  event_time: '',
  guest_count: '',
  event_type: '',
  venue_name: '',
  venue_address: '',
  dietary_restrictions: '',
  budget_range: '',
  dessert_preferences: '',
  special_requests: '',
};

const eventTypes = ['Wedding', 'Corporate Event', 'Birthday Party', 'Anniversary', 'Baby Shower', 'Holiday Party', 'Other'];
const budgetRanges = ['Under $500', '$500 - $1,000', '$1,000 - $2,500', '$2,500 - $5,000', '$5,000+'];

export default function QuotePage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const update = (field: keyof FormData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (): boolean => {
    if (step === 1) {
      if (!data.name.trim() || !data.email.trim()) {
        setError('Please fill in your name and email.');
        return false;
      }
    }
    if (step === 2) {
      if (!data.event_date || !data.guest_count) {
        setError('Please provide your event date and guest count.');
        return false;
      }
    }
    setError('');
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((s) => Math.min(s + 1, 3));
    }
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    setError('');
    try {
      await createQuoteRequest({
        ...data,
        guest_count: parseInt(data.guest_count, 10),
        event_time: data.event_time || null,
      });
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={styles.success}>
        <h1>Thank You, {data.name}!</h1>
        <p>We&rsquo;ve received your catering request and will email you a custom proposal within 2 business days.</p>
        <p style={styles.successSub}>A confirmation has been sent to {data.email}.</p>
        <a href="/" style={styles.btn}>Back to Home</a>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Request a Catering Quote</h1>
      <p style={styles.subtitle}>Tell us about your event and we&rsquo;ll craft a custom dessert proposal.</p>

      {/* Progress */}
      <div style={styles.progress}>
        {[1, 2, 3].map((s) => (
          <div key={s} style={{...styles.progressStep, ...(step >= s ? styles.progressActive : {})}}>
            <span style={styles.progressNum}>{s}</span>
            <span>{['Your Info', 'Event Details', 'Preferences'][s - 1]}</span>
          </div>
        ))}
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* Step 1: Contact */}
      {step === 1 && (
        <div style={styles.form}>
          <h3>Contact Information</h3>
          <div style={styles.row}>
            <input style={styles.input} placeholder="Full Name *" value={data.name} onChange={(e) => update('name', e.target.value)} />
            <input style={styles.input} type="email" placeholder="Email *" value={data.email} onChange={(e) => update('email', e.target.value)} />
          </div>
          <input style={styles.input} type="tel" placeholder="Phone (optional)" value={data.phone} onChange={(e) => update('phone', e.target.value)} />
        </div>
      )}

      {/* Step 2: Event Details */}
      {step === 2 && (
        <div style={styles.form}>
          <h3>Event Details</h3>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Event Date *</label>
              <input style={styles.input} type="date" value={data.event_date} onChange={(e) => update('event_date', e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Event Time</label>
              <input style={styles.input} type="time" value={data.event_time} onChange={(e) => update('event_time', e.target.value)} />
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Guest Count *</label>
              <input style={styles.input} type="number" min="1" placeholder="e.g. 100" value={data.guest_count} onChange={(e) => update('guest_count', e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Event Type</label>
              <select style={styles.input} value={data.event_type} onChange={(e) => update('event_type', e.target.value)}>
                <option value="">Select...</option>
                {eventTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Venue Name</label>
            <input style={styles.input} placeholder="e.g. The Grand Ballroom" value={data.venue_name} onChange={(e) => update('venue_name', e.target.value)} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Venue Address</label>
            <input style={styles.input} placeholder="Full address" value={data.venue_address} onChange={(e) => update('venue_address', e.target.value)} />
          </div>
        </div>
      )}

      {/* Step 3: Preferences */}
      {step === 3 && (
        <div style={styles.form}>
          <h3>Dessert Preferences</h3>
          <div style={styles.field}>
            <label style={styles.label}>Dietary Restrictions</label>
            <textarea style={styles.textarea} placeholder="e.g. 2 gluten-free, 1 vegan, nut-free..." value={data.dietary_restrictions} onChange={(e) => update('dietary_restrictions', e.target.value)} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Budget Range</label>
            <select style={styles.input} value={data.budget_range} onChange={(e) => update('budget_range', e.target.value)}>
              <option value="">Select...</option>
              {budgetRanges.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Dessert Preferences & Themes</label>
            <textarea style={styles.textarea} placeholder="e.g. French pastries, chocolate theme, seasonal fruits..." value={data.dessert_preferences} onChange={(e) => update('dessert_preferences', e.target.value)} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Special Requests</label>
            <textarea style={styles.textarea} placeholder="Anything else we should know?" value={data.special_requests} onChange={(e) => update('special_requests', e.target.value)} />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={styles.nav}>
        {step > 1 && (
          <button style={styles.btnSecondary} onClick={prevStep}>
            ← Back
          </button>
        )}
        {step < 3 ? (
          <button style={styles.btnPrimary} onClick={nextStep}>
            Continue →
          </button>
        ) : (
          <button style={styles.btnPrimary} onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '3rem 1.5rem',
  },
  title: {
    fontSize: '2rem',
    color: 'var(--color-primary)',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: 'var(--color-text-light)',
    marginBottom: '2rem',
  },
  progress: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
  },
  progressStep: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    opacity: 0.5,
    fontSize: '0.9rem',
  },
  progressActive: {
    opacity: 1,
  },
  progressNum: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'var(--color-primary)',
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: 700,
  },
  form: {
    background: 'var(--color-white)',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    marginBottom: '1.5rem',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1rem',
  },
  field: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    fontWeight: 600,
    fontSize: '0.9rem',
    marginBottom: '0.35rem',
  },
  input: {
    width: '100%',
    padding: '0.7rem 1rem',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
    fontSize: '1rem',
  },
  textarea: {
    width: '100%',
    padding: '0.7rem 1rem',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
    fontSize: '1rem',
    minHeight: '80px',
    resize: 'vertical' as const,
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1rem',
  },
  btnPrimary: {
    background: 'var(--color-primary)',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  btnSecondary: {
    background: 'var(--color-secondary)',
    color: 'var(--color-text)',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  error: {
    background: '#fef2f2',
    color: '#dc2626',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  success: {
    maxWidth: '500px',
    margin: '4rem auto',
    textAlign: 'center' as const,
    padding: '2rem',
  },
  successSub: {
    color: 'var(--color-text-light)',
    marginBottom: '2rem',
  },
  btn: {
    display: 'inline-block',
    marginTop: '1rem',
    background: 'var(--color-primary)',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontWeight: 600,
  },
};
