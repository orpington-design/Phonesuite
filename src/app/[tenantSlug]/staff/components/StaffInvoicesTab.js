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
          <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
            {invT.title}
          </h2>
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>
            {invT.subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenNewInvoice}
          style={{
            backgroundColor: '#059669',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '0.6rem 0.9rem',
            fontSize: '0.8rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
          }}
        >
          <Plus size={16} />
          {invT.btnNewInvoice}
        </button>
      </div>

      {/* KPI Financial Overview Tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
        
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
            {invT.totalCollected}
          </div>
          <div style={{ fontSize: '1rem', fontWeight: '900', color: '#059669', marginTop: '2px' }}>
            £{totalCollected.toFixed(2)}
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
            {invT.totalPending}
          </div>
          <div style={{ fontSize: '1rem', fontWeight: '900', color: '#d97706', marginTop: '2px' }}>
            £{totalPending.toFixed(2)}
          </div>
        </div>

        <div style={{ backgroundColor: overdueCount > 0 ? '#fff1f2' : '#ffffff', border: overdueCount > 0 ? '1px solid #fecdd3' : '1px solid #e2e8f0', borderRadius: '14px', padding: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: overdueCount > 0 ? '#e11d48' : '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
            {invT.totalOverdue}
          </div>
          <div style={{ fontSize: '1rem', fontWeight: '900', color: overdueCount > 0 ? '#e11d48' : '#64748b', marginTop: '2px' }}>
            £{totalOverdue.toFixed(2)}
          </div>
        </div>

      </div>

      {/* Search Input */}
      <div style={{ position: 'relative' }}>
        <Search size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input
          type="text"
          placeholder={invT.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Filter Tabs Pills */}
      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
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
                padding: '0.45rem 0.8rem',
                borderRadius: '9999px',
                border: isActive ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                backgroundColor: isActive ? '#2563eb' : '#ffffff',
                color: isActive ? '#ffffff' : (tab.highlight && tab.count > 0 ? '#e11d48' : '#475569'),
                fontWeight: isActive ? '800' : '600',
                fontSize: '0.75rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <span>{tab.label}</span>
              <span style={{
                fontSize: '0.65rem',
                padding: '1px 5px',
                borderRadius: '9999px',
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : '#f1f5f9',
                color: isActive ? '#ffffff' : '#64748b'
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '0.6rem' }}>
                  
                  {/* Print / View Receipt */}
                  <button
                    type="button"
                    onClick={() => onViewReceipt(inv)}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '4px 10px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      color: '#334155',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Printer size={13} />
                    {invT.printReceipt}
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    
                    {/* WhatsApp Reminder (for unpaid/overdue) */}
                    {!isPaid && (
                      <button
                        type="button"
                        onClick={() => handleWhatsAppReminder(inv)}
                        style={{
                          background: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          borderRadius: '8px',
                          padding: '4px 9px',
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          color: '#15803d',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        <MessageSquare size={13} />
                        {invT.remindWhatsApp}
                      </button>
                    )}

                    {/* Mark as Paid */}
                    {!isPaid && (
                      <button
                        type="button"
                        onClick={() => onSettleInvoice(inv.id)}
                        style={{
                          background: '#059669',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '5px 11px',
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          color: '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)'
                        }}
                      >
                        <CheckCircle2 size={13} />
                        {invT.markAsPaid}
                      </button>
                    )}

                    {isPaid && (
                      <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <CheckCircle2 size={14} />
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
