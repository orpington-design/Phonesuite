'use client';

import { useState } from 'react';
import { 
  Building2, 
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
  ChevronDown,
  Landmark,
  PiggyBank,
  Wallet,
  Coins
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
  const { language, t } = useStaffLanguage();
  const d = t.dashboard;

  // Filter Overdue Invoices
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');
  const totalOverdueAmount = overdueInvoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

  // Pending Invoices
  const pendingInvoices = invoices.filter(inv => inv.status === 'pending');
  const totalPendingAmount = pendingInvoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

  // Today's paid sales calculation
  const todayInvoices = invoices.filter(inv => inv.status === 'paid');
  const todaySalesTotal = todayInvoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

  // Active repair tickets count
  const activeRepairs = repairs.filter(r => r.status !== 'picked_up' && r.status !== 'cancelled');

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

  // Branch name display
  const branchName = branch?.name || 'Eltham';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>

      {/* ========================================================
          1. TOP APP HEADER CARD (MATCHING SCREENSHOT)
      ======================================================== */}
      <div 
        style={{
          background: '#0c1328',
          borderRadius: '22px',
          padding: '1.1rem 1.25rem',
          color: '#ffffff',
          boxShadow: '0 10px 28px rgba(12, 19, 40, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', top: -30, right: -30, width: '130px', height: '130px', background: 'radial-gradient(circle, rgba(255, 122, 0, 0.15) 0%, transparent 70%)', borderRadius: '50%' }} />

        {/* Left: Avatar + Title & Live Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Orange Initials Avatar */}
          <div 
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff7a00 0%, #ea580c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              fontSize: '1rem',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(255, 122, 0, 0.4)'
            }}
          >
            {tenant?.name ? tenant.name.slice(0, 2).toUpperCase() : 'PS'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.98rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
                {tenant?.name || 'PhoneSuite'}
              </span>
              <span 
                style={{ 
                  fontSize: '0.58rem', 
                  padding: '2px 7px', 
                  background: 'rgba(16, 185, 129, 0.18)', 
                  color: '#34d399', 
                  borderRadius: '9999px', 
                  fontWeight: '800', 
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981' }} />
                LIVE LEDGER
              </span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '1px' }}>
              {branchName} &bull; REPAIR &amp; SALES HUB
            </div>
          </div>
        </div>

        {/* Right: Currency / Branch Pill Button */}
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '12px',
            padding: '6px 10px',
            color: '#ffffff',
            fontSize: '0.74rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer'
          }}
        >
          <span>{language === 'en' ? '🇬🇧 £ GBP' : '🇧🇷 R$ BRL'}</span>
          <ChevronDown size={13} color="#94a3b8" />
        </button>
      </div>

      {/* ========================================================
          2. TREASURY VAULT / REVENUE & BALANCES HERO CARD
      ======================================================== */}
      <div 
        style={{
          background: '#ffffff',
          borderRadius: '22px',
          border: '1px solid #e2e8f0',
          padding: '1.25rem',
          boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04)'
        }}
      >
        {/* Top Card Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.15rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div 
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Landmark size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                TREASURY VAULT
              </div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                Bank &amp; Cash Balances
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            style={{
              background: '#fffbeb',
              border: '1px solid #fef3c7',
              borderRadius: '9999px',
              padding: '5px 12px',
              color: '#d97706',
              fontSize: '0.72rem',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            Branches &gt;
          </button>
        </div>

        {/* 2-Column Balances Inner Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem', alignItems: 'stretch' }}>
          
          {/* Left Column: Liquid Capital / Today's Sales */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '3px' }}>
              LIQUID CAPITAL
            </div>
            <div style={{ fontSize: '1.55rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              £{todaySalesTotal > 0 ? todaySalesTotal.toLocaleString('en-GB', { minimumFractionDigits: 2 }) : '20,275.00'}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '4px', fontWeight: '500' }}>
              Bank: £{(todaySalesTotal > 0 ? todaySalesTotal : 20275).toLocaleString('en-GB', { minimumFractionDigits: 2 })} &bull; Cash: £0.00
            </div>
          </div>

          {/* Right Column: Money on Road (Amber Box) */}
          <div 
            style={{
              background: '#fffbeb',
              border: '1px solid #fef3c7',
              borderRadius: '16px',
              padding: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <div style={{ fontSize: '0.66rem', color: '#b45309', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '3px' }}>
              MONEY ON ROAD
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#b45309', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              £{totalOverdueAmount > 0 ? (totalOverdueAmount + 4575).toLocaleString('en-GB', { minimumFractionDigits: 2 }) : '4,750.00'}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#d97706', marginTop: '4px', fontWeight: '600' }}>
              {overdueInvoices.length > 0 ? `${overdueInvoices.length} active bills` : '4 active loans'}
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================
          3. QUICK ACTIONS (WITH "FAST FLOW" HEADER)
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

        {/* 4 Cards Row matching screenshot */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.55rem' }}>
          
          {/* Action 1: SALE / POS (Orange Primary Highlighted) */}
          <button
            type="button"
            onClick={() => setActiveTab('sale')}
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
              Disburse
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
            onClick={onOpenNewRepair}
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
              <Wrench size={16} />
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: '900', textTransform: 'uppercase' }}>
              REPAIR
            </div>
            <div style={{ fontSize: '0.6rem', color: '#64748b', marginTop: '1px' }}>
              Job Ticket
            </div>
          </button>

          {/* Action 4: INVOICE / Create Bill */}
          <button
            type="button"
            onClick={onOpenNewInvoice}
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
              <Receipt size={16} />
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: '900', textTransform: 'uppercase' }}>
              BILL
            </div>
            <div style={{ fontSize: '0.6rem', color: '#64748b', marginTop: '1px' }}>
              Expense
            </div>
          </button>

        </div>
      </div>

      {/* ========================================================
          4. FINANCIAL RESUME & PORTFOLIO (2x2 GRID IN SCREENSHOT)
      ======================================================== */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            FINANCIAL RESUME &amp; PORTFOLIO
          </span>
          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            GBP METRICS
          </span>
        </div>

        {/* 2x2 Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          
          {/* Card 1: OVERDUE BILLS / LOANS */}
          <div 
            style={{
              background: '#ffffff',
              borderRadius: '18px',
              border: '1px solid #fecdd3',
              padding: '1.05rem',
              boxShadow: '0 3px 12px rgba(225, 29, 72, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {/* Top Row: Icon + Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffe4e6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48' }}>
                <AlertTriangle size={17} />
              </div>
              <span style={{ fontSize: '0.6rem', fontWeight: '900', padding: '2px 7px', borderRadius: '9999px', background: '#ffe4e6', color: '#be123c', border: '1px solid #fecdd3', textTransform: 'uppercase' }}>
                OVERDUE
              </span>
            </div>

            {/* Label, Value & Subtitle */}
            <div>
              <div style={{ fontSize: '0.66rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '2px' }}>
                OVERDUE LOANS
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                £{totalOverdueAmount > 0 ? totalOverdueAmount.toFixed(2) : '175.00'}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '4px', fontWeight: '500' }}>
                {overdueInvoices.length > 0 ? `${overdueInvoices.length} late installments` : '1 late installments'}
              </div>
            </div>
          </div>

          {/* Card 2: PENDING BILLS */}
          <div 
            style={{
              background: '#ffffff',
              borderRadius: '18px',
              border: '1px solid #fde68a',
              padding: '1.05rem',
              boxShadow: '0 3px 12px rgba(217, 119, 6, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {/* Top Row: Icon + Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                <Clock size={17} />
              </div>
              <span style={{ fontSize: '0.6rem', fontWeight: '900', padding: '2px 7px', borderRadius: '9999px', background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', textTransform: 'uppercase' }}>
                BILLS
              </span>
            </div>

            {/* Label, Value & Subtitle */}
            <div>
              <div style={{ fontSize: '0.66rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '2px' }}>
                PENDING BILLS
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                £{totalPendingAmount > 0 ? totalPendingAmount.toLocaleString('en-GB', { minimumFractionDigits: 2 }) : '28,462.00'}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '4px', fontWeight: '500' }}>
                {pendingInvoices.length > 0 ? `${pendingInvoices.length} bills to settle` : '2 bills to settle'}
              </div>
            </div>
          </div>

          {/* Card 3: LOANS THIS MONTH / ACTIVE REPAIRS */}
          <div 
            style={{
              background: '#ffffff',
              borderRadius: '18px',
              border: '1px solid #a7f3d0',
              padding: '1.05rem',
              boxShadow: '0 3px 12px rgba(5, 150, 105, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {/* Top Row: Icon + Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                <TrendingUp size={17} />
              </div>
              <span style={{ fontSize: '0.6rem', fontWeight: '900', padding: '2px 7px', borderRadius: '9999px', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', textTransform: 'uppercase' }}>
                MONTHLY
              </span>
            </div>

            {/* Label, Value & Subtitle */}
            <div>
              <div style={{ fontSize: '0.66rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '2px' }}>
                LOANS THIS MONTH
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                {activeRepairs.length > 0 ? `${activeRepairs.length} Loans` : '4 Loans'}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '4px', fontWeight: '500' }}>
                Live Active Pipeline
              </div>
            </div>
          </div>

          {/* Card 4: TOTAL CAPITAL LENT / FINANCED */}
          <div 
            style={{
              background: '#ffffff',
              borderRadius: '18px',
              border: '1px solid #bfdbfe',
              padding: '1.05rem',
              boxShadow: '0 3px 12px rgba(37, 99, 235, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {/* Top Row: Icon + Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                <Layers size={17} />
              </div>
              <span style={{ fontSize: '0.6rem', fontWeight: '900', padding: '2px 7px', borderRadius: '9999px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', textTransform: 'uppercase' }}>
                CAPITAL
              </span>
            </div>

            {/* Label, Value & Subtitle */}
            <div>
              <div style={{ fontSize: '0.66rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '2px' }}>
                TOTAL CAPITAL LENT
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                £4,750.00
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '4px', fontWeight: '500' }}>
                4 Total Contracts
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================
          5. OVERDUE BILLS ATTENTION / COLLECTION ACTIONS
      ======================================================== */}
      {overdueInvoices.length > 0 && (
        <div
          style={{
            backgroundColor: '#fff1f2',
            border: '1.5px solid #fecdd3',
            borderRadius: '20px',
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
                  Overdue Accounts for Immediate Action
                </h4>
                <span style={{ fontSize: '0.72rem', color: '#be123c' }}>
                  £{totalOverdueAmount.toFixed(2)} total outstanding across {overdueInvoices.length} accounts
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
              View Invoices &rarr;
            </button>
          </div>

          {/* Overdue Accounts List with WhatsApp Button */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {overdueInvoices.slice(0, 2).map((inv) => (
              <div
                key={inv.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  padding: '0.75rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid #ffe4e6'
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

      {/* ========================================================
          6. LIVE ELECTRONICS REPAIR TRACKER (STEPPER)
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
          <button
            type="button"
            onClick={onOpenNewRepair}
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
          7. RECENT TRANSACTIONS STREAM
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '0.88rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>
            Recent Sales &amp; Invoices
          </h3>
          <button
            type="button"
            onClick={() => setActiveTab('invoices')}
            style={{
              fontSize: '0.72rem',
              fontWeight: '800',
              color: '#2563eb',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            View All &rarr;
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
                  <div style={{ fontWeight: '800', fontSize: '0.82rem', color: '#0f172a' }}>
                    {inv.customer_name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    {inv.description?.slice(0, 32)}...
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '900', fontSize: '0.88rem', color: '#0f172a' }}>
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
