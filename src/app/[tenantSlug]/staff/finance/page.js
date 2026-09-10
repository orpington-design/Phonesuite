'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, FileCheck, Check, Smartphone } from 'lucide-react';
import { StaffLanguageProvider, useStaffLanguage } from '../context/StaffLanguageContext';
import StaffFinanceTab from '../components/StaffFinanceTab';
import { STORE_BRANCHES } from '../data/staffData';

export default function StaffFinancePage() {
  return (
    <StaffLanguageProvider>
      <StaffFinanceContent />
    </StaffLanguageProvider>
  );
}

function StaffFinanceContent() {
  const router = useRouter();
  const params = useParams();
  const tenantSlug = params.tenantSlug || 'premiumphonex';
  const { language, setLanguage, t } = useStaffLanguage();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const tenant = { name: 'PhoneSuite UK', slug: tenantSlug };
  const branch = STORE_BRANCHES[0];

  return (
    <div className="mobile-portal-wrapper">
      <div className="mobile-app-shell">
        
        {/* Dark Executive Header */}
        <header 
          className="mobile-header mobile-header-dark" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            backgroundColor: '#0b132b', 
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0.75rem 1rem'
          }}
        >
          {/* Back Button */}
          <button
            type="button"
            onClick={() => router.push(`/${tenantSlug}/staff`)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '10px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>

          {/* Center Brand / Title */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.94rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.02em' }}>
              {language === 'pt' ? 'Financiamento' : 'Finance Requests'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '1px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ea580c' }} />
              <span style={{ fontSize: '0.66rem', color: '#94a3b8', fontWeight: '600' }}>
                Credit Applications Desk
              </span>
            </div>
          </div>

          {/* Right Action: Language Switcher */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '10px',
                height: '34px',
                padding: '0 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '0.74rem',
                fontWeight: '700'
              }}
            >
              <span>{language === 'en' ? '🇬🇧' : '🇧🇷'}</span>
              <span style={{ fontSize: '0.7rem', fontWeight: '800' }}>{language === 'en' ? 'EN' : 'PT'}</span>
            </button>

            {isLangMenuOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 90 }} onClick={() => setIsLangMenuOpen(false)} />
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    background: '#0b132b',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    padding: '6px',
                    minWidth: '150px',
                    zIndex: 99,
                    boxShadow: '0 12px 30px rgba(0,0,0,0.5)'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => { setLanguage('en'); setIsLangMenuOpen(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: language === 'en' ? 'rgba(234, 88, 12, 0.18)' : 'transparent',
                      color: language === 'en' ? '#ff7a00' : '#f1f5f9',
                      fontSize: '0.78rem',
                      fontWeight: language === 'en' ? '700' : '500',
                      width: '100%',
                      cursor: 'pointer'
                    }}
                  >
                    <span>🇬🇧 English</span>
                    {language === 'en' && <Check size={14} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLanguage('pt'); setIsLangMenuOpen(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: language === 'pt' ? 'rgba(234, 88, 12, 0.18)' : 'transparent',
                      color: language === 'pt' ? '#ff7a00' : '#f1f5f9',
                      fontSize: '0.78rem',
                      fontWeight: language === 'pt' ? '700' : '500',
                      width: '100%',
                      cursor: 'pointer'
                    }}
                  >
                    <span>🇧🇷 Português</span>
                    {language === 'pt' && <Check size={14} />}
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="mobile-scroll-body" style={{ padding: '1rem' }}>
          <StaffFinanceTab tenant={tenant} branch={branch} tenantSlug={tenantSlug} />
        </main>

      </div>
    </div>
  );
}
