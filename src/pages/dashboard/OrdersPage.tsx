/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CalendarClock,
  Check,
  Copy,
  ExternalLink,
  Eye,
  FileText,
  Link2,
  MapPin,
  MessageCircle,
  Phone,
  Store,
  Truck,
  User,
  Utensils,
  X,
} from 'lucide-react';
import { Order } from '../../types';
import { copyTextReliable, formatNumber, waLink } from '../../utils/storage';
import { surfaceCardStyle, useDashboard } from './DashboardContext';

function formatOrderDayAndTime(order: Order): string {
  const rawTs = Number(order.at || 0);
  const parsedCreatedAt = !rawTs && order.createdAt ? Date.parse(order.createdAt) : NaN;
  const ts = rawTs > 0 ? rawTs : Number.isFinite(parsedCreatedAt) ? parsedCreatedAt : 0;

  if (ts > 0) {
    const dt = new Date(ts);
    try {
      const dayPart = dt.toLocaleDateString('ar-IQ-u-nu-latn', {
        weekday: 'short',
        day: 'numeric',
        month: 'numeric',
      });
      const timePart = dt.toLocaleTimeString('ar-IQ-u-nu-latn', {
        hour: '2-digit',
        minute: '2-digit',
      });
      return `${dayPart} • ${timePart}`;
    } catch {
      return `${dt.toLocaleDateString()} • ${dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  }

  return order.createdAt || '—';
}

function getOrderTypeInfo(order: Order) {
  const rawType = order.type || order.cu?.orderType || 'delivery';
  const tableVal = String(order.table || order.cu?.table || '').trim();

  if (rawType === 'table') {
    return {
      key: 'table' as const,
      label: tableVal ? `طاولة (${tableVal})` : 'طاولة',
      Icon: Utensils,
    };
  }
  if (rawType === 'pickup') {
    return {
      key: 'pickup' as const,
      label: 'حجز',
      Icon: Store,
    };
  }
  return {
    key: 'delivery' as const,
    label: 'توصيل',
    Icon: Truck,
  };
}

function getOrderStatusInfo(order: Order) {
  if (order.st === 'new' || order.status === 'pending') {
    return { text: 'جديد', bg: '#ea580c' };
  }
  if (order.st === 'preparing' || order.status === 'preparing') {
    return { text: 'قيد التجهيز', bg: '#f59e0b' };
  }
  if (order.st === 'completed' || order.status === 'completed') {
    return { text: 'مكتمل', bg: '#10b981' };
  }
  return { text: 'ملغي', bg: '#ef4444' };
}

function getOrderDisplayNumber(order: Order): string {
  return order.orderSeq || order.seq
    ? `#${order.orderSeq || order.seq}`
    : `#${order.id.slice(-6).toUpperCase()}`;
}

function extractOrderLinks(order: Order, restName: string): Array<{ label: string; url: string; kind: 'whatsapp' | 'map' | 'web' }> {
  const links: Array<{ label: string; url: string; kind: 'whatsapp' | 'map' | 'web' }> = [];
  const seen = new Set<string>();

  const addLink = (label: string, url: string, kind: 'whatsapp' | 'map' | 'web') => {
    const clean = String(url || '').trim();
    if (!clean || seen.has(clean)) return;
    seen.add(clean);
    links.push({ label, url: clean, kind });
  };

  const ordName = order.name || order.cu?.n || '';
  const ordPhone = order.phone || order.cu?.ph || '';
  if (ordPhone) {
    addLink(
      'مراسلة الزبون عبر واتساب',
      waLink(ordPhone, `مرحباً ${ordName}، بخصوص طلبك ${getOrderDisplayNumber(order)} من ${restName}:`),
      'whatsapp'
    );
  }

  const lat = order.lat ?? order.cu?.lat;
  const lng = order.lng ?? order.cu?.lng;
  if (lat && lng) {
    addLink(
      'موقع الزبون على خرائط Google',
      `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}`,
      'map'
    );
  }

  const directMap = order.mapUrl || order.locationUrl || order.cu?.mapUrl || order.cu?.locationUrl;
  if (typeof directMap === 'string' && /^https?:\/\//i.test(directMap.trim())) {
    addLink('رابط الموقع المرفق', directMap.trim(), 'map');
  }

  const textPool = [
    order.address,
    order.cu?.address,
    order.notes,
    order.cu?.nt,
  ]
    .filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
    .join(' ');

  const urlMatches = textPool.match(/https?:\/\/[^\s]+/gi) || [];
  urlMatches.forEach((rawUrl, idx) => {
    const cleanUrl = rawUrl.replace(/[),.;]+$/, '');
    const isMap = /maps\.google|goo\.gl\/maps|maps\.app\.goo\.gl/i.test(cleanUrl);
    addLink(isMap ? 'رابط خرائط Google' : `رابط مرفق #${idx + 1}`, cleanUrl, isMap ? 'map' : 'web');
  });

  return links;
}

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
    showToast,
  } = useDashboard();

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const selectedOrder = selectedOrderId
    ? allOrders.find((o) => o.id === selectedOrderId) || null
    : null;

  const completedOrdersCount = allOrders.filter(
    (o) => o.st === 'completed' || o.status === 'completed'
  ).length;

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
      <div className="mp-orders-toolbar">
        <div className="mp-orders-tabs" role="tablist" aria-label="تصفية الطلبات">
          <button
            type="button"
            role="tab"
            aria-selected={orderFilter === 'all'}
            className={`mp-orders-tab ${orderFilter === 'all' ? 'is-active' : ''}`}
            onClick={() => setOrderFilter('all')}
          >
            <span>الكل</span>
            <span className="mp-orders-tab-count tabular-nums">({allOrders.length})</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={orderFilter === 'new'}
            className={`mp-orders-tab ${orderFilter === 'new' ? 'is-active' : ''}`}
            onClick={() => setOrderFilter('new')}
          >
            <span>جديد</span>
            <span className="mp-orders-tab-count tabular-nums">({newOrdersCount})</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={orderFilter === 'completed'}
            className={`mp-orders-tab ${orderFilter === 'completed' ? 'is-active' : ''}`}
            onClick={() => setOrderFilter('completed')}
          >
            <span>مكتمل</span>
            <span className="mp-orders-tab-count tabular-nums">({completedOrdersCount})</span>
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div style={{ ...surfaceCardStyle, padding: '40px 20px', textAlign: 'center', borderRadius: '18px' }}>
          <div style={{ fontSize: '42px', marginBottom: '12px' }}>📦</div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px', color: 'var(--ink)' }}>
            لا توجد طلبات في هذا التصنيف حالياً
          </h3>
          <p style={{ fontSize: '13.5px', margin: 0, color: 'var(--muted)' }}>
            عندما يقوم الزبائن بالطلب عبر المنيو ستظهر طلباتهم هنا فوراً.
          </p>
        </div>
      ) : (
        <div className="mp-orders-list">
          {filteredOrders.map((order) => {
            const ordName = order.name || order.cu?.n || '';
            const ordPhone = order.phone || order.cu?.ph || '';
            const typeInfo = getOrderTypeInfo(order);
            const TypeIcon = typeInfo.Icon;
            const statusInfo = getOrderStatusInfo(order);
            const displayOrderNum = getOrderDisplayNumber(order);
            const dateTimeLabel = formatOrderDayAndTime(order);
            const totalAmount = formatNumber(order.tot || order.total || 0);

            return (
              <div key={order.id} className="mp-order-row">
                <div className="mp-order-top-line">
                  <div className="mp-order-meta-group">
                    <span className="mp-order-num tabular-nums">
                      {displayOrderNum}
                    </span>

                    <span className="mp-order-type-chip">
                      <TypeIcon size={12} style={{ color: 'var(--brand-ink, #34D399)', flexShrink: 0 }} />
                      <span>{typeInfo.label}</span>
                    </span>

                    <span
                      className="mp-order-status-dot"
                      style={{ background: statusInfo.bg }}
                    >
                      {statusInfo.text}
                    </span>
                  </div>

                  <div className="mp-order-end-group">
                    <span className="mp-order-price tabular-nums">
                      {totalAmount} {currency}
                    </span>

                    {ordPhone && (
                      <a
                        href={waLink(
                          ordPhone,
                          `مرحباً ${ordName}، بخصوص طلبك ${displayOrderNum} من ${rest.n}:`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mp-order-icon-btn is-wa"
                        title="مراسلة الزبون عبر واتساب"
                        aria-label={`مراسلة الزبون عبر واتساب للطلب ${displayOrderNum}`}
                      >
                        <MessageCircle size={15} />
                      </a>
                    )}

                    <button
                      type="button"
                      className="mp-order-icon-btn"
                      onClick={() => setSelectedOrderId(order.id)}
                      title="تفاصيل الطلب"
                      aria-label={`تفاصيل الطلب ${displayOrderNum}`}
                    >
                      <Eye size={15} />
                    </button>
                  </div>
                </div>

                <div className="mp-order-bottom-line">
                  <span className="mp-order-datetime tabular-nums">
                    <CalendarClock size={12} style={{ flexShrink: 0, opacity: 0.8 }} />
                    <span>{dateTimeLabel}</span>
                  </span>

                  <span className="mp-order-customer-mini">
                    {ordName ? `${ordName} • ${statusInfo.text}` : statusInfo.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedOrder && (() => {
        const ordName = selectedOrder.name || selectedOrder.cu?.n || '';
        const ordPhone = selectedOrder.phone || selectedOrder.cu?.ph || '';
        const ordAddr = selectedOrder.address || selectedOrder.cu?.address || '';
        const ordNotes = selectedOrder.notes || selectedOrder.cu?.nt || '';
        const ordArea = selectedOrder.cu?.area || selectedOrder.area || '';
        const ordCity = selectedOrder.cu?.city || selectedOrder.city || '';
        const ordTable = selectedOrder.table || selectedOrder.cu?.table || '';
        const deliveryFee = Number(selectedOrder.cu?.deliveryFee ?? selectedOrder.deliveryFee ?? 0);
        const typeInfo = getOrderTypeInfo(selectedOrder);
        const TypeIcon = typeInfo.Icon;
        const statusInfo = getOrderStatusInfo(selectedOrder);
        const displayOrderNum = getOrderDisplayNumber(selectedOrder);
        const dateTimeLabel = formatOrderDayAndTime(selectedOrder);
        const orderLinks = extractOrderLinks(selectedOrder, rest.n);

        return (
          <>
            <div className="drawer-backdrop" onClick={() => setSelectedOrderId(null)} />
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`تفاصيل الطلب ${displayOrderNum}`}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'min(560px, 94vw)',
                maxHeight: '90vh',
                overflowY: 'auto',
                ...surfaceCardStyle,
                borderRadius: '20px',
                padding: '18px 18px 20px',
                zIndex: 99999,
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  paddingBottom: '12px',
                  marginBottom: '14px',
                  borderBottom: '1px solid var(--line)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: 'var(--ink)' }} className="tabular-nums">
                    تفاصيل الطلب {displayOrderNum}
                  </h3>
                  <span
                    className="mp-order-status-dot"
                    style={{ background: statusInfo.bg }}
                  >
                    {statusInfo.text}
                  </span>
                  <span className="mp-order-type-chip">
                    <TypeIcon size={13} style={{ color: 'var(--brand-ink, #34D399)' }} />
                    <span>{typeInfo.label}</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedOrderId(null)}
                  aria-label="إغلاق"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '9px',
                    width: '32px',
                    height: '32px',
                    display: 'grid',
                    placeItems: 'center',
                    color: 'var(--muted)',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Customer & Order Info */}
                <div className="mp-order-modal-section">
                  <h4 className="mp-order-modal-section-title">
                    <User size={14} />
                    <span>معلومات الطلب والزبون</span>
                  </h4>

                  <div className="mp-order-info-grid">
                    <div className="mp-order-info-item">
                      <span className="mp-order-info-label">تاريخ ووقت الطلب</span>
                      <span className="mp-order-info-val tabular-nums">{dateTimeLabel}</span>
                    </div>

                    <div className="mp-order-info-item">
                      <span className="mp-order-info-label">نوع الطلب</span>
                      <span className="mp-order-info-val">{typeInfo.label}</span>
                    </div>

                    {ordName && (
                      <div className="mp-order-info-item">
                        <span className="mp-order-info-label">اسم الزبون</span>
                        <span className="mp-order-info-val">{ordName}</span>
                      </div>
                    )}

                    {ordPhone && (
                      <div className="mp-order-info-item">
                        <span className="mp-order-info-label">رقم الهاتف</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <a
                            href={`tel:${ordPhone}`}
                            dir="ltr"
                            className="mp-order-info-val tabular-nums"
                            style={{ color: 'var(--brand-ink, #34D399)', textDecoration: 'none' }}
                          >
                            {ordPhone}
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              void copyTextReliable(ordPhone).then((ok) => {
                                showToast(ok ? 'تم نسخ رقم الهاتف ✓' : 'تعذر النسخ');
                              });
                            }}
                            title="نسخ الرقم"
                            aria-label="نسخ رقم الهاتف"
                            style={{
                              border: '1px solid var(--line)',
                              background: 'var(--surface)',
                              color: 'var(--muted)',
                              borderRadius: '7px',
                              width: '26px',
                              height: '26px',
                              display: 'grid',
                              placeItems: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                      </div>
                    )}

                    {(ordArea || ordCity) && (
                      <div className="mp-order-info-item">
                        <span className="mp-order-info-label">المنطقة / المدينة</span>
                        <span className="mp-order-info-val">
                          {[ordArea, ordCity].filter(Boolean).join(' — ')}
                        </span>
                      </div>
                    )}

                    {ordTable && (
                      <div className="mp-order-info-item">
                        <span className="mp-order-info-label">رقم الطاولة</span>
                        <span className="mp-order-info-val">{ordTable}</span>
                      </div>
                    )}

                    {selectedOrder.scheduledSlot && (
                      <div className="mp-order-info-item">
                        <span className="mp-order-info-label">الوقت المحدد</span>
                        <span className="mp-order-info-val">{selectedOrder.scheduledSlot}</span>
                      </div>
                    )}

                    {typeof selectedOrder.needCutlery === 'boolean' && (
                      <div className="mp-order-info-item">
                        <span className="mp-order-info-label">أدوات الطعام</span>
                        <span className="mp-order-info-val">
                          {selectedOrder.needCutlery ? 'نعم (مطلوبة)' : 'لا حاجة'}
                        </span>
                      </div>
                    )}

                    {ordAddr && (
                      <div className="mp-order-info-item" style={{ gridColumn: '1 / -1' }}>
                        <span className="mp-order-info-label">العنوان</span>
                        <span className="mp-order-info-val">{ordAddr}</span>
                      </div>
                    )}

                    {ordNotes && (
                      <div className="mp-order-info-item" style={{ gridColumn: '1 / -1' }}>
                        <span className="mp-order-info-label">ملاحظات الزبون</span>
                        <span className="mp-order-info-val">{ordNotes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Direct Links (WhatsApp, Phone, Google Maps, External URLs) */}
                {(orderLinks.length > 0 || ordPhone) && (
                  <div className="mp-order-modal-section">
                    <h4 className="mp-order-modal-section-title">
                      <Link2 size={14} />
                      <span>الروابط والتواصل المباشر</span>
                    </h4>

                    <div className="mp-order-links-list">
                      {orderLinks.map((lk, idx) => (
                        <a
                          key={idx}
                          href={lk.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mp-order-link-pill"
                          style={
                            lk.kind === 'whatsapp'
                              ? {
                                  background: '#25D366',
                                  borderColor: '#25D366',
                                  color: '#ffffff',
                                }
                              : undefined
                          }
                        >
                          {lk.kind === 'whatsapp' ? (
                            <MessageCircle size={14} />
                          ) : lk.kind === 'map' ? (
                            <MapPin size={14} />
                          ) : (
                            <ExternalLink size={14} />
                          )}
                          <span>{lk.label}</span>
                        </a>
                      ))}

                      {ordPhone && (
                        <a href={`tel:${ordPhone}`} className="mp-order-link-pill">
                          <Phone size={14} />
                          <span>اتصال هاتفي بالزبون</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Order Items & Invoice Breakdown */}
                <div className="mp-order-modal-section">
                  <h4 className="mp-order-modal-section-title">
                    <FileText size={14} />
                    <span>تفاصيل الطلب والفاتورة</span>
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(selectedOrder.items || []).map((it, idx) => {
                      const extrasList = Array.isArray(it.extras)
                        ? it.extras
                            .map((ex: any) => (typeof ex === 'string' ? ex : ex?.n || ''))
                            .filter(Boolean)
                        : [];
                      const choicesList = Array.isArray(it.choices) ? it.choices.filter(Boolean) : [];
                      const detailsParts = [it.size, ...choicesList, ...extrasList].filter(Boolean);

                      return (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: '10px',
                            paddingBottom: '8px',
                            borderBottom: '1px solid color-mix(in srgb, var(--line) 45%, transparent)',
                            fontSize: '13px',
                            color: 'var(--ink)',
                          }}
                        >
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontWeight: 700 }}>
                              {it.n} <span style={{ color: 'var(--muted)' }}>× {it.q}</span>
                            </div>
                            {detailsParts.length > 0 && (
                              <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '2px' }}>
                                {detailsParts.join(' • ')}
                              </div>
                            )}
                            {it.notes && (
                              <div style={{ fontSize: '11.5px', color: 'var(--brand-ink, #34D399)', marginTop: '2px' }}>
                                ملاحظة: {it.notes}
                              </div>
                            )}
                          </div>
                          <span className="tabular-nums" style={{ fontWeight: 800, whiteSpace: 'nowrap' }}>
                            {formatNumber((it.pr || it.p || 0) * it.q)} {currency}
                          </span>
                        </div>
                      );
                    })}

                    {deliveryFee > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--muted)' }}>
                        <span>رسوم التوصيل</span>
                        <span className="tabular-nums">{formatNumber(deliveryFee)} {currency}</span>
                      </div>
                    )}

                    {Number(selectedOrder.serviceFee || 0) > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--muted)' }}>
                        <span>رسوم التغليف والخدمة</span>
                        <span className="tabular-nums">{formatNumber(selectedOrder.serviceFee)} {currency}</span>
                      </div>
                    )}

                    {Number(selectedOrder.tipAmount || 0) > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--muted)' }}>
                        <span>إكرامية</span>
                        <span className="tabular-nums">{formatNumber(selectedOrder.tipAmount)} {currency}</span>
                      </div>
                    )}

                    {Number(selectedOrder.discount || 0) > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#10b981' }}>
                        <span>خصم {selectedOrder.couponCode ? `(${selectedOrder.couponCode})` : ''}</span>
                        <span className="tabular-nums">-{formatNumber(selectedOrder.discount)} {currency}</span>
                      </div>
                    )}

                    {Number(selectedOrder.firstOrderDiscount || 0) > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#10b981' }}>
                        <span>خصم الطلب الأول</span>
                        <span className="tabular-nums">-{formatNumber(selectedOrder.firstOrderDiscount)} {currency}</span>
                      </div>
                    )}

                    {Number(selectedOrder.spinDiscount || 0) > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#10b981' }}>
                        <span>خصم عجلة الحظ {selectedOrder.spinRewardLabel ? `(${selectedOrder.spinRewardLabel})` : ''}</span>
                        <span className="tabular-nums">-{formatNumber(selectedOrder.spinDiscount)} {currency}</span>
                      </div>
                    )}

                    {selectedOrder.freeGiftName && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--brand-ink, #34D399)', fontWeight: 700 }}>
                        <span>هدية مجانية</span>
                        <span>{selectedOrder.freeGiftName}</span>
                      </div>
                    )}

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '8px',
                        marginTop: '2px',
                        borderTop: '1px solid var(--line)',
                        fontSize: '15px',
                        fontWeight: 900,
                        color: 'var(--ink)',
                      }}
                    >
                      <span>الإجمالي النهائي</span>
                      <span className="tabular-nums" style={{ color: 'var(--brand-ink, #34D399)' }}>
                        {formatNumber(selectedOrder.tot || selectedOrder.total || 0)} {currency}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Actions */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end', marginTop: '2px' }}>
                  {selectedOrder.st !== 'preparing' && selectedOrder.st !== 'completed' && (
                    <button
                      type="button"
                      className="btn s"
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'preparing')}
                    >
                      <span>قيد التجهيز</span>
                    </button>
                  )}
                  {selectedOrder.st !== 'completed' && (
                    <button
                      type="button"
                      className="btn p s"
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'completed')}
                    >
                      <Check size={14} />
                      <span>تعيين كمكتمل</span>
                    </button>
                  )}
                  {selectedOrder.st !== 'cancelled' && selectedOrder.st !== 'completed' && (
                    <button
                      type="button"
                      className="btn d s"
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'cancelled')}
                    >
                      <span>إلغاء الطلب</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
};
