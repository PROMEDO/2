/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Palette, Save } from 'lucide-react';
import { MENU_THEMES, getAllowedThemesForPlan } from '../../utils/plans';
import {
  LAYOUT_DEFINITIONS,
  themedInputStyle,
  useDashboard,
} from './DashboardContext';

export const AppearancePage: React.FC = () => {
  const {
    resolvedPlan,
    terms,
    isLayoutAllowed,
    selectedLayout,
    menuThemeMode,
    handleSelectThemeMode,
    menuThemePreset,
    handleSelectMenuTheme,
    restColor,
    setRestColor,
    restBgColor,
    setRestBgColor,
    handleInstantLayoutSelect,
    handleSaveSettings,
    openUpgradeModal,
  } = useDashboard();

  const allowedThemes = getAllowedThemesForPlan(resolvedPlan);

  return (
    <div className="mp-appearance-page">
      {/* Top Bar: Small Save Changes Button FIRST, Glassmorphic Light/Dark/Auto Mode BELOW */}
      <div className="mp-appearance-top-bar">
        <button
          type="button"
          onClick={handleSaveSettings}
          className="mp-appearance-save-btn"
        >
          <Save size={14} />
          <span>حفظ التغييرات</span>
        </button>

        {resolvedPlan.perms.lightDarkMode && (
          <div className="mp-appearance-mode-tabs" role="group" aria-label="وضع المظهر">
            <button
              type="button"
              onClick={() => handleSelectThemeMode('light')}
              className={`mp-appearance-mode-btn ${menuThemeMode === 'light' ? 'active' : ''}`}
            >
              <span>☀️ فاتح</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectThemeMode('dark')}
              className={`mp-appearance-mode-btn ${menuThemeMode === 'dark' ? 'active' : ''}`}
            >
              <span>🌙 غامق</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectThemeMode('auto')}
              className={`mp-appearance-mode-btn ${menuThemeMode === 'auto' ? 'active' : ''}`}
            >
              <span>📱 حسب الجهاز</span>
            </button>
          </div>
        )}
      </div>

      {/* Layout Options: 4 Squares (2 top, 2 bottom) without large background card */}
      <section className="mp-appearance-section">
        <div style={{ marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16.5px', fontWeight: 900, color: 'var(--ink)', margin: 0 }}>
            طريقة عرض {terms.itemsPlural} (4 أنماط احترافية)
          </h2>
        </div>

        <div className="mp-appearance-layouts-grid">
          {LAYOUT_DEFINITIONS.map((lay) => {
            const isSelected = selectedLayout === lay.id;
            const layoutAllowed = isLayoutAllowed(lay.id);
            return (
              <button
                key={lay.id}
                type="button"
                onClick={() => handleInstantLayoutSelect(lay.id)}
                className={`mp-appearance-layout-card ${isSelected ? 'selected' : ''}`}
                style={{ opacity: layoutAllowed ? 1 : 0.65 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '6px' }}>
                  <span style={{ fontSize: '24px', lineHeight: 1 }}>{lay.icon}</span>
                  {!layoutAllowed ? (
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: 800,
                        color: '#f59e0b',
                        background: 'rgba(245, 158, 11, 0.14)',
                        padding: '2px 7px',
                        borderRadius: '8px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      🔒 باقة أعلى
                    </span>
                  ) : isSelected ? (
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: 800,
                        color: 'var(--brand-ink, #34D399)',
                        background: 'var(--surface)',
                        padding: '2px 7px',
                        borderRadius: '8px',
                        border: '1px solid var(--brand)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      مفعّل ✓
                    </span>
                  ) : null}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <b style={{ fontSize: '14px', color: isSelected ? 'var(--brand-ink, #34D399)' : 'var(--ink)', lineHeight: 1.35 }}>
                    {lay.title}
                  </b>
                  <span style={{ fontSize: '11.5px', color: 'var(--muted)', lineHeight: 1.5 }}>
                    {lay.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Theme Presets & Custom Colors without large background card */}
      <section className="mp-appearance-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--brand-ink, #34D399)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <Palette size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '16.5px', fontWeight: 900, color: 'var(--ink)', margin: '0 0 2px' }}>
              قوالب المظهر والألوان
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>
              متاح في باقتك ({resolvedPlan.plan.n}):{' '}
              {resolvedPlan.maxThemes === -1 ? 'جميع المظاهر + تخصيص حر للألوان' : `${allowedThemes.length} مظاهر جاهزة`}.
            </p>
          </div>
        </div>

        <div className="mp-appearance-themes-grid">
          {MENU_THEMES.map((theme) => {
            const isUnlocked = allowedThemes.some((t) => t.id === theme.id);
            const isSelected = menuThemePreset === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => handleSelectMenuTheme(theme.id)}
                style={{
                  padding: '12px',
                  borderRadius: '14px',
                  border: isSelected ? `2px solid ${theme.brand}` : '1px solid var(--line)',
                  background: isSelected ? 'var(--soft)' : 'var(--surface)',
                  textAlign: 'start',
                  cursor: 'pointer',
                  opacity: isUnlocked ? 1 : 0.62,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: theme.brand, border: '1px solid rgba(255,255,255,0.2)' }} />
                    <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: theme.bg, border: '1px solid rgba(148,163,184,0.4)' }} />
                  </div>
                  <span style={{ fontSize: '10.5px', fontWeight: 800, color: isUnlocked ? (isSelected ? 'var(--brand-ink, #34D399)' : 'var(--muted)') : '#f59e0b' }}>
                    {!isUnlocked ? '🔒 مقفل' : isSelected ? 'نشط ✓' : theme.mode === 'light' ? 'فاتح ☀️' : 'داكن 🌙'}
                  </span>
                </div>
                <b style={{ fontSize: '13px', color: 'var(--ink)' }}>{theme.name}</b>
                <span style={{ fontSize: '11.5px', color: 'var(--muted)', lineHeight: 1.4 }}>{theme.subtitle}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Brand Colors */}
        <div
          style={{
            paddingTop: '16px',
            borderTop: '1px solid var(--line)',
            opacity: resolvedPlan.perms.customColors ? 1 : 0.72,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            <b style={{ fontSize: '14px', color: 'var(--ink)' }}>
              تخصيص ألوان الهوية البصرية بالكامل
            </b>
            {!resolvedPlan.perms.customColors && (
              <button
                type="button"
                onClick={() => openUpgradeModal('vip')}
                style={{
                  background: 'none',
                  border: 0,
                  padding: 0,
                  fontSize: '11.5px',
                  fontWeight: 800,
                  color: '#f59e0b',
                  cursor: 'pointer',
                }}
              >
                🔒 متاح في باقة الاعمال الشاملة — ترقية
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px' }}>
            <label className="f" style={{ margin: 0, fontSize: '12.5px' }}>
              اللون الأساسي (Brand Color)
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="color"
                  disabled={!resolvedPlan.perms.customColors}
                  value={restColor || '#1B5E4A'}
                  onChange={(e) => setRestColor(e.target.value)}
                  style={{ width: '44px', height: '38px', borderRadius: '8px', border: '1px solid var(--line)', cursor: resolvedPlan.perms.customColors ? 'pointer' : 'not-allowed' }}
                />
                <input
                  type="text"
                  dir="ltr"
                  disabled={!resolvedPlan.perms.customColors}
                  value={restColor}
                  onChange={(e) => setRestColor(e.target.value)}
                  style={{ ...themedInputStyle, fontSize: '12.5px' }}
                />
              </div>
            </label>

            <label className="f" style={{ margin: 0, fontSize: '12.5px' }}>
              لون الخلفية المخصص (اختياري)
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="color"
                  disabled={!resolvedPlan.perms.customColors}
                  value={restBgColor || '#08100d'}
                  onChange={(e) => setRestBgColor(e.target.value)}
                  style={{ width: '44px', height: '38px', borderRadius: '8px', border: '1px solid var(--line)', cursor: resolvedPlan.perms.customColors ? 'pointer' : 'not-allowed' }}
                />
                <input
                  type="text"
                  dir="ltr"
                  disabled={!resolvedPlan.perms.customColors}
                  value={restBgColor}
                  placeholder="تلقائي حسب المظهر"
                  onChange={(e) => setRestBgColor(e.target.value)}
                  style={{ ...themedInputStyle, fontSize: '12.5px' }}
                />
              </div>
            </label>
          </div>
        </div>
      </section>
    </div>
  );
};
