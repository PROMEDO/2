/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Check, MessageCircle } from 'lucide-react';
import { formatNumber, waLink } from '../../utils/storage';
import { surfaceCardStyle, useDashboard } from './DashboardContext';

export const OrdersPage: React.FC = () => {
  const {
    rest,
    currency,
    allOrders,
    filteredOrders,
    newOrdersCount,
    orderFilter,
    setOrderFilter,
    handleUpdateOrderStatus,
    customTabLabel,
  } = useDashboard();

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '22px' }}>
        <div>
          <h1 style={{ margin: '0 0 6px', fontSize: '24px', fontWeight: 900, color: 'var(--ink)' }}>
            {customTabLabel('orders', 'الطلبات الواردة 🛍️')}
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)' }}>
            تصل هنا جميع طلبات الزبائن فور تأكيدها وإرسالها عبر الواتساب.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={orderFilter === 'all' ? 'btn p s' : 'btn s'}
            onClick={() => setOrderFilter('all')}
          >
            الكل ({allOrders.length})
          </button>
          <button
            type="button"
            className={orderFilter === 'new' ? 'btn p s' : 'btn s'}
            onClick={() => setOrderFilter('new')}
          >
            جديد ({newOrdersCount})
          </button>
          <button
            type="button"
            className={orderFilter === 'completed' ? 'btn p s' : 'btn s'}
            onClick={() => setOrderFilter('completed')}
          >
            مكتمل
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div style={{ ...surfaceCardStyle, padding: '40px 20px', textAlign: 'center', borderRadius: '18px' }}>
          <div style={{ fontSize: '42px', marginBottom: '12px' }}>📦</div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px', color: 'var(--ink)' }}>
            لا توجد طلبات في هذا القسم حالياً
          </h3>
          <p style={{ fontSize: '13.5px', margin: 0, color: 'var(--muted)' }}>
            عندما يقوم الزبائن بالطلب عبر المنيو ستظهر تفاصيل طلباتهم هنا فوراً.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredOrders.map((order) => {
            const ordType = order.type || order.cu?.orderType || 'delivery';
            const ordName = order.name || order.cu?.n || '';
            const ordPhone = order.phone || order.cu?.ph || '';
            const ordAddr = order.address || order.cu?.address || '';
            const ordNotes = order.notes || order.cu?.nt || '';
            const ordTable = order.table || order.cu?.table || '';

            const statusText =
              order.st === 'new' || order.status === 'pending'
                ? 'جديد'
                : order.st === 'preparing'
                ? 'قيد التجهيز'
                : order.st === 'completed'
                ? 'مكتمل ✓'
                : 'ملغي ✕';

            const statusBg =
              order.st === 'new' || order.status === 'pending'
                ? '#ea580c'
                : order.st === 'preparing'
                ? '#f59e0b'
                : order.st === 'completed'
                ? '#10b981'
                : '#ef4444';

            const displayOrderNum =
              order.orderSeq || order.seq
                ? `#${order.orderSeq || order.seq}`
                : `#${order.id.slice(-6).toUpperCase()}`;

            return (
              <div
                key={order.id}
                style={{
                  ...surfaceCardStyle,
                  padding: '18px 20px',
                  borderRadius: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--ink)' }}>
                      طلب {displayOrderNum}
                    </span>
                    <span
                      style={{
                        background: statusBg,
                        color: '#fff',
                        fontSize: '11.5px',
                        padding: '3px 9px',
                        borderRadius: '12px',
                        fontWeight: 800,
                      }}
                    >
                      {statusText}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                      {ordType === 'table'
                        ? 'طلب طاولة (داخل الصالة)'
                        : ordType === 'delivery'
                        ? 'توصيل'
                        : 'استلام من الفرع'}
                    </span>
                    {ordTable && (
                      <span style={{ fontSize: '12px', color: 'var(--brand-ink, #34D399)', fontWeight: 700 }}>
                        طاولة {ordTable}
                      </span>
                    )}
                  </div>

                  <div className="tabular-nums" style={{ fontSize: '16px', fontWeight: 900, color: 'var(--brand-ink, #34D399)' }}>
                    {formatNumber(order.tot || order.total || 0)} {currency}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', marginBottom: '12px', color: 'var(--muted)' }}>
                  {ordName && <span>الاسم: <b style={{ color: 'var(--ink)' }}>{ordName}</b></span>}
                  {ordPhone && <span>الهاتف: <b style={{ color: 'var(--ink)' }}>{ordPhone}</b></span>}
                  {ordAddr && <span>العنوان: <b style={{ color: 'var(--ink)' }}>{ordAddr}</b></span>}
                  {ordNotes && <span>ملاحظات: <b style={{ color: 'var(--ink)' }}>{ordNotes}</b></span>}
                </div>

                <div style={{ background: 'var(--panel)', borderRadius: '10px', padding: '10px 14px', marginBottom: '12px', border: 0 }}>
                  {(order.items || []).map((it, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '4px 0', color: 'var(--ink)' }}>
                      <span>
                        {it.n} {it.size ? `(${it.size})` : ''} × {it.q}
                      </span>
                      <span className="tabular-nums" style={{ fontWeight: 700 }}>
                        {formatNumber((it.pr || it.p || 0) * it.q)} {currency}
                      </span>
                    </div>
                  ))}
                  {Number(order.serviceFee || 0) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', paddingTop: '6px', color: 'var(--muted)' }}>
                      <span>رسوم التغليف والخدمة</span>
                      <span className="tabular-nums">{formatNumber(order.serviceFee)} {currency}</span>
                    </div>
                  )}
                  {Number(order.discount || 0) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', paddingTop: '4px', color: '#10b981' }}>
                      <span>خصم {order.couponCode ? `(${order.couponCode})` : ''}</span>
                      <span className="tabular-nums">-{formatNumber(order.discount)} {currency}</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', flexWrap: 'wrap' }}>
                  {ordPhone && (
                    <a
                      href={waLink(ordPhone, `مرحباً ${ordName}، بخصوص طلبك من ${rest.n}:`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#25D366',
                        color: '#fff',
                        textDecoration: 'none',
                        padding: '7px 14px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <MessageCircle size={14} />
                      <span>مراسلة الزبون بالواتساب</span>
                    </a>
                  )}
                  {order.st !== 'completed' && (
                    <button
                      type="button"
                      className="btn s"
                      onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                    >
                      <Check size={14} />
                      <span>تعيين كمكتمل</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
