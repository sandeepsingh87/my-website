import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { tid } from '../../lib/tid.js';

export default function OrderModal({ order, onClose, updateOrderStatus }) {
  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!order) return null;
  const locked = order.status === 'shipped' || order.status === 'cancelled';

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose} {...tid('ovl-order-modal')}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-title"
        onClick={(event) => event.stopPropagation()}
        {...tid('dlg-order-details')}
      >
        <div className="panel-head">
          <h2 id="order-title">{order.id}</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close order details" {...tid('btn-order-modal-close')}>
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <dl className="detail-list">
          <div><dt>Customer</dt><dd>{order.customer}</dd></div>
          <div><dt>Product</dt><dd>{order.product}</dd></div>
          <div><dt>Placed</dt><dd>{order.placed}</dd></div>
          <div><dt>Total</dt><dd>{order.total}</dd></div>
          <div><dt>Status</dt><dd>{order.status}</dd></div>
        </dl>
        <div className="button-row">
          <button className="primary-button" disabled={locked} onClick={() => updateOrderStatus(order.id, 'processing')} {...tid('btn-modal-process')}>Process</button>
          <button className="danger-button" disabled={locked} onClick={() => updateOrderStatus(order.id, 'cancelled')} {...tid('btn-modal-cancel')}>Cancel order</button>
        </div>
      </section>
    </div>
  );
}
