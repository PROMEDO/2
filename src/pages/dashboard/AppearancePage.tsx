/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Palette, Save, Shapes } from 'lucide-react';
import {
  MENU_SHAPES,
  MENU_THEMES,
  getAllowedThemesForPlan,
  resolveMenuThemeEffectiveMode,
} from '../../utils/plans';
import {
  LAYOUT_DEFINITIONS,
  themedInputStyle,
  useDashboard,
} from './DashboardContext';

export const AppearancePage: React.FC = () => {
  const {
    resolvedPlan,
    isLayoutAllowed,
    selectedLayout,
    menuThemeMode,
    handleSelectThemeMode,
    menuThemePreset,
    handleSelectMenuTheme,
    menuThemeShape,
    handleSelectThemeShape,
    restColor,
    setRestColor,
    restBgColor,
    setRestBgColor,
    handleInstantLayoutSelect,
    handleSaveSettings,
    openUpgradeModal,
  } = useDashboard();

  const allowedThemes = getAllowedThemesForPlan(resolvedPlan);
  const previewMode = resolveMenuThemeEffectiveMode(menuThemeMode);

  return (
    <div className="mp-appearance-page">
      {/* 1. Small Save Changes Button FIRST (centered on mobile) + Menu Display Mode BELOW */}
      <motion.div
        className="mp-appearance-top-bar"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <motion.button
          type="button"
          onClick={handleSaveSettings}
          className="mp-appearance-save-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
        >
          <Save size={14} />
          <span>حفظ التغييرات</span>
        </motion.button>

        {resolvedPlan.perms.lightDarkMode && (
          <div className="mp-appearance-mode-wrap">
            <h2 className="mp-appearance-section-title">
              اختر مظهر المنيو كيف تريده للزبائن
            </h2>
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
          </div>
        )}
      </motion.div>

      {/* 2. Product Display Layouts: 4 Squares (2 top, 2 bottom) */}
      <motion.section
        className="mp-appearance-section"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, delay: 0.06 }}
      >
        <h2 className="mp-appearance-section-title" style={{ marginBottom: '12px' }}>
          اختر طريقة عرض المنتجات
        </h2>

        <div className="mp-appearance-layouts-grid">
          {LAYOUT_DEFINITIONS.map((lay) => {
            const isSelected = selectedLayout === lay.id;
            const layoutAllowed = isLayoutAllowed(lay.id);
            return (
              <motion.button
                key={lay.id}
                type="button"
                onClick={() => handleInstantLayoutSelect(lay.id)}
                className={`mp-appearance-layout-card ${isSelected ? 'selected' : ''}`}
                style={{ opacity: layoutAllowed ? 1 : 0.65 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
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
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      {/* 3. Menu Colors (10 Dual Light/Dark Themes as Interactive Cards) */}
      <motion.section
        className="mp-appearance-section"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, delay: 0.12 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--brand-ink, #34D399)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <Palette size={18} />
          </div>
          <div>
            <h2 className="mp-appearance-section-title" style={{ margin: '0 0 2px' }}>
              اختر ألوان المنيو
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>
              10 ثيمات لونية متوافقة تلقائياً مع الوضع الفاتح والغامق
            </p>
          </div>
        </div>

        <div className="mp-appearance-themes-grid">
          {MENU_THEMES.map((theme) => {
            const isUnlocked = allowedThemes.some((t) => t.id === theme.id);
            const isSelected = menuThemePreset === theme.id;
            const pal = previewMode === 'dark' ? theme.darkPalette : theme.lightPalette;
            return (
              <motion.button
                key={theme.id}
                type="button"
                onClick={() => handleSelectMenuTheme(theme.id)}
                className={`mp-appearance-theme-card ${isSelected ? 'selected' : ''}`}
                style={{
                  borderColor: isSelected ? pal.brand : undefined,
                  opacity: isUnlocked ? 1 : 0.62,
                }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Live mini theme color & dark/light preview strip */}
                <div
                  className="mp-theme-mini-preview"
                  style={{
                    background: pal.bg,
                    borderColor: pal.line,
                  }}
                >
                  <div className="mp-theme-mini-card" style={{ background: pal.surface, borderColor: pal.line }}>
                    <span className="mp-theme-mini-line" style={{ background: pal.text, width: '62%' }} />
                    <span className="mp-theme-mini-line" style={{ background: pal.muted, width: '40%', opacity: 0.6 }} />
                  </div>
                  <span className="mp-theme-mini-pill" style={{ background: pal.brand }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: pal.brand, border: '1px solid rgba(255,255,255,0.25)' }} />
                    <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: pal.bg, border: '1px solid rgba(148,163,184,0.4)' }} />
                  </div>
                  <span style={{ fontSize: '10.5px', fontWeight: 800, color: isUnlocked ? (isSelected ? 'var(--brand-ink, #34D399)' : 'var(--muted)') : '#f59e0b' }}>
                    {!isUnlocked ? '🔒 مقفل' : isSelected ? 'نشط ✓' : previewMode === 'dark' ? 'غامق 🌙' : 'فاتح ☀️'}
                  </span>
                </div>
                <b style={{ fontSize: '13px', color: 'var(--ink)' }}>{theme.name}</b>
                <span style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.4 }}>{theme.subtitle}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      {/* 4. Page & Card Shapes (Interactive Shape Cards) */}
      <motion.section
        className="mp-appearance-section"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, delay: 0.18 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--brand-ink, #34D399)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <Shapes size={18} />
          </div>
          <div>
            <h2 className="mp-appearance-section-title" style={{ margin: '0 0 2px' }}>
              اختر شكل الصفحة والبطاقات
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>
              أشكال وتفاصيل متنوعة للبطاقات والزوايا والخلفية
            </p>
          </div>
        </div>

        <div className="mp-appearance-shapes-grid">
          {MENU_SHAPES.map((shape) => {
            const isSelected = menuThemeShape === shape.id;
            return (
              <motion.button
                key={shape.id}
                type="button"
                onClick={() => handleSelectThemeShape(shape.id)}
                className={`mp-appearance-shape-card ${isSelected ? 'selected' : ''}`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`mp-shape-preview mp-shape-preview-${shape.id}`}>
                  <div className="mp-shape-preview-box">
                    <div className="mp-shape-preview-thumb" />
                    <div className="mp-shape-preview-meta">
                      <span className="mp-shape-preview-bar" />
                      <span className="mp-shape-preview-btn" />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <b style={{ fontSize: '13px', color: isSelected ? 'var(--brand-ink, #34D399)' : 'var(--ink)' }}>
                    {shape.name}
                  </b>
                  {isSelected && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        color: 'var(--brand-ink, #34D399)',
                        background: 'var(--surface)',
                        padding: '2px 6px',
                        borderRadius: '7px',
                        border: '1px solid var(--brand)',
                      }}
                    >
                      مفعّل ✓
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.4 }}>
                  {shape.subtitle}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      {/* 5. Custom Brand Colors */}
      <motion.section
        className="mp-appearance-section"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, delay: 0.24 }}
        style={{
          paddingTop: '18px',
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
      </motion.section>
    </div>
  );
};
