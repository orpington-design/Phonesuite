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
        <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
          {st.title}
        </h2>
        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>
          {st.subtitle}
        </p>
      </div>

      {/* 1. Staff Profile Card */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.75rem' }}>
          <User size={16} color="#2563eb" />
          <span>{st.staffProfile}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.1rem' }}>
            {activeStaff.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#0f172a' }}>
              {activeStaff.name}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              {activeStaff.role}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: '600' }}>
              {activeStaff.email}
            </div>
          </div>
        </div>

        {/* Staff switcher dropdown */}
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#475569', marginBottom: '0.25rem' }}>
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
              padding: '0.55rem 0.75rem',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#f8fafc',
              fontSize: '0.8rem',
              color: '#0f172a'
            }}
          >
            {STAFF_MEMBERS.map(m => (
              <option key={m.id} value={m.id}>{m.name} &bull; {m.role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Store Branch Switcher */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
          <Building2 size={16} color="#2563eb" />
          <span>{st.currentBranch}</span>
        </div>

        <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '0 0 0.65rem 0' }}>
          {st.switchBranchNotice}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {branches.map(b => {
            const isSelected = (branch?.id || 'branch-lon') === b.id;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setBranch(b)}
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '12px',
                  border: isSelected ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                  backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontWeight: '800', fontSize: '0.82rem', color: isSelected ? '#1d4ed8' : '#0f172a' }}>
                    {b.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    {b.address}
                  </div>
                </div>
                {isSelected && <Check size={16} color="#2563eb" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Quick Switchers (Customer Portal & Desktop Admin) */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.75rem' }}>
          <ExternalLink size={16} color="#2563eb" />
          <span>{st.quickSwitchers}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          
          <a
            href={`/${tenantSlug || 'premiumphonex'}/portal`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem',
              borderRadius: '12px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              textDecoration: 'none',
              color: '#0f172a',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '9px', backgroundColor: '#e0e7ff', color: '#4318ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Smartphone size={18} />
              </div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '0.82rem' }}>{st.openCustomerPortal}</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{st.customerPortalDesc}</div>
              </div>
            </div>
            <ExternalLink size={14} color="#64748b" />
          </a>

          <a
            href={`/${tenantSlug || 'premiumphonex'}/dashboard`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem',
              borderRadius: '12px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              textDecoration: 'none',
              color: '#0f172a',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '9px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Monitor size={18} />
              </div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '0.82rem' }}>{st.openDesktopAdmin}</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{st.desktopAdminDesc}</div>
              </div>
            </div>
            <ExternalLink size={14} color="#64748b" />
          </a>

        </div>
      </div>

      {/* 4. Language & Viewport Preferences */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.75rem' }}>
          <Globe size={16} color="#2563eb" />
          <span>{st.languagePreferences}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.85rem' }}>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            style={{
              padding: '0.65rem',
              borderRadius: '12px',
              border: language === 'en' ? '2px solid #2563eb' : '1px solid #e2e8f0',
              backgroundColor: language === 'en' ? '#eff6ff' : '#ffffff',
              color: language === 'en' ? '#1d4ed8' : '#475569',
              fontWeight: '700',
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>🇬🇧</span>
            <span>English (UK)</span>
          </button>

          <button
            type="button"
            onClick={() => setLanguage('pt')}
            style={{
              padding: '0.65rem',
              borderRadius: '12px',
              border: language === 'pt' ? '2px solid #2563eb' : '1px solid #e2e8f0',
              backgroundColor: language === 'pt' ? '#eff6ff' : '#ffffff',
              color: language === 'pt' ? '#1d4ed8' : '#475569',
              fontWeight: '700',
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
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
            padding: '0.65rem',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#f8fafc',
            color: '#334155',
            fontWeight: '700',
            fontSize: '0.78rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          <span>{isFullscreen ? 'Switch to Phone Frame Shell (480px)' : 'Switch to Full Screen View'}</span>
        </button>

      </div>

      {/* 5. Store Operational Parameters */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.75rem' }}>
          <Shield size={16} color="#2563eb" />
          <span>{st.storeSettings}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#475569', marginBottom: '0.2rem' }}>
                {st.currency}
              </label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#475569', marginBottom: '0.2rem' }}>
                {st.vatRate}
              </label>
              <input
                type="text"
                value={vatRate}
                onChange={(e) => setVatRate(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#475569', marginBottom: '0.2rem' }}>
              {st.businessPhone}
            </label>
            <input
              type="text"
              value={businessWhatsapp}
              onChange={(e) => setBusinessWhatsapp(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
            />
          </div>

          <button
            type="button"
            onClick={handleSaveSettings}
            style={{
              marginTop: '0.35rem',
              padding: '0.75rem',
              borderRadius: '10px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              border: 'none',
              fontWeight: '700',
              fontSize: '0.82rem',
              cursor: 'pointer'
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
