'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../../utils/supabase/client';
import { Building, Users, Activity, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenants = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from('tenants').select('*').order('created_at', { ascending: false });
      if (data) {
        setTenants(data);
      }
      setLoading(false);
    };
    fetchTenants();
  }, []);

  return (
    <div style={{ padding: '2rem 3rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Platform Overview</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage PhoneSuite tenants and system health.</p>
      </header>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', borderRadius: '12px' }}>
            <Building size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Total Tenants</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '700', margin: 0 }}>{tenants.length}</h3>
          </div>
        </div>
        
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)', borderRadius: '12px' }}>
            <Users size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Active Users</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '700', margin: 0 }}>--</h3>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(168, 85, 247, 0.1)', color: 'var(--accent-purple)', borderRadius: '12px' }}>
            <Activity size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>System Status</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '700', margin: 0, color: 'var(--accent-emerald)' }}>Healthy</h3>
          </div>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Registered Tenants</h3>
        </div>
        
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading tenants...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.9rem' }}>Business Name</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.9rem' }}>Slug</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.9rem' }}>Created At</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.9rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map(tenant => (
                  <tr key={tenant.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{tenant.name}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{tenant.slug}.phonesuite.uk</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>
                      {new Date(tenant.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <Link href={`/${tenant.slug}/dashboard`} target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                        View <ExternalLink size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
                {tenants.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No tenants registered yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
