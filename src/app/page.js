'use client';

import { Laptop, ShieldCheck, Database, PenTool, LayoutDashboard, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function MarketingLandingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
      
      {/* Navbar */}
      <header style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--primary)' }}>
            <Laptop size={28} />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: '800', background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.03em' }}>
            PhoneSuite
          </span>
        </div>
        
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', transition: 'color 0.2s ease' }} onMouseOver={e => e.target.style.color = 'var(--text-primary)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Features</a>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/customer" style={{ color: '#0284c7', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '600' }}>
              Customer Portal
            </Link>
            <Link href="/login" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>
              Staff Login
            </Link>
            <Link href="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.95rem' }}>
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main style={{ flex: 1 }}>
        
        {/* Hero Section */}
        <section style={{ padding: '8rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          {/* Background Glows */}
          <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }}></div>
          
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1.5rem', border: '1px solid rgba(59,130,246,0.2)' }}>
              <Sparkles size={16} /> The Operating System for Repair Shops
            </div>
            
            <h1 style={{ fontSize: '4.5rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
              Run your electronics business <br/>
              <span style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-emerald) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>with absolute precision.</span>
            </h1>
            
            <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
              PhoneSuite is the enterprise-grade CRM, POS, and repair management platform designed exclusively for UK electronics retailers. Seamlessly manage inventory, staff, and customer contracts in one secure hub.
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <Link href="/register" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
                Start Your Free Trial <ChevronRight size={20} />
              </Link>
              <Link href="/login" className="btn btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem', border: '1px solid var(--border-color)' }}>
                Sign In to Workspace
              </Link>
            </div>
            
            <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)' }} /> UK Regulatory Compliant</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)' }} /> Military-Grade Security</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)' }} /> 99.9% Uptime SLA</div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" style={{ padding: '5rem 2rem', background: 'var(--bg-surface-solid)', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Everything you need to scale</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Replace disconnected tools with a single unified platform engineered for high-volume retailers.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              
              <div className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                  <LayoutDashboard size={28} />
                </div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>Advanced POS & CRM</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Process sales, track commissions, and manage customer relationships effortlessly across multiple branch locations.</p>
              </div>

              <div className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)', marginBottom: '1.5rem' }}>
                  <ShieldCheck size={28} />
                </div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>Repair Tracking</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Track devices from intake to return. Real-time updates, cost estimation, and technician assignments all in one place.</p>
              </div>

              <div className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-amber)', marginBottom: '1.5rem' }}>
                  <PenTool size={28} />
                </div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>Secure E-Signatures</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Fully compliant Rent-to-Own agreement flow. Customers verify DOB and sign digitally via email or in the portal.</p>
              </div>

              <div className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.1)', color: 'var(--accent-purple)', marginBottom: '1.5rem' }}>
                  <Database size={28} />
                </div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>Multi-Tenant Isolation</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Your data is 100% isolated and protected by Row-Level Security. Complete peace of mind for your business operations.</p>
              </div>
              
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section style={{ padding: '6rem 2rem', textAlign: 'center', background: 'linear-gradient(180deg, var(--bg-surface-solid) 0%, var(--bg-base) 100%)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '4rem 2rem', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Ready to transform your shop?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>Join the next generation of electronics retailers using PhoneSuite.</p>
            <Link href="/register" className="btn btn-primary" style={{ padding: '0.85rem 2.5rem', fontSize: '1.05rem' }}>
              Create Your Workspace
            </Link>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer style={{ padding: '2rem', borderTop: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>&copy; 2026 PhoneSuite.uk. All rights reserved.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem' }}>
          <Link href="/customer" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Customer Portal</Link>
          <Link href="/admin" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Admin Portal</Link>
        </div>
      </footer>
    </div>
  );
}
