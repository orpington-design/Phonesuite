'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Smartphone, 
  AlertTriangle, 
  MessageSquare, 
  Phone, 
  Truck, 
  CheckCircle2, 
  Search, 
  ShieldAlert, 
  RotateCcw,
  MapPin, 
  Calendar, 
  FileText,
  Plus,
  X,
  Laptop,
  Tablet,
  ExternalLink
} from 'lucide-react';
import { 
  INITIAL_DEVICE_COLLECTIONS, 
  getSavedCollections, 
  persistCollections 
} from '../data/staffData';

export default function DeviceCollectionsPage() {
  const router = useRouter();
  const params = useParams();
  const tenantSlug = params.tenantSlug || 'premiumphonex';

  const [collections, setCollections] = useState(() => getSavedCollections());
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all, pending_recovery, recovery_dispatched, retrieved
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New Collection Form
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newDeviceModel, setNewDeviceModel] = useState('');
  const [newContractId, setNewContractId] = useState('');
  const [newAmountDue, setNewAmountDue] = useState('');
  const [newDaysOverdue, setNewDaysOverdue] = useState('14');

  useEffect(() => {
    persistCollections(collections);
  }, [collections]);

  // Statistics
  const pendingCount = collections.filter(c => c.status === 'pending_recovery').length;
  const dispatchedCount = collections.filter(c => c.status === 'recovery_dispatched').length;
  const retrievedCount = collections.filter(c => c.status === 'retrieved').length;
  const totalDueAmount = collections
    .filter(c => c.status !== 'retrieved')
    .reduce((sum, c) => sum + Number(c.amountDue || 0), 0);
  const totalDeviceAssetValue = collections
    .filter(c => c.status !== 'retrieved')
    .reduce((sum, c) => sum + Number(c.deviceValue || 0), 0);

  // Filtered List
  const filtered = collections.filter(item => {
    if (activeFilter !== 'all' && item.status !== activeFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.customerName?.toLowerCase().includes(q) ||
      item.deviceModel?.toLowerCase().includes(q) ||
      item.contractId?.toLowerCase().includes(q) ||
      item.customerPhone?.toLowerCase().includes(q)
    );
  });

  // Action: Send Legal Notice
  const handleSendNotice = (item) => {
    const message = encodeURIComponent(
      `URGENT REPOSSESSION NOTICE: Hello ${item.customerName}, your Rent-to-Own agreement #${item.contractId} for the ${item.deviceModel} is now ${item.daysOverdue} days past due (Overdue: £${Number(item.amountDue).toFixed(2)}). Under your agreement terms, failure to clear this balance requires immediate surrender and return of the hardware device to our PhoneSuite store. Please reply or contact us immediately to resolve this matter.`
    );
    window.open(`https://wa.me/${item.customerPhone?.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');

    // Update notice count
    setCollections(prev => prev.map(c => {
      if (c.id === item.id) {
        return {
          ...c,
          noticeSentCount: (c.noticeSentCount || 0) + 1,
          lastNoticeDate: new Date().toISOString().split('T')[0]
        };
      }
      return c;
    }));
  };

  // Action: Dispatch Field Agent
  const handleToggleDispatch = (id) => {
    setCollections(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'recovery_dispatched' ? 'pending_recovery' : 'recovery_dispatched';
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  // Action: Mark Retrieved
  const handleMarkRetrieved = (id) => {
    setCollections(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, status: 'retrieved', retrievedAt: new Date().toISOString() };
      }
      return c;
    }));
  };

  // Action: Add new collection
  const handleAddCollection = (e) => {
    e.preventDefault();
    if (!newCustName || !newDeviceModel || !newAmountDue) return;

    const newRecord = {
      id: `col-${Date.now()}`,
      customerName: newCustName,
      customerPhone: newCustPhone || '+44 7700 900000',
      customerEmail: '',
      customerAddress: newCustAddress || 'London, UK',
      deviceModel: newDeviceModel,
      deviceSerial: 'SN-' + Math.floor(100000 + Math.random() * 900000),
      contractId: newContractId || `RTO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      agreementDate: new Date().toISOString().split('T')[0],
      daysOverdue: parseInt(newDaysOverdue) || 14,
      amountDue: parseFloat(newAmountDue) || 0,
      deviceValue: (parseFloat(newAmountDue) * 6) || 800,
      status: 'pending_recovery',
      branch: 'London Central Branch',
      noticeSentCount: 0,
      lastNoticeDate: null
    };

    setCollections(prev => [newRecord, ...prev]);
    setIsNewModalOpen(false);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');
    setNewDeviceModel('');
    setNewContractId('');
    setNewAmountDue('');
  };

  return (
    <div className="mobile-portal-wrapper">
      <div className="mobile-app-shell">

        {/* Top Header */}
        <header className="mobile-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            type="button"
            onClick={() => router.push(`/${tenantSlug}/staff`)}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '10px',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#0f172a',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>

          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '0.95rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>
              Device Collections
            </h1>
            <span style={{ fontSize: '0.65rem', color: '#ea580c', fontWeight: '800', textTransform: 'uppercase' }}>
              Hardware Recovery &amp; RTO
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsNewModalOpen(true)}
            style={{
              background: '#ea580c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(234, 88, 12, 0.3)'
            }}
            title="Add Repossession Case"
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>
        </header>

        {/* Scrollable Content */}
        <main className="mobile-scroll-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '3rem' }}>
          
          {/* Recovery Overview Hero Banner */}
          <div 
            style={{
              background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
              border: '1.5px solid #fed7aa',
              borderRadius: '22px',
              padding: '1.25rem',
              boxShadow: '0 8px 24px -4px rgba(234, 88, 12, 0.12)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#9a3412', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                REPOSSESSION &amp; RECOVERY DESK
              </span>
              <span style={{ fontSize: '0.62rem', background: '#ea580c', color: '#fff', padding: '2px 8px', borderRadius: '9999px', fontWeight: '800' }}>
                {pendingCount + dispatchedCount} ACTIVE CASES
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#9a3412', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  £{totalDueAmount.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#c2410c', marginTop: '4px', fontWeight: '600' }}>
                  Defaulted installment payments
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.7)', borderRadius: '14px', padding: '0.6rem 0.8rem', border: '1px solid rgba(234, 88, 12, 0.2)' }}>
                <span style={{ fontSize: '0.62rem', color: '#78350f', fontWeight: '700', textTransform: 'uppercase' }}>
                  Device Assets Value
                </span>
                <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#0f172a' }}>
                  £{totalDeviceAssetValue.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                </div>
                <span style={{ fontSize: '0.6rem', color: '#059669', fontWeight: '700' }}>
                  Protected by legal contract
                </span>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '2px' }}>
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              style={{
                padding: '6px 12px',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: '800',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: activeFilter === 'all' ? '#0f172a' : '#ffffff',
                color: activeFilter === 'all' ? '#ffffff' : '#64748b',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
              }}
            >
              All ({collections.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('pending_recovery')}
              style={{
                padding: '6px 12px',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: '800',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: activeFilter === 'pending_recovery' ? '#ea580c' : '#ffffff',
                color: activeFilter === 'pending_recovery' ? '#ffffff' : '#64748b',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
              }}
            >
              Notice Required ({pendingCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('recovery_dispatched')}
              style={{
                padding: '6px 12px',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: '800',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: activeFilter === 'recovery_dispatched' ? '#dc2626' : '#ffffff',
                color: activeFilter === 'recovery_dispatched' ? '#ffffff' : '#64748b',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
              }}
            >
              Agent Dispatched ({dispatchedCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('retrieved')}
              style={{
                padding: '6px 12px',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: '800',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: activeFilter === 'retrieved' ? '#059669' : '#ffffff',
                color: activeFilter === 'retrieved' ? '#ffffff' : '#64748b',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
              }}
            >
              Retrieved ({retrievedCount})
            </button>
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by customer, device or contract #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.3rem',
                borderRadius: '14px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                fontSize: '0.82rem',
                color: '#0f172a'
              }}
            />
          </div>

          {/* Collections List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: '#fff', borderRadius: '18px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 0.5rem auto' }} />
                <p style={{ fontWeight: '800', fontSize: '0.95rem', color: '#0f172a' }}>No Collections Pending</p>
                <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>All device financing accounts are in good standing.</p>
              </div>
            ) : (
              filtered.map((item) => {
                const isRetrieved = item.status === 'retrieved';
                const isDispatched = item.status === 'recovery_dispatched';

                return (
                  <div
                    key={item.id}
                    style={{
                      background: isRetrieved ? '#f8fafc' : '#ffffff',
                      border: isRetrieved 
                        ? '1px solid #e2e8f0' 
                        : isDispatched 
                          ? '1.5px solid #fca5a5' 
                          : '1.5px solid #fed7aa',
                      borderRadius: '20px',
                      padding: '1.15rem',
                      boxShadow: isRetrieved ? 'none' : '0 4px 16px rgba(0, 0, 0, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      opacity: isRetrieved ? 0.8 : 1
                    }}
                  >
                    {/* Header Row: Customer & Badge */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontWeight: '900', fontSize: '0.95rem', color: '#0f172a' }}>
                            {item.customerName}
                          </span>
                          {isRetrieved ? (
                            <span style={{ fontSize: '0.6rem', padding: '2px 6px', background: '#dcfce7', color: '#15803d', borderRadius: '6px', fontWeight: '800' }}>
                              RETRIEVED
                            </span>
                          ) : isDispatched ? (
                            <span style={{ fontSize: '0.6rem', padding: '2px 6px', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', fontWeight: '800' }}>
                              AGENT DISPATCHED
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.6rem', padding: '2px 6px', background: '#fff7ed', color: '#c2410c', borderRadius: '6px', fontWeight: '800', border: '1px solid #fed7aa' }}>
                              {item.daysOverdue} DAYS OVERDUE
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                          Agreement: <strong>{item.contractId}</strong> &bull; Serial: {item.deviceSerial}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: '900', color: isRetrieved ? '#059669' : '#e11d48' }}>
                          £{Number(item.amountDue).toFixed(2)}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: '600' }}>
                          Est. Device: £{Number(item.deviceValue).toFixed(0)}
                        </div>
                      </div>
                    </div>

                    {/* Device Details Box */}
                    <div 
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #f1f5f9',
                        borderRadius: '12px',
                        padding: '0.65rem 0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#fed7aa', color: '#9a3412', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Smartphone size={16} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a' }}>
                            {item.deviceModel}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <MapPin size={11} /> {item.customerAddress}
                          </div>
                        </div>
                      </div>

                      {item.noticeSentCount > 0 && (
                        <span style={{ fontSize: '0.62rem', background: '#fef3c7', color: '#b45309', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                          {item.noticeSentCount} Notice(s)
                        </span>
                      )}
                    </div>

                    {/* Actions Row */}
                    {!isRetrieved && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.65rem' }}>
                        
                        {/* Call Button */}
                        <a
                          href={`tel:${item.customerPhone}`}
                          style={{
                            background: '#f1f5f9',
                            color: '#0f172a',
                            borderRadius: '10px',
                            padding: '6px 9px',
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Phone size={13} />
                          Call
                        </a>

                        {/* WhatsApp Repossession Notice */}
                        <button
                          type="button"
                          onClick={() => handleSendNotice(item)}
                          style={{
                            background: '#22c55e',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '6px 9px',
                            fontSize: '0.72rem',
                            fontWeight: '800',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <MessageSquare size={13} />
                          WhatsApp Notice
                        </button>

                        {/* Toggle Dispatch Field Agent */}
                        <button
                          type="button"
                          onClick={() => handleToggleDispatch(item.id)}
                          style={{
                            background: isDispatched ? '#dc2626' : '#0f172a',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '6px 9px',
                            fontSize: '0.72rem',
                            fontWeight: '800',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Truck size={13} />
                          {isDispatched ? 'Dispatched' : 'Dispatch'}
                        </button>

                        {/* Mark Retrieved */}
                        <button
                          type="button"
                          onClick={() => handleMarkRetrieved(item.id)}
                          style={{
                            background: '#059669',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '6px 9px',
                            fontSize: '0.72rem',
                            fontWeight: '800',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <CheckCircle2 size={13} />
                          Recovered
                        </button>
                      </div>
                    )}

                    {isRetrieved && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontSize: '0.72rem', fontWeight: '700', paddingTop: '4px' }}>
                        <CheckCircle2 size={14} />
                        Device successfully repossessed and checked into store inventory.
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>

        </main>

        {/* Modal: Register New Repossession Case */}
        {isNewModalOpen && (
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
                    Register Repossession Case
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Defaulted Rent-to-Own agreement
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddCollection} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    CUSTOMER NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eleanor Wright"
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '4px' }}>
                      PHONE *
                    </label>
                    <input
                      type="text"
                      placeholder="+44 7911..."
                      value={newCustPhone}
                      onChange={(e) => setNewCustPhone(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '4px' }}>
                      CONTRACT #
                    </label>
                    <input
                      type="text"
                      placeholder="RTO-2026-..."
                      value={newContractId}
                      onChange={(e) => setNewContractId(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    CUSTOMER ADDRESS
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 15 Gloucester Rd, Kensington, London"
                    value={newCustAddress}
                    onChange={(e) => setNewCustAddress(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    DEVICE MODEL *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apple iPad Pro 12.9 M2 256GB"
                    value={newDeviceModel}
                    onChange={(e) => setNewDeviceModel(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '4px' }}>
                      AMOUNT DUE (£) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="68.00"
                      value={newAmountDue}
                      onChange={(e) => setNewAmountDue(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '4px' }}>
                      DAYS OVERDUE
                    </label>
                    <input
                      type="number"
                      placeholder="14"
                      value={newDaysOverdue}
                      onChange={(e) => setNewDaysOverdue(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    marginTop: '0.75rem',
                    background: 'linear-gradient(135deg, #ff7a00 0%, #ea580c 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '14px',
                    padding: '0.85rem',
                    fontSize: '0.9rem',
                    fontWeight: '900',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(234, 88, 12, 0.3)'
                  }}
                >
                  Create Repossession File
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
