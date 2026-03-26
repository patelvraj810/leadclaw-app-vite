export function createLineItem(pricebookItem = null) {
  const unitPrice = Number(pricebookItem?.unit_price || 0);
  return {
    _key: Math.random().toString(36).slice(2),
    name: pricebookItem?.name || '',
    description: pricebookItem?.description || '',
    quantity: 1,
    unit_price: unitPrice,
    unit: pricebookItem?.unit || 'each',
    total: unitPrice,
  };
}
