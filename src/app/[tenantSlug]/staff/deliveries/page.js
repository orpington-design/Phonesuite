'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Truck, 
  Package, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Search, 
  Plus, 
  X, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  Calendar, 
  User, 
  Sparkles, 
  ChevronRight, 
  Navigation,
  Copy,
  Check,
  RotateCcw
} from 'lucide-react';
import { 
  INITIAL_DELIVERIES, 
  getSavedDeliveries, 
  persistDeliveries,
  formatMoney 
} from '../data/staffData';
import { StaffLanguageProvider, useStaffLanguage } from '../context/StaffLanguageContext';

export default function DeliveriesPage() {
  return (
    <StaffLanguageProvider>
      <DeliveriesPageContent />
    </StaffLanguageProvider>
  );
}

function DeliveriesPageContent() {
  const router = useRouter();
  const params = useParams();
  const tenantSlug = params?.tenantSlug || 'premiumphonex';
  const { language } = useStaffLanguage();
  const isPt = language === 'pt';

  const [deliveries, setDeliveries] = useState(() => getSavedDeliveries());
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all | out_for_delivery | booked | delivered
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // New Delivery Form State
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newPostcode, setNewPostcode] = useState('');
  const [newItems, setNewItems] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCourier, setNewCourier] = useState('DPD Express Next-Day');
  const [newTimeWindow, setNewTimeWindow] = useState('14:00 - 16:00');
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    persistDeliveries(deliveries);
  }, [deliveries]);

  // Statistics
  const totalCount = deliveries.length;
  const outForDeliveryCount = deliveries.filter(d => d.status === 'out_for_delivery').length;
  const bookedCount = deliveries.filter(d => d.status === 'booked').length;
  const deliveredCount = deliveries.filter(d => d.status === 'delivered').length;
  const activeBookedCount = deliveries.filter(d => d.status !== 'delivered').length;

  // Filtered List
  const filtered = deliveries.filter(item => {
    if (activeFilter === 'out_for_delivery' && item.status !== 'out_for_delivery') return false;
    if (activeFilter === 'booked' && item.status !== 'booked') return false;
    if (activeFilter === 'delivered' && item.status !== 'delivered') return false;
    if (!search.trim()) return true;

    const q = search.toLowerCase();
    return (
      item.customerName?.toLowerCase().includes(q) ||
      item.deliveryAddress?.toLowerCase().includes(q) ||
      item.trackingCode?.toLowerCase().includes(q) ||
      item.courier?.toLowerCase().includes(q) ||
      item.items?.toLowerCase().includes(q) ||
      item.customerPhone?.toLowerCase().includes(q)
    );
  });

  // Action: Advance Delivery Status
  const handleAdvanceStatus = (id) => {
    setDeliveries(prev => prev.map(del => {
      if (del.id === id) {
        if (del.status === 'booked') {
          return {
            ...del,
            status: 'out_for_delivery',
            timeline: del.timeline.map((t, idx) => idx <= 2 ? { ...t, completed: true } : t)
          };
        } else if (del.status === 'out_for_delivery') {
          const nowTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
          return {
            ...del,
            status: 'delivered',
            timeline: del.timeline.map(t => ({ ...t, completed: true, time: t.step === 'Delivered' ? nowTime : t.time }))
          };
        }
      }
      return del;
    }));
  };

  // Action: Send WhatsApp Tracking Update
  const handleSendWhatsApp = (del) => {
    const text = encodeURIComponent(
      `Hello ${del.customerName}! Your PhoneSuite order (${del.orderNumber}) is scheduled for delivery with ${del.courier}.\n\n📅 Delivery Window: ${del.timeWindow} (Today)\n📍 Address: ${del.deliveryAddress}\n📦 Tracking Code: ${del.trackingCode}\n\nOur driver ${del.driverName || 'will contact you upon arrival'}. Thank you for choosing PhoneSuite!`
    );
    window.open(`https://wa.me/${del.customerPhone?.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  // Action: Copy Tracking
  const handleCopyTracking = (code, id) => {
    navigator.clipboard?.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Action: Create New Delivery
  const handleCreateDelivery = (e) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustAddress.trim()) return;

    const newId = `del-${Date.now().toString().slice(-4)}`;
    const randomDelNum = `DEL-2026-${Math.floor(100 + Math.random() * 900)}`;
    const randomTrk = newCourier.includes('DPD') 
      ? `DPD-GB-${Math.floor(100000 + Math.random() * 900000)}` 
      : newCourier.includes('Royal')
      ? `RM-TRK-${Math.floor(100000 + Math.random() * 900000)}`
      : `PS-VAN-${Math.floor(100 + Math.random() * 900)}`;

    const newDeliveryObj = {
      id: newId,
      deliveryNumber: randomDelNum,
      orderNumber: `ORD-2026-${Math.floor(9000 + Math.random() * 999)}`,
      customerName: newCustName,
      customerPhone: newCustPhone || '+44 7700 900000',
      customerEmail: 'customer@order.co.uk',
      deliveryAddress: newCustAddress,
      postcode: newPostcode || 'London UK',
      items: newItems || 'Hardware Device & Accessories',
      itemCount: 1,
      courier: newCourier,
      trackingCode: randomTrk,
      scheduledDate: '2026-09-11',
      timeWindow: newTimeWindow || '14:00 - 16:00',
      status: 'booked',
      totalAmount: parseFloat(newAmount) || 299.00,
      driverName: newCourier.includes('Van') ? 'Alex Rivera (Staff Driver)' : 'Assigned Courier Driver',
      driverPhone: '+44 7700 900123',
      notes: newNotes || 'Handle with care.',
      timeline: [
        { step: 'Booked & Manifested', time: 'Just Now', completed: true },
        { step: 'Collected by Courier', time: 'Pending', completed: false },
        { step: 'Out for Delivery', time: 'Pending', completed: false },
        { step: 'Delivered', time: 'Pending', completed: false }
      ]
    };

    setDeliveries([newDeliveryObj, ...deliveries]);
    setIsNewModalOpen(false);

    // Reset Form
    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');
    setNewPostcode('');
    setNewItems('');
    setNewAmount('');
    setNewNotes('');
  };

  return (
    <div className="mobile-portal-wrapper">
      <div className="mobile-app-shell">

        {/* Top Header */}
        <header 
          className="mobile-header mobile-header-dark" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            backgroundColor: '#0b132b', 
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0.75rem 1rem'
          }}
        >
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
            <ArrowLeft size={16} />
            <span>{isPt ? 'Painel' : 'Dashboard'}</span>
          </button>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.94rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Truck size={17} color="#38bdf8" />
              <span>{isPt ? 'Entregas & Despacho' : 'Delivery Progress'}</span>
            </div>
            <div style={{ fontSize: '0.66rem', color: '#94a3b8', fontWeight: '600' }}>
              {isPt ? 'Rastreio de Courier & Motoristas' : 'Courier & Driver Dispatch'}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsNewModalOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              border: 'none',
              borderRadius: '10px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(8, 145, 178, 0.35)'
            }}
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>{isPt ? 'Agendar' : 'Book'}</span>
          </button>
        </header>

        {/* Scrollable Content */}
        <main className="mobile-scroll-body" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '3.5rem' }}>

          {/* Hero Banner: Ocean Cyan / Teal Gradient */}
          <div 
            style={{ 
              background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)', 
              borderRadius: '18px', 
              padding: '1.25rem', 
              color: '#ffffff',
              boxShadow: '0 8px 24px -4px rgba(8, 145, 178, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', top: -30, right: -30, width: '130px', height: '130px', background: 'radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'rgba(255, 255, 255, 0.9)' }}>
                {isPt ? 'PAINEL DE DESPACHO AO VIVO' : 'LIVE DISPATCH DESK'}
              </span>
              <span 
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.62rem', 
                  fontWeight: '800', 
                  padding: '2px 8px', 
                  borderRadius: '9999px', 
                  background: 'rgba(255, 255, 255, 0.25)', 
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.35)' 
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 6px #4ade80' }} />
                {outForDeliveryCount} {isPt ? 'EM TRÂNSITO' : 'EN ROUTE'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '2.3rem', fontWeight: '900', lineHeight: 1, letterSpacing: '-0.03em', color: '#ffffff' }}>
                  {activeBookedCount}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.9)', fontWeight: '700', marginTop: '4px' }}>
                  {isPt ? 'Entregas Agendadas para Hoje' : 'Deliveries Booked for Today'}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.66rem', color: 'rgba(255, 255, 255, 0.82)', textTransform: 'uppercase', fontWeight: '700' }}>
                  {isPt ? 'Concluídas Hoje' : 'Completed Today'}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#ffffff', marginTop: '2px' }}>
                  {deliveredCount} {isPt ? 'Entregues' : 'Delivered'}
                </div>
              </div>
            </div>

            {/* 4-KPI Grid Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginTop: '1rem', paddingTop: '0.9rem', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <div style={{ background: 'rgba(0, 0, 0, 0.15)', padding: '6px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.58rem', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '700' }}>Total</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#ffffff', marginTop: '1px' }}>{totalCount}</div>
              </div>
              <div style={{ background: 'rgba(0, 0, 0, 0.15)', padding: '6px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.58rem', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '700' }}>En Route</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#38bdf8', marginTop: '1px' }}>{outForDeliveryCount}</div>
              </div>
              <div style={{ background: 'rgba(0, 0, 0, 0.15)', padding: '6px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.58rem', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '700' }}>Booked</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#fef08a', marginTop: '1px' }}>{bookedCount}</div>
              </div>
              <div style={{ background: 'rgba(0, 0, 0, 0.15)', padding: '6px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.58rem', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '700' }}>Delivered</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#86efac', marginTop: '1px' }}>{deliveredCount}</div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isPt ? 'Buscar por cliente, rastreio, endereço ou courier...' : 'Search by customer, tracking, address, courier...'}
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                fontSize: '0.8rem',
                background: '#ffffff',
                outline: 'none',
                color: '#0f172a'
              }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {[
              { id: 'all', label: isPt ? `Todas (${totalCount})` : `All (${totalCount})` },
              { id: 'out_for_delivery', label: isPt ? `Em Rota (${outForDeliveryCount})` : `Out for Delivery (${outForDeliveryCount})` },
              { id: 'booked', label: isPt ? `Agendadas (${bookedCount})` : `Booked (${bookedCount})` },
              { id: 'delivered', label: isPt ? `Entregues (${deliveredCount})` : `Delivered (${deliveredCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  border: activeFilter === tab.id ? '1.5px solid #0891b2' : '1px solid #e2e8f0',
                  background: activeFilter === tab.id ? '#0891b2' : '#ffffff',
                  color: activeFilter === tab.id ? '#ffffff' : '#64748b',
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: activeFilter === tab.id ? '0 2px 8px rgba(8, 145, 178, 0.25)' : 'none'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Deliveries List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: '#ffffff', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                <Truck size={36} color="#94a3b8" style={{ margin: '0 auto 8px auto' }} />
                <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>
                  {isPt ? 'Nenhuma entrega encontrada' : 'No deliveries found'}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                  {isPt ? 'Tente mudar seus filtros ou agende uma nova entrega.' : 'Try adjusting your filters or book a new delivery.'}
                </div>
              </div>
            ) : (
              filtered.map(del => {
                const isOut = del.status === 'out_for_delivery';
                const isBooked = del.status === 'booked';
                const isDelivered = del.status === 'delivered';

                return (
                  <div 
                    key={del.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '16px',
                      border: isOut ? '1.5px solid #38bdf8' : '1px solid #e2e8f0',
                      padding: '1.1rem',
                      boxShadow: isOut ? '0 6px 18px rgba(14, 165, 233, 0.12)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem'
                    }}
                  >
                    {/* Top Row: Tracking, Courier & Status Pill */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span 
                          onClick={() => handleCopyTracking(del.trackingCode, del.id)}
                          style={{ 
                            fontFamily: 'monospace', 
                            fontSize: '0.74rem', 
                            fontWeight: '800', 
                            color: '#0f172a',
                            background: '#f1f5f9',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Click to copy tracking code"
                        >
                          {del.trackingCode}
                          {copiedId === del.id ? <Check size={12} color="#10b981" /> : <Copy size={12} color="#64748b" />}
                        </span>

                        <span style={{ fontSize: '0.65rem', fontWeight: '800', background: '#e0f2fe', color: '#0369a1', padding: '2px 7px', borderRadius: '9999px' }}>
                          {del.courier.split(' ')[0]}
                        </span>
                      </div>

                      {/* Status Badge */}
                      <span 
                        style={{ 
                          fontSize: '0.64rem', 
                          fontWeight: '800', 
                          padding: '3px 10px', 
                          borderRadius: '9999px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: isOut ? '#ecfeff' : isDelivered ? '#ecfdf5' : '#fef3c7',
                          color: isOut ? '#0891b2' : isDelivered ? '#059669' : '#b45309',
                          border: isOut ? '1px solid #a5f3fc' : isDelivered ? '1px solid #a7f3d0' : '1px solid #fde68a'
                        }}
                      >
                        {isOut && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0891b2', display: 'inline-block' }} />}
                        {isDelivered && <CheckCircle2 size={12} />}
                        {isBooked && <Clock size={12} />}
                        <span>
                          {isOut ? (isPt ? 'Em Rota' : 'Out for Delivery') : isDelivered ? (isPt ? 'Entregue' : 'Delivered') : (isPt ? 'Agendada' : 'Booked')}
                        </span>
                      </span>
                    </div>

                    {/* Customer & Destination */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '0.98rem', fontWeight: '900', color: '#0f172a' }}>
                          {del.customerName}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', color: '#64748b', marginTop: '3px' }}>
                          <MapPin size={14} color="#0891b2" style={{ flexShrink: 0 }} />
                          <span>{del.deliveryAddress}</span>
                        </div>
                      </div>

                      {/* Google Maps Shortcut */}
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(del.deliveryAddress)}`} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#0891b2',
                          textDecoration: 'none',
                          flexShrink: 0
                        }}
                        title="Open address in Google Maps"
                      >
                        <Navigation size={15} />
                      </a>
                    </div>

                    {/* Delivery Window & Hardware Package Item */}
                    <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem' }}>
                        <span style={{ color: '#64748b', fontWeight: '700' }}>
                          {isPt ? 'Janela de Entrega:' : 'Delivery Window:'}
                        </span>
                        <strong style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={13} color="#0891b2" />
                          {del.timeWindow} ({isPt ? 'Hoje' : 'Today'})
                        </strong>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '0.74rem', borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}>
                        <div>
                          <div style={{ fontWeight: '800', color: '#0f172a' }}>{del.items}</div>
                          <div style={{ fontSize: '0.66rem', color: '#64748b', marginTop: '1px' }}>
                            Order #{del.orderNumber} &bull; Courier: {del.courier}
                          </div>
                        </div>
                        <strong style={{ color: '#0f172a', fontWeight: '900' }}>{formatMoney(del.totalAmount)}</strong>
                      </div>

                      {del.notes && (
                        <div style={{ fontSize: '0.68rem', color: '#d97706', background: '#fef3c7', padding: '3px 8px', borderRadius: '6px', fontWeight: '600' }}>
                          Note: {del.notes}
                        </div>
                      )}
                    </div>

                    {/* 4-Step Progress Visual Bar */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.66rem', fontWeight: '800', textTransform: 'uppercase', color: '#94a3b8' }}>
                          {isPt ? 'Etapas do Despacho' : 'Dispatch Steps'}
                        </span>
                        <span style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: '700' }}>
                          Driver: {del.driverName}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                        {del.timeline.map((step, sIdx) => (
                          <div key={sIdx} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            <div 
                              style={{ 
                                height: '5px', 
                                borderRadius: '9999px', 
                                background: step.completed ? (isDelivered ? '#10b981' : '#0891b2') : '#e2e8f0' 
                              }} 
                            />
                            <span style={{ fontSize: '0.58rem', fontWeight: step.completed ? '800' : '600', color: step.completed ? '#0f172a' : '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {step.step.split(' ')[0]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '0.35rem' }}>
                      <button
                        type="button"
                        onClick={() => handleSendWhatsApp(del)}
                        style={{
                          background: '#ecfdf5',
                          border: '1px solid #a7f3d0',
                          borderRadius: '10px',
                          padding: '9px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          color: '#065f46',
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          cursor: 'pointer'
                        }}
                      >
                        <MessageSquare size={14} color="#059669" />
                        <span>{isPt ? 'Enviar ETA Zap' : 'WhatsApp ETA'}</span>
                      </button>

                      {del.status !== 'delivered' ? (
                        <button
                          type="button"
                          onClick={() => handleAdvanceStatus(del.id)}
                          style={{
                            background: isOut ? '#10b981' : '#0891b2',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '9px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            color: '#ffffff',
                            fontSize: '0.75rem',
                            fontWeight: '800',
                            cursor: 'pointer',
                            boxShadow: isOut ? '0 2px 8px rgba(16, 185, 129, 0.3)' : '0 2px 8px rgba(8, 145, 178, 0.3)'
                          }}
                        >
                          {isOut ? (
                            <>
                              <CheckCircle2 size={15} />
                              <span>{isPt ? 'Confirmar Entrega' : 'Mark Delivered'}</span>
                            </>
                          ) : (
                            <>
                              <Truck size={15} />
                              <span>{isPt ? 'Despachar (Em Rota)' : 'Dispatch En Route'}</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <div 
                          style={{ 
                            background: '#f1f5f9', 
                            borderRadius: '10px', 
                            padding: '9px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: '5px',
                            color: '#059669',
                            fontSize: '0.74rem',
                            fontWeight: '800'
                          }}
                        >
                          <CheckCircle2 size={15} />
                          <span>{isPt ? 'Entregue com Sucesso' : 'Delivered & Signed'}</span>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </main>

        {/* ========================================================
            MODAL: BOOK NEW DELIVERY
        ======================================================== */}
        {isNewModalOpen && (
          <div 
            style={{ 
              position: 'fixed', 
              inset: 0, 
              background: 'rgba(15, 23, 42, 0.65)', 
              backdropFilter: 'blur(4px)',
              zIndex: 9999, 
              display: 'flex', 
              alignItems: 'flex-end', 
              justifyContent: 'center' 
            }}
          >
            <div 
              style={{ 
                background: '#ffffff', 
                width: '100%', 
                maxWidth: '430px', 
                borderTopLeftRadius: '24px', 
                borderTopRightRadius: '24px', 
                padding: '1.25rem',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              {/* Modal Drag Bar */}
              <div style={{ width: '40px', height: '4px', background: '#cbd5e1', borderRadius: '9999px', margin: '0 auto 4px auto' }} />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
                    <Truck size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '900', color: '#0f172a' }}>
                      {isPt ? 'Agendar Nova Entrega' : 'Book New Delivery'}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b' }}>
                      {isPt ? 'Despache via courier ou van própria da loja' : 'Dispatch via courier or in-house store van'}
                    </p>
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={() => setIsNewModalOpen(false)}
                  style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Booking Form */}
              <form onSubmit={handleCreateDelivery} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '800', color: '#334155', marginBottom: '3px' }}>
                    {isPt ? 'Nome do Cliente *' : 'Customer Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustName}
                    onChange={e => setNewCustName(e.target.value)}
                    placeholder="e.g. Charlotte King"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '800', color: '#334155', marginBottom: '3px' }}>
                      {isPt ? 'Telefone / WhatsApp' : 'Phone / WhatsApp'}
                    </label>
                    <input
                      type="text"
                      value={newCustPhone}
                      onChange={e => setNewCustPhone(e.target.value)}
                      placeholder="+44 7900 123456"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '800', color: '#334155', marginBottom: '3px' }}>
                      {isPt ? 'Código Postal (Postcode)' : 'UK Postcode'}
                    </label>
                    <input
                      type="text"
                      value={newPostcode}
                      onChange={e => setNewPostcode(e.target.value)}
                      placeholder="e.g. SW1A 1AA"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '800', color: '#334155', marginBottom: '3px' }}>
                    {isPt ? 'Endereço Completo de Entrega *' : 'Full Delivery Address *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustAddress}
                    onChange={e => setNewCustAddress(e.target.value)}
                    placeholder="e.g. 10 Downing Street, Westminster, London"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '800', color: '#334155', marginBottom: '3px' }}>
                    {isPt ? 'Produtos / Aparelhos do Pacote' : 'Package Hardware & Items'}
                  </label>
                  <input
                    type="text"
                    value={newItems}
                    onChange={e => setNewItems(e.target.value)}
                    placeholder="e.g. iPhone 15 Pro Max 256GB (Black Titanium)"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '800', color: '#334155', marginBottom: '3px' }}>
                      {isPt ? 'Courier / Transportadora' : 'Courier / Dispatcher'}
                    </label>
                    <select
                      value={newCourier}
                      onChange={e => setNewCourier(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.78rem', background: '#ffffff', outline: 'none' }}
                    >
                      <option value="DPD Express Next-Day">DPD Express Next-Day</option>
                      <option value="Royal Mail Special Delivery 24">Royal Mail Special Delivery 24</option>
                      <option value="Store Same-Day Express Van">Store Same-Day Express Van</option>
                      <option value="DHL Express UK">DHL Express UK</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '800', color: '#334155', marginBottom: '3px' }}>
                      {isPt ? 'Janela Horária' : 'Time Window'}
                    </label>
                    <select
                      value={newTimeWindow}
                      onChange={e => setNewTimeWindow(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.78rem', background: '#ffffff', outline: 'none' }}
                    >
                      <option value="10:00 - 12:00">10:00 - 12:00 (Morning)</option>
                      <option value="12:00 - 14:00">12:00 - 14:00 (Lunch)</option>
                      <option value="14:00 - 16:00">14:00 - 16:00 (Afternoon)</option>
                      <option value="16:00 - 18:00">16:00 - 18:00 (Late)</option>
                      <option value="18:00 - 20:00">18:00 - 20:00 (Evening)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '800', color: '#334155', marginBottom: '3px' }}>
                    {isPt ? 'Instruções Especiais para o Motorista' : 'Driver Delivery Instructions'}
                  </label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={e => setNewNotes(e.target.value)}
                    placeholder="e.g. Ring flat 2, require ID signature"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsNewModalOpen(false)}
                    style={{ flex: 1, padding: '11px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}
                  >
                    {isPt ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    style={{ flex: 1.5, padding: '11px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', color: '#ffffff', fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer', boxShadow: '0 2px 8px rgba(8, 145, 178, 0.35)' }}
                  >
                    {isPt ? 'Confirmar Agendamento' : 'Schedule Delivery'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
