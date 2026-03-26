import { useMemo, useState } from 'react';
import { createLineItem } from '../lib/lineItems';

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function lineTotal(quantity, unitPrice) {
  return Math.round(Number(quantity || 0) * Number(unitPrice || 0) * 100) / 100;
}

export function LineItemsEditor({
  items,
  onChange,
  pricebook = [],
  quantityMin = '0.25',
  quantityStep = '0.25',
  customLabel = '+ Custom line',
  pricebookLabel = '+ From price book',
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [search, setSearch] = useState('');

  const filteredPricebook = useMemo(() => {
    return pricebook.filter((item) => {
      if (item.is_active === false) return false;
      if (!search.trim()) return true;
      const term = search.toLowerCase();
      return (
        item.name?.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term) ||
        item.category?.toLowerCase().includes(term)
      );
    });
  }, [pricebook, search]);

  const updateItem = (key, field, value) => {
    const next = items.map((item) => {
      if (item._key !== key) return item;
      const updated = { ...item, [field]: value };
      updated.total = lineTotal(updated.quantity || 1, updated.unit_price || 0);
      return updated;
    });
    onChange(next);
  };

  const removeItem = (key) => onChange(items.filter((item) => item._key !== key));

  const addCustom = () => onChange([...items, createLineItem()]);

  const addFromPricebook = (pricebookItem) => {
    onChange([...items, createLineItem(pricebookItem)]);
    setShowPicker(false);
    setSearch('');
  };

  return (
    <div className="line-editor">
      {items.length > 0 ? (
        <div className="line-editor-table">
          <div className="line-editor-head">
            <span>Item</span>
            <span>Qty</span>
            <span>Unit price</span>
            <span>Total</span>
            <span />
          </div>
          {items.map((item) => (
            <div key={item._key} className="line-editor-row">
              <div className="line-editor-cell line-editor-item">
                <input
                  value={item.name}
                  onChange={(event) => updateItem(item._key, 'name', event.target.value)}
                  placeholder="Item name"
                />
                <input
                  value={item.description || ''}
                  onChange={(event) => updateItem(item._key, 'description', event.target.value)}
                  placeholder="Description (optional)"
                  className="line-editor-subinput"
                />
              </div>
              <div className="line-editor-cell">
                <input
                  type="number"
                  min={quantityMin}
                  step={quantityStep}
                  value={item.quantity}
                  onChange={(event) => updateItem(item._key, 'quantity', event.target.value)}
                  className="line-editor-number line-editor-center"
                />
              </div>
              <div className="line-editor-cell">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unit_price}
                  onChange={(event) => updateItem(item._key, 'unit_price', event.target.value)}
                  className="line-editor-number line-editor-money"
                />
              </div>
              <div className="line-editor-total">{formatMoney(item.total)}</div>
              <button
                type="button"
                className="line-editor-remove"
                onClick={() => removeItem(item._key)}
                aria-label="Remove line item"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <div className="line-editor-actions">
        <button type="button" className="btn btn-ghost btn-sm" onClick={addCustom}>
          {customLabel}
        </button>
        {pricebook.length > 0 ? (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setShowPicker((value) => !value);
              setSearch('');
            }}
          >
            {pricebookLabel}
          </button>
        ) : null}
      </div>

      {showPicker ? (
        <div className="picker-panel">
          <div className="picker-head">
            <input
              autoFocus
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search price book..."
            />
          </div>
          <div className="picker-list">
            {filteredPricebook.length === 0 ? (
              <div className="picker-empty">
                {pricebook.length === 0 ? 'No items in price book yet.' : 'No matches found.'}
              </div>
            ) : (
              filteredPricebook.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="picker-item"
                  onClick={() => addFromPricebook(item)}
                >
                  <div>
                    <div className="picker-item-title">{item.name}</div>
                    {item.description ? (
                      <div className="picker-item-copy">{item.description}</div>
                    ) : null}
                  </div>
                  <div className="picker-item-price">
                    {formatMoney(item.unit_price)}/{item.unit || 'each'}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
