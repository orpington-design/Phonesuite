'use client';

import { ShieldCheck, Users, Settings, Home, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', background: 'var(--bg-surface)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldCheck size={24} style={{ color: 'var(--primary)' }} />
          <h1 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>PhoneSuite Admin</h1>
        </div>
        
        <nav style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text-primary)', textDecoration: 'none', background: 'rgba(255,255,255,0.05)' }}>
            <Home size={18} /> Dashboard
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'not-allowed' }}>
            <Users size={18} /> Tenants (Coming Soon)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'not-allowed' }}>
            <Settings size={18} /> Settings
          </div>
        </nav>

        <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid var(--border-color)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--accent-danger)', textDecoration: 'none' }}>
            <LogOut size={18} /> Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
