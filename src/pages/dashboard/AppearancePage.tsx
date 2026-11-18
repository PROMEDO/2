/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Palette, Save } from 'lucide-react';
import { MENU_THEMES, getAllowedThemesForPlan } from '../../utils/plans';
import {
  LAYOUT_DEFINITIONS,
  surfaceCardStyle,
  themedInputStyle,
  useDashboard,
} from './DashboardContext';

export const AppearancePage: React.FC = () => {
  const {
    resolvedPlan,
    customTabLabel,
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
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: '0 0 6px', fontSize: '25px', fontWeight: 900, color: 'var(--ink)' }}>
            {customTabLabel('appearance', `مظهر ${terms.menuTitle} وأسلوب العرض 🎨`)}
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)' }}>
            اختر طريقة عرض {terms.itemsPlural} والمظهر الغامق أو الفاتح والألوان المتناسبة مع هوية مشروعك.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveSettings}
          className="btn p"
          style={{ fontWeight: 800 }}
        >
          <Save size={16} />
          <span>حفظ الألوان والمظهر</span>
        </button>
      </div>

      {/* Layout Options */}
      <section style={{ ...surfaceCardStyle, borderRadius: '20px', padding: '22px 24px' }}>
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 900, color: 'var(--ink)', margin: '0 0 4px' }}>
            طريقة عرض {terms.itemsPlural} (3 أنماط احترافية)
          </h2>
          <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: 0 }}>
            يتم تطبيق النمط المختار فوراً على واجهة الزبائن بمجرد النقر عليه.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {LAYOUT_DEFINITIONS.map((lay) => {
            const isSelected = selectedLayout === lay.id;
            const layoutAllowed = isLayoutAllowed(lay.id);
            return (
              <button
                key={lay.id}
                type="button"
                onClick={() => handleInstantLayoutSelect(lay.id)}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  border: isSelected ? '2px solid var(--brand)' : '1px solid var(--line)',
                  background: isSelected ? 'var(--soft)' : 'var(--bg)',
                  textAlign: 'start',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  opacity: layoutAllowed ? 1 : 0.65,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ fontSize: '24px' }}>{lay.icon}</span>
                  {!layoutAllowed ? (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        color: '#f59e0b',
                        background: 'rgba(245, 158, 11, 0.14)',
                        padding: '2px 8px',
                        borderRadius: '8px',
                      }}
                    >
                      🔒 باقة أعلى
                    </span>
                  ) : isSelected && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        color: 'var(--brand-ink, #34D399)',
                        background: 'var(--surface)',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        border: '1px solid var(--brand)',
                      }}
                    >
                      مفعّل ✓
                    </span>
                  )}
                </div>
                <b style={{ fontSize: '14.5px', color: isSelected ? 'var(--brand-ink, #34D399)' : 'var(--ink)' }}>
                  {lay.title}
                </b>
                <span style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>
                  {lay.desc}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Theme Presets & Light/Dark Toggle */}
      <section style={{ ...surfaceCardStyle, borderRadius: '20px', padding: '22px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: 'var(--soft)', color: 'var(--brand-ink, #34D399)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <Palette size={19} />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 900, color: 'var(--ink)', margin: '0 0 2px' }}>
                قوالب المظهر والألوان
              </h2>
              <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: 0 }}>
                متاح في باقتك ({resolvedPlan.plan.n}):{' '}
                {resolvedPlan.maxThemes === -1 ? 'جميع المظاهر + تخصيص حر للألوان' : `${allowedThemes.length} مظاهر جاهزة`}.
              </p>
            </div>
          </div>

          {resolvedPlan.perms.lightDarkMode && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleSelectThemeMode('light')}
                className={menuThemeMode === 'light' ? 'btn p s' : 'btn s'}
                style={{ fontWeight: 800 }}
              >
                ☀️ فاتح
              </button>
              <button
                type="button"
                onClick={() => handleSelectThemeMode('dark')}
                className={menuThemeMode === 'dark' ? 'btn p s' : 'btn s'}
                style={{ fontWeight: 800 }}
              >
                🌙 غامق
              </button>
              <button
                type="button"
                onClick={() => handleSelectThemeMode('auto')}
                className={menuThemeMode === 'auto' ? 'btn p s' : 'btn s'}
                style={{ fontWeight: 800 }}
              >
                📱 حسب الجهاز
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '18px' }}>
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
                  background: isSelected ? 'var(--soft)' : 'var(--bg)',
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
