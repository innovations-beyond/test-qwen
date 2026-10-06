import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface DessertItem {
  id: number;
  name: string;
  price: string;
  category_name: string;
  availability: string;
  is_active: boolean;
}

export default function Menu() {
  const [items, setItems] = useState<DessertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/desserts/`)
      .then((r) => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading menu...</p>;

  return (
    <div>
      <h2>Menu Management</h2>
      <p className="subtitle">
        Manage your dessert catalog. Use the{' '}
        <a href="http://localhost:8000/admin/" target="_blank" rel="noreferrer">
          Django Admin
        </a>{' '}
        for full CRUD operations.
      </p>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Availability</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className={item.is_active ? '' : 'row-inactive'}>
                <td>{item.name}</td>
                <td>{item.category_name || '—'}</td>
                <td>${item.price}</td>
                <td>{item.availability}</td>
                <td>
                  <span className={`badge ${item.is_active ? 'badge-active' : 'badge-inactive'}`}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <p className="muted">No menu items yet. Add some via Django Admin.</p>}
      </div>
    </div>
  );
}
