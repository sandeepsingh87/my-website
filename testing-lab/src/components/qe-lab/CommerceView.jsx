import React from 'react';
import { ArrowUpDown, Filter, Search, SlidersHorizontal } from 'lucide-react';
import { PAGE_SIZE } from '../../data/fixtures.js';
import { tid } from '../../lib/tid.js';

export default function CommerceView({
  query,
  setQuery,
  status,
  setStatus,
  sortBy,
  setSortBy,
  sortDir,
  setSortDir,
  page,
  setPage,
  filteredOrders,
  pagedOrders,
  setSelectedOrder,
  updateOrderStatus,
  onClearFilters
}) {
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));

  return (
    <section className="panel" {...tid('view-commerce')}>
      <div className="panel-head">
        <h2>Orders and Data Grid</h2>
        <ArrowUpDown size={18} aria-hidden="true" />
      </div>
      <p className="panel-lede">Search, filter, sort, pagination, empty state, and row actions including a details modal.</p>
      <div className="toolbar" {...tid('bar-order-filters')}>
        <label className="search-field" {...tid('fld-order-search')}>
          <Search size={16} aria-hidden="true" />
          <input {...tid('inp-order-search')} value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search orders" />
        </label>
        <label {...tid('sel-order-status')}>
          <Filter size={16} aria-hidden="true" />
          <select {...tid('ddl-order-status')} value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}>
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
        <label {...tid('sel-order-sort')}>
          <SlidersHorizontal size={16} aria-hidden="true" />
          <select {...tid('ddl-order-sort')} value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="id">Sort by ID</option>
            <option value="customer">Sort by customer</option>
            <option value="status">Sort by status</option>
            <option value="amount">Sort by total</option>
            <option value="placed">Sort by date</option>
          </select>
        </label>
        <button
          type="button"
          className="secondary-button"
          onClick={() => setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'))}
          {...tid('btn-sort-dir')}
        >
          {sortDir === 'asc' ? 'Asc' : 'Desc'}
        </button>
        <button type="button" className="secondary-button" onClick={onClearFilters} {...tid('btn-clear-filters')}>
          Clear filters
        </button>
      </div>

      <p className="result-count" {...tid('txt-order-count')}>{filteredOrders.length} order{filteredOrders.length === 1 ? '' : 's'}</p>

      {filteredOrders.length === 0 ? (
        <p className="empty-state" {...tid('msg-orders-empty')}>No orders match the current filters.</p>
      ) : (
        <>
          <div className="table-wrap" {...tid('tbl-orders-wrap')}>
            <table {...tid('tbl-orders')}>
              <caption className="sr-only">Practice orders for filter, sort, and status tests</caption>
              <thead>
                <tr>
                  <th scope="col">Order</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Product</th>
                  <th scope="col">Placed</th>
                  <th scope="col">Status</th>
                  <th scope="col">Total</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {pagedOrders.map((order) => {
                  const locked = order.status === 'shipped' || order.status === 'cancelled';
                  return (
                    <tr key={order.id} {...tid(`row-order-${order.id.toLowerCase()}`)}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.product}</td>
                      <td>{order.placed}</td>
                      <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                      <td>{order.total}</td>
                      <td>
                        <button className="text-button" onClick={() => setSelectedOrder(order.id)} {...tid(`btn-order-view-${order.id.toLowerCase()}`)}>View</button>
                        <button
                          className="text-button"
                          disabled={locked}
                          onClick={() => updateOrderStatus(order.id, 'shipped')}
                          {...tid(`btn-order-ship-${order.id.toLowerCase()}`)}
                        >
                          Ship
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="pager" {...tid('bar-order-pager')}>
            <button className="secondary-button" type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} {...tid('btn-page-prev')}>Previous</button>
            <span {...tid('txt-page')}>Page {page} of {totalPages}</span>
            <button className="secondary-button" type="button" disabled={page >= totalPages} onClick={() => setPage(page + 1)} {...tid('btn-page-next')}>Next</button>
          </div>
        </>
      )}
    </section>
  );
}
