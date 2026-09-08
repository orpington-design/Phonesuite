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

export default function DashboardTab({ 
  customer, 
  tenant, 
  bills, 
  repairs, 
  contracts, 
  setActiveTab, 
  onTriggerPayment 
}) {
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
      
      {/* 1. Welcome Profile Card */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '1.25rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div style={{ position: 'absolute', top: -15, right: -15, width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, transparent 70%)', borderRadius: '50%' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div 
              style={{ 
                width: '46px', 
                height: '46px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #38bdf8 0%, #4f46e5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.15rem',
                fontWeight: '700',
                color: '#fff',
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              {customer?.name ? customer.name.charAt(0) : 'U'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', margin: 0 }}>
                  {customer?.name || 'Valued Customer'}
                </h2>
                <span 
                  style={{ 
                    fontSize: '0.65rem', 
                    padding: '2px 7px', 
                    background: 'rgba(56, 189, 248, 0.15)', 
                    color: '#38bdf8', 
                    borderRadius: '9999px',
                    fontWeight: '600',
                    border: '1px solid rgba(56, 189, 248, 0.3)' 
                  }}
                >
                  {customer?.tier || 'VIP Platinum'}
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                {tenant?.name || 'PhoneSuite'} &bull; Customer ID #{customer?.id?.slice(0, 8) || '001'}
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
            background: 'rgba(15, 23, 42, 0.6)', 
            borderRadius: '14px', 
            padding: '0.85rem',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          {/* Outstanding Balance */}
          <div>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Due
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginTop: '2px' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: '800', color: totalOutstanding > 0 ? '#f87171' : '#34d399' }}>
                £{totalOutstanding.toFixed(2)}
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
              {unpaidBills.length} pending {unpaidBills.length === 1 ? 'bill' : 'bills'}
            </span>
          </div>

          {/* Credit Score */}
          <div 
            onClick={() => setActiveTab('score')} 
            style={{ cursor: 'pointer', borderLeft: '1px solid rgba(255, 255, 255, 0.08)', paddingLeft: '0.75rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Credit Score
              </span>
              <ChevronRight size={14} style={{ color: '#64748b' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginTop: '2px' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: '800', color: '#38bdf8' }}>
                {customer?.credit_score || 785}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: '600' }}>
                EXCELLENT
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
              £{Number(customer?.credit_limit || 2500).toLocaleString()} limit
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
                padding: '0.65rem 1rem',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
            >
              <CreditCard size={16} /> Pay Due Balance Now (£{totalOutstanding.toFixed(2)})
            </button>
          </div>
        )}
      </div>

      {/* 2. Active Repair Status Tracker (Live Device Journey) */}
      {activeRepair && (
        <div className="mobile-card" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div 
                style={{ 
                  padding: '6px', 
                  borderRadius: '8px', 
                  background: 'rgba(56, 189, 248, 0.15)', 
                  color: '#38bdf8' 
                }}
              >
                <Wrench size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>
                  Device Repair Tracker
                </h3>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {activeRepair.device_model}
                </span>
              </div>
            </div>

            <span 
              style={{ 
                fontSize: '0.7rem', 
                fontWeight: '700',
                padding: '3px 8px', 
                borderRadius: '9999px',
                background: activeRepair.status === 'ready' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                color: activeRepair.status === 'ready' ? '#34d399' : '#fbbf24',
                textTransform: 'uppercase',
                border: `1px solid ${activeRepair.status === 'ready' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`
              }}
            >
              {activeRepair.status === 'ready' ? 'Ready for Pickup' : activeRepair.status}
            </span>
          </div>

          {/* Visual Step Pipeline */}
          {(() => {
            const currentStep = getStatusStepIndex(activeRepair.status);
            const stepLabels = ['Received', 'Diagnosing', 'Repairing', 'Ready', 'Picked Up'];

            return (
              <div style={{ margin: '1.25rem 0 0.75rem 0' }}>
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {/* Background track */}
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: '12px', 
                      left: '12px', 
                      right: '12px', 
                      height: '3px', 
                      background: 'rgba(255, 255, 255, 0.1)',
                      zIndex: 1
                    }} 
                  >
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${(currentStep / 4) * 100}%`, 
                        background: '#38bdf8', 
                        transition: 'width 0.4s ease' 
                      }} 
                    />
                  </div>

                  {stepLabels.map((label, idx) => {
                    const isCompleted = idx <= currentStep;
                    const isCurrent = idx === currentStep;

                    return (
                      <div 
                        key={label} 
                        style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center', 
                          zIndex: 2,
                          position: 'relative' 
                        }}
                      >
                        <div 
                          style={{ 
                            width: '24px', 
                            height: '24px', 
                            borderRadius: '50%', 
                            background: isCompleted ? '#38bdf8' : '#1e293b', 
                            border: `2px solid ${isCurrent ? '#ffffff' : isCompleted ? '#38bdf8' : 'rgba(255, 255, 255, 0.2)'}`,
                            color: isCompleted ? '#0f172a' : '#94a3b8',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontSize: '0.65rem',
                            fontWeight: '800',
                            boxShadow: isCurrent ? '0 0 10px rgba(56, 189, 248, 0.8)' : 'none'
                          }}
                        >
                          {isCompleted ? '✓' : idx + 1}
                        </div>
                        <span 
                          style={{ 
                            fontSize: '0.62rem', 
                            marginTop: '5px', 
                            color: isCurrent ? '#ffffff' : isCompleted ? '#94a3b8' : '#64748b',
                            fontWeight: isCurrent ? '700' : '400',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Diagnostic Note */}
          {activeRepair.diagnostic_notes && (
            <div 
              style={{ 
                marginTop: '0.85rem', 
                padding: '0.65rem 0.85rem', 
                background: 'rgba(15, 23, 42, 0.7)', 
                borderRadius: '10px', 
                borderLeft: '3px solid #38bdf8',
                fontSize: '0.75rem',
                lineHeight: 1.4
              }}
            >
              <strong style={{ color: '#38bdf8' }}>Technician update: </strong>
              <span style={{ color: '#cbd5e1' }}>{activeRepair.diagnostic_notes}</span>
            </div>
          )}
        </div>
      )}

      {/* 3. Featured Shop Banner (Directly promoting the star tab!) */}
      <div 
        onClick={() => setActiveTab('shop')}
        style={{ 
          background: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 60%, #0f172a 100%)',
          borderRadius: '18px',
          padding: '1.15rem',
          border: '1px solid rgba(129, 140, 248, 0.3)',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 20px rgba(79, 70, 229, 0.2)'
        }}
      >
        <div style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.15 }}>
          <ShoppingBag size={120} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fef08a', marginBottom: '0.35rem' }}>
          <Sparkles size={14} />
          <span style={{ fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Shop New Arrivals
          </span>
        </div>

        <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff', margin: '0 0 0.35rem 0', maxWidth: '80%' }}>
          Phones, iPads, Watches, Laptops & Gaming
        </h3>
        <p style={{ fontSize: '0.75rem', color: '#c7d2fe', margin: '0 0 0.75rem 0', maxWidth: '85%' }}>
          Instant 0% Rent-to-Own financing pre-approved with your score.
        </p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: '700', color: '#38bdf8' }}>
          Explore Products &bull; Pay Weekly/Monthly <ArrowUpRight size={14} />
        </div>
      </div>

      {/* 4. Rent-to-Own Agreement Active Status */}
      {contracts && contracts.length > 0 && (
        <div className="mobile-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                <FileText size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '700', margin: 0, color: '#fff' }}>
                  Hire-Purchase Contract
                </h4>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  {contracts[0].item_name}
                </span>
              </div>
            </div>
            <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '9999px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: '600' }}>
              Active
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', margin: '0.5rem 0' }}>
            <span>Progress: {contracts[0].paid_installments} of {contracts[0].total_installments} paid</span>
            <span style={{ color: '#fff', fontWeight: '600' }}>£{contracts[0].installment_amount}/mo</span>
          </div>

          <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
        <button
          onClick={() => setActiveTab('shop')}
          style={{
            background: 'rgba(30, 41, 59, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '0.85rem',
            textAlign: 'left',
            cursor: 'pointer',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}
        >
          <div style={{ color: '#38bdf8' }}><ShoppingBag size={20} /></div>
          <span style={{ fontSize: '0.82rem', fontWeight: '700' }}>Tech Store</span>
          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Browse all devices</span>
        </button>

        <button
          onClick={() => setActiveTab('bills')}
          style={{
            background: 'rgba(30, 41, 59, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '0.85rem',
            textAlign: 'left',
            cursor: 'pointer',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}
        >
          <div style={{ color: '#34d399' }}><CreditCard size={20} /></div>
          <span style={{ fontSize: '0.82rem', fontWeight: '700' }}>Pay Invoices</span>
          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Stripe & Cards</span>
        </button>

        <button
          onClick={() => setActiveTab('score')}
          style={{
            background: 'rgba(30, 41, 59, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '0.85rem',
            textAlign: 'left',
            cursor: 'pointer',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}
        >
          <div style={{ color: '#fbbf24' }}><Award size={20} /></div>
          <span style={{ fontSize: '0.82rem', fontWeight: '700' }}>Credit Power</span>
          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Tier perks & limits</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          style={{
            background: 'rgba(30, 41, 59, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '0.85rem',
            textAlign: 'left',
            cursor: 'pointer',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}
        >
          <div style={{ color: '#a78bfa' }}><ShieldCheck size={20} /></div>
          <span style={{ fontSize: '0.82rem', fontWeight: '700' }}>My Account</span>
          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Security & store info</span>
        </button>
      </div>

    </div>
  );
}
