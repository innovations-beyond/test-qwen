import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface Order {
  id: number;
  status: string;
  fulfillment_type: string;
  scheduled_for: string;
  total: string;
  guest_name: string;
  guest_email: string;
  placed_at: string | null;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/orders/`, {
      headers: { Authorization: `Token ${localStorage.getItem('admin_token') || ''}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => setOrders(data.results || data))
      .catch(() => setError('Could not load orders. Are you authenticated?'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h2>Orders</h2>
      <p className="subtitle">Manage all customer orders.</p>

      {orders.length === 0 ? (
        <div className="card">
          <p className="muted">No orders yet.</p>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Scheduled</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.guest_name || order.guest_email}</td>
                  <td>{order.fulfillment_type}</td>
                  <td>{new Date(order.scheduled_for).toLocaleDateString()}</td>
                  <td>${order.total}</td>
                  <td>
                    <span className={`badge badge-${order.status}`}>{order.status}</span>
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
