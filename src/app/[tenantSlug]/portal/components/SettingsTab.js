'use client';

import { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Bell, 
  Store, 
  Phone, 
  MapPin, 
  Clock, 
  Smartphone, 
  CheckCircle2, 
  ArrowLeft, 
  HelpCircle,
  ExternalLink,
  MessageSquare,
  Lock,
  Calendar,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsTab({ 
  customer, 
  setCustomer, 
  customersList = [], 
  tenant, 
  isFullscreen, 
  setIsFullscreen 
}) {
  const router = useRouter();

  // Notification toggles
  const [smsRepair, setSmsRepair] = useState(true);
  const [billReminders, setBillReminders] = useState(true);
  const [shopDrops, setShopDrops] = useState(false);
  const [biometrics, setBiometrics] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* Customer Profile Card */}
      <div className="mobile-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div 
            style={{ 
              width: '50px', 
              height: '50px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #38bdf8 0%, #4f46e5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              fontWeight: '800',
              color: '#fff',
              border: '2px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            {customer?.name ? customer.name.charAt(0) : 'U'}
          </div>

          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff', margin: 0 }}>
              {customer?.name || 'Customer'}
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
              {customer?.email || 'customer@example.com'}
            </p>
          </div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', padding: '0.85rem', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>Phone:</span>
            <span style={{ color: '#fff', fontWeight: '600' }}>{customer?.phone || '+44 7911 123456'}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8' }}>Date of Birth (E-Sign):</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ color: '#fff', fontWeight: '600' }}>{customer?.dob || '14 June 1992'}</span>
              <CheckCircle2 size={13} style={{ color: '#34d399' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>Address:</span>
            <span style={{ color: '#cbd5e1', textAlign: 'right', maxWidth: '60%' }}>
              {customer?.address || '42 Baker Street, London NW1 6XE'}
            </span>
          </div>
        </div>
      </div>

      {/* Security & Regulatory Compliance */}
      <div className="mobile-card">
        <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#fff', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ShieldCheck size={16} style={{ color: '#10b981' }} /> Security & Regulatory Verification
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#fff' }}>DOB Identity Verification</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Verified for UK Consumer Credit Agreements</div>
            </div>
            <span style={{ fontSize: '0.68rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: '700' }}>
              VERIFIED
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#fff' }}>Biometrics / Face ID Prompt</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Quick sign-in with phone biometrics</div>
            </div>
            <input 
              type="checkbox" 
              checked={biometrics} 
              onChange={() => setBiometrics(!biometrics)}
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#38bdf8' }} 
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="mobile-card">
        <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#fff', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Bell size={16} style={{ color: '#38bdf8' }} /> Notifications & Alerts
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#fff' }}>Repair Status SMS</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Real-time updates as device is fixed</div>
            </div>
            <input 
              type="checkbox" 
              checked={smsRepair} 
              onChange={() => setSmsRepair(!smsRepair)}
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#38bdf8' }} 
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#fff' }}>Bill & RTO Reminders</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>3 days before installment due date</div>
            </div>
            <input 
              type="checkbox" 
              checked={billReminders} 
              onChange={() => setBillReminders(!billReminders)}
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#38bdf8' }} 
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#fff' }}>Shop Product Drops</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Alerts on new phones, iPads & consoles</div>
            </div>
            <input 
              type="checkbox" 
              checked={shopDrops} 
              onChange={() => setShopDrops(!shopDrops)}
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#38bdf8' }} 
            />
          </div>
        </div>
      </div>

      {/* Store & Branch Information */}
      <div className="mobile-card">
        <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#fff', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Store size={16} style={{ color: '#fbbf24' }} /> {tenant?.name || 'PhoneSuite'} Store Location
        </h4>

        <div style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={15} style={{ color: '#38bdf8', flexShrink: 0 }} />
            <span>42 Central High Street, London Central, WC1E 6BT</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={15} style={{ color: '#38bdf8', flexShrink: 0 }} />
            <span>Mon - Sat: 9:00 AM - 7:00 PM &bull; Sun: 10:30 AM - 5:00 PM</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Phone size={15} style={{ color: '#38bdf8', flexShrink: 0 }} />
            <span>+44 (0) 20 7946 0192</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem' }}>
          <a
            href="tel:+442079460192"
            style={{
              flex: 1,
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '10px',
              padding: '0.55rem',
              color: '#38bdf8',
              fontSize: '0.76rem',
              fontWeight: '700',
              textDecoration: 'none',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
          >
            <Phone size={14} /> Call Store
          </a>

          <a
            href="https://wa.me/447911123456"
            target="_blank"
            rel="noreferrer"
            style={{
              flex: 1,
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '10px',
              padding: '0.55rem',
              color: '#34d399',
              fontSize: '0.76rem',
              fontWeight: '700',
              textDecoration: 'none',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
          >
            <MessageSquare size={14} /> WhatsApp Tech
          </a>
        </div>
      </div>

      {/* Simulator / Developer View Controls */}
      <div className="mobile-card" style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px dashed rgba(255, 255, 255, 0.15)' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94a3b8', margin: '0 0 0.65rem 0' }}>
          Portal View Settings
        </h4>

        {/* Fullscreen vs Mobile Frame toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#fff' }}>Viewport Mode</div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
              {isFullscreen ? 'Full width responsive' : 'Mobile phone shell (480px)'}
            </div>
          </div>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '4px 10px',
              color: '#fff',
              fontSize: '0.72rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            <span>{isFullscreen ? 'Phone Frame' : 'Full Width'}</span>
          </button>
        </div>

        {/* Customer profile switcher (if test accounts exist) */}
        {customersList.length > 1 && (
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
              Switch Test Customer Profile:
            </label>
            <select
              value={customer?.id || ''}
              onChange={(e) => {
                const found = customersList.find(c => c.id === e.target.value);
                if (found) setCustomer(found);
              }}
              style={{
                width: '100%',
                background: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '0.45rem',
                color: '#fff',
                fontSize: '0.75rem'
              }}
            >
              {customersList.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={() => router.push('/customer')}
          style={{
            width: '100%',
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            padding: '0.5rem',
            color: '#94a3b8',
            fontSize: '0.75rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem'
          }}
        >
          <ArrowLeft size={13} /> Switch Shop / Home
        </button>
      </div>

      <div style={{ textAlign: 'center', padding: '0.5rem 0', color: '#64748b', fontSize: '0.7rem' }}>
        PhoneSuite Customer Portal v2.4 (Mobile Edition)
      </div>

    </div>
  );
}
