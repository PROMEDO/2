/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Copy, ExternalLink, Lock, Share2 } from 'lucide-react';
import { QRCodeView } from '../../components/QRCodeView';
import { surfaceCardStyle, useDashboard } from './DashboardContext';

export const QrPage: React.FC = () => {
  const {
    rest,
    resolvedPlan,
    liveMenuUrl,
    fullSubdomainUrl,
    publicPath,
    copyLink,
    openShareModal,
    onNavigate,
    openUpgradeModal,
    customTabLabel,
  } = useDashboard();

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ marginBottom: '22px' }}>
        <h1 style={{ margin: '0 0 6px', fontSize: '24px', fontWeight: 900, color: 'var(--ink)' }}>
          {customTabLabel('qr', 'كود الـ QR ورابط المنيو 📱')}
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)' }}>
          تحميل وطباعة باركود الـ QR بدقة فائقة للمطعم وكروت الطاولات.
        </p>
      </div>

      {!resolvedPlan.perms.qrCode ? (
        <div style={{ ...surfaceCardStyle, padding: '36px 24px', borderRadius: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(245, 158, 11, 0.14)', color: '#f59e0b', display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}>
            <Lock size={26} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '8px', color: 'var(--ink)' }}>
            ميزة كود الـ QR معطلة في باقتك الحالية
          </h3>
          <p style={{ fontSize: '13.5px', color: 'var(--muted)', marginBottom: '20px', lineHeight: 1.6 }}>
            يمكنك مشاركة رابط المنيو المباشر أو التواصل مع الإدارة لتفعيل ميزة QR Code لباقتك ({resolvedPlan.plan.n}).
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={openShareModal}
              className="btn p"
              style={{ fontWeight: 800 }}
            >
              <Share2 size={16} />
              <span>مشاركة المنيو</span>
            </button>
            <button
              type="button"
              onClick={() => copyLink(liveMenuUrl)}
              className="btn"
              style={{ fontWeight: 800 }}
            >
              <Copy size={16} />
              <span>نسخ رابط المنيو</span>
            </button>
            <button
              type="button"
              onClick={() => openUpgradeModal('starter')}
              className="btn"
              style={{ fontWeight: 800 }}
            >
              ترقية الباقة لتفعيل QR
            </button>
          </div>
        </div>
      ) : (
        <div style={{ ...surfaceCardStyle, padding: '30px 20px', borderRadius: '20px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '6px', color: 'var(--ink)' }}>
            {rest.n}
          </h3>
          <p style={{ fontSize: '13.5px', marginBottom: '24px', color: 'var(--muted)' }}>
            امسح الكود لفتح القائمة فوراً
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div style={{ padding: '20px', background: '#fff', borderRadius: '22px', border: '1px solid var(--line)' }}>
              <QRCodeView url={liveMenuUrl} restaurantName={rest.n} size={220} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={openShareModal}
              className="btn p"
              style={{ fontWeight: 800 }}
            >
              <Share2 size={16} />
              <span>مشاركة المنيو</span>
            </button>
            <button
              type="button"
              onClick={() => copyLink(liveMenuUrl)}
              className="btn"
              style={{ fontWeight: 800 }}
            >
              <Copy size={16} />
              <span>نسخ رابط المنيو</span>
            </button>
            {fullSubdomainUrl ? (
              <a
                href={fullSubdomainUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{ textDecoration: 'none', fontWeight: 800 }}
              >
                <ExternalLink size={16} />
                <span>فتح المنيو</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate(publicPath)}
                className="btn"
                style={{ fontWeight: 800 }}
              >
                <ExternalLink size={16} />
                <span>معاينة المنيو</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
