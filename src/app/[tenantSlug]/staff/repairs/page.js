'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Wrench, 
  Smartphone, 
  Tablet, 
  Laptop, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Phone, 
  ChevronRight, 
  AlertCircle,
  Sparkles,
  X,
  User,
  ShieldCheck
} from 'lucide-react';
import { 
  INITIAL_STAFF_REPAIRS, 
  INITIAL_STAFF_CUSTOMERS, 
  STAFF_MEMBERS 
} from '../data/staffData';

export default function StaffRepairsPage() {
  const router = useRouter();
  const params = useParams();
  const tenantSlug = params.tenantSlug || 'premiumphonex';

  const [repairs, setRepairs] = useState(INITIAL_STAFF_REPAIRS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, received, diagnosing, repairing, ready, picked_up
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);

  // New repair form state
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [deviceType, setDeviceType] = useState('phone');
  const [deviceModel, setDeviceModel] = useState('');
  const [deviceSerial, setDeviceSerial] = useState('');
  const [issueDesc, setIssueDesc] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [depositPaid, setDepositPaid] = useState('0');
  const [technician, setTechnician] = useState('Alex Rivera');

  // Stats
  const activeRepairs = repairs.filter(r => r.status !== 'picked_up' && r.status !== 'cancelled');
  const readyRepairs = repairs.filter(r => r.status === 'ready');
  const totalPipelineRevenue = repairs.reduce((sum, r) => sum + Number(r.estimated_cost || 0), 0);

  // Status Stepper constants
  const STEPS = ['received', 'diagnosing', 'repairing', 'ready', 'picked_up'];
  const STEP_LABELS = {
    received: 'Received',
    diagnosing: 'Diagnosing',
    repairing: 'Repairing',
    ready: 'Ready',
    picked_up: 'Collected'
  };

  const getStepIndex = (status) => {
    const idx = STEPS.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  const advanceStatus = (id) => {
    setRepairs(prev => prev.map(rep => {
      if (rep.id === id) {
        const currIdx = STEPS.indexOf(rep.status);
        if (currIdx >= 0 && currIdx < STEPS.length - 1) {
          const nextStatus = STEPS[currIdx + 1];
          return { ...rep, status: nextStatus };
        }
      }
      return rep;
    }));
  };

  const handleWhatsAppUpdate = (rep) => {
    let message = '';
    if (rep.status === 'ready') {
      message = `Hello ${rep.customer_name}, great news! Your ${rep.device_model} (Ticket #${rep.id}) repair has been completed and quality tested. Your device is ready for collection at our PhoneSuite store. Outstanding balance: £${Number(rep.balance_due).toFixed(2)}. See you soon!`;
    } else {
      message = `Hello ${rep.customer_name}, your ${rep.device_model} (Ticket #${rep.id}) is currently in status: [${STEP_LABELS[rep.status]}]. Our technician is actively working on it. We will notify you once ready for collection. Thank you, PhoneSuite UK!`;
    }
    window.open(`https://wa.me/${rep.customer_phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCreateJob = (e) => {
    e.preventDefault();
    if (!custName || !deviceModel || !issueDesc) return;

    const est = parseFloat(estimatedCost) || 95.00;
    const dep = parseFloat(depositPaid) || 0.00;

    const newJob = {
      id: `rep-${Math.floor(100 + Math.random() * 900)}`,
      customer_name: custName,
      customer_phone: custPhone || '+44 7700 900123',
      device_type: deviceType,
      device_model: deviceModel,
      device_serial: deviceSerial || 'IMEI-' + Math.floor(10000000 + Math.random() * 90000000),
      issue_description: issueDesc,
      diagnostic_notes: 'Initial intake completed. Assigned to bench.',
      status: 'received',
      estimated_cost: est,
      deposit_paid: dep,
      balance_due: est - dep,
      assigned_technician: technician,
      created_at: new Date().toISOString(),
      branch: 'London Central Branch'
    };

    setRepairs(prev => [newJob, ...prev]);
    setIsNewJobModalOpen(false);
    setCustName('');
    setCustPhone('');
    setDeviceModel('');
    setDeviceSerial('');
    setIssueDesc('');
    setEstimatedCost('');
    setDepositPaid('0');
  };

  const filtered = repairs.filter(rep => {
    if (statusFilter !== 'all' && rep.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      rep.customer_name?.toLowerCase().includes(q) ||
      rep.device_model?.toLowerCase().includes(q) ||
      rep.id?.toLowerCase().includes(q) ||
      rep.issue_description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="mobile-portal-wrapper">
      <div className="mobile-app-shell">

        {/* Top Header */}
        <header className="mobile-header mobile-header-dark" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0b132b', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            type="button"
            onClick={() => router.push(`/${tenantSlug}/staff`)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '10px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} strokeWidth={2.4} />
            <span>Dashboard</span>
          </button>

          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '0.96rem', fontWeight: '900', color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
              Workshop &amp; Repairs
            </h1>
            <span style={{ fontSize: '0.64rem', color: '#60a5fa', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Electronics Diagnostics
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsNewJobModalOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #ff7a00 0%, #ea580c 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(234, 88, 12, 0.35)'
            }}
            title="Create Repair Ticket"
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>
        </header>

        {/* Scroll Body */}
        <main className="mobile-scroll-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '3rem' }}>

          {/* Repairs Hero Summary */}
          <div 
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1.2rem',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                HARDWARE WORKSHOP BENCH
              </span>
              <span style={{ fontSize: '0.62rem', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: '6px', fontWeight: '800' }}>
                {activeRepairs.length} ACTIVE JOBS
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {activeRepairs.length} Devices
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px', fontWeight: '500' }}>
                  {readyRepairs.length} ready for customer pickup
                </div>
              </div>

              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '0.65rem 0.85rem', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  Pipeline Revenue
                </span>
                <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#0f172a', marginTop: '2px' }}>
                  £{totalPipelineRevenue.toFixed(2)}
                </div>
                <span style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: '800' }}>
                  Labor &amp; OEM Parts
                </span>
              </div>
            </div>
          </div>

          {/* Status Filters (Apple Segmented Style) */}
          <div style={{ display: 'flex', gap: '0.45rem', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none' }}>
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              style={{
                padding: '0.48rem 0.85rem',
                borderRadius: '11px',
                fontSize: '0.74rem',
                fontWeight: statusFilter === 'all' ? '800' : '600',
                border: statusFilter === 'all' ? '1px solid #0f172a' : '1px solid #e2e8f0',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: statusFilter === 'all' ? '#0f172a' : '#ffffff',
                color: statusFilter === 'all' ? '#ffffff' : '#64748b',
                boxShadow: statusFilter === 'all' ? '0 2px 6px rgba(15, 23, 42, 0.2)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              All ({repairs.length})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('ready')}
              style={{
                padding: '0.48rem 0.85rem',
                borderRadius: '11px',
                fontSize: '0.74rem',
                fontWeight: statusFilter === 'ready' ? '800' : '600',
                border: statusFilter === 'ready' ? '1px solid #059669' : '1px solid #e2e8f0',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: statusFilter === 'ready' ? '#059669' : '#ffffff',
                color: statusFilter === 'ready' ? '#ffffff' : '#64748b',
                boxShadow: statusFilter === 'ready' ? '0 2px 6px rgba(5, 150, 105, 0.2)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Ready ({readyRepairs.length})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('repairing')}
              style={{
                padding: '0.48rem 0.85rem',
                borderRadius: '11px',
                fontSize: '0.74rem',
                fontWeight: statusFilter === 'repairing' ? '800' : '600',
                border: statusFilter === 'repairing' ? '1px solid #0f172a' : '1px solid #e2e8f0',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: statusFilter === 'repairing' ? '#0f172a' : '#ffffff',
                color: statusFilter === 'repairing' ? '#ffffff' : '#64748b',
                boxShadow: statusFilter === 'repairing' ? '0 2px 6px rgba(15, 23, 42, 0.2)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Repairing
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('diagnosing')}
              style={{
                padding: '0.48rem 0.85rem',
                borderRadius: '11px',
                fontSize: '0.74rem',
                fontWeight: statusFilter === 'diagnosing' ? '800' : '600',
                border: statusFilter === 'diagnosing' ? '1px solid #0f172a' : '1px solid #e2e8f0',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: statusFilter === 'diagnosing' ? '#0f172a' : '#ffffff',
                color: statusFilter === 'diagnosing' ? '#ffffff' : '#64748b',
                boxShadow: statusFilter === 'diagnosing' ? '0 2px 6px rgba(15, 23, 42, 0.2)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Diagnosing
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('received')}
              style={{
                padding: '0.48rem 0.85rem',
                borderRadius: '11px',
                fontSize: '0.74rem',
                fontWeight: statusFilter === 'received' ? '800' : '600',
                border: statusFilter === 'received' ? '1px solid #ea580c' : '1px solid #e2e8f0',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: statusFilter === 'received' ? '#ea580c' : '#ffffff',
                color: statusFilter === 'received' ? '#ffffff' : '#64748b',
                boxShadow: statusFilter === 'received' ? '0 2px 6px rgba(234, 88, 12, 0.2)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Intake
            </button>
          </div>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by customer, device model or ticket #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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

          {/* Repairs Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: '#fff', borderRadius: '18px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 0.5rem auto' }} />
                <p style={{ fontWeight: '800', fontSize: '0.95rem', color: '#0f172a' }}>No Repair Jobs</p>
                <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>No repair jobs currently match this filter.</p>
              </div>
            ) : (
              filtered.map((rep) => {
                const stepIdx = getStepIndex(rep.status);
                const isReady = rep.status === 'ready';
                const isPickedUp = rep.status === 'picked_up';

                return (
                  <div
                    key={rep.id}
                    style={{
                      background: '#ffffff',
                      border: isReady ? '1.5px solid #86efac' : '1px solid #e2e8f0',
                      borderRadius: '20px',
                      padding: '1.15rem',
                      boxShadow: isReady ? '0 4px 16px rgba(16, 185, 129, 0.08)' : '0 3px 12px rgba(0, 0, 0, 0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    {/* Top Row: Ticket ID + Customer + Status Badge */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontWeight: '900', fontSize: '0.95rem', color: '#0f172a' }}>
                            {rep.customer_name}
                          </span>
                          <span 
                            style={{ 
                              fontSize: '0.6rem', 
                              padding: '2px 7px', 
                              borderRadius: '6px', 
                              fontWeight: '800',
                              background: isReady ? '#dcfce7' : isPickedUp ? '#f1f5f9' : '#eff6ff',
                              color: isReady ? '#15803d' : isPickedUp ? '#64748b' : '#1d4ed8',
                              border: isReady ? '1px solid #86efac' : '1px solid #bfdbfe',
                              textTransform: 'uppercase'
                            }}
                          >
                            {STEP_LABELS[rep.status] || rep.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                          Ticket: <strong style={{ color: '#0f172a' }}>#{rep.id}</strong> &bull; Tech: {rep.assigned_technician}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0f172a' }}>
                          £{Number(rep.estimated_cost).toFixed(2)}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: rep.balance_due > 0 ? '#e11d48' : '#059669', fontWeight: '700' }}>
                          {rep.balance_due > 0 ? `Due: £${Number(rep.balance_due).toFixed(2)}` : 'Fully Paid'}
                        </div>
                      </div>
                    </div>

                    {/* Device & Issue Box */}
                    <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '0.65rem 0.8rem', border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '4px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {rep.device_type === 'laptop' ? <Laptop size={14} /> : rep.device_type === 'tablet' ? <Tablet size={14} /> : <Smartphone size={14} />}
                        </div>
                        <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>
                          {rep.device_model}
                        </span>
                        {rep.device_serial && (
                          <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                            ({rep.device_serial})
                          </span>
                        )}
                      </div>

                      <p style={{ fontSize: '0.75rem', color: '#475569', margin: 0, lineHeight: 1.35 }}>
                        {rep.issue_description}
                      </p>

                      {rep.diagnostic_notes && (
                        <div style={{ fontSize: '0.7rem', color: '#2563eb', marginTop: '4px', fontWeight: '600' }}>
                          &bull; {rep.diagnostic_notes}
                        </div>
                      )}
                    </div>

                    {/* 5-Step Stepper */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        {STEPS.map((step, idx) => (
                          <span 
                            key={step} 
                            style={{ 
                              fontSize: '0.6rem', 
                              fontWeight: idx <= stepIdx ? '800' : '500',
                              color: idx === stepIdx ? '#2563eb' : idx < stepIdx ? '#10b981' : '#94a3b8'
                            }}
                          >
                            {STEP_LABELS[step]}
                          </span>
                        ))}
                      </div>

                      <div style={{ display: 'flex', gap: '4px', height: '6px', borderRadius: '9999px', overflow: 'hidden', background: '#e2e8f0' }}>
                        {STEPS.map((step, idx) => (
                          <div
                            key={step}
                            style={{
                              flex: 1,
                              background: idx < stepIdx ? '#10b981' : idx === stepIdx ? '#2563eb' : '#e2e8f0',
                              transition: 'background 0.3s ease'
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '0.65rem' }}>
                      <a
                        href={`tel:${rep.customer_phone}`}
                        style={{
                          background: '#ffffff',
                          color: '#0f172a',
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '6px 10px',
                          fontSize: '0.74rem',
                          fontWeight: '700',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                        }}
                      >
                        <Phone size={13} strokeWidth={2.2} />
                        Call
                      </a>

                      <button
                        type="button"
                        onClick={() => handleWhatsAppUpdate(rep)}
                        style={{
                          background: 'rgba(16, 185, 129, 0.08)',
                          color: '#059669',
                          border: '1px solid rgba(16, 185, 129, 0.25)',
                          borderRadius: '10px',
                          padding: '6px 11px',
                          fontSize: '0.74rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <MessageSquare size={13} strokeWidth={2.2} />
                        WhatsApp
                      </button>

                      {!isPickedUp ? (
                        <button
                          type="button"
                          onClick={() => advanceStatus(rep.id)}
                          style={{
                            background: isReady ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#0f172a',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '6px 12px',
                            fontSize: '0.74rem',
                            fontWeight: '800',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: isReady ? '0 2px 8px rgba(16, 185, 129, 0.25)' : '0 2px 8px rgba(15, 23, 42, 0.18)'
                          }}
                        >
                          <span>{isReady ? 'Customer Pickup' : `Advance ->`}</span>
                          <ChevronRight size={13} strokeWidth={2.4} />
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <CheckCircle2 size={13} /> Collected
                        </span>
                      )}
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </main>

        {/* Modal: New Repair Intake */}
        {isNewJobModalOpen && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              backdropFilter: 'blur(4px)'
            }}
          >
            <div 
              style={{
                width: '100%',
                maxWidth: '480px',
                backgroundColor: '#ffffff',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '1.5rem',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                    Intake Repair Ticket
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Register broken electronic device
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewJobModalOpen(false)}
                  style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateJob} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    CUSTOMER NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Daniel Harris"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '4px' }}>
                      PHONE NUMBER
                    </label>
                    <input
                      type="text"
                      placeholder="+44 7911..."
                      value={custPhone}
                      onChange={(e) => setCustPhone(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '4px' }}>
                      DEVICE TYPE
                    </label>
                    <select
                      value={deviceType}
                      onChange={(e) => setDeviceType(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#fff' }}
                    >
                      <option value="phone">Smartphone</option>
                      <option value="tablet">Tablet / iPad</option>
                      <option value="laptop">MacBook / Laptop</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    DEVICE MODEL *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. iPhone 15 Pro, Galaxy S24, MacBook Air"
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    FAULT / ISSUE DESCRIPTION *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe cracked glass, charging port issue, water damage, etc."
                    value={issueDesc}
                    onChange={(e) => setIssueDesc(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '4px' }}>
                      ESTIMATED COST (£)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="120.00"
                      value={estimatedCost}
                      onChange={(e) => setEstimatedCost(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '4px' }}>
                      DEPOSIT PAID (£)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="20.00"
                      value={depositPaid}
                      onChange={(e) => setDepositPaid(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    marginTop: '0.75rem',
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '14px',
                    padding: '0.85rem',
                    fontSize: '0.9rem',
                    fontWeight: '900',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
                  }}
                >
                  Create Workshop Job Ticket
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
