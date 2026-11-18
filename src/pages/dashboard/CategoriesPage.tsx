/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Clock,
  Edit,
  Image as ImageIcon,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { AvailabilitySchedule, Category } from '../../types';
import { AvailabilityScheduleEditor } from '../../components/AvailabilityScheduleEditor';
import { MediaLibraryModal } from '../../components/MediaLibraryModal';
import {
  DEFAULT_AVAILABILITY_SCHEDULE,
  normalizeAvailabilitySchedule,
} from '../../utils/availability';
import {
  SixDotDragHandle,
  surfaceCardStyle,
  themedInputStyle,
  useDashboard,
} from './DashboardContext';

export const CategoriesPage: React.FC = () => {
  const {
    resolvedPlan,
    allCategories,
    showCatModal,
    setShowCatModal,
    editingCatId,
    catNameInput,
    setCatNameInput,
    catImageInput,
    setCatImageInput,
    openNewCategoryModal,
    handleToggleCategoryVisibility,
    handleSaveCategory,
    handleOpenEditCategory,
    handleDeleteCategory,
    handleReorderCategories,
    handleSaveCategorySchedule,
    mediaLibraryItems,
    uploadImagesToLibrary,
    removeMediaLibraryItem,
  } = useDashboard();

  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [scheduleModalCat, setScheduleModalCat] = useState<Category | null>(null);
  const [scheduleDraft, setScheduleDraft] = useState<AvailabilitySchedule>(() =>
    normalizeAvailabilitySchedule(DEFAULT_AVAILABILITY_SCHEDULE)
  );

  // Smooth touch + mouse pointer-drag reordering via the 6-dot handle
  const [draggingCatId, setDraggingCatId] = useState<string | null>(null);
  const [dragOffsetY, setDragOffsetY] = useState<number>(0);
  const [dragOrder, setDragOrder] = useState<string[] | null>(null);
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const dragSessionRef = useRef<{
    catId: string;
    startClientY: number;
    initialCenterY: number;
    slotCenters: number[];
    draftOrder: string[];
    originalOrder: string[];
  } | null>(null);

  const canReorder = allCategories.length > 1;

  const displayCategories = dragOrder
    ? dragOrder
        .map((id) => allCategories.find((c) => c.id === id))
        .filter((c): c is Category => Boolean(c))
    : allCategories;

  useEffect(() => {
    const handlePointerMove = (ev: PointerEvent) => {
      const st = dragSessionRef.current;
      if (!st) return;
      ev.preventDefault();

      const currentCenterY = st.initialCenterY + (ev.clientY - st.startClientY);
      let bestIdx = 0;
      let bestDist = Infinity;
      st.slotCenters.forEach((sc, idx) => {
        const dist = Math.abs(currentCenterY - sc);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = idx;
        }
      });

      const currentIdx = st.draftOrder.indexOf(st.catId);
      if (currentIdx !== -1 && bestIdx !== currentIdx) {
        const nextOrder = [...st.draftOrder];
        const [moved] = nextOrder.splice(currentIdx, 1);
        nextOrder.splice(bestIdx, 0, moved);
        st.draftOrder = nextOrder;
        setDragOrder([...nextOrder]);
      }

      setDragOffsetY(currentCenterY - st.slotCenters[bestIdx]);
    };

    const finishDrag = () => {
      const st = dragSessionRef.current;
      if (!st) return;
      const changed = st.draftOrder.some((id, idx) => id !== st.originalOrder[idx]);
      const finalOrder = [...st.draftOrder];
      dragSessionRef.current = null;
      setDraggingCatId(null);
      setDragOffsetY(0);
      setDragOrder(null);
      if (changed) {
        handleReorderCategories(finalOrder);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', finishDrag);
    window.addEventListener('pointercancel', finishDrag);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', finishDrag);
      window.removeEventListener('pointercancel', finishDrag);
    };
  }, [handleReorderCategories]);

  const startHandleDrag = (e: React.PointerEvent<HTMLButtonElement>, catId: string) => {
    if (!canReorder) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore if browser declines pointer capture
    }

    const originalOrder = allCategories.map((c) => c.id);
    const slotCenters = originalOrder.map((id) => {
      const el = rowRefs.current.get(id);
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      return rect.top + rect.height / 2;
    });
    const initialIdx = originalOrder.indexOf(catId);
    if (initialIdx === -1 || slotCenters.some((v) => v === 0)) return;

    dragSessionRef.current = {
      catId,
      startClientY: e.clientY,
      initialCenterY: slotCenters[initialIdx],
      slotCenters,
      draftOrder: [...originalOrder],
      originalOrder,
    };
    setDraggingCatId(catId);
    setDragOffsetY(0);
    setDragOrder([...originalOrder]);
  };

  const openScheduleModal = (cat: Category) => {
    setScheduleModalCat(cat);
    setScheduleDraft(normalizeAvailabilitySchedule(cat.availabilitySchedule));
  };

  const handleSaveScheduleModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleModalCat) return;
    handleSaveCategorySchedule(scheduleModalCat, scheduleDraft);
    setScheduleModalCat(null);
  };

  const atCatLimit = resolvedPlan.maxCats !== -1 && allCategories.length >= resolvedPlan.maxCats;
  const catLimitText =
    resolvedPlan.maxCats === -1
      ? `${allCategories.length}/∞`
      : `${allCategories.length}/${resolvedPlan.maxCats}`;

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '18px',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={openNewCategoryModal}
          className={atCatLimit ? 'btn s' : 'btn p'}
          style={{
            height: '42px',
            minHeight: '42px',
            borderRadius: '12px',
            padding: '0 16px',
            fontSize: '13.5px',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          <span>{atCatLimit ? 'الحد مكتمل 🔒' : 'إضافة قسم'}</span>
          <Plus size={17} />
        </button>

        <button
          type="button"
          tabIndex={-1}
          aria-disabled="true"
          style={{
            height: '42px',
            minHeight: '42px',
            borderRadius: '12px',
            padding: '0 10px 0 12px',
            border: '1px solid var(--line)',
            background: 'var(--card)',
            color: 'var(--ink)',
            fontSize: '12.5px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'default',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <span style={{ color: 'var(--muted)', fontWeight: 700 }}>عدد الأقسام</span>
          <span
            dir="ltr"
            className="tabular-nums"
            style={{
              fontSize: '12.5px',
              fontWeight: 800,
              padding: '3px 9px',
              borderRadius: '8px',
              background: atCatLimit
                ? 'rgba(239, 68, 68, 0.14)'
                : 'color-mix(in srgb, var(--ink) 8%, transparent)',
              border: atCatLimit
                ? '1px solid rgba(239, 68, 68, 0.35)'
                : '1px solid color-mix(in srgb, var(--line) 80%, transparent)',
              color: atCatLimit ? '#ef4444' : 'var(--ink)',
              lineHeight: 1.3,
            }}
          >
            {catLimitText}
          </span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {displayCategories.map((c) => {
          const isCatVisible = c.published !== false;
          const isDragging = draggingCatId === c.id;
          const hasSchedule = Boolean(c.availabilitySchedule?.enabled);
          return (
            <div
              key={c.id}
              ref={(el) => {
                if (el) {
                  rowRefs.current.set(c.id, el);
                } else {
                  rowRefs.current.delete(c.id);
                }
              }}
              style={{
                ...surfaceCardStyle,
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                opacity: isCatVisible ? 1 : 0.65,
                position: 'relative',
                zIndex: isDragging ? 40 : 1,
                transform: isDragging ? `translateY(${dragOffsetY}px) scale(1.015)` : 'none',
                border: isDragging ? '1.5px solid var(--brand)' : surfaceCardStyle.border,
                boxShadow: isDragging ? '0 14px 32px rgba(0, 0, 0, 0.35)' : undefined,
                transition: isDragging
                  ? 'box-shadow 0.15s ease, border-color 0.15s ease'
                  : 'transform 0.18s ease, opacity 0.15s ease',
                userSelect: draggingCatId ? 'none' : undefined,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                {canReorder && (
                  <button
                    type="button"
                    onPointerDown={(e) => startHandleDrag(e, c.id)}
                    title="اسحب لتحريك القسم للأعلى أو للأسفل"
                    aria-label={`تحريك قسم ${c.n}`}
                    style={{
                      touchAction: 'none',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      background: 'transparent',
                      border: 'none',
                      padding: '6px 4px',
                      margin: '-6px -2px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: isDragging ? 'grabbing' : 'grab',
                      flexShrink: 0,
                      borderRadius: '8px',
                    }}
                  >
                    <SixDotDragHandle />
                  </button>
                )}
                {c.img && (
                  <img
                    src={c.img}
                    alt={c.n}
                    referrerPolicy="no-referrer"
                    style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                  />
                )}
                <div style={{ minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: 800,
                      color: 'var(--ink)',
                      display: 'block',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {c.n}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isCatVisible}
                  aria-label={isCatVisible ? 'إخفاء القسم من المنيو' : 'إظهار القسم في المنيو'}
                  title={isCatVisible ? 'ظاهر في المنيو — اضغط للإيقاف' : 'مخفي من المنيو — اضغط للتشغيل'}
                  onClick={() => handleToggleCategoryVisibility(c)}
                  className={`ios-switch ${isCatVisible ? 'on' : 'off'}`}
                >
                  <span className="ios-switch-thumb" />
                </button>

                <button
                  type="button"
                  onClick={() => openScheduleModal(c)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    border: hasSchedule ? '1px solid rgba(255, 59, 48, 0.6)' : '1px solid var(--line)',
                    background: hasSchedule ? 'rgba(255, 59, 48, 0.16)' : 'var(--bg)',
                    color: hasSchedule ? '#ff3b30' : 'var(--ink)',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                  }}
                  title="تعيين وقت توفر القسم"
                  aria-label="تعيين وقت توفر القسم"
                >
                  <Clock size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEditCategory(c)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    border: '1px solid var(--line)',
                    background: 'var(--bg)',
                    color: 'var(--ink)',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                  }}
                  title="تعديل القسم"
                >
                  <Edit size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteCategory(c)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    border: '1px solid var(--line)',
                    background: 'var(--bg)',
                    color: 'var(--ink)',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                  }}
                  title="حذف القسم"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal (clean name + image picker only) */}
      {showCatModal && (
        <>
          <div className="drawer-backdrop" onClick={() => setShowCatModal(false)} />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(500px, 92vw)',
              maxHeight: '90vh',
              overflowY: 'auto',
              ...surfaceCardStyle,
              borderRadius: '20px',
              padding: '20px 22px 22px',
              zIndex: 99999,
              boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '18px',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '19px', fontWeight: 900, color: 'var(--ink)' }}>
                {editingCatId ? 'تعديل القسم' : 'إضافة قسم'}
              </h3>
              <button
                type="button"
                onClick={() => setShowCatModal(false)}
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
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSaveCategory}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <label className="f" style={{ marginBottom: 0 }}>
                اسم القسم
                <input
                  type="text"
                  value={catNameInput}
                  onChange={(e) => setCatNameInput(e.target.value)}
                  placeholder="ادخل اسم القسم"
                  style={{ ...themedInputStyle, borderRadius: '12px', marginTop: '6px' }}
                  required
                />
              </label>

              <div
                role="button"
                tabIndex={0}
                onClick={() => setShowMediaLibrary(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowMediaLibrary(true);
                  }
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: catImageInput ? '16px' : '24px 16px',
                  borderRadius: '14px',
                  border: '1.5px dashed color-mix(in srgb, var(--line) 85%, transparent)',
                  background: 'color-mix(in srgb, var(--ink) 3%, transparent)',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                {catImageInput ? (
                  <>
                    <img
                      src={catImageInput}
                      alt={catNameInput || 'صورة القسم'}
                      referrerPolicy="no-referrer"
                      style={{
                        width: '86px',
                        height: '86px',
                        borderRadius: '14px',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--brand-ink, #34D399)' }}>
                      اضغط لتغيير الصورة من مكتبة الصور
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCatImageInput('');
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        padding: '4px 10px',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: 'var(--muted)',
                        cursor: 'pointer',
                      }}
                    >
                      إزالة الصورة
                    </button>
                  </>
                ) : (
                  <>
                    <ImageIcon size={30} strokeWidth={1.7} style={{ color: 'var(--muted)' }} />
                    <div style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--ink)' }}>
                      اضف صورة للقسم (اختياري)
                    </div>
                    <div dir="auto" style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>
                      مقاس الصورة المفضل 180 × 180، نقبل jpg, png, jpeg
                    </div>
                  </>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
                <button
                  type="submit"
                  className="btn p"
                  style={{
                    minWidth: '180px',
                    height: '44px',
                    borderRadius: '12px',
                    padding: '0 26px',
                    fontSize: '14.5px',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {editingCatId ? 'حفظ القسم' : 'إضافة قسم'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Dedicated Schedule / Timer Modal opened from the row Clock button */}
      {scheduleModalCat && (
        <>
          <div className="drawer-backdrop" onClick={() => setScheduleModalCat(null)} />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(480px, 94vw)',
              maxHeight: '90vh',
              overflowY: 'auto',
              ...surfaceCardStyle,
              borderRadius: '20px',
              padding: '18px 16px 20px',
              zIndex: 99999,
              boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 900, color: 'var(--ink)' }}>
                توقيت توفر: {scheduleModalCat.n}
              </h3>
              <button
                type="button"
                onClick={() => setScheduleModalCat(null)}
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
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSaveScheduleModal}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <AvailabilityScheduleEditor
                value={scheduleDraft}
                onChange={setScheduleDraft}
                targetLabel="القسم"
                inputStyle={themedInputStyle}
                flat
              />

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
                <button
                  type="submit"
                  className="btn p"
                  style={{
                    minWidth: '180px',
                    height: '44px',
                    borderRadius: '12px',
                    padding: '0 26px',
                    fontSize: '14.5px',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  حفظ التوقيت
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      <MediaLibraryModal
        isOpen={showMediaLibrary}
        items={mediaLibraryItems}
        currentUrl={catImageInput}
        onSelect={(url) => setCatImageInput(url)}
        onUploadFiles={uploadImagesToLibrary}
        onDeleteItem={(mediaId) => {
          const target = mediaLibraryItems.find((m) => m.id === mediaId);
          if (target && target.url === catImageInput) {
            setCatImageInput('');
          }
          removeMediaLibraryItem(mediaId);
        }}
        onClose={() => setShowMediaLibrary(false)}
      />
    </div>
  );
};
