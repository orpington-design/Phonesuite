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
                  {customer?.name || 'Valued Customer'}
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
                {tenant?.name || 'PhoneSuite'} &bull; Customer #{customer?.id?.slice(0, 8) || '001'}
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
              Total Due
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginTop: '2px' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: '800', color: totalOutstanding > 0 ? '#ef4444' : '#10b981' }}>
                £{totalOutstanding.toFixed(2)}
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
              {unpaidBills.length} pending {unpaidBills.length === 1 ? 'bill' : 'bills'}
            </span>
          </div>

          {/* Credit Score */}
          <div 
            onClick={() => setActiveTab('score')} 
            style={{ cursor: 'pointer', borderLeft: '1px solid #e2e8f0', paddingLeft: '0.75rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>
                Credit Score
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
              <CreditCard size={16} /> Pay Due Balance Now (£{totalOutstanding.toFixed(2)})
            </button>
          </div>
        )}
      </div>

      {/* 2. Active Repair Status Tracker */}
      {activeRepair && (
        <div className="mobile-card" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div 
                style={{ 
                  padding: '6px', 
                  borderRadius: '8px', 
                  background: 'rgba(67, 24, 255, 0.08)', 
                  color: '#4318ff' 
                }}
              >
                <Wrench size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Device Repair Tracker
                </h3>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  {activeRepair.device_model}
                </span>
              </div>
            </div>

            <span 
              style={{ 
                fontSize: '0.7rem', 
                fontWeight: '700',
                padding: '3px 9px', 
                borderRadius: '9999px',
                background: activeRepair.status === 'ready' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                color: activeRepair.status === 'ready' ? '#059669' : '#d97706',
                textTransform: 'uppercase',
                border: `1px solid ${activeRepair.status === 'ready' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
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
                      background: '#e2e8f0',
                      zIndex: 1
                    }} 
                  >
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${(currentStep / 4) * 100}%`, 
                        background: '#4318ff', 
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
                            background: isCompleted ? '#4318ff' : '#f8fafc', 
                            border: `2px solid ${isCurrent ? '#4318ff' : isCompleted ? '#4318ff' : '#cbd5e1'}`,
                            color: isCompleted ? '#ffffff' : '#64748b',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontSize: '0.65rem',
                            fontWeight: '800',
                            boxShadow: isCurrent ? '0 0 10px rgba(67, 24, 255, 0.4)' : 'none'
                          }}
                        >
                          {isCompleted ? '✓' : idx + 1}
                        </div>
                        <span 
                          style={{ 
                            fontSize: '0.62rem', 
                            marginTop: '5px', 
                            color: isCurrent ? '#0f172a' : isCompleted ? '#475569' : '#94a3b8',
                            fontWeight: isCurrent ? '700' : '500',
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
                padding: '0.75rem 0.85rem', 
                background: '#f8fafc', 
                borderRadius: '10px', 
                borderLeft: '3px solid #4318ff',
                fontSize: '0.76rem',
                lineHeight: 1.4
              }}
            >
              <strong style={{ color: '#4318ff' }}>Technician update: </strong>
              <span style={{ color: '#334155' }}>{activeRepair.diagnostic_notes}</span>
            </div>
          )}
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
            Shop New Arrivals
          </span>
        </div>

        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff', margin: '0 0 0.35rem 0', maxWidth: '80%' }}>
          Phones, iPads, Watches, Laptops & Gaming
        </h3>
        <p style={{ fontSize: '0.76rem', color: '#e0f2fe', margin: '0 0 0.75rem 0', maxWidth: '85%' }}>
          Instant 0% Rent-to-Own financing pre-approved with your score.
        </p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: '700', color: '#ffffff', background: 'rgba(255, 255, 255, 0.2)', padding: '4px 10px', borderRadius: '8px' }}>
          Explore Products &bull; Pay Weekly/Monthly <ArrowUpRight size={14} />
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
                  Hire-Purchase Contract
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
            <span>Progress: {contracts[0].paid_installments} of {contracts[0].total_installments} paid</span>
            <span style={{ color: '#0f172a', fontWeight: '700' }}>£{contracts[0].installment_amount}/mo</span>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
        <button
          onClick={() => setActiveTab('shop')}
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '0.85rem',
            textAlign: 'left',
            cursor: 'pointer',
            color: '#0f172a',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ color: '#4318ff' }}><ShoppingBag size={20} /></div>
          <span style={{ fontSize: '0.82rem', fontWeight: '800' }}>Tech Store</span>
          <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Browse all devices</span>
        </button>

        <button
          onClick={() => setActiveTab('bills')}
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '0.85rem',
            textAlign: 'left',
            cursor: 'pointer',
            color: '#0f172a',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ color: '#10b981' }}><CreditCard size={20} /></div>
          <span style={{ fontSize: '0.82rem', fontWeight: '800' }}>Pay Invoices</span>
          <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Stripe & Cards</span>
        </button>

        <button
          onClick={() => setActiveTab('score')}
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '0.85rem',
            textAlign: 'left',
            cursor: 'pointer',
            color: '#0f172a',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ color: '#d97706' }}><Award size={20} /></div>
          <span style={{ fontSize: '0.82rem', fontWeight: '800' }}>Credit Power</span>
          <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Tier perks & limits</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '0.85rem',
            textAlign: 'left',
            cursor: 'pointer',
            color: '#0f172a',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ color: '#7c3aed' }}><ShieldCheck size={20} /></div>
          <span style={{ fontSize: '0.82rem', fontWeight: '800' }}>My Account</span>
          <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Security & store info</span>
        </button>
      </div>

    </div>
  );
}
