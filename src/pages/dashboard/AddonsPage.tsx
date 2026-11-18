/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Edit,
  Eye,
  Plus,
  Save,
  Trash2,
  Volume2,
  X,
} from 'lucide-react';
import { ADDON_CATALOG } from '../../data/addonsCatalog';
import { formatNumber } from '../../utils/storage';
import { getAddonRequiredPlanLabel, isAddonAllowedForPlan } from '../../utils/plans';
import { playBellTone, surfaceCardStyle, themedInputStyle, useDashboard } from './DashboardContext';

export const AddonsPage: React.FC = () => {
  const {
    resolvedPlan,
    customTabLabel,
    currency,
    allItems,
    addonsState,
    editingAddonKey,
    setEditingAddonKey,
    addonDraft,
    setAddonDraft,
    showPopupPreview,
    setShowPopupPreview,
    handleToggleAddon,
    handleOpenAddonEdit,
    handleSaveAddonEdit,
    openUpgradeModal,
  } = useDashboard();

  const allowedAddonsCount = ADDON_CATALOG.filter((a) => isAddonAllowedForPlan(a.key, resolvedPlan)).length;
  const enabledCount = ADDON_CATALOG.filter(
    (a) => isAddonAllowedForPlan(a.key, resolvedPlan) && Boolean((addonsState[a.key] as Record<string, any> | undefined)?.enabled)
  ).length;
  const visibleAddons = ADDON_CATALOG;

  return (
    <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: 'var(--ink)', margin: '0 0 6px' }}>
            {customTabLabel('addons', 'متجر الإضافات والميزات التفاعلية ⚡')}
          </h1>
          <p style={{ color: 'var(--muted)', margin: 0, fontSize: '14px' }}>
            30 ميزة تسويقية وبيعية حقيقية — شغّل وعدّل أي ميزة لتعمل فوراً في منيو مطعمك.
          </p>
        </div>
        <div
          style={{
            background: 'var(--soft)',
            border: '1px solid var(--line)',
            borderRadius: '12px',
            padding: '8px 14px',
            fontSize: '13px',
            fontWeight: 800,
            color: 'var(--brand)',
          }}
        >
          المفعلة: {enabledCount} • المتاح في باقتك ({resolvedPlan.plan.n}): {allowedAddonsCount} من {ADDON_CATALOG.length}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(295px, 1fr))',
          gap: '16px',
        }}
      >
        {visibleAddons.map((addon) => {
          const allowed = isAddonAllowedForPlan(addon.key, resolvedPlan);
          const reqLabel = getAddonRequiredPlanLabel(addon.key);
          const cfg = (addonsState[addon.key] || {}) as Record<string, any>;
          const isEnabled = allowed && Boolean(cfg.enabled);
          return (
            <div
              key={addon.key}
              style={{
                background: 'var(--surface)',
                border: isEnabled ? '1.5px solid var(--brand)' : '1px solid color-mix(in srgb, var(--line) 75%, transparent)',
                borderRadius: '18px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: 'none',
                opacity: allowed ? 1 : 0.72,
              }}
            >
              {/* Top Action Bar inside Box */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid var(--line)',
                }}
              >
                {allowed ? (
                  <button
                    type="button"
                    onClick={() => handleToggleAddon(addon)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '10px',
                      border: isEnabled ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(16, 185, 129, 0.45)',
                      background: isEnabled ? 'rgba(239, 68, 68, 0.14)' : 'rgba(16, 185, 129, 0.16)',
                      color: isEnabled ? '#ef4444' : '#10b981',
                      fontWeight: 800,
                      fontSize: '12.5px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: isEnabled ? '#10b981' : '#94a3b8',
                      }}
                    />
                    <span>{isEnabled ? 'إيقاف' : 'تشغيل'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      openUpgradeModal(
                        reqLabel.includes('اقتصادية')
                          ? 'starter'
                          : reqLabel.includes('احترافية')
                          ? 'pro'
                          : 'vip'
                      )
                    }
                    style={{
                      padding: '6px 12px',
                      borderRadius: '10px',
                      border: '1px solid rgba(245, 158, 11, 0.35)',
                      background: 'rgba(245, 158, 11, 0.12)',
                      color: '#f59e0b',
                      fontWeight: 800,
                      fontSize: '11.5px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <span>🔒 {reqLabel}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (allowed) {
                      handleOpenAddonEdit(addon.key);
                    } else {
                      openUpgradeModal(
                        reqLabel.includes('اقتصادية')
                          ? 'starter'
                          : reqLabel.includes('احترافية')
                          ? 'pro'
                          : 'vip'
                      );
                    }
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--line)',
                    background: 'var(--bg)',
                    color: allowed ? 'var(--ink)' : 'var(--muted)',
                    fontWeight: 800,
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <Edit size={13} />
                  <span>{allowed ? 'تعديل' : 'ترقية'}</span>
                </button>
              </div>

              {/* Feature Identity & Summary */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: isEnabled ? 'var(--soft)' : 'var(--panel)',
                    border: 0,
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '22px',
                    flexShrink: 0,
                  }}
                >
                  {addon.icon}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '4px' }}>
                    <b style={{ fontSize: '14.5px', color: 'var(--ink)' }}>{addon.title}</b>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        color: !allowed ? '#f59e0b' : isEnabled ? '#10b981' : 'var(--muted)',
                        flexShrink: 0,
                      }}
                    >
                      {!allowed ? '🔒 مقفل' : isEnabled ? 'يعمل' : 'متوقف'}
                    </span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: 0, lineHeight: 1.55 }}>
                    {addon.desc}
                  </p>
                  {addon.key === 'freeDeliveryProgress' && (
                    <div style={{ marginTop: '6px', fontSize: '11.5px', fontWeight: 700, color: isEnabled ? 'var(--brand)' : 'var(--muted)' }}>
                      {isEnabled
                        ? `مفعّل — الحد الأدنى للتوصيل المجاني: ${formatNumber(Number(cfg.minAmount ?? 25000))} ${currency}`
                        : `غير مفعّل حالياً — الحد الأدنى عند التفعيل: ${formatNumber(Number(cfg.minAmount ?? 25000))} ${currency}`}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* EDIT ADDON POPUP MODAL */}
      {editingAddonKey && (
        <>
          <div className="drawer-backdrop" onClick={() => setEditingAddonKey(null)} />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(540px, 94vw)',
              maxHeight: '90vh',
              overflowY: 'auto',
              ...surfaceCardStyle,
              borderRadius: '20px',
              padding: '24px',
              zIndex: 99999,
              boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
            }}
          >
            {(() => {
              const activeMeta = ADDON_CATALOG.find((a) => a.key === editingAddonKey)!;
              return (
                <form onSubmit={handleSaveAddonEdit}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid var(--line)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '22px' }}>{activeMeta.icon}</span>
                      <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 900, color: 'var(--ink)' }}>
                        تعديل: {activeMeta.title}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingAddonKey(null)}
                      style={{ background: 'none', border: 0, color: 'var(--muted)', cursor: 'pointer' }}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 2px', borderBottom: '1px solid var(--line)', marginBottom: '16px', cursor: 'pointer', fontWeight: 800 }}>
                    <span>حالة الميزة في المنيو</span>
                    <input
                      type="checkbox"
                      checked={Boolean(addonDraft.enabled)}
                      onChange={(e) => setAddonDraft((p) => ({ ...p, enabled: e.target.checked }))}
                    />
                  </label>

                  {editingAddonKey === 'offerPopup' && (
                    <>
                      <label className="f">
                        عنوان النافذة المنبثقة *
                        <input
                          type="text"
                          value={addonDraft.title || ''}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, title: e.target.value }))}
                          style={themedInputStyle}
                          required
                        />
                      </label>
                      <label className="f">
                        تفاصيل العرض
                        <textarea
                          rows={2}
                          value={addonDraft.subtitle || ''}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, subtitle: e.target.value }))}
                          style={themedInputStyle}
                        />
                      </label>
                      <label className="f">
                        رابط صورة العرض
                        <input
                          type="text"
                          value={addonDraft.image || ''}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, image: e.target.value }))}
                          style={themedInputStyle}
                        />
                      </label>
                      <label className="f">
                        نص الزر
                        <input
                          type="text"
                          value={addonDraft.buttonText || ''}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, buttonText: e.target.value }))}
                          style={themedInputStyle}
                        />
                      </label>
                      <button
                        type="button"
                        className="btn s"
                        onClick={() => setShowPopupPreview(true)}
                        style={{ marginBottom: '12px' }}
                      >
                        <Eye size={14} />
                        <span>معاينة شكل البوب اب</span>
                      </button>
                    </>
                  )}

                  {editingAddonKey === 'announcementBar' && (
                    <>
                      <label className="f">
                        نص الشريط الإعلاني *
                        <input
                          type="text"
                          value={addonDraft.text || ''}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, text: e.target.value }))}
                          style={themedInputStyle}
                          required
                        />
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <label className="f">
                          لون خلفية الشريط
                          <input
                            type="color"
                            value={addonDraft.bgColor || '#1B5E4A'}
                            onChange={(e) => setAddonDraft((p) => ({ ...p, bgColor: e.target.value }))}
                          />
                        </label>
                        <label className="f">
                          لون النص
                          <input
                            type="color"
                            value={addonDraft.textColor || '#ffffff'}
                            onChange={(e) => setAddonDraft((p) => ({ ...p, textColor: e.target.value }))}
                          />
                        </label>
                      </div>
                    </>
                  )}

                  {editingAddonKey === 'countdownTimer' && (
                    <>
                      <label className="f">
                        عنوان العرض التنازلي
                        <input
                          type="text"
                          value={addonDraft.title || ''}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, title: e.target.value }))}
                          style={themedInputStyle}
                        />
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <label className="f">
                          نوع الخصم الفعلي على المنيو
                          <select
                            value={addonDraft.discountType || 'percent'}
                            onChange={(e) => setAddonDraft((p) => ({ ...p, discountType: e.target.value }))}
                            style={themedInputStyle}
                          >
                            <option value="percent">نسبة مئوية (%)</option>
                            <option value="fixed">مبلغ ثابت ({currency})</option>
                          </select>
                        </label>
                        <label className="f">
                          قيمة الخصم (تخصم تلقائياً من كل الأسعار)
                          <input
                            type="number"
                            min={0}
                            value={addonDraft.discountValue ?? 15}
                            onChange={(e) => setAddonDraft((p) => ({ ...p, discountValue: Number(e.target.value) }))}
                            style={themedInputStyle}
                          />
                        </label>
                      </div>
                      <label className="f">
                        نص التنبيه الظاهر في الشريط
                        <input
                          type="text"
                          value={addonDraft.discountText || ''}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, discountText: e.target.value }))}
                          style={themedInputStyle}
                        />
                      </label>
                      <label className="f">
                        ساعة انتهاء العرض اليومية (0 - 23)
                        <input
                          type="number"
                          min={0}
                          max={23}
                          value={addonDraft.endHour ?? 23}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, endHour: Number(e.target.value) }))}
                          style={themedInputStyle}
                        />
                      </label>
                    </>
                  )}

                  {editingAddonKey === 'promoCoupons' && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <b style={{ fontSize: '13.5px', color: 'var(--ink)' }}>قائمة الكوبونات الفعالة (تظهر نهاية السلة)</b>
                        <button
                          type="button"
                          className="btn s"
                          onClick={() =>
                            setAddonDraft((p) => ({
                              ...p,
                              couponsList: [
                                ...(Array.isArray(p.couponsList) ? p.couponsList : []),
                                { code: `SAVE${(p.couponsList?.length || 0) + 15}`, discountType: 'percent', discountValue: 15, minSubtotal: 0 },
                              ],
                            }))
                          }
                        >
                          <Plus size={14} />
                          <span>إضافة كوبون</span>
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                        {(Array.isArray(addonDraft.couponsList) ? addonDraft.couponsList : []).map((cp: any, idx: number) => (
                          <div key={idx} style={{ background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: '12px', padding: '12px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                              <input
                                type="text"
                                dir="ltr"
                                placeholder="الكود (PLUS10)"
                                value={cp.code || ''}
                                onChange={(e) => {
                                  const next = [...(addonDraft.couponsList || [])];
                                  next[idx] = { ...next[idx], code: e.target.value.toUpperCase() };
                                  setAddonDraft((p) => ({ ...p, couponsList: next }));
                                }}
                                style={{ ...themedInputStyle, fontWeight: 800 }}
                                required
                              />
                              <select
                                value={cp.discountType || 'percent'}
                                onChange={(e) => {
                                  const next = [...(addonDraft.couponsList || [])];
                                  next[idx] = { ...next[idx], discountType: e.target.value };
                                  setAddonDraft((p) => ({ ...p, couponsList: next }));
                                }}
                                style={themedInputStyle}
                              >
                                <option value="percent">نسبة مئوية (%)</option>
                                <option value="fixed">مبلغ ثابت ({currency})</option>
                              </select>
                              {(addonDraft.couponsList?.length || 0) > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = (addonDraft.couponsList || []).filter((_: any, i: number) => i !== idx);
                                    setAddonDraft((p) => ({ ...p, couponsList: next }));
                                  }}
                                  style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                              <label className="f" style={{ margin: 0, fontSize: '12px' }}>
                                قيمة الخصم
                                <input
                                  type="number"
                                  min={1}
                                  value={cp.discountValue ?? 10}
                                  onChange={(e) => {
                                    const next = [...(addonDraft.couponsList || [])];
                                    next[idx] = { ...next[idx], discountValue: Number(e.target.value) };
                                    setAddonDraft((p) => ({ ...p, couponsList: next }));
                                  }}
                                  style={themedInputStyle}
                                />
                              </label>
                              <label className="f" style={{ margin: 0, fontSize: '12px' }}>
                                الحد الأدنى للطلب ({currency})
                                <input
                                  type="number"
                                  min={0}
                                  value={cp.minSubtotal ?? 0}
                                  onChange={(e) => {
                                    const next = [...(addonDraft.couponsList || [])];
                                    next[idx] = { ...next[idx], minSubtotal: Number(e.target.value) };
                                    setAddonDraft((p) => ({ ...p, couponsList: next }));
                                  }}
                                  style={themedInputStyle}
                                />
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {editingAddonKey === 'customerReviews' && (
                    <>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', cursor: 'pointer', fontWeight: 700 }}>
                        <input
                          type="checkbox"
                          checked={addonDraft.showOnMenu !== false}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, showOnMenu: e.target.checked }))}
                        />
                        <span>عرض تقييمات الزبائن في صفحة المنيو</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', cursor: 'pointer', fontWeight: 700 }}>
                        <input
                          type="checkbox"
                          checked={addonDraft.allowSubmit !== false}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, allowSubmit: e.target.checked }))}
                        />
                        <span>السماح للزبائن بإرسال تقييم جديد</span>
                      </label>
                    </>
                  )}

                  {editingAddonKey === 'minOrder' && (
                    <>
                      <label className="f">
                        الحد الأدنى لمبلغ الطلب ({currency}) *
                        <input
                          type="number"
                          min={0}
                          value={addonDraft.amount ?? 10000}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, amount: Number(e.target.value) }))}
                          style={themedInputStyle}
                          required
                        />
                      </label>
                      <label className="f">
                        رسالة التنبيه للزبون
                        <input
                          type="text"
                          value={addonDraft.message || ''}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, message: e.target.value }))}
                          style={themedInputStyle}
                        />
                      </label>
                    </>
                  )}

                  {editingAddonKey === 'serviceFee' && (
                    <>
                      <label className="f">
                        تسمية الرسوم في الفاتورة *
                        <input
                          type="text"
                          value={addonDraft.label || ''}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, label: e.target.value }))}
                          style={themedInputStyle}
                          required
                        />
                      </label>
                      <label className="f">
                        مبلغ الرسوم ({currency}) *
                        <input
                          type="number"
                          min={0}
                          value={addonDraft.amount ?? 1000}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, amount: Number(e.target.value) }))}
                          style={themedInputStyle}
                          required
                        />
                      </label>
                    </>
                  )}

                  {editingAddonKey === 'tableService' && (
                    <>
                      <label className="f">
                        عدد الطاولات المتوفرة في الصالة *
                        <input
                          type="number"
                          min={1}
                          max={200}
                          value={addonDraft.tablesCount ?? 12}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, tablesCount: Number(e.target.value) }))}
                          style={themedInputStyle}
                          required
                        />
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', cursor: 'pointer', fontWeight: 700 }}>
                        <input
                          type="checkbox"
                          checked={addonDraft.allowWaiterCall !== false}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, allowWaiterCall: e.target.checked }))}
                        />
                        <span>تفعيل زر نداء النادل للطاولة</span>
                      </label>
                    </>
                  )}

                  {editingAddonKey === 'healthNotices' && (
                    <label className="f">
                      العبارات الصحية والتغذوية (سطر لكل عبارة)
                      <textarea
                        rows={4}
                        value={addonDraft.noticesText || ''}
                        onChange={(e) => setAddonDraft((p) => ({ ...p, noticesText: e.target.value }))}
                        style={themedInputStyle}
                      />
                    </label>
                  )}

                  {editingAddonKey === 'audioBell' && (
                    <>
                      <label className="f">
                        نغمة التنبيه الصوتي للطلبات
                        <select
                          value={addonDraft.tone || 'chime'}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, tone: e.target.value }))}
                          style={themedInputStyle}
                        >
                          <option value="chime">رنين ناعم ثلاثي (Chime)</option>
                          <option value="bell">جرس الكاشير الكلاسيكي</option>
                          <option value="alert">تنبيه سريع</option>
                        </select>
                      </label>
                      <button
                        type="button"
                        className="btn s"
                        onClick={() => playBellTone(addonDraft.tone || 'chime')}
                        style={{ marginBottom: '12px' }}
                      >
                        <Volume2 size={15} />
                        <span>اختبار صوت التنبيه الآن</span>
                      </button>
                    </>
                  )}

                  {editingAddonKey === 'prepBadge' && (
                    <>
                      <label className="f">
                        عنوان الشارة (مثال: التحضير السريع)
                        <input
                          type="text"
                          value={addonDraft.text || ''}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, text: e.target.value }))}
                          style={themedInputStyle}
                        />
                      </label>
                      <label className="f">
                        الوقت المتوقع (مثال: 20 - 30 دقيقة)
                        <input
                          type="text"
                          value={addonDraft.etaText || ''}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, etaText: e.target.value }))}
                          style={themedInputStyle}
                        />
                      </label>
                    </>
                  )}

                  {editingAddonKey === 'closedNotice' && (
                    <label className="f">
                      نص إشعار الطلب المسبق عند الإغلاق
                      <textarea
                        rows={3}
                        value={addonDraft.message || ''}
                        onChange={(e) => setAddonDraft((p) => ({ ...p, message: e.target.value }))}
                        style={themedInputStyle}
                      />
                    </label>
                  )}

                  {editingAddonKey === 'happyHour' && (
                    <>
                      <label className="f">
                        عنوان عرض ساعة السعادة
                        <input
                          type="text"
                          value={addonDraft.title || ''}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, title: e.target.value }))}
                          style={themedInputStyle}
                        />
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                        <label className="f">
                          من الساعة (0-23)
                          <input
                            type="number"
                            min={0}
                            max={23}
                            value={addonDraft.startHour ?? 14}
                            onChange={(e) => setAddonDraft((p) => ({ ...p, startHour: Number(e.target.value) }))}
                            style={themedInputStyle}
                          />
                        </label>
                        <label className="f">
                          إلى الساعة (0-23)
                          <input
                            type="number"
                            min={0}
                            max={23}
                            value={addonDraft.endHour ?? 17}
                            onChange={(e) => setAddonDraft((p) => ({ ...p, endHour: Number(e.target.value) }))}
                            style={themedInputStyle}
                          />
                        </label>
                        <label className="f">
                          الخصم (%)
                          <input
                            type="number"
                            min={1}
                            max={90}
                            value={addonDraft.discountPercent ?? 15}
                            onChange={(e) => setAddonDraft((p) => ({ ...p, discountPercent: Number(e.target.value) }))}
                            style={themedInputStyle}
                          />
                        </label>
                      </div>
                    </>
                  )}

                  {editingAddonKey === 'freeGiftThreshold' && (
                    <>
                      <label className="f">
                        الحد الأدنى للطلب للحصول على الهدية ({currency})
                        <input
                          type="number"
                          min={0}
                          value={addonDraft.minAmount ?? 25000}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, minAmount: Number(e.target.value) }))}
                          style={themedInputStyle}
                        />
                      </label>
                      <label className="f">
                        اسم الهدية المجانية
                        <input
                          type="text"
                          value={addonDraft.giftName || ''}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, giftName: e.target.value }))}
                          style={themedInputStyle}
                        />
                      </label>
                    </>
                  )}

                  {editingAddonKey === 'cartUpsell' && (
                    <>
                      <label className="f">
                        عنوان قسم المقترحات في السلة
                        <input
                          type="text"
                          value={addonDraft.title || ''}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, title: e.target.value }))}
                          style={themedInputStyle}
                        />
                      </label>
                      <label className="f">
                        عدد الأصناف المقترحة داخل السلة
                        <input
                          type="number"
                          min={1}
                          max={8}
                          value={addonDraft.maxItems ?? 4}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, maxItems: Number(e.target.value) }))}
                          style={themedInputStyle}
                        />
                      </label>
                    </>
                  )}

                  {editingAddonKey === 'dailySpecialBanner' && (
                    <>
                      <label className="f">
                        عنوان بطاقة طبق اليوم
                        <input
                          type="text"
                          value={addonDraft.title || ''}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, title: e.target.value }))}
                          style={themedInputStyle}
                        />
                      </label>
                      <label className="f">
                        الوصف المختصر
                        <input
                          type="text"
                          value={addonDraft.subtitle || ''}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, subtitle: e.target.value }))}
                          style={themedInputStyle}
                        />
                      </label>
                      <label className="f">
                        نص الشارة (مثال: الأكثر طلباً اليوم)
                        <input
                          type="text"
                          value={addonDraft.badgeText || ''}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, badgeText: e.target.value }))}
                          style={themedInputStyle}
                        />
                      </label>
                      <label className="f">
                        اختر الطبق المميز من المنيو
                        <select
                          value={addonDraft.itemId || ''}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, itemId: e.target.value }))}
                          style={themedInputStyle}
                        >
                          <option value="">تلقائي (أول طبق مميز)</option>
                          {allItems.map((it) => (
                            <option key={it.id} value={it.id}>
                              {it.n} — {formatNumber(it.pr)} {currency}
                            </option>
                          ))}
                        </select>
                      </label>
                    </>
                  )}

                  {editingAddonKey === 'spinWheelPromo' && (
                    <>
                      <label className="f">
                        عنوان نافذة عجلة الحظ
                        <input
                          type="text"
                          value={addonDraft.title || ''}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, title: e.target.value }))}
                          style={themedInputStyle}
                        />
                      </label>
                      <label className="f">
                        الجوائز المتاحة (سطر لكل جائزة — أمثلة: خصم 5%، خصم 10%، توصيل مجاني)
                        <textarea
                          rows={4}
                          value={addonDraft.prizesText || ''}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, prizesText: e.target.value }))}
                          style={themedInputStyle}
                        />
                      </label>
                    </>
                  )}

                  {editingAddonKey === 'loyaltyPoints' && (
                    <>
                      <label className="f">
                        عدد النقاط لكل 1,000 {currency}
                        <input
                          type="number"
                          min={1}
                          value={addonDraft.pointsPerThousand ?? 1}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, pointsPerThousand: Number(e.target.value) }))}
                          style={themedInputStyle}
                        />
                      </label>
                      <label className="f">
                        رسالة تشجيع النقاط للزبون
                        <input
                          type="text"
                          value={addonDraft.rewardNote || ''}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, rewardNote: e.target.value }))}
                          style={themedInputStyle}
                        />
                      </label>
                    </>
                  )}

                  {editingAddonKey === 'socialProofBadge' && (
                    <>
                      <label className="f">
                        عدد المتصفحين الحاليين الظاهر
                        <input
                          type="number"
                          min={1}
                          value={addonDraft.visitorsCount ?? 18}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, visitorsCount: Number(e.target.value) }))}
                          style={themedInputStyle}
                        />
                      </label>
                      <label className="f">
                        نص عدد الطلبات اليومية
                        <input
                          type="text"
                          value={addonDraft.ordersTodayText || ''}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, ordersTodayText: e.target.value }))}
                          style={themedInputStyle}
                        />
                      </label>
                    </>
                  )}

                  {editingAddonKey === 'chefPicksFilter' && (
                    <>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', cursor: 'pointer', fontWeight: 700 }}>
                        <input
                          type="checkbox"
                          checked={addonDraft.showPopular !== false}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, showPopular: e.target.checked }))}
                        />
                        <span>تفعيل فلتر "الأكثر طلباً"</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', cursor: 'pointer', fontWeight: 700 }}>
                        <input
                          type="checkbox"
                          checked={addonDraft.showOffers !== false}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, showOffers: e.target.checked }))}
                        />
                        <span>تفعيل فلتر "العروض المخفضة"</span>
                      </label>
                    </>
                  )}

                  {editingAddonKey === 'quickReorder' && (
                    <label className="f">
                      نص زر إعادة الطلب السريع
                      <input
                        type="text"
                        value={addonDraft.buttonText || ''}
                        onChange={(e) => setAddonDraft((p) => ({ ...p, buttonText: e.target.value }))}
                        style={themedInputStyle}
                      />
                    </label>
                  )}

                  {editingAddonKey === 'savedFavorites' && (
                    <label className="f">
                      تسمية تبويب المفضلة
                      <input
                        type="text"
                        value={addonDraft.label || ''}
                        onChange={(e) => setAddonDraft((p) => ({ ...p, label: e.target.value }))}
                        style={themedInputStyle}
                      />
                    </label>
                  )}

                  {editingAddonKey === 'cutleryOption' && (
                    <label className="f">
                      نص سؤال أدوات الطعام داخل السلة
                      <input
                        type="text"
                        value={addonDraft.label || ''}
                        onChange={(e) => setAddonDraft((p) => ({ ...p, label: e.target.value }))}
                        style={themedInputStyle}
                      />
                    </label>
                  )}

                  {editingAddonKey === 'deliveryEtaTracker' && (
                    <label className="f">
                      وقت التوصيل المتوقع الظاهر للزبون
                      <input
                        type="text"
                        value={addonDraft.etaText || ''}
                        onChange={(e) => setAddonDraft((p) => ({ ...p, etaText: e.target.value }))}
                        style={themedInputStyle}
                      />
                    </label>
                  )}

                  {editingAddonKey === 'scheduledOrder' && (
                    <>
                      <label className="f">
                        عنوان اختيار الوقت
                        <input
                          type="text"
                          value={addonDraft.label || ''}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, label: e.target.value }))}
                          style={themedInputStyle}
                        />
                      </label>
                      <label className="f">
                        المواعيد المتاحة للجدولة (سطر لكل موعد)
                        <textarea
                          rows={4}
                          value={addonDraft.slotsText || ''}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, slotsText: e.target.value }))}
                          style={themedInputStyle}
                        />
                      </label>
                    </>
                  )}

                  {editingAddonKey === 'firstOrderDiscount' && (
                    <>
                      <label className="f">
                        نسبة خصم الطلب الأول (%)
                        <input
                          type="number"
                          min={1}
                          max={90}
                          value={addonDraft.discountPercent ?? 10}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, discountPercent: Number(e.target.value) }))}
                          style={themedInputStyle}
                        />
                      </label>
                      <label className="f">
                        عنوان الخصم الترحيبي
                        <input
                          type="text"
                          value={addonDraft.title || ''}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, title: e.target.value }))}
                          style={themedInputStyle}
                        />
                      </label>
                    </>
                  )}

                  {editingAddonKey === 'freeDeliveryProgress' && (
                    <>
                      <label className="f">
                        الحد الأدنى للتوصيل المجاني ({currency})
                        <input
                          type="number"
                          min={0}
                          value={addonDraft.minAmount ?? 25000}
                          onChange={(e) =>
                            setAddonDraft((p) => ({
                              ...p,
                              minAmount: e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)),
                            }))
                          }
                          placeholder="25000"
                          style={themedInputStyle}
                        />
                        <small style={{ display: 'block', marginTop: '5px', fontSize: '11.5px', color: 'var(--muted)' }}>
                          تبقى هذه الميزة غير مفعّلة في المنيو حتى تقوم بتشغيلها من زر التفعيل أعلاه.
                        </small>
                      </label>
                      <label className="f">
                        عنوان شريط التوصيل المجاني التحفيزي
                        <input
                          type="text"
                          value={addonDraft.label || ''}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, label: e.target.value }))}
                          style={themedInputStyle}
                        />
                      </label>
                    </>
                  )}

                  {editingAddonKey === 'whatsappSupportFloat' && (
                    <>
                      <label className="f">
                        نص زر الدعم العائم
                        <input
                          type="text"
                          value={addonDraft.label || ''}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, label: e.target.value }))}
                          style={themedInputStyle}
                        />
                      </label>
                      <label className="f">
                        الرسالة التلقائية عند فتح الواتساب
                        <input
                          type="text"
                          value={addonDraft.prefillText || ''}
                          onChange={(e) => setAddonDraft((p) => ({ ...p, prefillText: e.target.value }))}
                          style={themedInputStyle}
                        />
                      </label>
                    </>
                  )}

                  {editingAddonKey === 'groupOrderBillSplit' && (
                    <label className="f">
                      أقصى عدد للأشخاص في حاسبة تقسيم الفاتورة
                      <input
                        type="number"
                        min={2}
                        max={30}
                        value={addonDraft.maxPeople ?? 10}
                        onChange={(e) => setAddonDraft((p) => ({ ...p, maxPeople: Number(e.target.value) }))}
                        style={themedInputStyle}
                      />
                    </label>
                  )}

                  {editingAddonKey === 'flashTipOption' && (
                    <label className="f">
                      مبالغ الإكرامية السريعة (افصل بينها بفاصلة: 1000,2000,5000)
                      <input
                        type="text"
                        dir="ltr"
                        value={addonDraft.presetsText || ''}
                        onChange={(e) => setAddonDraft((p) => ({ ...p, presetsText: e.target.value }))}
                        style={{ ...themedInputStyle, textAlign: 'left' }}
                      />
                    </label>
                  )}

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '18px' }}>
                    <button type="button" className="btn" onClick={() => setEditingAddonKey(null)}>
                      إلغاء
                    </button>
                    <button type="submit" className="btn p" style={{ fontWeight: 800 }}>
                      <Save size={15} />
                      <span>حفظ التعديلات</span>
                    </button>
                  </div>
                </form>
              );
            })()}
          </div>
        </>
      )}

      {showPopupPreview && (
        <>
          <div className="drawer-backdrop" onClick={() => setShowPopupPreview(false)} />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(420px, 92vw)',
              ...surfaceCardStyle,
              borderRadius: '22px',
              overflow: 'hidden',
              zIndex: 100100,
              boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
              textAlign: 'center',
            }}
          >
            <button
              type="button"
              onClick={() => setShowPopupPreview(false)}
              style={{
                position: 'absolute',
                top: '12px',
                insetInlineEnd: '12px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
                color: 'var(--ink)',
                zIndex: 10,
              }}
            >
              ✕
            </button>

            {(addonDraft.image || addonsState.offerPopup?.image) && (
              <img
                src={addonDraft.image || addonsState.offerPopup?.image}
                alt="صورة الإعلان"
                style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
              />
            )}

            <div style={{ padding: '22px' }}>
              <h3 style={{ fontSize: '19px', fontWeight: 900, color: 'var(--ink)', margin: '0 0 8px' }}>
                {addonDraft.title || addonsState.offerPopup?.title}
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 20px' }}>
                {addonDraft.subtitle || addonsState.offerPopup?.subtitle}
              </p>
              <button
                type="button"
                onClick={() => setShowPopupPreview(false)}
                className="btn p b"
                style={{ fontWeight: 800 }}
              >
                {addonDraft.buttonText || addonsState.offerPopup?.buttonText || 'تصفح المنيو'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
