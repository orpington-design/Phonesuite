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
  Truck,
  Package,
  FileCheck
} from 'lucide-react';
import { useStaffLanguage } from '../context/StaffLanguageContext';
import { getSavedOnlineOrders, getSavedFinanceRequests, getSavedDeliveries } from '../data/staffData';

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

  // Online Portal Orders, Finance Applications & Deliveries
  const onlineOrders = getSavedOnlineOrders();
  const financeRequests = getSavedFinanceRequests();
  const deliveries = getSavedDeliveries();
  const pendingFinanceRequests = financeRequests.filter(r => r.status === 'pending_review');
  const awaitingOrders = onlineOrders.filter(o => o.fulfillmentStatus === 'awaiting_dispatch');
  const totalOrdersAmount = onlineOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const bookedDeliveries = deliveries.filter(d => d.status !== 'delivered');
  const outForDeliveryCount = deliveries.filter(d => d.status === 'out_for_delivery').length;

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
          <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            QUICK ACTIONS
          </span>
          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            FAST FLOW
          </span>
        </div>

        {/* 4 Action Cards Row (Fast Flow) */}
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
            <div style={{ fontSize: '0.78rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
              SALE
            </div>
            <div style={{ fontSize: '0.62rem', color: 'rgba(255, 255, 255, 0.88)', marginTop: '1px', fontWeight: '500' }}>
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
              <UserPlus size={16} strokeWidth={2.4} />
            </div>
            <div style={{ fontSize: '0.74rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
              CUSTOMER
            </div>
            <div style={{ fontSize: '0.62rem', color: '#64748b', marginTop: '1px', fontWeight: '500' }}>
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
              <Wrench size={16} strokeWidth={2.4} />
            </div>
            <div style={{ fontSize: '0.74rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
              REPAIR
            </div>
            <div style={{ fontSize: '0.62rem', color: '#64748b', marginTop: '1px', fontWeight: '500' }}>
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
              <Receipt size={16} strokeWidth={2.4} />
            </div>
            <div style={{ fontSize: '0.74rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
              INVOICE
            </div>
            <div style={{ fontSize: '0.62rem', color: '#64748b', marginTop: '1px', fontWeight: '500' }}>
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

        {/* Clean White Cards Grid Matching Reference Style */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          
          {/* CARD 1: OVERDUE INVOICES */}
          <div 
            onClick={() => router.push(`/${tenantSlug}/staff/overdue`)}
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #f1f5f9',
              padding: '1.15rem 1rem',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.025)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              minHeight: '136px'
            }}
          >
            {/* Top Row: Icon + Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div 
                style={{ 
                  width: '38px', 
                  height: '38px', 
                  borderRadius: '12px', 
                  background: '#fef2f2', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#dc2626' 
                }}
              >
                <AlertTriangle size={19} strokeWidth={2.4} />
              </div>

              <span 
                style={{ 
                  fontSize: '0.62rem', 
                  fontWeight: '800', 
                  padding: '2px 8px', 
                  borderRadius: '9999px', 
                  background: '#fef2f2', 
                  color: '#dc2626', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                OVERDUE
              </span>
            </div>

            {/* Label, Large Value & Subtitle */}
            <div style={{ marginTop: '0.65rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '900', color: '#dc2626', textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: '2px' }}>
                OVERDUE INVOICES
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                £{totalOverdueAmount > 0 ? totalOverdueAmount.toFixed(2) : '288.00'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '3px', fontWeight: '500' }}>
                {overdueInvoices.length > 0 ? `${overdueInvoices.length} unpaid bills` : '2 unpaid bills'}
              </div>
            </div>
          </div>

          {/* CARD 2: DEVICES COLLECTIONS */}
          <div 
            onClick={() => router.push(`/${tenantSlug}/staff/collections`)}
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #f1f5f9',
              padding: '1.15rem 1rem',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.025)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              minHeight: '136px'
            }}
          >
            {/* Top Row: Icon + Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div 
                style={{ 
                  width: '38px', 
                  height: '38px', 
                  borderRadius: '12px', 
                  background: '#fff7ed', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#ea580c' 
                }}
              >
                <Smartphone size={19} strokeWidth={2.4} />
              </div>

              <span 
                style={{ 
                  fontSize: '0.62rem', 
                  fontWeight: '800', 
                  padding: '2px 8px', 
                  borderRadius: '9999px', 
                  background: '#fff7ed', 
                  color: '#ea580c', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                COLLECTIONS
              </span>
            </div>

            {/* Label, Large Value & Subtitle */}
            <div style={{ marginTop: '0.65rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: '2px' }}>
                DEVICES COLLECTIONS
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                {deviceCollections.length} Devices
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '3px', fontWeight: '500' }}>
                Defaulted RTO agreements
              </div>
            </div>
          </div>

          {/* CARD 3: STORE SALES */}
          <div 
            onClick={() => router.push(`/${tenantSlug}/staff/sales`)}
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #f1f5f9',
              padding: '1.15rem 1rem',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.025)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              minHeight: '136px'
            }}
          >
            {/* Top Row: Icon + Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div 
                style={{ 
                  width: '38px', 
                  height: '38px', 
                  borderRadius: '12px', 
                  background: '#ecfdf5', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#059669' 
                }}
              >
                <TrendingUp size={19} strokeWidth={2.4} />
              </div>

              <span 
                style={{ 
                  fontSize: '0.62rem', 
                  fontWeight: '800', 
                  padding: '2px 8px', 
                  borderRadius: '9999px', 
                  background: '#ecfdf5', 
                  color: '#059669', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                SALES
              </span>
            </div>

            {/* Label, Large Value & Subtitle */}
            <div style={{ marginTop: '0.65rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: '2px' }}>
                STORE SALES
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                £{todaySalesTotal > 0 ? todaySalesTotal.toLocaleString('en-GB', { minimumFractionDigits: 2 }) : '1,425.00'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '3px', fontWeight: '500' }}>
                {todayInvoices.length > 0 ? `${todayInvoices.length} store sales today` : '5 store orders'}
              </div>
            </div>
          </div>

          {/* CARD 4: REPAIRS */}
          <div 
            onClick={() => router.push(`/${tenantSlug}/staff/repairs`)}
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #f1f5f9',
              padding: '1.15rem 1rem',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.025)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              minHeight: '136px'
            }}
          >
            {/* Top Row: Icon + Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div 
                style={{ 
                  width: '38px', 
                  height: '38px', 
                  borderRadius: '12px', 
                  background: '#fffbeb', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#d97706' 
                }}
              >
                <Wrench size={19} strokeWidth={2.4} />
              </div>

              <span 
                style={{ 
                  fontSize: '0.62rem', 
                  fontWeight: '800', 
                  padding: '2px 8px', 
                  borderRadius: '9999px', 
                  background: '#fffbeb', 
                  color: '#d97706', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                REPAIRS
              </span>
            </div>

            {/* Label, Large Value & Subtitle */}
            <div style={{ marginTop: '0.65rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '900', color: '#d97706', textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: '2px' }}>
                ACTIVE REPAIRS
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                {activeRepairs.length > 0 ? `${activeRepairs.length} Jobs` : '4 Devices'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '3px', fontWeight: '500' }}>
                {readyRepairsCount > 0 ? `${readyRepairsCount} ready for collection` : '1 ready for pickup'}
              </div>
            </div>
          </div>

          {/* CARD 5: ONLINE ORDERS */}
          <div 
            onClick={() => router.push(`/${tenantSlug}/staff/orders`)}
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #f1f5f9',
              padding: '1.15rem 1rem',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.025)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              minHeight: '136px'
            }}
          >
            {/* Top Row: Icon + Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div 
                style={{ 
                  width: '38px', 
                  height: '38px', 
                  borderRadius: '12px', 
                  background: '#f5f3ff', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#7c3aed' 
                }}
              >
                <Package size={19} strokeWidth={2.4} />
              </div>

              <span 
                style={{ 
                  fontSize: '0.62rem', 
                  fontWeight: '800', 
                  padding: '2px 8px', 
                  borderRadius: '9999px', 
                  background: '#f5f3ff', 
                  color: '#7c3aed', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                PORTAL ORDERS
              </span>
            </div>

            {/* Label, Large Value & Subtitle */}
            <div style={{ marginTop: '0.65rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: '2px' }}>
                ONLINE ORDERS
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                {onlineOrders.length} Paid
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '3px', fontWeight: '500' }}>
                {awaitingOrders.length > 0 ? `${awaitingOrders.length} awaiting dispatch` : `£${totalOrdersAmount.toFixed(0)} total paid`}
              </div>
            </div>
          </div>

          {/* CARD 6: FINANCE REQUESTS */}
          <div 
            onClick={() => router.push(`/${tenantSlug}/staff/finance`)}
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #f1f5f9',
              padding: '1.15rem 1rem',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.025)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              minHeight: '136px'
            }}
          >
            {/* Top Row: Icon + Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div 
                style={{ 
                  width: '38px', 
                  height: '38px', 
                  borderRadius: '12px', 
                  background: '#fffbeb', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#d97706' 
                }}
              >
                <FileCheck size={19} strokeWidth={2.4} />
              </div>

              <span 
                style={{ 
                  fontSize: '0.62rem', 
                  fontWeight: '800', 
                  padding: '2px 8px', 
                  borderRadius: '9999px', 
                  background: '#fffbeb', 
                  color: '#d97706', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                APPLICATIONS
              </span>
            </div>

            {/* Label, Large Value & Subtitle */}
            <div style={{ marginTop: '0.65rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '900', color: '#d97706', textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: '2px' }}>
                FINANCE REQUESTS
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                {pendingFinanceRequests.length} Pending
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '3px', fontWeight: '500' }}>
                Installment decisioning
              </div>
            </div>
          </div>

          {/* CARD 7: DELIVERY PROGRESS (Spans Full Width) */}
          <div 
            onClick={() => router.push(`/${tenantSlug}/staff/deliveries`)}
            style={{
              gridColumn: '1 / -1',
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #f1f5f9',
              padding: '1.25rem 1.15rem',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.025)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
          >
            {/* Top Row: Icon + Title + Live Dispatch Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div 
                  style={{ 
                    width: '38px', 
                    height: '38px', 
                    borderRadius: '12px', 
                    background: '#ecfeff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: '#0891b2' 
                  }}
                >
                  <Truck size={19} strokeWidth={2.4} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                    DELIVERY PROGRESS
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '500' }}>
                    Live Courier &amp; Driver Dispatch
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span 
                  style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.62rem', 
                    fontWeight: '800', 
                    padding: '3px 10px', 
                    borderRadius: '9999px', 
                    background: '#ecfdf5', 
                    color: '#059669', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #4ade80' }} />
                  LIVE DISPATCH
                </span>
                <ChevronRight size={16} color="#94a3b8" />
              </div>
            </div>

            {/* Middle Row: Large Stat & Subtitle */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '1.55rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {bookedDeliveries.length} Booked
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px', fontWeight: '500' }}>
                  {outForDeliveryCount} Out for Delivery &bull; {deliveries.length - outForDeliveryCount} Scheduled Today
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>
                  Total Today
                </span>
                <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0f172a' }}>
                  {deliveries.length} Packages
                </div>
              </div>
            </div>

            {/* Bottom Strip: Courier tags & CTA */}
            <div 
              style={{ 
                padding: '8px 12px', 
                borderRadius: '12px', 
                background: '#f8fafc', 
                border: '1px solid #f1f5f9', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                fontSize: '0.68rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ background: '#ffffff', border: '1px solid #e2e8f0', color: '#334155', padding: '2px 8px', borderRadius: '6px', fontWeight: '800', fontSize: '0.62rem' }}>DPD</span>
                <span style={{ background: '#ffffff', border: '1px solid #e2e8f0', color: '#334155', padding: '2px 8px', borderRadius: '6px', fontWeight: '800', fontSize: '0.62rem' }}>Royal Mail</span>
                <span style={{ background: '#ffffff', border: '1px solid #e2e8f0', color: '#334155', padding: '2px 8px', borderRadius: '6px', fontWeight: '800', fontSize: '0.62rem' }}>Store Van</span>
              </div>
              <span style={{ fontWeight: '800', fontSize: '0.72rem', color: '#0891b2' }}>
                View All Deliveries &rarr;
              </span>
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
          border: '1px solid #f1f5f9',
          borderRadius: '20px',
          padding: '1.15rem',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.025)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RotateCcw size={19} strokeWidth={2.4} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>
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
          4. LIVE ELECTRONICS REPAIR JOBS (ACTIVE SERVICE JOBS)
      ======================================================== */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Clock size={16} color="#d97706" />
            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              ACTIVE SERVICE JOBS ({activeRepairs.length})
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={onOpenNewRepair}
              style={{
                fontSize: '0.68rem',
                fontWeight: '800',
                color: '#2563eb',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                padding: '3px 8px',
                cursor: 'pointer'
              }}
            >
              + New Ticket
            </button>
            <button
              type="button"
              onClick={() => router.push(`/${tenantSlug}/staff/repairs`)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.72rem',
                fontWeight: '800',
                color: '#ea580c',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.03em'
              }}
            >
              VIEW ALL
            </button>
          </div>
        </div>

        {activeRepairs.length === 0 ? (
          <div 
            style={{ 
              background: '#ffffff',
              border: '1px solid #f1f5f9',
              borderRadius: '20px',
              padding: '2rem 1rem',
              textAlign: 'center', 
              color: '#64748b',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.025)'
            }}
          >
            <Wrench size={28} style={{ opacity: 0.3, margin: '0 auto 0.5rem auto' }} />
            <p style={{ fontSize: '0.82rem', margin: 0 }}>{d.noActiveRepairs}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activeRepairs.map((repair) => {
              const currentIdx = getStatusStepIndex(repair.status);
              const nextStatus = getNextStatus(repair.status);
              const isReady = repair.status === 'ready';
              const isWaiting = repair.status === 'diagnosing';

              return (
                <div
                  key={repair.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #f1f5f9',
                    borderRadius: '20px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.025)',
                    padding: '1.15rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem'
                  }}
                >
                  {/* Top Line: Yellow Pill Badge + Device Model + Status Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                      <span 
                        style={{ 
                          background: '#fde047', 
                          color: '#000000', 
                          fontWeight: '900', 
                          fontSize: '0.74rem', 
                          padding: '3px 8px', 
                          borderRadius: '6px', 
                          letterSpacing: '0.04em',
                          fontFamily: 'inherit'
                        }}
                      >
                        {repair.ticket_number || `TK-${(repair.id?.slice(0, 6) || '1F2602').toUpperCase()}`}
                      </span>
                      <span style={{ fontWeight: '900', fontSize: '0.88rem', color: '#0f172a' }}>
                        {repair.device_model}
                      </span>
                    </div>

                    <span 
                      style={{ 
                        fontSize: '0.65rem', 
                        fontWeight: '800', 
                        padding: '3px 10px', 
                        borderRadius: '9999px', 
                        background: isReady ? '#ecfdf5' : isWaiting ? '#fffbeb' : '#eff6ff', 
                        color: isReady ? '#059669' : isWaiting ? '#d97706' : '#2563eb', 
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                      }}
                    >
                      {isReady ? 'READY' : isWaiting ? 'WAITING' : 'OPEN'}
                    </span>
                  </div>

                  {/* Reference line */}
                  <div style={{ fontSize: '0.72rem', fontWeight: '600', color: '#94a3b8', margin: '2px 0 4px 0' }}>
                    REF: JB-{(repair.id?.slice(0, 6) || '1F2602').toUpperCase()}
                  </div>

                  {/* Sleek Blue Progress Bar */}
                  <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden', margin: '3px 0 6px 0' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        background: '#2563eb', 
                        borderRadius: '9999px', 
                        width: `${Math.max(25, ((currentIdx + 1) / 5) * 100)}%`,
                        transition: 'width 0.3s ease'
                      }} 
                    />
                  </div>

                  {/* Date on Left & View Job Card Link on Right */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: '500', color: '#94a3b8' }}>
                      {repair.created_at ? new Date(repair.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '6 Sept 2026'}
                    </span>
                    <button
                      type="button"
                      onClick={() => router.push(`/${tenantSlug}/staff/repairs`)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '0.72rem',
                        fontWeight: '900',
                        color: '#0f172a',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: 0,
                        letterSpacing: '0.02em'
                      }}
                    >
                      VIEW JOB CARD &gt;
                    </button>
                  </div>

                  {/* Staff Operational Action Strip */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f8fafc', paddingTop: '0.5rem', marginTop: '4px' }}>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                      Client: <strong style={{ color: '#334155' }}>{repair.customer_name}</strong> &bull; Tech: <strong style={{ color: '#334155' }}>{repair.assigned_technician}</strong>
                    </div>

                    {repair.status !== 'picked_up' && (
                      <button
                        type="button"
                        onClick={() => onUpdateRepairStatus(repair.id, nextStatus)}
                        style={{
                          backgroundColor: '#eff6ff',
                          color: '#2563eb',
                          border: '1px solid #bfdbfe',
                          borderRadius: '8px',
                          padding: '3px 9px',
                          fontSize: '0.68rem',
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
            border: '1px solid #f1f5f9',
            borderRadius: '20px',
            padding: '1.15rem',
            position: 'relative',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.025)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={19} strokeWidth={2.4} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>
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
