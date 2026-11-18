/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Palette, RotateCcw, Save, Shapes } from 'lucide-react';
import {
  MENU_SHAPES,
  MENU_THEMES,
  getAllowedThemesForPlan,
  getContrastInk,
  resolveMenuThemeEffectiveMode,
} from '../../utils/plans';
import { LAYOUT_DEFINITIONS, useDashboard } from './DashboardContext';

export const AppearancePage: React.FC = () => {
  const {
    resolvedPlan,
    isLayoutAllowed,
    selectedLayout,
    menuThemeMode,
    handleSelectThemeMode,
    menuThemePreset,
    handleSelectMenuTheme,
    handleUpdateCustomColors,
    menuThemeShape,
    handleSelectThemeShape,
    restColor,
    restBgColor,
    handleInstantLayoutSelect,
    handleSaveSettings,
    openUpgradeModal,
  } = useDashboard();

  const allowedThemes = getAllowedThemesForPlan(resolvedPlan);
  const previewMode = resolveMenuThemeEffectiveMode(menuThemeMode);
  const isCustomSelected = menuThemePreset === 'custom' && resolvedPlan.perms.customColors;
  const customBrandHex = restColor || '#10B981';
  const defaultPreviewBg = previewMode === 'dark' ? '#08100d' : '#f4f7f6';
  const customBgPreview = restBgColor || defaultPreviewBg;
  const customBgIsLight = getContrastInk(customBgPreview) === '#0f172a';
  const customSurfacePreview = customBgIsLight ? '#ffffff' : '#131d19';
  const customInkPreview = customBgIsLight ? '#0f172a' : '#f8fafc';
  const customLinePreview = customBgIsLight ? 'rgba(15, 23, 42, 0.14)' : 'rgba(255, 255, 255, 0.16)';

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

      {/* 3. Menu Colors (10 Dual Light/Dark Themes + Wide 2-Column Custom Color Picker Card at the End) */}
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
              10 ثيمات لونية متوافقة تلقائياً مع الوضع الفاتح والغامق بالإضافة للألوان المخصصة
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

          {/* Last Option: Wide Card Spanning 2 Cards Width for Custom Menu Colors */}
          <motion.div
            role="button"
            tabIndex={0}
            onClick={() => handleSelectMenuTheme('custom')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelectMenuTheme('custom');
              }
            }}
            className={`mp-appearance-theme-card mp-appearance-custom-theme-card ${isCustomSelected ? 'selected' : ''}`}
            style={{
              borderColor: isCustomSelected ? customBrandHex : undefined,
              opacity: resolvedPlan.perms.customColors ? 1 : 0.72,
            }}
            whileHover={{ y: -2 }}
          >
            <div
              className="mp-theme-mini-preview"
              style={{
                background: customBgPreview,
                borderColor: customLinePreview,
              }}
            >
              <div className="mp-theme-mini-card" style={{ background: customSurfacePreview, borderColor: customLinePreview }}>
                <span className="mp-theme-mini-line" style={{ background: customInkPreview, width: '58%' }} />
                <span className="mp-theme-mini-line" style={{ background: customBrandHex, width: '36%', opacity: 0.75 }} />
              </div>
              <span className="mp-theme-mini-pill" style={{ background: customBrandHex }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '8px', flexWrap: 'wrap' }}>
              <div>
                <b style={{ fontSize: '13.5px', color: 'var(--ink)', display: 'block' }}>
                  ألوان مخصصة لمنيوك 🎨
                </b>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                  اختر اللون الأساسي ولون الخلفية بحرية لتناسب هوية مشروعك
                </span>
              </div>
              <span style={{ fontSize: '10.5px', fontWeight: 800, color: resolvedPlan.perms.customColors ? (isCustomSelected ? 'var(--brand-ink, #34D399)' : 'var(--muted)') : '#f59e0b' }}>
                {!resolvedPlan.perms.customColors ? '🔒 باقة أعلى' : isCustomSelected ? 'نشط ✓' : 'تخصيص حر'}
              </span>
            </div>

            <div
              className="mp-custom-color-controls"
              onClick={(e) => {
                e.stopPropagation();
                if (!resolvedPlan.perms.customColors) {
                  openUpgradeModal('vip');
                }
              }}
            >
              <label className="mp-custom-color-chip">
                <input
                  type="color"
                  disabled={!resolvedPlan.perms.customColors}
                  value={customBrandHex}
                  onChange={(e) => handleUpdateCustomColors(e.target.value, undefined)}
                  aria-label="اللون الأساسي"
                />
                <div style={{ minWidth: 0 }}>
                  <span className="mp-custom-color-label">اللون الأساسي</span>
                  <span className="mp-custom-color-hex tabular-nums" dir="ltr">{customBrandHex.toUpperCase()}</span>
                </div>
              </label>

              <label className="mp-custom-color-chip">
                <input
                  type="color"
                  disabled={!resolvedPlan.perms.customColors}
                  value={customBgPreview}
                  onChange={(e) => handleUpdateCustomColors(undefined, e.target.value)}
                  aria-label="لون الخلفية"
                />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <span className="mp-custom-color-label">لون الخلفية</span>
                  <span className="mp-custom-color-hex tabular-nums" dir="ltr">
                    {restBgColor ? restBgColor.toUpperCase() : 'تلقائي'}
                  </span>
                </div>
                {restBgColor && resolvedPlan.perms.customColors && (
                  <button
                    type="button"
                    title="إرجاع الخلفية تلقائياً"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleUpdateCustomColors(undefined, '');
                    }}
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '6px',
                      border: '1px solid var(--line)',
                      background: 'var(--surface)',
                      color: 'var(--muted)',
                      display: 'grid',
                      placeItems: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <RotateCcw size={11} />
                  </button>
                )}
              </label>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* 4. Page & Card Shapes (8 Standout Interactive Shape Cards Applied Across Entire Menu) */}
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
              يُطبّق الشكل فوراً على كامل الصفحة: البنر، الصورة الشخصية، الأقسام والبطاقات
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
                  <div className="mp-shape-mini-banner" />
                  <div className="mp-shape-mini-row">
                    <div className="mp-shape-mini-avatar" />
                    <div className="mp-shape-preview-box">
                      <div className="mp-shape-preview-thumb" />
                      <div className="mp-shape-preview-meta">
                        <span className="mp-shape-preview-bar" />
                        <span className="mp-shape-preview-btn" />
                      </div>
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
    </div>
  );
};
