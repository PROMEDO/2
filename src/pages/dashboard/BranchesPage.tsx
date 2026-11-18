/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  GitBranch,
  Lock,
  Plus,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { getCollection } from '../../utils/storage';
import { Category, MenuItem } from '../../types';
import { getFullSubdomainUrl, getPublicMenuUrlPath } from '../../utils/businessDefaults';
import { surfaceCardStyle, themedInputStyle, useDashboard } from './DashboardContext';

export const BranchesPage: React.FC = () => {
  const {
    mainRid,
    activeRid,
    mainRest,
    branchesList,
    resolvedPlan,
    customTabLabel,
    site,
    switchActiveBranch,
    createBranch,
    cloneMainMenuToBranch,
    deleteBranch,
    copyLink,
    onNavigate,
    openUpgradeModal,
  } = useDashboard();

  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchPhone, setNewBranchPhone] = useState('');
  const [newBranchAddress, setNewBranchAddress] = useState('');
  const [cloneOnCreate, setCloneOnCreate] = useState(true);

  const maxB = resolvedPlan.maxBranches;
  const isLocked = maxB === 0;
  const atLimit = maxB !== -1 && branchesList.length >= maxB;
  const quotaLabel =
    maxB === -1 ? 'غير محدود ∞' : `${branchesList.length} من ${maxB} فرع إضافي`;

  const allCats = getCollection<Category>('cats');
  const allItems = getCollection<MenuItem>('items');

  const getBranchUrl = (r: typeof mainRest) => {
    const sub = getFullSubdomainUrl(r, site, resolvedPlan);
    if (sub) return sub;
    return `${window.location.origin}${getPublicMenuUrlPath(r, resolvedPlan)}`;
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = createBranch(newBranchName, newBranchPhone, newBranchAddress, cloneOnCreate);
    if (ok) {
      setNewBranchName('');
      setNewBranchPhone('');
      setNewBranchAddress('');
    }
  };

  return (
    <div style={{ maxWidth: '1020px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: '0 0 6px', fontSize: '25px', fontWeight: 900, color: 'var(--ink)' }}>
            {customTabLabel('branches', 'إدارة الأفرع المتعددة 🏢')}
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)' }}>
            أنشئ أفرعاً إضافية وتحكم بمنيو وأسعار كل فرع بالكامل من نفس لوحة التحكم مع إمكانية نسخ منيو الفرع الرئيسي بضغطة زر.
          </p>
        </div>

        {!isLocked && (
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
            الحد المسموح ({resolvedPlan.plan.n}): {quotaLabel}
          </div>
        )}
      </div>

      {isLocked ? (
        <div
          style={{
            ...surfaceCardStyle,
            borderRadius: '20px',
            padding: '28px 24px',
            borderStyle: 'dashed',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.14)', color: '#f59e0b', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Lock size={22} />
              </div>
              <div>
                <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 900, color: 'var(--ink)' }}>
                  ميزة إدارة عدة أفرع مقفلة في باقتك الحالية 🔒
                </h2>
                <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--muted)' }}>
                  متاحة في <b>الباقة الاحترافية</b> (حتى فرعين) و<b>باقة الاعمال الشاملة</b> (أفرع لانهائية).
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openUpgradeModal('pro')}
              className="btn p s"
              style={{ fontWeight: 800 }}
            >
              ترقية الباقة الآن
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div style={{ background: 'var(--panel)', border: 0, borderRadius: '14px', padding: '14px' }}>
              <b style={{ display: 'block', color: 'var(--ink)', fontSize: '14px', marginBottom: '4px' }}>نسخ منيو الفرع الرئيسي</b>
              <span style={{ fontSize: '12.5px', color: 'var(--muted)' }}>انسخ جميع الأقسام والأطباق والأسعار لأي فرع جديد بنقرة واحدة وعدّل عليها بحرية.</span>
            </div>
            <div style={{ background: 'var(--panel)', border: 0, borderRadius: '14px', padding: '14px' }}>
              <b style={{ display: 'block', color: 'var(--ink)', fontSize: '14px', marginBottom: '4px' }}>واتساب وموقع مستقل لكل فرع</b>
              <span style={{ fontSize: '12.5px', color: 'var(--muted)' }}>كل فرع يمتلك رابط منيو خاص به ورقم واتساب لاستقبال طلباته بشكل منفصل.</span>
            </div>
            <div style={{ background: 'var(--panel)', border: 0, borderRadius: '14px', padding: '14px' }}>
              <b style={{ display: 'block', color: 'var(--ink)', fontSize: '14px', marginBottom: '4px' }}>تبديل فوري من نفس اللوحة</b>
              <span style={{ fontSize: '12.5px', color: 'var(--muted)' }}>تنقّل بين أفرعك من نفس لوحة التحكم دون الحاجة لتسجيل الخروج أو إنشاء حسابات جديدة.</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Create New Branch Form */}
          <form
            onSubmit={handleCreate}
            style={{ ...surfaceCardStyle, borderRadius: '20px', padding: '22px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--soft)', color: 'var(--brand)', display: 'grid', placeItems: 'center' }}>
                <Plus size={18} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '16.5px', fontWeight: 900, color: 'var(--ink)' }}>
                  إنشاء فرع جديد
                </h2>
                <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)' }}>
                  {atLimit
                    ? `وصلت للحد الأقصى المسموح في باقتك (${maxB} فرع). يمكنك الترقية لباقة الاعمال الشاملة لأفرع غير محدودة.`
                    : 'أضف بيانات الفرع الجديد واختر ما إذا كنت تريد نسخ منيو الفرع الرئيسي إليه تلقائياً.'}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px', marginBottom: '12px' }}>
              <label className="f" style={{ margin: 0 }}>
                اسم الفرع * (مثال: فرع المنصور)
                <input
                  type="text"
                  required
                  disabled={atLimit}
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  placeholder="مثال: فرع المنصور"
                  style={themedInputStyle}
                />
              </label>

              <label className="f" style={{ margin: 0 }}>
                رقم هاتف / واتساب الفرع (اختياري)
                <input
                  type="tel"
                  dir="ltr"
                  disabled={atLimit}
                  value={newBranchPhone}
                  onChange={(e) => setNewBranchPhone(e.target.value)}
                  placeholder={mainRest.ph || '07701234567'}
                  style={{ ...themedInputStyle, textAlign: 'left' }}
                />
              </label>

              <label className="f" style={{ margin: 0 }}>
                عنوان الفرع (اختياري)
                <input
                  type="text"
                  disabled={atLimit}
                  value={newBranchAddress}
                  onChange={(e) => setNewBranchAddress(e.target.value)}
                  placeholder="مثال: بغداد - المنصور شارع 14 رمضان"
                  style={themedInputStyle}
                />
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 700, color: 'var(--ink)' }}>
                <input
                  type="checkbox"
                  checked={cloneOnCreate}
                  onChange={(e) => setCloneOnCreate(e.target.checked)}
                />
                <span>نسخ منيو الفرع الرئيسي (الأقسام والأصناف) إلى هذا الفرع تلقائياً</span>
              </label>

              <button
                type="submit"
                disabled={atLimit}
                className="btn p"
                style={{ fontWeight: 800, opacity: atLimit ? 0.6 : 1 }}
              >
                <Plus size={16} />
                <span>{atLimit ? 'الحد مكتمل 🔒' : 'إنشاء الفرع وتفعيله'}</span>
              </button>
            </div>
          </form>

          {/* Main Branch + Child Branches List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Main Branch Card */}
            {(() => {
              const isManagingMain = activeRid === mainRid;
              const mainCatsCount = allCats.filter((c) => c.rid === mainRid).length;
              const mainItemsCount = allItems.filter((i) => i.rid === mainRid).length;
              const mainUrl = getBranchUrl(mainRest);

              return (
                <div
                  style={{
                    ...surfaceCardStyle,
                    borderRadius: '18px',
                    padding: '18px 20px',
                    border: isManagingMain ? '2px solid var(--brand)' : '1px solid var(--line)',
                    background: isManagingMain ? 'var(--soft)' : 'var(--surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '14px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--brand)', color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      <GitBranch size={20} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <b style={{ fontSize: '16px', color: 'var(--ink)' }}>{mainRest.n} (الفرع الرئيسي)</b>
                        {isManagingMain && (
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#10b981', background: 'rgba(16,185,129,0.16)', padding: '2px 8px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={12} /> نشط الآن في اللوحة
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '3px' }}>
                        {mainCatsCount} أقسام • {mainItemsCount} عنصر • {mainRest.address || 'العنوان الرئيسي'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {!isManagingMain && (
                      <button
                        type="button"
                        onClick={() => switchActiveBranch(mainRid)}
                        className="btn p s"
                        style={{ fontWeight: 800 }}
                      >
                        إدارة الرئيسي الآن
                      </button>
                    )}
                    <button type="button" onClick={() => copyLink(mainUrl)} className="btn s">
                      <Copy size={14} />
                      <span>نسخ الرابط</span>
                    </button>
                    {getFullSubdomainUrl(mainRest, site, resolvedPlan) ? (
                      <a
                        href={mainUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn s"
                        style={{ textDecoration: 'none' }}
                      >
                        <ExternalLink size={14} />
                        <span>فتح المنيو</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onNavigate(getPublicMenuUrlPath(mainRest, resolvedPlan))}
                        className="btn s"
                      >
                        <ExternalLink size={14} />
                        <span>فتح المنيو</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Child Branches */}
            {branchesList.length === 0 ? (
              <div style={{ ...surfaceCardStyle, borderRadius: '18px', padding: '28px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)' }}>
                  لم تُضف أي أفرع إضافية بعد. استخدم النموذج أعلاه لإنشاء فرعك الثاني.
                </p>
              </div>
            ) : (
              branchesList.map((branch) => {
                const isManagingThis = activeRid === branch.id;
                const branchLabel = branch.branchName || branch.n;
                const branchCats = allCats.filter((c) => c.rid === branch.id).length;
                const branchItems = allItems.filter((i) => i.rid === branch.id).length;
                const branchUrl = getBranchUrl(branch);

                return (
                  <div
                    key={branch.id}
                    style={{
                      ...surfaceCardStyle,
                      borderRadius: '18px',
                      padding: '18px 20px',
                      border: isManagingThis ? '2px solid var(--brand)' : '1px solid var(--line)',
                      background: isManagingThis ? 'var(--soft)' : 'var(--surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '14px',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <b style={{ fontSize: '15.5px', color: 'var(--ink)' }}>🏢 {branchLabel}</b>
                        {isManagingThis && (
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#10b981', background: 'rgba(16,185,129,0.16)', padding: '2px 8px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={12} /> قيد الإدارة الآن
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '3px' }}>
                        {branchCats} أقسام • {branchItems} عنصر • 📞 {branch.ph || mainRest.ph}
                        {branch.address ? ` • 📍 ${branch.address}` : ''}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {!isManagingThis && (
                        <button
                          type="button"
                          onClick={() => switchActiveBranch(branch.id)}
                          className="btn p s"
                          style={{ fontWeight: 800 }}
                        >
                          إدارة منيو هذا الفرع
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => cloneMainMenuToBranch(branch.id, branchLabel)}
                        className="btn s"
                        title="استيراد نسخة من منيو الفرع الرئيسي"
                      >
                        <RefreshCw size={14} />
                        <span>نسخ منيو الرئيسي هنا</span>
                      </button>
                      <button type="button" onClick={() => copyLink(branchUrl)} className="btn s">
                        <Copy size={14} />
                        <span>الرابط</span>
                      </button>
                      {getFullSubdomainUrl(branch, site, resolvedPlan) ? (
                        <a
                          href={branchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn s"
                          style={{ textDecoration: 'none' }}
                        >
                          <ExternalLink size={14} />
                          <span>فتح</span>
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onNavigate(getPublicMenuUrlPath(branch, resolvedPlan))}
                          className="btn s"
                        >
                          <ExternalLink size={14} />
                          <span>فتح</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteBranch(branch.id, branchLabel)}
                        className="btn s d"
                        title="حذف الفرع"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};
