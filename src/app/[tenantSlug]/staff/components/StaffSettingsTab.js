'use client';

import { useState } from 'react';
import { 
  Building2, 
  User, 
  MapPin, 
  Globe, 
  Layers, 
  ExternalLink, 
  Monitor, 
  Smartphone, 
  Percent, 
  Phone, 
  Shield, 
  Check,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useStaffLanguage } from '../context/StaffLanguageContext';
import { STORE_BRANCHES, STAFF_MEMBERS } from '../data/staffData';

export default function StaffSettingsTab({
  tenant,
  branch,
  setBranch,
  branches = STORE_BRANCHES,
  tenantSlug,
  isFullscreen,
  setIsFullscreen
}) {
  const { language, setLanguage, t } = useStaffLanguage();
  const st = t.settings;

  const [activeStaff, setActiveStaff] = useState(STAFF_MEMBERS[0]);
  const [vatRate, setVatRate] = useState('20.0');
  const [currency, setCurrency] = useState('GBP (£)');
  const [businessWhatsapp, setBusinessWhatsapp] = useState('+44 20 7946 0912');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveSettings = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
          {st.title}
        </h2>
        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '3px 0 0 0', fontWeight: '500' }}>
          {st.subtitle}
        </p>
      </div>

      {/* 1. Staff Profile Card */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.85rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
            <User size={15} strokeWidth={2.4} />
          </div>
          <span>{st.staffProfile}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.85rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #ff7a00 0%, #ea580c 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.15rem', boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)' }}>
            {activeStaff.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '0.94rem', color: '#0f172a', letterSpacing: '-0.01em' }}>
              {activeStaff.name}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '1px' }}>
              {activeStaff.role}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#ea580c', fontWeight: '700', marginTop: '1px' }}>
              {activeStaff.email}
            </div>
          </div>
        </div>

        {/* Staff switcher dropdown */}
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#475569', marginBottom: '0.3rem' }}>
            Switch Staff Profile (Session Context)
          </label>
          <select
            value={activeStaff.id}
            onChange={(e) => {
              const found = STAFF_MEMBERS.find(m => m.id === e.target.value);
              if (found) setActiveStaff(found);
            }}
            style={{
              width: '100%',
              padding: '0.68rem 0.85rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              fontSize: '0.82rem',
              color: '#0f172a',
              outline: 'none'
            }}
          >
            {STAFF_MEMBERS.map(m => (
              <option key={m.id} value={m.id}>{m.name} &bull; {m.role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Store Branch Switcher */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
            <Building2 size={15} strokeWidth={2.4} />
          </div>
          <span>{st.currentBranch}</span>
        </div>

        <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '0 0 0.75rem 0' }}>
          {st.switchBranchNotice}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {branches.map(b => {
            const isSelected = (branch?.id || 'branch-lon') === b.id;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setBranch(b)}
                style={{
                  padding: '0.75rem 0.95rem',
                  borderRadius: '12px',
                  border: isSelected ? '1.5px solid #0f172a' : '1px solid #e2e8f0',
                  backgroundColor: isSelected ? '#f8fafc' : '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: isSelected ? '0 2px 8px rgba(15, 23, 42, 0.08)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ fontWeight: '800', fontSize: '0.84rem', color: isSelected ? '#0f172a' : '#334155' }}>
                    {b.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                    {b.address}
                  </div>
                </div>
                {isSelected && <Check size={16} color="#0f172a" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Quick Switchers (Customer Portal & Desktop Admin) */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.85rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
            <ExternalLink size={15} strokeWidth={2.4} />
          </div>
          <span>{st.quickSwitchers}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          
          <a
            href={`/${tenantSlug || 'premiumphonex'}/portal`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.8rem',
              borderRadius: '12px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              textDecoration: 'none',
              color: '#0f172a',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '11px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Smartphone size={18} strokeWidth={2.2} />
              </div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '0.84rem' }}>{st.openCustomerPortal}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '1px' }}>{st.customerPortalDesc}</div>
              </div>
            </div>
            <ExternalLink size={14} color="#94a3b8" />
          </a>

          <a
            href={`/${tenantSlug || 'premiumphonex'}/dashboard`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.8rem',
              borderRadius: '12px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              textDecoration: 'none',
              color: '#0f172a',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '11px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Monitor size={18} strokeWidth={2.2} />
              </div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '0.84rem' }}>{st.openDesktopAdmin}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '1px' }}>{st.desktopAdminDesc}</div>
              </div>
            </div>
            <ExternalLink size={14} color="#94a3b8" />
          </a>

        </div>
      </div>

      {/* 4. Language & Viewport Preferences */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.85rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
            <Globe size={15} strokeWidth={2.4} />
          </div>
          <span>{st.languagePreferences}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.85rem' }}>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            style={{
              padding: '0.7rem',
              borderRadius: '12px',
              border: language === 'en' ? '1.5px solid #0f172a' : '1px solid #e2e8f0',
              backgroundColor: language === 'en' ? '#0f172a' : '#ffffff',
              color: language === 'en' ? '#ffffff' : '#64748b',
              fontWeight: '800',
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: language === 'en' ? '0 4px 12px rgba(15, 23, 42, 0.2)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>🇬🇧</span>
            <span>English (UK)</span>
          </button>

          <button
            type="button"
            onClick={() => setLanguage('pt')}
            style={{
              padding: '0.7rem',
              borderRadius: '12px',
              border: language === 'pt' ? '1.5px solid #0f172a' : '1px solid #e2e8f0',
              backgroundColor: language === 'pt' ? '#0f172a' : '#ffffff',
              color: language === 'pt' ? '#ffffff' : '#64748b',
              fontWeight: '800',
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: language === 'pt' ? '0 4px 12px rgba(15, 23, 42, 0.2)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>🇧🇷</span>
            <span>Português (BR)</span>
          </button>
        </div>

        {/* Viewport display toggle */}
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          style={{
            width: '100%',
            padding: '0.72rem',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            color: '#0f172a',
            fontWeight: '700',
            fontSize: '0.78rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
        >
          {isFullscreen ? <Minimize2 size={15} strokeWidth={2.2} /> : <Maximize2 size={15} strokeWidth={2.2} />}
          <span>{isFullscreen ? 'Switch to Phone Frame Shell (480px)' : 'Switch to Full Screen View'}</span>
        </button>

      </div>

      {/* 5. Store Operational Parameters */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.85rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
            <Shield size={15} strokeWidth={2.4} />
          </div>
          <span>{st.storeSettings}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#475569', marginBottom: '0.25rem' }}>
                {st.currency}
              </label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={{ width: '100%', padding: '0.62rem 0.8rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.82rem', outline: 'none', backgroundColor: '#ffffff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#475569', marginBottom: '0.25rem' }}>
                {st.vatRate}
              </label>
              <input
                type="text"
                value={vatRate}
                onChange={(e) => setVatRate(e.target.value)}
                style={{ width: '100%', padding: '0.62rem 0.8rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.82rem', outline: 'none', backgroundColor: '#ffffff' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#475569', marginBottom: '0.25rem' }}>
              {st.businessPhone}
            </label>
            <input
              type="text"
              value={businessWhatsapp}
              onChange={(e) => setBusinessWhatsapp(e.target.value)}
              style={{ width: '100%', padding: '0.62rem 0.8rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.82rem', outline: 'none', backgroundColor: '#ffffff' }}
            />
          </div>

          <button
            type="button"
            onClick={handleSaveSettings}
            style={{
              marginTop: '0.5rem',
              padding: '0.82rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ff7a00 0%, #ea580c 100%)',
              color: '#ffffff',
              border: 'none',
              fontWeight: '800',
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)',
              letterSpacing: '0.01em',
              transition: 'all 0.15s ease'
            }}
          >
            {savedNotice ? '✓ Settings Saved!' : 'Save Store Preferences'}
          </button>
        </div>
      </div>

      {/* App Version Info */}
      <div style={{ textAlign: 'center', fontSize: '0.68rem', color: '#94a3b8', padding: '0.5rem 0 1rem 0' }}>
        {st.systemVersion}
      </div>

    </div>
  );
}
