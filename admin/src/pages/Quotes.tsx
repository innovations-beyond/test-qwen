import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface Quote {
  id: number;
  name: string;
  email: string;
  event_date: string;
  guest_count: number;
  event_type: string;
  status: string;
  created_at: string;
}

export default function Quotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/quotes/`, {
      headers: { Authorization: `Token ${localStorage.getItem('admin_token') || ''}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => setQuotes(data.results || data))
      .catch(() => setError('Could not load quotes. Are you authenticated?'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading quotes...</p>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h2>Quote Requests</h2>
      <p className="subtitle">Event catering inquiries. Respond by email with a custom proposal.</p>

      {quotes.length === 0 ? (
        <div className="card">
          <p className="muted">No quote requests yet.</p>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Event Date</th>
                <th>Guests</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.id}>
                  <td>{q.name}</td>
                  <td>{q.email}</td>
                  <td>{q.event_date}</td>
                  <td>{q.guest_count}</td>
                  <td>{q.event_type || '—'}</td>
                  <td>
                    <span className={`badge badge-${q.status}`}>{q.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
