'use client';

import { 
  Award, 
  CreditCard, 
  Wrench, 
  ShoppingBag, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  Sparkles,
  ShieldCheck,
  Smartphone,
  ArrowUpRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function DashboardTab({ 
  customer, 
  tenant, 
  bills, 
  repairs, 
  contracts, 
  setActiveTab, 
  onTriggerPayment 
}) {
  const { t } = useLanguage();
  const unpaidBills = bills.filter(b => b.status !== 'paid');
  const totalOutstanding = unpaidBills.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const activeRepair = repairs.find(r => r.status !== 'picked_up' && r.status !== 'cancelled') || repairs[0];

  const getStatusStepIndex = (status) => {
    const steps = ['received', 'diagnosing', 'repairing', 'ready', 'picked_up'];
    const idx = steps.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* 1. Welcome Profile Card (Premium Clean Light) */}
      <div 
        style={{ 
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '20px',
          padding: '1.25rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(112, 144, 176, 0.08)'
        }}
      >
        <div style={{ position: 'absolute', top: -15, right: -15, width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(67, 24, 255, 0.06) 0%, transparent 70%)', borderRadius: '50%' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div 
              style={{ 
                width: '46px', 
                height: '46px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #4318ff 0%, #38bdf8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.15rem',
                fontWeight: '800',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(67, 24, 255, 0.25)'
              }}
            >
              {customer?.name ? customer.name.charAt(0) : 'U'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  {customer?.name || t.dashboard.welcome}
                </h2>
                <span 
                  style={{ 
                    fontSize: '0.65rem', 
                    padding: '2px 8px', 
                    background: 'rgba(67, 24, 255, 0.08)', 
                    color: '#4318ff', 
                    borderRadius: '9999px',
                    fontWeight: '700',
                    border: '1px solid rgba(67, 24, 255, 0.18)' 
                  }}
                >
                  {customer?.tier || 'VIP Platinum'}
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
                {tenant?.name || 'PhoneSuite'} &bull; {t.dashboard.customer} #{customer?.id?.slice(0, 8) || '001'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Balance & Credit Overview Bar */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '0.65rem', 
            background: '#f8fafc', 
            borderRadius: '14px', 
            padding: '0.85rem',
            border: '1px solid #e2e8f0'
          }}
        >
          {/* Outstanding Balance */}
          <div>
            <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>
              {t.dashboard.totalDue}
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginTop: '2px' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: '800', color: totalOutstanding > 0 ? '#ef4444' : '#10b981' }}>
                £{totalOutstanding.toFixed(2)}
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
              {unpaidBills.length} {unpaidBills.length === 1 ? t.dashboard.pendingBill : t.dashboard.pendingBills}
            </span>
          </div>

          {/* Credit Score */}
          <div 
            onClick={() => setActiveTab('score')} 
            style={{ cursor: 'pointer', borderLeft: '1px solid #e2e8f0', paddingLeft: '0.75rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>
                {t.dashboard.creditScore}
              </span>
              <ChevronRight size={14} style={{ color: '#94a3b8' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginTop: '2px' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: '800', color: '#4318ff' }}>
                {customer?.credit_score || 785}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: '700' }}>
                EXCELLENT
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
              £{Number(customer?.credit_limit || 2500).toLocaleString()} {t.dashboard.limit}
            </span>
          </div>
        </div>

        {/* Action Button */}
        {totalOutstanding > 0 && (
          <div style={{ marginTop: '0.85rem' }}>
            <button
              onClick={() => onTriggerPayment ? onTriggerPayment(unpaidBills[0]) : setActiveTab('bills')}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '0.7rem 1rem',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
              }}
            >
              <CreditCard size={16} /> {t.dashboard.payDueNow} (£{totalOutstanding.toFixed(2)})
            </button>
          </div>
        )}
      </div>

      {/* 2. Active Repair Status Tracker (Active Service Jobs Style) */}
      {activeRepair && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Clock size={16} color="#d97706" />
              <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                ACTIVE SERVICE JOBS (1)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
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

          <div 
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
            {/* Top line: Yellow License Plate Badge + Device Model + Status Badge */}
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
                    letterSpacing: '0.04em' 
                  }}
                >
                  TK-{(activeRepair.id?.slice(0, 6) || '1F2602').toUpperCase()}
                </span>
                <span style={{ fontWeight: '900', fontSize: '0.88rem', color: '#0f172a' }}>
                  {activeRepair.device_model}
                </span>
              </div>

              <span 
                style={{ 
                  fontSize: '0.65rem', 
                  fontWeight: '800', 
                  padding: '3px 10px', 
                  borderRadius: '9999px', 
                  background: activeRepair.status === 'ready' ? '#ecfdf5' : activeRepair.status === 'diagnosing' ? '#fffbeb' : '#eff6ff', 
                  color: activeRepair.status === 'ready' ? '#059669' : activeRepair.status === 'diagnosing' ? '#d97706' : '#2563eb', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                {activeRepair.status === 'ready' ? t.dashboard.readyForPickup : activeRepair.status === 'diagnosing' ? 'WAITING' : 'OPEN'}
              </span>
            </div>

            {/* Reference line */}
            <div style={{ fontSize: '0.72rem', fontWeight: '600', color: '#94a3b8', margin: '2px 0 4px 0' }}>
              REF: JB-{(activeRepair.id?.slice(0, 6) || '1F2602').toUpperCase()}
            </div>

            {/* Sleek Blue Progress Bar */}
            <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden', margin: '3px 0 6px 0' }}>
              <div 
                style={{ 
                  height: '100%', 
                  background: '#2563eb', 
                  borderRadius: '9999px', 
                  width: `${Math.max(25, ((getStatusStepIndex(activeRepair.status) + 1) / 5) * 100)}%`,
                  transition: 'width 0.3s ease'
                }} 
              />
            </div>

            {/* Date on Left & View Job Card on Right */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: '500', color: '#94a3b8' }}>
                {activeRepair.created_at ? new Date(activeRepair.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '6 Sept 2026'}
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
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

            {/* Diagnostic Note */}
            {activeRepair.diagnostic_notes && (
              <div 
                style={{ 
                  marginTop: '0.65rem', 
                  padding: '0.65rem 0.75rem', 
                  background: '#f8fafc', 
                  borderRadius: '10px', 
                  borderLeft: '3px solid #2563eb',
                  fontSize: '0.74rem',
                  lineHeight: 1.4
                }}
              >
                <strong style={{ color: '#2563eb' }}>{t.dashboard.techNotes}: </strong>
                <span style={{ color: '#334155' }}>{activeRepair.diagnostic_notes}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Featured Shop Banner */}
      <div 
        onClick={() => setActiveTab('shop')}
        style={{ 
          background: 'linear-gradient(135deg, #4318ff 0%, #06b6d4 100%)',
          borderRadius: '18px',
          padding: '1.15rem',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 25px rgba(67, 24, 255, 0.25)',
          color: '#ffffff'
        }}
      >
        <div style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.15, color: '#fff' }}>
          <ShoppingBag size={120} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fef08a', marginBottom: '0.35rem' }}>
          <Sparkles size={14} />
          <span style={{ fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {t.shop.catalogTitle}
          </span>
        </div>

        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff', margin: '0 0 0.35rem 0', maxWidth: '80%' }}>
          Phones, iPads, Watches, Laptops & Gaming
        </h3>

        <p style={{ fontSize: '0.76rem', color: '#e0f2fe', margin: '0 0 0.75rem 0', maxWidth: '85%' }}>
          {t.shop.catalogSubtitle}
        </p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: '700', color: '#ffffff', background: 'rgba(255, 255, 255, 0.2)', padding: '4px 10px', borderRadius: '8px' }}>
          {t.bills.openShop} <ArrowUpRight size={14} />
        </div>
      </div>

      {/* 4. Rent-to-Own Agreement Active Status */}
      {contracts && contracts.length > 0 && (
        <div className="mobile-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.12)', color: '#d97706' }}>
                <FileText size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '800', margin: 0, color: '#0f172a' }}>
                  {t.dashboard.rtoActive}
                </h4>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  {contracts[0].item_name}
                </span>
              </div>
            </div>
            <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '9999px', background: 'rgba(16, 185, 129, 0.12)', color: '#059669', fontWeight: '700' }}>
              ACTIVE
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', margin: '0.5rem 0' }}>
            <span>{contracts[0].paid_installments} / {contracts[0].total_installments} {t.dashboard.installmentsPaid}</span>
            <span style={{ color: '#0f172a', fontWeight: '700' }}>£{contracts[0].installment_amount}{t.bills.perMonth}</span>
          </div>

          <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${(contracts[0].paid_installments / contracts[0].total_installments) * 100}%`,
                background: 'linear-gradient(90deg, #10b981, #06b6d4)'
              }} 
            />
          </div>
        </div>
      )}

      {/* 5. Quick Actions Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            QUICK ACTIONS
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {/* Card 1: Shop (Top-Left: Blue) */}
          <button
            onClick={() => setActiveTab('shop')}
            style={{
              background: '#ffffff',
              border: '1px solid #f1f5f9',
              borderRadius: '20px',
              padding: '1.15rem 1rem',
              textAlign: 'left',
              cursor: 'pointer',
              color: '#0f172a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              minHeight: '115px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.025)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
              <ShoppingBag size={19} strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ fontSize: '0.80rem', fontWeight: '900', textTransform: 'uppercase', color: '#0f172a', letterSpacing: '-0.01em' }}>
                {t.dashboard.shopTech}
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: '500', color: '#64748b', marginTop: '2px' }}>
                {t.shop.all}
              </div>
            </div>
          </button>

          {/* Card 2: My Bills (Top-Right: Red) */}
          <button
            onClick={() => setActiveTab('bills')}
            style={{
              background: '#ffffff',
              border: '1px solid #f1f5f9',
              borderRadius: '20px',
              padding: '1.15rem 1rem',
              textAlign: 'left',
              cursor: 'pointer',
              color: '#0f172a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              minHeight: '115px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.025)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
              <CreditCard size={19} strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ fontSize: '0.80rem', fontWeight: '900', textTransform: 'uppercase', color: '#dc2626', letterSpacing: '-0.01em' }}>
                {t.dashboard.myBills}
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: '500', color: '#64748b', marginTop: '2px' }}>
                Stripe &amp; Cards
              </div>
            </div>
          </button>

          {/* Card 3: Credit Power (Bottom-Left: Amber) */}
          <button
            onClick={() => setActiveTab('score')}
            style={{
              background: '#ffffff',
              border: '1px solid #f1f5f9',
              borderRadius: '20px',
              padding: '1.15rem 1rem',
              textAlign: 'left',
              cursor: 'pointer',
              color: '#0f172a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              minHeight: '115px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.025)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
              <Award size={19} strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ fontSize: '0.80rem', fontWeight: '900', textTransform: 'uppercase', color: '#0f172a', letterSpacing: '-0.01em' }}>
                {t.dashboard.creditPower}
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: '500', color: '#64748b', marginTop: '2px' }}>
                Tier perks &amp; limits
              </div>
            </div>
          </button>

          {/* Card 4: Store Help (Bottom-Right: Amber) */}
          <button
            onClick={() => setActiveTab('settings')}
            style={{
              background: '#ffffff',
              border: '1px solid #f1f5f9',
              borderRadius: '20px',
              padding: '1.15rem 1rem',
              textAlign: 'left',
              cursor: 'pointer',
              color: '#0f172a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              minHeight: '115px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.025)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
              <ShieldCheck size={19} strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ fontSize: '0.80rem', fontWeight: '900', textTransform: 'uppercase', color: '#d97706', letterSpacing: '-0.01em' }}>
                {t.dashboard.storeHelp}
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: '500', color: '#64748b', marginTop: '2px' }}>
                Security &amp; store info
              </div>
            </div>
          </button>
        </div>
      </div>

    </div>
  );
}
