'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../utils/supabase/client';
import { registerTenant } from '../actions/tenant';
import { Building, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantSlug, setNewTenantSlug] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateTenant = async (e) => {
    e.preventDefault();
    if (!newTenantName || !newTenantSlug || !adminEmail || !adminPassword) return;
    
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const formData = new FormData();
    formData.append('businessName', newTenantName);
    formData.append('domainSlug', newTenantSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
    formData.append('adminEmail', adminEmail);
    formData.append('adminPassword', adminPassword);

    const result = await registerTenant(formData);

    if (result.error) {
      setErrorMsg(result.error);
    } else {
      setSuccessMsg(`Shop "${newTenantName}" registered successfully! Redirecting to login...`);
      setTimeout(() => {
        router.push('/login');
      }, 2500);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="portal-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <Link href="/" style={{ position: 'absolute', top: '2rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
        <ArrowLeft size={18} /> Back to Home
      </Link>
      
      <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '50%', background: 'var(--primary-glow)', border: '1px solid var(--border-color)', marginBottom: '1rem', color: 'var(--accent-amber)' }}>
            <Building size={28} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>Register Your Shop</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Join PhoneSuite and transform your repair business.</p>
        </div>

        {successMsg && (
          <div style={{ borderLeft: '4px solid var(--accent-emerald)', padding: '1rem', marginBottom: '1.5rem', background: 'rgba(16,185,129,0.08)' }}>
            <p style={{ color: 'var(--accent-emerald)', fontSize: '0.95rem', fontWeight: '500' }}>{successMsg}</p>
          </div>
        )}
        
        {errorMsg && (
          <div style={{ borderLeft: '4px solid var(--accent-danger)', padding: '1rem', marginBottom: '1.5rem', background: 'rgba(239,68,68,0.08)' }}>
            <p style={{ color: 'var(--accent-danger)', fontSize: '0.95rem', fontWeight: '500' }}>{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleCreateTenant} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Business Name</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. London Airlink Repairs"
              value={newTenantName}
              onChange={(e) => {
                setNewTenantName(e.target.value);
                setNewTenantSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'));
              }}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Domain Slug</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="london-airlink"
                value={newTenantSlug}
                onChange={(e) => setNewTenantSlug(e.target.value)}
                style={{ flex: 1 }}
                required
              />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>.phonesuite.uk</span>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Admin Email</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="admin@example.com"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Admin Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="Strong password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-success" disabled={isSubmitting} style={{ width: '100%', marginTop: '1rem', opacity: isSubmitting ? 0.7 : 1 }}>
            <Sparkles size={18} /> {isSubmitting ? 'Creating Workspace...' : 'Create Account'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Log in</Link>
        </div>
      </div>
    </div>
  );
}
