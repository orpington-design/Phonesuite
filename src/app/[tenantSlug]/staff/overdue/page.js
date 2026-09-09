'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  AlertTriangle, 
  Receipt, 
  MessageSquare, 
  Phone, 
  CheckCircle2, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  ExternalLink,
  Smartphone
} from 'lucide-react';
import { INITIAL_STAFF_INVOICES } from '../data/staffData';

export default function OverdueInvoicesPage() {
  const router = useRouter();
  const params = useParams();
  const tenantSlug = params.tenantSlug || 'premiumphonex';

  const [invoices, setInvoices] = useState(INITIAL_STAFF_INVOICES);
  const [search, setSearch] = useState('');

  const overdueList = invoices.filter(inv => inv.status === 'overdue');
  const totalOverdue = overdueList.reduce((sum, i) => sum + Number(i.amount || 0), 0);

  const filtered = overdueList.filter(inv => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return inv.customer_name?.toLowerCase().includes(q) ||
           inv.invoice_number?.toLowerCase().includes(q) ||
           inv.description?.toLowerCase().includes(q);
  });

  const handleSettle = (id) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'paid', paid_at: new Date().toISOString() } : inv));
  };

  const handleWhatsAppReminder = (inv) => {
    const text = encodeURIComponent(
      `Hello ${inv.customer_name}, this is PhoneSuite UK. Friendly reminder that invoice #${inv.invoice_number} for £${Number(inv.amount).toFixed(2)} is overdue (due date was ${inv.due_date}). Please contact us or settle your account. Thank you!`
    );
    window.open(`https://wa.me/${inv.customer_phone?.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="mobile-portal-wrapper">
      <div className="mobile-app-shell">
        
        {/* Top Header */}
        <header className="mobile-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            type="button"
            onClick={() => router.push(`/${tenantSlug}/staff`)}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '10px',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#0f172a',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>

          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '0.95rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>
              Overdue Invoices
            </h1>
            <span style={{ fontSize: '0.65rem', color: '#e11d48', fontWeight: '700' }}>
              Immediate Collection
            </span>
          </div>

          <button
            type="button"
            onClick={() => router.push(`/${tenantSlug}/staff?tab=invoices`)}
            style={{
              background: '#e11d48',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '6px 10px',
              fontSize: '0.74rem',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(225, 29, 72, 0.3)'
            }}
          >
            All Invoices
          </button>
        </header>

        {/* Scrollable Content */}
        <main className="mobile-scroll-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Total Debt Hero Card */}
          <div 
            style={{
              background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
              border: '1.5px solid #fecdd3',
              borderRadius: '20px',
              padding: '1.25rem',
              boxShadow: '0 8px 24px -4px rgba(225, 29, 72, 0.12)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#9f1239', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                TOTAL OVERDUE BALANCE
              </span>
              <span style={{ fontSize: '0.62rem', background: '#e11d48', color: '#fff', padding: '2px 8px', borderRadius: '9999px', fontWeight: '800' }}>
                ACTION REQUIRED
              </span>
            </div>

            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#9f1239', letterSpacing: '-0.03em', lineHeight: 1 }}>
              £{totalOverdue.toFixed(2)}
            </div>
            
            <div style={{ fontSize: '0.75rem', color: '#be123c', marginTop: '6px', fontWeight: '600' }}>
              {overdueList.length} customer accounts with past-due payment schedules
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by customer, invoice #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.3rem',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                fontSize: '0.82rem',
                color: '#0f172a'
              }}
            />
          </div>

          {/* Invoices List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                <CheckCircle2 size={32} color="#10b981" style={{ margin: '0 auto 0.5rem auto' }} />
                <p style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a' }}>No Overdue Invoices</p>
                <p style={{ fontSize: '0.75rem' }}>All accounts are currently up to date.</p>
              </div>
            ) : (
              filtered.map((inv) => (
                <div
                  key={inv.id}
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #fecdd3',
                    borderRadius: '18px',
                    padding: '1.1rem',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontWeight: '900', fontSize: '0.95rem', color: '#0f172a' }}>
                          {inv.customer_name}
                        </span>
                        <span style={{ fontSize: '0.6rem', padding: '2px 6px', background: '#fee2e2', color: '#b91c1c', borderRadius: '4px', fontWeight: '800' }}>
                          OVERDUE
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                        {inv.invoice_number} &bull; {inv.type}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#e11d48' }}>
                        £{Number(inv.amount).toFixed(2)}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#be123c', fontWeight: '700' }}>
                        Due: {inv.due_date}
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: '#475569', margin: 0, lineHeight: 1.3 }}>
                    {inv.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '0.6rem', marginTop: '0.2rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Phone: <strong style={{ color: '#0f172a' }}>{inv.customer_phone}</strong>
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={() => handleWhatsAppReminder(inv)}
                        style={{
                          background: '#22c55e',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <MessageSquare size={13} />
                        WhatsApp
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSettle(inv.id)}
                        style={{
                          background: '#059669',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <CheckCircle2 size={13} />
                        Mark Paid
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
