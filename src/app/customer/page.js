'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../utils/supabase/client';
import { CreditCard, ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';

export default function GlobalCustomerPortal() {
  const router = useRouter();
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenants = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from('tenants').select('id, name, slug').order('name');
      if (data && data.length > 0) {
        setTenants(data);
        setSelectedTenant(data[0].slug);
      } else {
        const fallback = [{ id: 'demo-1', name: 'PremiumPhoneX (Official Store)', slug: 'premiumphonex' }];
        setTenants(fallback);
        setSelectedTenant('premiumphonex');
      }
      setLoading(false);
    };
    fetchTenants();
  }, []);

  const handleEnterPortal = () => {
    if (!selectedTenant) return;
    router.push(`/${selectedTenant}/portal`);
  };

  return (
    <div className="portal-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <Link href="/" style={{ position: 'absolute', top: '2rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
        <ArrowLeft size={18} /> Back to Home
      </Link>
      
      <div className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '50%', background: 'var(--primary-glow)', border: '1px solid var(--border-color)', marginBottom: '1rem', color: 'var(--accent-cyan)' }}>
            <CreditCard size={28} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>Customer Portal</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Check repair status, view bills, and manage your devices.</p>
        </div>

        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Note:</strong> Customer accounts are created by the repair shop. If you don't have an account, please contact your shop directly.
          </p>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading shops...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Find your repair shop</label>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <select 
                  className="select-field" 
                  value={selectedTenant}
                  onChange={(e) => setSelectedTenant(e.target.value)}
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                >
                  {tenants.map(t => (
                    <option key={t.id} value={t.slug}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <button 
              className="btn btn-secondary" 
              onClick={handleEnterPortal}
              style={{ width: '100%', marginTop: '0.5rem', border: '1px solid var(--accent-cyan)', color: 'var(--text-primary)' }}
            >
              Continue to Shop Portal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
