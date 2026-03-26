import { useState, useEffect, useMemo } from 'react';
import { fetchPricebook, createPricebookItem, updatePricebookItem, deletePricebookItem } from '../lib/api';
import { Tag } from '../components/ui/Tag';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';

const CATEGORIES = ['Labor', 'Parts', 'Service Calls', 'Packages', 'Other'];
const UNITS = ['each', 'hour', 'sqft', 'unit', 'day'];

const EMPTY_FORM = {
  name: '',
  description: '',
  category: 'Labor',
  unit_price: '',
  unit: 'each',
  is_active: true,
};

export function PriceBook() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [editId, setEditId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchPricebook()
      .then(data => {
        setItems(Array.isArray(data) ? data : data.items || []);
      })
      .catch(err => {
        console.error('Failed to load pricebook:', err);
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items
      .filter((item) => {
        const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
        const matchesStatus = statusFilter === 'All'
          || (statusFilter === 'Active' ? item.is_active !== false : item.is_active === false);
        if (!normalizedQuery) return matchesCategory && matchesStatus;
        const haystack = [
          item.name,
          item.description,
          item.category,
          item.unit,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return matchesCategory && matchesStatus && haystack.includes(normalizedQuery);
      })
      .sort((left, right) => {
        if (sortBy === 'price_desc') return Number(right.unit_price || 0) - Number(left.unit_price || 0);
        if (sortBy === 'price_asc') return Number(left.unit_price || 0) - Number(right.unit_price || 0);
        if (sortBy === 'recent') return new Date(right.created_at || 0) - new Date(left.created_at || 0);
        return (left.name || '').localeCompare(right.name || '');
      });
  }, [items, query, categoryFilter, statusFilter, sortBy]);

  const grouped = CATEGORIES.reduce((acc, category) => {
    acc[category] = filteredItems.filter((item) => item.category === category);
    return acc;
  }, {});

  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setForm({
      name: item.name || '',
      description: item.description || '',
      category: item.category || 'Labor',
      unit_price: item.unit_price != null ? String(item.unit_price) : '',
      unit: item.unit || 'each',
      is_active: item.is_active !== false,
    });
    setShowForm(true);
    setFormError('');
  };

  const cancelForm = () => {
    setShowForm(false);
    setForm(EMPTY_FORM);
    setEditId(null);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setFormError('Name is required.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    const payload = {
      ...form,
      unit_price: form.unit_price !== '' ? parseFloat(form.unit_price) : undefined,
    };
    try {
      if (editId) {
        const updated = await updatePricebookItem(editId, payload);
        setItems(prev => prev.map(i => i.id === editId ? { ...i, ...updated } : i));
      } else {
        const created = await createPricebookItem(payload);
        setItems(prev => [created, ...prev]);
      }
      cancelForm();
    } catch (err) {
      setFormError(err.message || 'Failed to save item.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    setDeletingId(id);
    try {
      await deletePricebookItem(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (item) => {
    try {
      const updated = await updatePricebookItem(item.id, { is_active: !item.is_active });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_active: !item.is_active, ...updated } : i));
    } catch (err) {
      console.error('Failed to toggle active:', err);
    }
  };

  return (
    <div className="page active" id="p-pricebook" style={{ padding: '0' }}>
      <div style={{ padding: '22px 24px' }}>

        {/* Header */}
        <section className="page-hero">
          <div>
            <div className="page-eyebrow">Pricing system</div>
            <h1 className="page-title">Keep your services, labor, and pricing ready for every quote.</h1>
            <p className="page-subtitle">
              Matchit uses your price book across estimates, invoices, and AI-assisted quoting, so this should stay clean and searchable.
            </p>
          </div>
          <div className="page-stat-chip">
            <strong>{filteredItems.length}</strong>
            <span>{filteredItems.length === items.length ? 'visible items' : `filtered from ${items.length}`}</span>
          </div>
        </section>

        <div className="toolbar-shell pb-toolbar">
          <div className="srch" style={{ minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Search services, parts, descriptions"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} style={{ width: 'auto', minWidth: '140px' }}>
              <option value="All">All categories</option>
              {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} style={{ width: 'auto', minWidth: '120px' }}>
              <option value="All">All status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} style={{ width: 'auto', minWidth: '145px' }}>
              <option value="name">Sort: Name</option>
              <option value="recent">Sort: Recent</option>
              <option value="price_desc">Sort: Highest price</option>
              <option value="price_asc">Sort: Lowest price</option>
            </select>
            <button
              className="btn btn-dark btn-sm"
              onClick={() => { cancelForm(); setShowForm(v => !v); }}
            >
              {showForm && !editId ? '✕ Cancel' : '+ Add item'}
            </button>
          </div>
        </div>

        {/* Add / Edit form */}
        {showForm && (
          <Card style={{ marginBottom: '20px' }}>
            <CardHeader><CardTitle>{editId ? 'Edit item' : 'New item'}</CardTitle></CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <div className="field-row">
                  <div className="field">
                    <label>Name <span style={{ color: 'var(--red)' }}>*</span></label>
                    <input type="text" value={form.name} onChange={e => handleFormChange('name', e.target.value)} placeholder="e.g. AC service call" />
                  </div>
                  <div className="field">
                    <label>Category</label>
                    <select value={form.category} onChange={e => handleFormChange('category', e.target.value)}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label>Description</label>
                  <input type="text" value={form.description} onChange={e => handleFormChange('description', e.target.value)} placeholder="Brief description (optional)" />
                </div>
                <div className="field-row">
                  <div className="field">
                    <label>Unit price ($)</label>
                    <input type="number" min="0" step="0.01" value={form.unit_price} onChange={e => handleFormChange('unit_price', e.target.value)} placeholder="125.00" />
                  </div>
                  <div className="field">
                    <label>Unit</label>
                    <select value={form.unit} onChange={e => handleFormChange('unit', e.target.value)}>
                      {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
                <div className="field" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={form.is_active}
                    onChange={e => handleFormChange('is_active', e.target.checked)}
                    style={{ width: 'auto', accentColor: 'var(--text)' }}
                  />
                  <label htmlFor="is_active" style={{ margin: 0, cursor: 'pointer' }}>Active (visible to AI agent)</label>
                </div>
                {formError && (
                  <div style={{ color: 'var(--red)', fontSize: '13px', marginBottom: '12px' }}>{formError}</div>
                )}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="submit" className="btn btn-dark btn-sm" disabled={submitting}>
                    {submitting ? 'Saving...' : editId ? 'Save changes' : 'Add item'}
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={cancelForm}>Cancel</button>
                </div>
              </form>
            </CardBody>
          </Card>
        )}

        {/* Items grouped by category */}
        {loading ? (
          <div className="loading">Loading...</div>
        ) : items.length === 0 ? (
          <div className="empty-state" style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: 'var(--text3)', maxWidth: '420px', margin: '0 auto', lineHeight: 1.7 }}>
              No items yet. Add your services and prices here. Your AI will reference these when discussing pricing with leads.
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state" style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: 'var(--text3)', maxWidth: '420px', margin: '0 auto', lineHeight: 1.7 }}>
              No price book items match these filters. Try widening the search or clearing the status/category filters.
            </div>
          </div>
        ) : (
          CATEGORIES.map(cat => {
            const catItems = grouped[cat];
            if (catItems.length === 0) return null;
            return (
              <div key={cat} style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.1em', fontFamily: "'JetBrains Mono', monospace", marginBottom: '8px' }}>
                  {cat}
                </div>
                <div className="tbl">
                  <div className="th" style={{ gridTemplateColumns: '2fr 1.5fr 1fr 1fr 80px 100px' }}>
                    <span>Name</span>
                    <span>Description</span>
                    <span>Price</span>
                    <span>Unit</span>
                    <span>Status</span>
                    <span></span>
                  </div>
                  {catItems.map(item => (
                    <div key={item.id} className="tr" style={{ gridTemplateColumns: '2fr 1.5fr 1fr 1fr 80px 100px' }}>
                      <div className="tnc">
                        <span style={{ fontWeight: '500', fontSize: '13px' }}>{item.name}</span>
                      </div>
                      <div className="tc" style={{ color: 'var(--text3)' }}>{item.description || '—'}</div>
                      <div className="tc" style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: '500' }}>
                        {item.unit_price != null ? `$${Number(item.unit_price).toFixed(2)}` : '—'}
                      </div>
                      <div className="tc">{item.unit || '—'}</div>
                      <div>
                        <Tag
                          color={item.is_active !== false ? 'green' : 'gray'}
                          style={{ fontSize: '10px', cursor: 'pointer' }}
                          onClick={() => handleToggleActive(item)}
                        >
                          {item.is_active !== false ? 'Active' : 'Inactive'}
                        </Tag>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '4px 10px', fontSize: '11px' }}
                          onClick={() => startEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '4px 10px', fontSize: '11px', color: 'var(--red)', borderColor: 'var(--red-bg)' }}
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                        >
                          {deletingId === item.id ? '...' : 'Del'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
