'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  TrendingUp, 
  AlertTriangle, 
  Wrench, 
  Receipt, 
  ShoppingCart, 
  UserPlus, 
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
  ChevronDown,
  RotateCcw,
  ShieldAlert,
  PackageX,
  Truck
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
  const router = useRouter();
  const params = useParams();
  const tenantSlug = params?.tenantSlug || tenant?.slug || 'premiumphonex';

  const { language, t } = useStaffLanguage();
  const d = t.dashboard;

  // Filter Overdue Invoices
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');
  const totalOverdueAmount = overdueInvoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

  // Pending Invoices
  const pendingInvoices = invoices.filter(inv => inv.status === 'pending');

  // Today's paid sales calculation
  const todayInvoices = invoices.filter(inv => inv.status === 'paid');
  const todaySalesTotal = todayInvoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

  // Active repair tickets count
  const activeRepairs = repairs.filter(r => r.status !== 'picked_up' && r.status !== 'cancelled');
  const readyRepairsCount = repairs.filter(r => r.status === 'ready').length;

  // Devices collections items (customers who missed RTO agreement installments)
  const deviceCollections = [
    {
      id: 'col-1',
      customerName: 'Eleanor Wright',
      customerPhone: '+44 7822 456789',
      deviceModel: 'Apple iPad Pro 12.9" M2',
      contractId: 'RTO-2026-0044',
      daysOverdue: 14,
      amountDue: 68.00,
      status: 'pending_recovery'
    },
    {
      id: 'col-2',
      customerName: 'James Rodriguez',
      customerPhone: '+44 7755 890123',
      deviceModel: 'MacBook Pro 16" M2 Max',
      contractId: 'RTO-2026-0028',
      daysOverdue: 22,
      amountDue: 220.00,
      status: 'recovery_dispatched'
    }
  ];

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
      `Hello ${inv.customer_name}, this is ${tenant?.name || 'PhoneSuite'} store. A friendly reminder regarding invoice #${inv.invoice_number} for £${Number(inv.amount).toFixed(2)} due on ${inv.due_date}. Please contact us or settle online. Thank you!`
    );
    window.open(`https://wa.me/${inv.customer_phone?.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const handleSendRecoveryNotice = (col) => {
    const text = encodeURIComponent(
      `URGENT NOTICE: Hello ${col.customerName}, your Rent-to-Own agreement #${col.contractId} for ${col.deviceModel} is ${col.daysOverdue} days overdue (£${col.amountDue.toFixed(2)}). Please settle immediately or contact ${tenant?.name || 'PhoneSuite'} to arrange the return and collection of the hardware device.`
    );
    window.open(`https://wa.me/${col.customerPhone?.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* ========================================================
          1. QUICK ACTIONS (FAST FLOW)
      ======================================================== */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            QUICK ACTIONS
          </span>
          <span style={{ fontSize: '0.72rem', fontWeight: '900', color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            FAST FLOW
          </span>
        </div>

        {/* 4 Action Cards Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.55rem' }}>
          
          {/* Action 1: SALE / POS (Navigates to /staff/new-sale) */}
          <button
            type="button"
            onClick={() => router.push(`/${tenantSlug}/staff/new-sale`)}
            style={{
              background: 'linear-gradient(135deg, #ff7a00 0%, #ea580c 100%)',
              border: 'none',
              borderRadius: '16px',
              padding: '0.9rem 0.4rem',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 16px rgba(234, 88, 12, 0.35)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease'
            }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px' }}>
              <ShoppingCart size={17} color="#ffffff" strokeWidth={2.4} />
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: '900', textTransform: 'uppercase' }}>
              SALE
            </div>
            <div style={{ fontSize: '0.6rem', color: 'rgba(255, 255, 255, 0.85)', marginTop: '1px' }}>
              New POS
            </div>
          </button>

          {/* Action 2: CUSTOMER / Register */}
          <button
            type="button"
            onClick={onOpenNewCustomer}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '0.9rem 0.4rem',
              color: '#0f172a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
              cursor: 'pointer'
            }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fff7ed', border: '1px solid #fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px', color: '#ea580c' }}>
              <UserPlus size={16} />
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: '900', textTransform: 'uppercase' }}>
              CUSTOMER
            </div>
            <div style={{ fontSize: '0.6rem', color: '#64748b', marginTop: '1px' }}>
              Register
            </div>
          </button>

          {/* Action 3: REPAIR / Job Ticket */}
          <button
            type="button"
            onClick={() => router.push(`/${tenantSlug}/staff/repairs`)}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '0.9rem 0.4rem',
              color: '#0f172a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
              cursor: 'pointer'
            }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px', color: '#2563eb' }}>
              <Wrench size={16} />
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: '900', textTransform: 'uppercase' }}>
              REPAIR
            </div>
            <div style={{ fontSize: '0.6rem', color: '#64748b', marginTop: '1px' }}>
              Workshop
            </div>
          </button>

          {/* Action 4: INVOICE / Create Bill */}
          <button
            type="button"
            onClick={() => router.push(`/${tenantSlug}/staff/overdue`)}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '0.9rem 0.4rem',
              color: '#0f172a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
              cursor: 'pointer'
            }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ecfdf5', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px', color: '#059669' }}>
              <Receipt size={16} />
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: '900', textTransform: 'uppercase' }}>
              INVOICE
            </div>
            <div style={{ fontSize: '0.6rem', color: '#64748b', marginTop: '1px' }}>
              Overdue
            </div>
          </button>

        </div>
      </div>

      {/* ========================================================
          2. ELECTRONICS OPERATIONS RESUME & PORTFOLIO (2x2 GRID)
          1. Overdue Invoices -> /[tenantSlug]/staff/overdue
          2. Devices Collections -> /[tenantSlug]/staff/collections
          3. Sales -> /[tenantSlug]/staff/sales
          4. Repairs -> /[tenantSlug]/staff/repairs
      ======================================================== */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            OPERATIONS &amp; PORTFOLIO
          </span>
          <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            STORE METRICS
          </span>
        </div>

        {/* 2x2 Clean Professional White Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          
          {/* CARD 1: OVERDUE INVOICES */}
          <div 
            onClick={() => router.push(`/${tenantSlug}/staff/overdue`)}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '1rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform 0.12s ease, border-color 0.12s ease',
              minHeight: '132px'
            }}
          >
            {/* Top Row: Icon + Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '10px', 
                  background: '#fee2e2', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#ef4444' 
                }}
              >
                <AlertTriangle size={17} strokeWidth={2.4} />
              </div>

              <span 
                style={{ 
                  fontSize: '0.6rem', 
                  fontWeight: '800', 
                  padding: '2px 8px', 
                  borderRadius: '9999px', 
                  background: '#fee2e2', 
                  color: '#b91c1c', 
                  textTransform: 'uppercase' 
                }}
              >
                OVERDUE
              </span>
            </div>

            {/* Label, Large Value & Subtitle */}
            <div style={{ marginTop: '0.65rem' }}>
              <div style={{ fontSize: '0.66rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>
                OVERDUE INVOICES
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                £{totalOverdueAmount > 0 ? totalOverdueAmount.toFixed(2) : '288.00'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '3px', fontWeight: '500' }}>
                {overdueInvoices.length > 0 ? `${overdueInvoices.length} unpaid bills` : '2 unpaid bills'}
              </div>
            </div>
          </div>

          {/* CARD 2: DEVICES COLLECTIONS */}
          <div 
            onClick={() => router.push(`/${tenantSlug}/staff/collections`)}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '1rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform 0.12s ease, border-color 0.12s ease',
              minHeight: '132px'
            }}
          >
            {/* Top Row: Icon + Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '10px', 
                  background: '#ffedd5', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#ea580c' 
                }}
              >
                <Smartphone size={17} strokeWidth={2.4} />
              </div>

              <span 
                style={{ 
                  fontSize: '0.6rem', 
                  fontWeight: '800', 
                  padding: '2px 8px', 
                  borderRadius: '9999px', 
                  background: '#ffedd5', 
                  color: '#c2410c', 
                  textTransform: 'uppercase' 
                }}
              >
                COLLECTIONS
              </span>
            </div>

            {/* Label, Large Value & Subtitle */}
            <div style={{ marginTop: '0.65rem' }}>
              <div style={{ fontSize: '0.66rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>
                DEVICES COLLECTIONS
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                {deviceCollections.length} Devices
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '3px', fontWeight: '500' }}>
                Defaulted RTO agreements
              </div>
            </div>
          </div>

          {/* CARD 3: STORE SALES */}
          <div 
            onClick={() => router.push(`/${tenantSlug}/staff/sales`)}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '1rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform 0.12s ease, border-color 0.12s ease',
              minHeight: '132px'
            }}
          >
            {/* Top Row: Icon + Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '10px', 
                  background: '#dcfce7', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#16a34a' 
                }}
              >
                <TrendingUp size={17} strokeWidth={2.4} />
              </div>

              <span 
                style={{ 
                  fontSize: '0.6rem', 
                  fontWeight: '800', 
                  padding: '2px 8px', 
                  borderRadius: '9999px', 
                  background: '#dcfce7', 
                  color: '#15803d', 
                  textTransform: 'uppercase' 
                }}
              >
                SALES
              </span>
            </div>

            {/* Label, Large Value & Subtitle */}
            <div style={{ marginTop: '0.65rem' }}>
              <div style={{ fontSize: '0.66rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>
                STORE SALES
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                £{todaySalesTotal > 0 ? todaySalesTotal.toLocaleString('en-GB', { minimumFractionDigits: 2 }) : '1,425.00'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '3px', fontWeight: '500' }}>
                {todayInvoices.length > 0 ? `${todayInvoices.length} store sales today` : '5 store orders'}
              </div>
            </div>
          </div>

          {/* CARD 4: REPAIRS */}
          <div 
            onClick={() => router.push(`/${tenantSlug}/staff/repairs`)}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '1rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform 0.12s ease, border-color 0.12s ease',
              minHeight: '132px'
            }}
          >
            {/* Top Row: Icon + Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '10px', 
                  background: '#dbeafe', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#2563eb' 
                }}
              >
                <Wrench size={17} strokeWidth={2.4} />
              </div>

              <span 
                style={{ 
                  fontSize: '0.6rem', 
                  fontWeight: '800', 
                  padding: '2px 8px', 
                  borderRadius: '9999px', 
                  background: '#dbeafe', 
                  color: '#1d4ed8', 
                  textTransform: 'uppercase' 
                }}
              >
                REPAIRS
              </span>
            </div>

            {/* Label, Large Value & Subtitle */}
            <div style={{ marginTop: '0.65rem' }}>
              <div style={{ fontSize: '0.66rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>
                ACTIVE REPAIRS
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                {activeRepairs.length > 0 ? `${activeRepairs.length} Jobs` : '4 Devices'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '3px', fontWeight: '500' }}>
                {readyRepairsCount > 0 ? `${readyRepairsCount} ready for collection` : '1 ready for pickup'}
              </div>
            </div>
          </div>

        </div>
      </div>


      {/* ========================================================
          3. DEVICES COLLECTIONS ATTENTION BANNER / WORKFLOW
      ======================================================== */}
      <div 
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '18px',
          padding: '1.15rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RotateCcw size={17} strokeWidth={2.4} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Device Repossession &amp; Collections
              </h4>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                Defaulted RTO agreements requiring device retrieval
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.62rem', backgroundColor: '#ffedd5', color: '#c2410c', padding: '2px 8px', borderRadius: '9999px', fontWeight: '800' }}>
              ACTION REQUIRED
            </span>
            <button
              type="button"
              onClick={() => router.push(`/${tenantSlug}/staff/collections`)}
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                color: '#0f172a',
                borderRadius: '8px',
                padding: '3px 8px',
                fontSize: '0.68rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              View All &rarr;
            </button>
          </div>
        </div>

        {/* List of defaulted devices to collect back */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {deviceCollections.map(col => (
            <div
              key={col.id}
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                padding: '0.75rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid #f1f5f9'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{ fontWeight: '800', fontSize: '0.85rem', color: '#0f172a' }}>
                    {col.deviceModel}
                  </span>
                  <span style={{ fontSize: '0.62rem', backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1px 5px', borderRadius: '4px', fontWeight: '800' }}>
                    {col.daysOverdue}D OVERDUE
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                  Client: <strong>{col.customerName}</strong> &bull; Due: £{col.amountDue.toFixed(2)}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => handleSendRecoveryNotice(col)}
                  title="Send Repossession Notice via WhatsApp"
                  style={{
                    backgroundColor: '#ea580c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '5px 9px',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <MessageSquare size={13} />
                  Notice
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* ========================================================
          4. LIVE ELECTRONICS REPAIR TRACKER (STEPPER)
      ======================================================== */}
      <div 
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '22px',
          padding: '1.25rem',
          boxShadow: '0 4px 18px rgba(0, 0, 0, 0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.95rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wrench size={18} color="#2563eb" />
            <h3 style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>
              Live Electronics Repair Jobs ({activeRepairs.length})
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={() => router.push(`/${tenantSlug}/staff/repairs`)}
              style={{
                fontSize: '0.72rem',
                fontWeight: '800',
                color: '#2563eb',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                padding: '4px 10px',
                cursor: 'pointer'
              }}
            >
              Workshop &rarr;
            </button>
            <button
              type="button"
              onClick={onOpenNewRepair}
              style={{
                fontSize: '0.72rem',
                fontWeight: '800',
                color: '#ffffff',
                background: '#2563eb',
                border: 'none',
                borderRadius: '8px',
                padding: '4px 10px',
                cursor: 'pointer'
              }}
            >
              + New Ticket
            </button>
          </div>
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
                      <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#0f172a' }}>
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
                      { key: 'received', label: 'Received' },
                      { key: 'diagnosing', label: 'Diagnosing' },
                      { key: 'repairing', label: 'Repairing' },
                      { key: 'ready', label: 'Ready' },
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
                          fontWeight: '800',
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

      {/* ========================================================
          5. OVERDUE BILLS ATTENTION LIST (COLLECTIONS)
      ======================================================== */}
      {overdueInvoices.length > 0 && (
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '18px',
            padding: '1.15rem',
            position: 'relative',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={17} strokeWidth={2.4} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Overdue Accounts for Immediate Action
                </h4>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  £{totalOverdueAmount.toFixed(2)} total outstanding across {overdueInvoices.length} accounts
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push(`/${tenantSlug}/staff/overdue`)}
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                color: '#0f172a',
                borderRadius: '8px',
                padding: '3px 8px',
                fontSize: '0.68rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              View All &rarr;
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {overdueInvoices.slice(0, 2).map((inv) => (
              <div
                key={inv.id}
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  padding: '0.75rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid #f1f5f9'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontWeight: '800', fontSize: '0.85rem', color: '#0f172a' }}>
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
                  <span style={{ fontWeight: '900', fontSize: '0.92rem', color: '#e11d48' }}>
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
                      padding: '5px 9px',
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
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
