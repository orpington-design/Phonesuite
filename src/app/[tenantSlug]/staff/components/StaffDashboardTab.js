'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  Wrench, 
  Receipt, 
  ShoppingCart, 
  UserPlus, 
  PackagePlus, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Phone, 
  MessageSquare, 
  ArrowUpRight,
  Sparkles,
  Smartphone,
  Tablet,
  Laptop,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useStaffLanguage } from '../context/StaffLanguageContext';

export default function StaffDashboardTab({
  tenant,
  branch,
  repairs = [],
  invoices = [],
  customers = [],
  onUpdateRepairStatus,
  onOpenNewRepair,
  onOpenNewInvoice,
  onOpenNewCustomer,
  onOpenNewProduct,
  setActiveTab,
  onSettleInvoice
}) {
  const { t } = useStaffLanguage();
  const d = t.dashboard;

  // Filter Overdue Invoices
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');
  const totalOverdueAmount = overdueInvoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

  // Today's paid sales calculation
  const todayInvoices = invoices.filter(inv => inv.status === 'paid');
  const todaySalesTotal = todayInvoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

  // Active repair tickets count
  const activeRepairs = repairs.filter(r => r.status !== 'picked_up' && r.status !== 'cancelled');
  const readyRepairsCount = repairs.filter(r => r.status === 'ready').length;

  const getStatusStepIndex = (status) => {
    const steps = ['received', 'diagnosing', 'repairing', 'ready', 'picked_up'];
    const idx = steps.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  const getNextStatus = (curr) => {
    const sequence = ['received', 'diagnosing', 'repairing', 'ready', 'picked_up'];
    const idx = sequence.indexOf(curr);
    if (idx >= 0 && idx < sequence.length - 1) {
      return sequence[idx + 1];
    }
    return curr;
  };

  const handleSendWhatsAppReminder = (inv) => {
    const text = encodeURIComponent(
      `Hello ${inv.customer_name}, this is ${tenant?.name || 'PhoneSuite'} store. A friendly reminder regarding invoice #${inv.invoice_number} for £${Number(inv.amount).toFixed(2)} due on ${inv.due_date}. You can settle it anytime online or at our branch. Thank you!`
    );
    window.open(`https://wa.me/${inv.customer_phone?.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>

      {/* 1. Header Profile & Status Pill */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #0A1128 0%, #1e293b 100%)',
          borderRadius: '20px',
          padding: '1.25rem',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 25px rgba(10, 17, 40, 0.25)'
        }}
      >
        <div style={{ position: 'absolute', top: -30, right: -30, width: '130px', height: '130px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%)', borderRadius: '50%' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div 
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '900',
                fontSize: '1.1rem',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.35)'
              }}
            >
              PS
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
                  {tenant?.name || 'PhoneSuite Operations'}
                </h2>
                <span style={{ fontSize: '0.62rem', padding: '2px 6px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', borderRadius: '6px', fontWeight: '700', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  LIVE
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                {branch?.name || 'London Central Branch'} &bull; {d.staffRole}
              </p>
            </div>
          </div>
        </div>

        {/* Mini quick summary bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.75rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase' }}>{d.kpiTodaySales}</div>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: '#38bdf8' }}>£{todaySalesTotal.toFixed(2)}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase' }}>{d.kpiActiveRepairs}</div>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: '#10b981' }}>{activeRepairs.length}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase' }}>{d.kpiOverdueInvoices}</div>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: overdueInvoices.length > 0 ? '#f87171' : '#10b981' }}>
              {overdueInvoices.length}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Operational Actions Bar (Horizontal Scroll / Grid) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {d.quickActions}
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
          
          {/* Action 1: New Sale (POS) */}
          <button
            type="button"
            onClick={() => setActiveTab('sale')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.65rem 0.3rem',
              borderRadius: '14px',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#2563eb',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px', boxShadow: '0 3px 8px rgba(59, 130, 246, 0.3)' }}>
              <ShoppingCart size={18} />
            </div>
            <span style={{ fontSize: '0.66rem', fontWeight: '800', textAlign: 'center', lineHeight: 1.1 }}>
              POS Sale
            </span>
          </button>

          {/* Action 2: New Repair Job */}
          <button
            type="button"
            onClick={onOpenNewRepair}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.65rem 0.3rem',
              borderRadius: '14px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#15803d',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px', boxShadow: '0 3px 8px rgba(16, 185, 129, 0.3)' }}>
              <Wrench size={18} />
            </div>
            <span style={{ fontSize: '0.66rem', fontWeight: '800', textAlign: 'center', lineHeight: 1.1 }}>
              New Repair
            </span>
          </button>

          {/* Action 3: Create Invoice */}
          <button
            type="button"
            onClick={onOpenNewInvoice}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.65rem 0.3rem',
              borderRadius: '14px',
              backgroundColor: '#faf5ff',
              border: '1px solid #e9d5ff',
              color: '#7e22ce',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#8b5cf6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px', boxShadow: '0 3px 8px rgba(139, 92, 246, 0.3)' }}>
              <Receipt size={18} />
            </div>
            <span style={{ fontSize: '0.66rem', fontWeight: '800', textAlign: 'center', lineHeight: 1.1 }}>
              Invoice
            </span>
          </button>

          {/* Action 4: Add Customer */}
          <button
            type="button"
            onClick={onOpenNewCustomer}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.65rem 0.3rem',
              borderRadius: '14px',
              backgroundColor: '#fff7ed',
              border: '1px solid #fed7aa',
              color: '#c2410c',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#f97316', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px', boxShadow: '0 3px 8px rgba(249, 115, 22, 0.3)' }}>
              <UserPlus size={18} />
            </div>
            <span style={{ fontSize: '0.66rem', fontWeight: '800', textAlign: 'center', lineHeight: 1.1 }}>
              + Customer
            </span>
          </button>

          {/* Action 5: Add Product */}
          <button
            type="button"
            onClick={onOpenNewProduct}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.65rem 0.3rem',
              borderRadius: '14px',
              backgroundColor: '#fdf4ff',
              border: '1px solid #f5d0fe',
              color: '#a21caf',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#d946ef', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px', boxShadow: '0 3px 8px rgba(217, 70, 239, 0.3)' }}>
              <PackagePlus size={18} />
            </div>
            <span style={{ fontSize: '0.66rem', fontWeight: '800', textAlign: 'center', lineHeight: 1.1 }}>
              + Product
            </span>
          </button>

        </div>
      </div>

      {/* 3. Overdue Invoices Admin Card (Prominent Alert) */}
      {overdueInvoices.length > 0 && (
        <div
          style={{
            backgroundColor: '#fff1f2',
            border: '1.5px solid #fecdd3',
            borderRadius: '18px',
            padding: '1.15rem',
            position: 'relative',
            boxShadow: '0 4px 15px rgba(225, 29, 72, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#e11d48', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#9f1239', margin: 0 }}>
                  {d.overdueAlertTitle}
                </h4>
                <span style={{ fontSize: '0.72rem', color: '#be123c' }}>
                  £{totalOverdueAmount.toFixed(2)} {d.overdueAlertDesc} {overdueInvoices.length} {d.accounts}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('invoices')}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #fecdd3',
                color: '#e11d48',
                borderRadius: '8px',
                padding: '4px 8px',
                fontSize: '0.7rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {d.viewAllOverdue} &rarr;
            </button>
          </div>

          {/* Overdue Accounts List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {overdueInvoices.slice(0, 2).map((inv) => (
              <div
                key={inv.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid #ffe4e6'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontWeight: '800', fontSize: '0.82rem', color: '#0f172a' }}>
                      {inv.customer_name}
                    </span>
                    <span style={{ fontSize: '0.62rem', backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1px 5px', borderRadius: '4px', fontWeight: '800' }}>
                      OVERDUE
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {inv.invoice_number} &bull; Due: {inv.due_date}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: '800', fontSize: '0.92rem', color: '#e11d48' }}>
                    £{Number(inv.amount).toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSendWhatsAppReminder(inv)}
                    title="Send WhatsApp Reminder"
                    style={{
                      backgroundColor: '#22c55e',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '5px 8px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <MessageSquare size={13} />
                    WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Live Electronics Repair Tracker Stepper */}
      <div 
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '20px',
          padding: '1.15rem',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wrench size={18} color="#2563eb" />
            <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              {d.liveRepairJobs} ({activeRepairs.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={onOpenNewRepair}
            style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              color: '#2563eb',
              background: '#eff6ff',
              border: 'none',
              borderRadius: '8px',
              padding: '4px 10px',
              cursor: 'pointer'
            }}
          >
            + New Ticket
          </button>
        </div>

        {activeRepairs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0', color: '#64748b' }}>
            <Wrench size={28} style={{ opacity: 0.3, margin: '0 auto 0.5rem auto' }} />
            <p style={{ fontSize: '0.82rem', margin: 0 }}>{d.noActiveRepairs}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {activeRepairs.map((repair) => {
              const currentIdx = getStatusStepIndex(repair.status);
              const nextStatus = getNextStatus(repair.status);
              const isReady = repair.status === 'ready';

              return (
                <div
                  key={repair.id}
                  style={{
                    border: isReady ? '1.5px solid #10b981' : '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '0.9rem',
                    backgroundColor: isReady ? '#f0fdf4' : '#fafafa',
                    position: 'relative'
                  }}
                >
                  {/* Top line: Device model & Price */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontWeight: '800', fontSize: '0.9rem', color: '#0f172a' }}>
                          {repair.device_model}
                        </span>
                        {isReady && (
                          <span style={{ fontSize: '0.62rem', backgroundColor: '#10b981', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontWeight: '800' }}>
                            READY FOR PICKUP
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        Client: <strong>{repair.customer_name}</strong> &bull; {repair.customer_phone}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a' }}>
                        £{Number(repair.estimated_cost).toFixed(2)}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: '600' }}>
                        Deposit: £{Number(repair.deposit_paid || 0).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Fault snippet */}
                  <p style={{ fontSize: '0.75rem', color: '#475569', margin: '0 0 0.65rem 0', fontStyle: 'italic', lineHeight: 1.3 }}>
                    &ldquo;{repair.issue_description}&rdquo;
                  </p>

                  {/* 5-Step Visual Progression Stepper */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', padding: '0.4rem 0' }}>
                    {[
                      { key: 'received', label: d.stepReceived },
                      { key: 'diagnosing', label: d.stepDiagnosing },
                      { key: 'repairing', label: d.stepRepairing },
                      { key: 'ready', label: d.stepReady },
                      { key: 'picked_up', label: 'Done' }
                    ].map((st, i) => {
                      const isCompleted = i <= currentIdx;
                      const isCurrent = i === currentIdx;

                      return (
                        <div key={st.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
                          
                          {/* Connector Line */}
                          {i > 0 && (
                            <div 
                              style={{
                                position: 'absolute',
                                top: '9px',
                                left: '-50%',
                                width: '100%',
                                height: '2px',
                                backgroundColor: i <= currentIdx ? '#2563eb' : '#e2e8f0',
                                zIndex: 1
                              }}
                            />
                          )}

                          {/* Node Dot */}
                          <div 
                            style={{
                              width: isCurrent ? '20px' : '18px',
                              height: isCurrent ? '20px' : '18px',
                              borderRadius: '50%',
                              backgroundColor: isCompleted ? '#2563eb' : '#ffffff',
                              border: isCompleted ? '2px solid #2563eb' : '2px solid #cbd5e1',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.6rem',
                              fontWeight: '800',
                              zIndex: 2,
                              boxShadow: isCurrent ? '0 0 0 4px rgba(37, 99, 235, 0.2)' : 'none'
                            }}
                          >
                            {isCompleted ? <CheckCircle2 size={12} /> : (i + 1)}
                          </div>

                          <span style={{ fontSize: '0.6rem', color: isCurrent ? '#2563eb' : '#64748b', fontWeight: isCurrent ? '800' : '500', marginTop: '3px', textAlign: 'center' }}>
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Technician & Advance Action */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                      Tech: <strong style={{ color: '#334155' }}>{repair.assigned_technician}</strong>
                    </div>

                    {repair.status !== 'picked_up' && (
                      <button
                        type="button"
                        onClick={() => onUpdateRepairStatus(repair.id, nextStatus)}
                        style={{
                          backgroundColor: '#2563eb',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '4px 10px',
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        Advance &rarr; {nextStatus}
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Recent Sales Stream */}
      <div 
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '20px',
          padding: '1.15rem',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
            {d.recentTransactions}
          </h3>
          <button
            type="button"
            onClick={() => setActiveTab('invoices')}
            style={{
              fontSize: '0.72rem',
              fontWeight: '700',
              color: '#2563eb',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {d.viewAllSales} &rarr;
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {invoices.slice(0, 3).map((inv) => (
            <div
              key={inv.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.5rem',
                borderBottom: '1px solid #f1f5f9'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: inv.status === 'paid' ? '#ecfdf5' : '#fef3c7',
                  color: inv.status === 'paid' ? '#059669' : '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Receipt size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.82rem', color: '#0f172a' }}>
                    {inv.customer_name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    {inv.description?.slice(0, 32)}...
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '800', fontSize: '0.88rem', color: '#0f172a' }}>
                  £{Number(inv.amount).toFixed(2)}
                </div>
                <span style={{
                  fontSize: '0.62rem',
                  fontWeight: '800',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  backgroundColor: inv.status === 'paid' ? '#dcfce7' : (inv.status === 'overdue' ? '#fee2e2' : '#fef3c7'),
                  color: inv.status === 'paid' ? '#15803d' : (inv.status === 'overdue' ? '#b91c1c' : '#b45309')
                }}>
                  {inv.status?.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
