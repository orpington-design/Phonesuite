'use client';

import { useState } from 'react';
import { 
  Receipt, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Printer, 
  MessageSquare, 
  FileText,
  Filter
} from 'lucide-react';
import { useStaffLanguage } from '../context/StaffLanguageContext';

export default function StaffInvoicesTab({
  invoices = [],
  onOpenNewInvoice,
  onSettleInvoice,
  onViewReceipt,
  tenant
}) {
  const { t } = useStaffLanguage();
  const invT = t.invoices;

  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'overdue', 'pending', 'paid', 'rto'
  const [searchQuery, setSearchQuery] = useState('');

  // Calculations
  const totalCollected = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + Number(i.amount || 0), 0);

  const totalPending = invoices
    .filter(i => i.status === 'pending')
    .reduce((sum, i) => sum + Number(i.amount || 0), 0);

  const totalOverdue = invoices
    .filter(i => i.status === 'overdue')
    .reduce((sum, i) => sum + Number(i.amount || 0), 0);

  const overdueCount = invoices.filter(i => i.status === 'overdue').length;

  // Filtered invoices
  const filteredInvoices = invoices.filter(inv => {
    // Filter matching
    if (activeFilter === 'overdue' && inv.status !== 'overdue') return false;
    if (activeFilter === 'pending' && inv.status !== 'pending') return false;
    if (activeFilter === 'paid' && inv.status !== 'paid') return false;
    if (activeFilter === 'rto' && !inv.type?.toLowerCase().includes('rto')) return false;

    // Search matching
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = inv.customer_name?.toLowerCase().includes(q);
      const matchNum = inv.invoice_number?.toLowerCase().includes(q);
      const matchDesc = inv.description?.toLowerCase().includes(q);
      return matchName || matchNum || matchDesc;
    }
    return true;
  });

  const handleWhatsAppReminder = (inv) => {
    const text = encodeURIComponent(
      `Hello ${inv.customer_name}, this is ${tenant?.name || 'PhoneSuite'} store. A friendly reminder regarding invoice #${inv.invoice_number} for £${Number(inv.amount).toFixed(2)} due on ${inv.due_date}. Please contact us or settle online. Thank you!`
    );
    window.open(`https://wa.me/${inv.customer_phone?.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Top Banner & Create Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            {invT.title}
          </h2>
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '3px 0 0 0', fontWeight: '500' }}>
            {invT.subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenNewInvoice}
          style={{
            background: 'linear-gradient(135deg, #ff7a00 0%, #ea580c 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '0.62rem 0.95rem',
            fontSize: '0.8rem',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)',
            letterSpacing: '0.01em'
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
          {invT.btnNewInvoice}
        </button>
      </div>

      {/* KPI Financial Overview Tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
        
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '0.85rem 0.65rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {invT.totalCollected}
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: '900', color: '#10b981', marginTop: '4px', letterSpacing: '-0.02em' }}>
            £{totalCollected.toFixed(2)}
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '0.85rem 0.65rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {invT.totalPending}
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: '900', color: '#d97706', marginTop: '4px', letterSpacing: '-0.02em' }}>
            £{totalPending.toFixed(2)}
          </div>
        </div>

        <div style={{ backgroundColor: overdueCount > 0 ? '#fff1f2' : '#ffffff', border: overdueCount > 0 ? '1.5px solid #fecdd3' : '1px solid #e2e8f0', borderRadius: '16px', padding: '0.85rem 0.65rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.62rem', color: overdueCount > 0 ? '#e11d48' : '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {invT.totalOverdue}
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: '900', color: overdueCount > 0 ? '#e11d48' : '#64748b', marginTop: '4px', letterSpacing: '-0.02em' }}>
            £{totalOverdue.toFixed(2)}
          </div>
        </div>

      </div>

      {/* Search Input */}
      <div style={{ position: 'relative' }}>
        <Search size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input
          type="text"
          placeholder={invT.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.72rem 1rem 0.72rem 2.5rem',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            fontSize: '0.82rem',
            color: '#0f172a',
            outline: 'none',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
        />
      </div>

      {/* Filter Tabs Pills (Apple Segmented Control Style) */}
      <div style={{ display: 'flex', gap: '0.45rem', overflowX: 'auto', paddingBottom: '0.25rem', scrollbarWidth: 'none' }}>
        {[
          { key: 'all', label: invT.tabAll, count: invoices.length },
          { key: 'overdue', label: invT.tabOverdue, count: overdueCount, highlight: true },
          { key: 'pending', label: invT.tabPending, count: invoices.filter(i => i.status === 'pending').length },
          { key: 'paid', label: invT.tabPaid, count: invoices.filter(i => i.status === 'paid').length },
          { key: 'rto', label: invT.tabRto, count: invoices.filter(i => i.type?.toLowerCase().includes('rto')).length }
        ].map(tab => {
          const isActive = activeFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter(tab.key)}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: '12px',
                border: isActive ? '1px solid #0f172a' : '1px solid #e2e8f0',
                backgroundColor: isActive ? '#0f172a' : '#ffffff',
                color: isActive ? '#ffffff' : (tab.highlight && tab.count > 0 ? '#e11d48' : '#64748b'),
                fontWeight: isActive ? '800' : '600',
                fontSize: '0.76rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: isActive ? '0 4px 12px rgba(15, 23, 42, 0.2)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{tab.label}</span>
              <span style={{
                fontSize: '0.65rem',
                padding: '1.5px 6px',
                borderRadius: '6px',
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : (tab.highlight && tab.count > 0 ? '#fee2e2' : '#f1f5f9'),
                color: isActive ? '#ffffff' : (tab.highlight && tab.count > 0 ? '#e11d48' : '#64748b'),
                fontWeight: '800'
              }}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2.5rem 1rem', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#64748b' }}>
          <Receipt size={32} style={{ opacity: 0.3, margin: '0 auto 0.5rem auto' }} />
          <p style={{ fontSize: '0.85rem', margin: 0, fontWeight: '600' }}>{invT.noInvoicesFound}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredInvoices.map((inv) => {
            const isOverdue = inv.status === 'overdue';
            const isPaid = inv.status === 'paid';
            const isPending = inv.status === 'pending';

            return (
              <div
                key={inv.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: isOverdue ? '1.5px solid #fecdd3' : '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '1rem',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem'
                }}
              >
                {/* Header: Customer name & Amount */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ fontWeight: '800', fontSize: '0.92rem', color: '#0f172a' }}>
                        {inv.customer_name}
                      </span>
                      <span style={{
                        fontSize: '0.62rem',
                        fontWeight: '800',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: isPaid ? '#dcfce7' : (isOverdue ? '#fee2e2' : '#fef3c7'),
                        color: isPaid ? '#15803d' : (isOverdue ? '#b91c1c' : '#b45309')
                      }}>
                        {isPaid ? invT.paidBadge : (isOverdue ? invT.overdueBadge : invT.pendingBadge)}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                      {inv.invoice_number} &bull; {inv.type}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: '900', color: isOverdue ? '#e11d48' : '#0f172a' }}>
                      £{Number(inv.amount).toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: isOverdue ? '#e11d48' : '#64748b' }}>
                      {invT.dueDate}: <strong>{inv.due_date}</strong>
                    </div>
                  </div>
                </div>

                {/* Description snippet */}
                <p style={{ fontSize: '0.78rem', color: '#475569', margin: 0 }}>
                  {inv.description}
                </p>

                {/* Actions bottom strip */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', marginTop: '0.2rem' }}>
                  
                  {/* Print / View Receipt */}
                  <button
                    type="button"
                    onClick={() => onViewReceipt(inv)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '6px 11px',
                      fontSize: '0.74rem',
                      fontWeight: '700',
                      color: '#0f172a',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                    }}
                  >
                    <Printer size={13} strokeWidth={2.2} />
                    {invT.printReceipt}
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    
                    {/* WhatsApp Reminder (for unpaid/overdue) */}
                    {!isPaid && (
                      <button
                        type="button"
                        onClick={() => handleWhatsAppReminder(inv)}
                        style={{
                          background: 'rgba(16, 185, 129, 0.08)',
                          border: '1px solid rgba(16, 185, 129, 0.25)',
                          borderRadius: '10px',
                          padding: '6px 10px',
                          fontSize: '0.74rem',
                          fontWeight: '700',
                          color: '#059669',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <MessageSquare size={13} strokeWidth={2.2} />
                        {invT.remindWhatsApp}
                      </button>
                    )}

                    {/* Mark as Paid */}
                    {!isPaid && (
                      <button
                        type="button"
                        onClick={() => onSettleInvoice(inv.id)}
                        style={{
                          background: '#0f172a',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '6px 12px',
                          fontSize: '0.74rem',
                          fontWeight: '800',
                          color: '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.18)'
                        }}
                      >
                        <CheckCircle2 size={13} strokeWidth={2.4} />
                        {invT.markAsPaid}
                      </button>
                    )}

                    {isPaid && (
                      <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '8px', background: '#ecfdf5' }}>
                        <CheckCircle2 size={14} strokeWidth={2.4} />
                        Settled
                      </span>
                    )}

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
