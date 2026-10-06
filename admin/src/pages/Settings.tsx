import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface Settings {
  business_name: string;
  tagline: string;
  phone: string;
  email: string;
  minimum_lead_hours: number;
  tax_rate_percent: string;
  delivery_fee_flat: string;
  pickup_fee_flat: string;
}

export default function Settings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/settings/`)
      .then((r) => r.json())
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading settings...</p>;
  if (!settings) return <p>Could not load settings.</p>;

  return (
    <div>
      <h2>Business Settings</h2>
      <p className="subtitle">
        View current configuration. Edit via{' '}
        <a href="http://localhost:8000/admin/" target="_blank" rel="noreferrer">
          Django Admin
        </a>{' '}
        for full control.
      </p>

      <div className="card">
        <dl className="settings-list">
          <div className="settings-row">
            <dt>Business Name</dt>
            <dd>{settings.business_name}</dd>
          </div>
          <div className="settings-row">
            <dt>Tagline</dt>
            <dd>{settings.tagline || '—'}</dd>
          </div>
          <div className="settings-row">
            <dt>Phone</dt>
            <dd>{settings.phone || '—'}</dd>
          </div>
          <div className="settings-row">
            <dt>Email</dt>
            <dd>{settings.email || '—'}</dd>
          </div>
          <div className="settings-row">
            <dt>Minimum Lead Time</dt>
            <dd>{settings.minimum_lead_hours} hours</dd>
          </div>
          <div className="settings-row">
            <dt>Tax Rate</dt>
            <dd>{settings.tax_rate_percent}%</dd>
          </div>
          <div className="settings-row">
            <dt>Delivery Fee</dt>
            <dd>${settings.delivery_fee_flat}</dd>
          </div>
          <div className="settings-row">
            <dt>Pickup Fee</dt>
            <dd>${settings.pickup_fee_flat}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
