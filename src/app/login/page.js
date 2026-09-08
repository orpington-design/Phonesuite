'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../utils/supabase/client';
import { Laptop, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const executeLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoggingIn(true);
    setErrorMsg('');
    
    const supabase = createClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (authError) {
      setErrorMsg(authError.message);
      setIsLoggingIn(false);
      return;
    }

    if (authData?.user) {
      // Find the profile to get the tenant_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id, role')
        .eq('id', authData.user.id)
        .single();
        
      if (profile) {
        // If they are a customer trying to log into the staff portal
        if (profile.role === 'customer') {
          await supabase.auth.signOut();
          setErrorMsg('This portal is for staff only. Please use the customer portal.');
          setIsLoggingIn(false);
          return;
        }

        // Get tenant slug
        const { data: tenant } = await supabase
          .from('tenants')
          .select('slug')
          .eq('id', profile.tenant_id)
          .single();
          
        if (tenant) {
          router.push(`/${tenant.slug}/dashboard`);
          return;
        }
      }
      
      // Fallback if no specific tenant found
      setErrorMsg('No assigned shop found for this account.');
      await supabase.auth.signOut();
    }
    
    setIsLoggingIn(false);
  };

  return (
    <div className="portal-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Link href="/" style={{ position: 'absolute', top: '2rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
        <ArrowLeft size={18} /> Back to Home
      </Link>
      
      <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '50%', background: 'var(--primary-glow)', border: '1px solid var(--border-color)', marginBottom: '1rem', color: 'var(--accent-cyan)' }}>
            <Laptop size={28} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>Staff Login</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sign in to your PhoneSuite workspace</p>
        </div>

        {errorMsg && (
          <div style={{ padding: '0.75rem', background: 'rgba(238, 93, 80, 0.1)', color: 'var(--accent-rose)', borderLeft: '4px solid var(--accent-rose)', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={executeLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="input-field" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={isLoggingIn}>
            {isLoggingIn ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Don't have a shop account? <Link href="/register" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Register here</Link>
        </div>
      </div>
    </div>
  );
}
