'use client';

import { useState, useEffect, useRef } from 'react';
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
  RotateCcw,
  Layers,
  Map as MapIcon,
  Compass,
  Zap,
  Play,
  Pause,
  ArrowUpDown,
  Share2,
  Maximize2,
  LocateFixed,
  Radio,
  Sliders
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

// Preset Map Coordinates for London Delivery Nodes
const STORE_DEPOT = {
  id: 'depot-lon',
  name: 'PhoneSuite Central Hub',
  address: '42 Baker Street, Marylebone, London NW1 6XE',
  postcode: 'NW1 6XE',
  x: 290,
  y: 200,
  isDepot: true
};

const STOP_COORDINATES = {
  'del-101': { x: 550, y: 350 }, // Greenwich
  'del-102': { x: 380, y: 110 }, // Highbury
  'del-103': { x: 190, y: 360 }, // Chelsea
  'del-104': { x: 510, y: 250 }, // Canary Wharf
};

function DeliveriesPageContent() {
  const router = useRouter();
  const params = useParams();
  const tenantSlug = params?.tenantSlug || 'premiumphonex';
  const { language } = useStaffLanguage();
  const isPt = language === 'pt';

  const [deliveries, setDeliveries] = useState(() => getSavedDeliveries());
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all | out_for_delivery | booked | delivered
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Map & Live GPS Telemetry State
  const [selectedPinId, setSelectedPinId] = useState(null);
  const [isSimulating, setIsSimulating] = useState(true);
  const [driverPosIndex, setDriverPosIndex] = useState(0);
  const [assignedDriver, setAssignedDriver] = useState('Liam Patterson (Van #04)');

  // New Delivery Form State
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newPostcode, setNewPostcode] = useState('');
  const [newItems, setNewItems] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCourier, setNewCourier] = useState('Store Same-Day Express Van');
  const [newTimeWindow, setNewTimeWindow] = useState('14:00 - 16:00');
  const [newNotes, setNewNotes] = useState('');

  // Route sequence builder state
  const [routeSequence, setRouteSequence] = useState(() => 
    deliveries.filter(d => d.status !== 'delivered')
  );

  useEffect(() => {
    persistDeliveries(deliveries);
  }, [deliveries]);

  // Sync route sequence with deliveries
  useEffect(() => {
    setRouteSequence(deliveries.filter(d => d.status !== 'delivered'));
  }, [deliveries]);

  // Live Driver Movement Simulation along route coordinates
  const simulatedRoutePath = [
    { x: 290, y: 200, label: 'Leaving Baker St Hub', speed: 18, heading: 45 },
    { x: 330, y: 160, label: 'Euston Rd / King’s Cross', speed: 28, heading: 40 },
    { x: 380, y: 110, label: 'Approaching Stop 1 (Highbury N5)', speed: 15, heading: 30 },
    { x: 440, y: 170, label: 'Heading to East London A10', speed: 32, heading: 120 },
    { x: 510, y: 250, label: 'Canary Wharf Highway', speed: 25, heading: 140 },
    { x: 550, y: 350, label: 'Approaching Stop 2 (Greenwich SE10)', speed: 12, heading: 160 },
    { x: 420, y: 370, label: 'Thames Crossing Vauxhall', speed: 30, heading: 240 },
    { x: 190, y: 360, label: 'Approaching Stop 3 (Chelsea SW10)', speed: 14, heading: 260 },
  ];

  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setDriverPosIndex(prev => (prev + 1) % simulatedRoutePath.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isSimulating, simulatedRoutePath.length]);

  const currentDriverPos = simulatedRoutePath[driverPosIndex];

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

  // Action: Move Stop in Route Sequence
  const handleMoveStop = (index, direction) => {
    const newSeq = [...routeSequence];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= newSeq.length) return;
    const temp = newSeq[index];
    newSeq[index] = newSeq[targetIdx];
    newSeq[targetIdx] = temp;
    setRouteSequence(newSeq);
  };

  // Action: Auto-Optimize Route (Shortest Path Heuristic)
  const handleOptimizeSequence = () => {
    const sorted = [...routeSequence].sort((a, b) => {
      const posA = STOP_COORDINATES[a.id] || { x: 400, y: 300 };
      const posB = STOP_COORDINATES[b.id] || { x: 400, y: 300 };
      // Distances from Baker St Hub
      const distA = Math.hypot(posA.x - STORE_DEPOT.x, posA.y - STORE_DEPOT.y);
      const distB = Math.hypot(posB.x - STORE_DEPOT.x, posB.y - STORE_DEPOT.y);
      return distA - distB;
    });
    setRouteSequence(sorted);
  };

  // Action: Launch Real Multi-Stop Google Maps Turn-by-Turn Route
  const handleLaunchGoogleMapsRoute = () => {
    if (routeSequence.length === 0) return;
    const origin = encodeURIComponent(STORE_DEPOT.address);
    const destination = encodeURIComponent(routeSequence[routeSequence.length - 1].deliveryAddress);
    const waypoints = routeSequence
      .slice(0, -1)
      .map(s => encodeURIComponent(s.deliveryAddress))
      .join('|');

    const gmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ''}&travelmode=driving`;
    window.open(gmapsUrl, '_blank');
  };

  // Action: Dispatch Route to Driver
  const handleConfirmRouteDispatch = () => {
    setDeliveries(prev => prev.map(del => {
      const inRoute = routeSequence.some(s => s.id === del.id);
      if (inRoute) {
        return {
          ...del,
          status: 'out_for_delivery',
          courier: assignedDriver.includes('Van') ? 'Store Same-Day Express Van' : del.courier,
          driverName: assignedDriver,
          timeline: del.timeline.map((t, idx) => idx <= 2 ? { ...t, completed: true } : t)
        };
      }
      return del;
    }));
    setIsRouteModalOpen(false);
    setViewMode('map');
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
      driverName: newCourier.includes('Van') ? assignedDriver : 'Assigned Courier Driver',
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

  const selectedDelivery = deliveries.find(d => d.id === selectedPinId);

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
              <span>{isPt ? 'Entregas & Rotas' : 'Delivery & Routing'}</span>
            </div>
            <div style={{ fontSize: '0.66rem', color: '#94a3b8', fontWeight: '600' }}>
              {viewMode === 'map' ? (isPt ? 'Mapa GPS ao Vivo' : 'Live GPS Fleet Map') : (isPt ? 'Lista de Despacho' : 'Dispatch Console')}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              onClick={() => setIsRouteModalOpen(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '10px',
                padding: '6px 9px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#38bdf8',
                fontSize: '0.74rem',
                fontWeight: '800',
                cursor: 'pointer'
              }}
              title="Plan & Optimize Route"
            >
              <Navigation size={14} />
              <span>{isPt ? 'Rota' : 'Route'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsNewModalOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                border: 'none',
                borderRadius: '10px',
                padding: '6px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#ffffff',
                fontSize: '0.76rem',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(8, 145, 178, 0.35)'
              }}
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>{isPt ? 'Novo' : 'Book'}</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="mobile-scroll-body" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '3.5rem' }}>

          {/* VIEW SWITCHER & ROUTE CALLOUT */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#f1f5f9', padding: '4px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              style={{
                padding: '8px',
                borderRadius: '10px',
                border: 'none',
                background: viewMode === 'list' ? '#ffffff' : 'transparent',
                color: viewMode === 'list' ? '#0f172a' : '#64748b',
                fontSize: '0.78rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: viewMode === 'list' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Layers size={15} color={viewMode === 'list' ? '#0891b2' : '#64748b'} />
              <span>{isPt ? 'Visualização Lista' : 'List View'} ({filtered.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('map')}
              style={{
                padding: '8px',
                borderRadius: '10px',
                border: 'none',
                background: viewMode === 'map' ? '#0891b2' : 'transparent',
                color: viewMode === 'map' ? '#ffffff' : '#64748b',
                fontSize: '0.78rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: viewMode === 'map' ? '0 2px 8px rgba(8, 145, 178, 0.35)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <MapIcon size={15} color={viewMode === 'map' ? '#ffffff' : '#64748b'} />
              <span>{isPt ? 'Mapa GPS & Rota' : 'Map & Live GPS'}</span>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 6px #4ade80' }} />
            </button>
          </div>

          {/* ========================================================
              MAP VIEW & LIVE FLEET TRACKER
          ======================================================== */}
          {viewMode === 'map' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

              {/* Live Driver HUD Telemetry Banner */}
              <div 
                style={{ 
                  background: 'linear-gradient(135deg, #0b132b 0%, #1e293b 100%)', 
                  borderRadius: '18px', 
                  padding: '1rem', 
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 6px 20px rgba(11, 19, 43, 0.35)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
                    <span style={{ fontSize: '0.66rem', fontWeight: '800', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      REAL-TIME FLEET TELEMETRY
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSimulating(!isSimulating)}
                    style={{
                      background: isSimulating ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                      border: `1px solid ${isSimulating ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.2)'}`,
                      borderRadius: '8px',
                      padding: '3px 8px',
                      color: isSimulating ? '#6ee7b7' : '#cbd5e1',
                      fontSize: '0.62rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {isSimulating ? <Pause size={11} /> : <Play size={11} />}
                    <span>{isSimulating ? 'Simulating Movement' : 'Resume Sim'}</span>
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                      <Truck size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#ffffff' }}>
                        {assignedDriver}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '1px' }}>
                        {currentDriverPos.label} &bull; <strong>{currentDriverPos.speed} mph</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLaunchGoogleMapsRoute}
                    style={{
                      background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '7px 12px',
                      color: '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 2px 8px rgba(8, 145, 178, 0.35)'
                    }}
                  >
                    <ExternalLink size={13} />
                    <span>Google Maps</span>
                  </button>
                </div>
              </div>

              {/* INTERACTIVE VECTOR CARTOGRAPHY MAP */}
              <div 
                style={{ 
                  background: '#0f172a', 
                  borderRadius: '20px', 
                  border: '1.5px solid #334155', 
                  position: 'relative',
                  height: '370px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)'
                }}
              >
                {/* SVG MAP CANVAS */}
                <svg 
                  viewBox="0 0 700 450" 
                  style={{ width: '100%', height: '100%', display: 'block' }}
                >
                  <defs>
                    {/* Road glow filter */}
                    <filter id="glowPath" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    
                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="50%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>

                    <radialGradient id="radarWave" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* London Background Geography / Parks */}
                  <rect x="0" y="0" width="700" height="450" fill="#090d16" />
                  
                  {/* London Green Parks */}
                  <path d="M 230 140 Q 250 120 280 150 Q 290 190 260 210 Q 220 180 230 140 Z" fill="#143026" opacity="0.65" /> {/* Regent's Park */}
                  <path d="M 180 260 Q 220 240 240 270 Q 220 310 170 300 Z" fill="#143026" opacity="0.65" /> {/* Hyde Park */}
                  <path d="M 520 340 Q 560 320 580 360 Q 560 400 510 380 Z" fill="#143026" opacity="0.65" /> {/* Greenwich Park */}

                  {/* River Thames Curving through London */}
                  <path 
                    d="M 50 440 Q 150 420 220 370 Q 290 320 370 290 Q 460 280 520 320 Q 570 340 620 310 Q 660 280 700 270" 
                    fill="none" 
                    stroke="#1e3a5f" 
                    strokeWidth="32" 
                    strokeLinecap="round" 
                  />
                  <path 
                    d="M 50 440 Q 150 420 220 370 Q 290 320 370 290 Q 460 280 520 320 Q 570 340 620 310 Q 660 280 700 270" 
                    fill="none" 
                    stroke="#2563eb" 
                    strokeWidth="12" 
                    strokeOpacity="0.4"
                    strokeLinecap="round" 
                  />

                  {/* Secondary City Arterials / Street Grid */}
                  <path d="M 50 160 L 650 160" stroke="#1e293b" strokeWidth="3" />
                  <path d="M 120 50 L 120 400" stroke="#1e293b" strokeWidth="3" />
                  <path d="M 330 50 L 330 420" stroke="#1e293b" strokeWidth="4" />
                  <path d="M 480 50 L 480 420" stroke="#1e293b" strokeWidth="3" />
                  <path d="M 50 320 L 650 320" stroke="#1e293b" strokeWidth="3" />
                  <path d="M 100 80 L 620 380" stroke="#1e293b" strokeWidth="3" />
                  <path d="M 150 380 L 600 80" stroke="#1e293b" strokeWidth="3" />

                  {/* Key Landmarks Text */}
                  <text x="235" y="165" fill="#475569" fontSize="9" fontWeight="700">Regent&apos;s Park</text>
                  <text x="175" y="275" fill="#475569" fontSize="9" fontWeight="700">Hyde Park</text>
                  <text x="530" y="360" fill="#475569" fontSize="9" fontWeight="700">Greenwich</text>
                  <text x="360" y="315" fill="#3b82f6" fontSize="9" fontWeight="800" opacity="0.6">River Thames</text>

                  {/* DELIVERY ROUTE POLYLINE (Store -> Stop 1 -> Stop 4 -> Stop 2 -> Stop 3) */}
                  <path 
                    d="M 290 200 L 380 110 L 510 250 L 550 350 L 190 360"
                    fill="none" 
                    stroke="rgba(56, 189, 248, 0.25)" 
                    strokeWidth="10" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  <path 
                    d="M 290 200 L 380 110 L 510 250 L 550 350 L 190 360"
                    fill="none" 
                    stroke="url(#routeGradient)" 
                    strokeWidth="4" 
                    strokeDasharray="8 6" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    filter="url(#glowPath)"
                  />

                  {/* STORE DEPOT NODE */}
                  <g transform="translate(290, 200)" onClick={() => setSelectedPinId('depot')} style={{ cursor: 'pointer' }}>
                    <circle r="16" fill="rgba(234, 88, 12, 0.25)" />
                    <circle r="9" fill="#ea580c" stroke="#ffffff" strokeWidth="2.5" />
                    <text x="0" y="22" fill="#fed7aa" fontSize="10" fontWeight="900" textAnchor="middle">
                      PhoneSuite Hub
                    </text>
                  </g>

                  {/* DELIVERY STOP PINS */}
                  {deliveries.map((del, idx) => {
                    const coords = STOP_COORDINATES[del.id] || { x: 350, y: 250 };
                    const isSelected = selectedPinId === del.id;
                    const isDelivered = del.status === 'delivered';
                    const isEnRoute = del.status === 'out_for_delivery';
                    const pinColor = isDelivered ? '#10b981' : isEnRoute ? '#38bdf8' : '#f59e0b';

                    return (
                      <g 
                        key={del.id} 
                        transform={`translate(${coords.x}, ${coords.y})`}
                        onClick={() => setSelectedPinId(del.id)}
                        style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}
                      >
                        {isSelected && (
                          <circle r="22" fill={pinColor} opacity="0.3" />
                        )}
                        <circle r="13" fill={pinColor} stroke="#ffffff" strokeWidth="2.5" />
                        <text x="0" y="4" fill="#0f172a" fontSize="10" fontWeight="900" textAnchor="middle">
                          {idx + 1}
                        </text>
                        <text x="0" y="22" fill="#ffffff" fontSize="9" fontWeight="800" textAnchor="middle">
                          {del.customerName.split(' ')[0]}
                        </text>
                      </g>
                    );
                  })}

                  {/* LIVE DRIVER VAN MARKER (Animated Radar Waves + Icon) */}
                  <g transform={`translate(${currentDriverPos.x}, ${currentDriverPos.y})`}>
                    {/* Radar Pulse Animation Waves */}
                    <circle r="26" fill="url(#radarWave)">
                      <animate attributeName="r" values="10;32;10" dur="2.4s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0;0.8" dur="2.4s" repeatCount="indefinite" />
                    </circle>

                    {/* Driver Outer Halo */}
                    <circle r="14" fill="#0284c7" stroke="#ffffff" strokeWidth="3" />
                    
                    {/* Van Symbol */}
                    <path 
                      d="M -6 -3 L -3 -6 L 3 -6 L 6 -3 L 6 4 L -6 4 Z" 
                      fill="#ffffff" 
                    />
                    <circle cx="-3" cy="4" r="1.5" fill="#0f172a" />
                    <circle cx="3" cy="4" r="1.5" fill="#0f172a" />

                    {/* Driver Name Tag */}
                    <rect x="-40" y="-28" width="80" height="15" rx="5" fill="rgba(15, 23, 42, 0.9)" stroke="#38bdf8" strokeWidth="1" />
                    <text x="0" y="-17" fill="#38bdf8" fontSize="8" fontWeight="800" textAnchor="middle">
                      🚚 Van #04 Live
                    </text>
                  </g>

                </svg>

                {/* Floating Map Controls overlay */}
                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPinId(null);
                    }}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(6px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title="Fit All Stops"
                  >
                    <Maximize2 size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPinId('depot');
                    }}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(6px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#ea580c',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title="Center on Store Hub"
                  >
                    <MapPin size={14} />
                  </button>
                </div>

                {/* Map Bottom Legend Strip */}
                <div 
                  style={{ 
                    position: 'absolute', 
                    bottom: '8px', 
                    left: '10px', 
                    right: '10px', 
                    background: 'rgba(15, 23, 42, 0.85)', 
                    backdropFilter: 'blur(8px)',
                    borderRadius: '10px',
                    padding: '5px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.62rem',
                    color: '#94a3b8',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#ea580c', fontWeight: '800' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ea580c' }} /> Hub
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#38bdf8', fontWeight: '800' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8' }} /> En Route
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#f59e0b', fontWeight: '800' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b' }} /> Booked
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#10b981', fontWeight: '800' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} /> Delivered
                    </span>
                  </div>
                  <span style={{ color: '#38bdf8', fontWeight: '800' }}>Tap pin to view stop</span>
                </div>
              </div>

              {/* SELECTED STOP INSPECTION CARD ON MAP */}
              {selectedDelivery ? (
                <div 
                  style={{ 
                    background: '#ffffff', 
                    borderRadius: '16px', 
                    border: '1.5px solid #0891b2', 
                    padding: '1rem',
                    boxShadow: '0 4px 16px rgba(8, 145, 178, 0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#0891b2', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: '900' }}>
                        {deliveries.findIndex(d => d.id === selectedDelivery.id) + 1}
                      </span>
                      <strong style={{ fontSize: '0.94rem', color: '#0f172a' }}>{selectedDelivery.customerName}</strong>
                    </div>

                    <button 
                      type="button" 
                      onClick={() => setSelectedPinId(null)}
                      style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={14} color="#0891b2" style={{ flexShrink: 0 }} />
                    <span>{selectedDelivery.deliveryAddress}</span>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem' }}>
                    <div>
                      <div style={{ fontWeight: '800', color: '#0f172a' }}>{selectedDelivery.items}</div>
                      <div style={{ fontSize: '0.66rem', color: '#64748b' }}>Window: {selectedDelivery.timeWindow}</div>
                    </div>
                    <span style={{ fontWeight: '900', color: '#0f172a' }}>{formatMoney(selectedDelivery.totalAmount)}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleSendWhatsApp(selectedDelivery)}
                      style={{
                        padding: '9px',
                        borderRadius: '10px',
                        background: '#ecfdf5',
                        border: '1px solid #a7f3d0',
                        color: '#065f46',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px'
                      }}
                    >
                      <MessageSquare size={14} color="#059669" />
                      <span>Send WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAdvanceStatus(selectedDelivery.id)}
                      style={{
                        padding: '9px',
                        borderRadius: '10px',
                        background: selectedDelivery.status === 'delivered' ? '#f1f5f9' : '#0891b2',
                        border: 'none',
                        color: selectedDelivery.status === 'delivered' ? '#059669' : '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px'
                      }}
                    >
                      <CheckCircle2 size={14} />
                      <span>{selectedDelivery.status === 'delivered' ? 'Completed' : 'Mark Delivered'}</span>
                    </button>
                  </div>
                </div>
              ) : selectedPinId === 'depot' ? (
                <div 
                  style={{ 
                    background: '#ffffff', 
                    borderRadius: '16px', 
                    border: '1.5px solid #ea580c', 
                    padding: '1rem',
                    boxShadow: '0 4px 16px rgba(234, 88, 12, 0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#ea580c', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: '900' }}>
                        📍
                      </span>
                      <strong style={{ fontSize: '0.94rem', color: '#0f172a' }}>{STORE_DEPOT.name}</strong>
                    </div>
                    <button type="button" onClick={() => setSelectedPinId(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                      <X size={16} />
                    </button>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#475569' }}>{STORE_DEPOT.address}</div>
                  <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: '700' }}>
                    ✓ Central dispatch warehouse &bull; Inventory hub
                  </div>
                </div>
              ) : null}

              {/* Quick Jump to Route Sequence Manager */}
              <button
                type="button"
                onClick={() => setIsRouteModalOpen(true)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  background: '#0f172a',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: '800',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)'
                }}
              >
                <Navigation size={16} color="#38bdf8" />
                <span>{isPt ? 'Criar / Otimizar Ordem das Paradas' : 'Create / Optimize Route Sequence'}</span>
              </button>

            </div>
          ) : (
            /* ========================================================
                LIST VIEW
            ======================================================== */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

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

              {/* Deliveries List Cards */}
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

            </div>
          )}

        </main>

        {/* ========================================================
            MODAL 1: ROUTE PLANNER & SEQUENCE OPTIMIZER
        ======================================================== */}
        {isRouteModalOpen && (
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
              <div style={{ width: '40px', height: '4px', background: '#cbd5e1', borderRadius: '9999px', margin: '0 auto 4px auto' }} />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                    <Navigation size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '900', color: '#0f172a' }}>
                      {isPt ? 'Planejador de Rotas' : 'Delivery Route Planner'}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b' }}>
                      {isPt ? 'Crie a rota e otimize a ordem de entrega' : 'Sequence stops & dispatch to driver'}
                    </p>
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={() => setIsRouteModalOpen(false)}
                  style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Driver & Vehicle Selector */}
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Assigned Driver &amp; Vehicle
                </label>
                <select
                  value={assignedDriver}
                  onChange={(e) => setAssignedDriver(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#ffffff', fontWeight: '700', outline: 'none' }}
                >
                  <option value="Liam Patterson (Van #04)">Liam Patterson — PhoneSuite Van #04 (eVito)</option>
                  <option value="Alex Rivera (Staff Driver)">Alex Rivera — Store Express Van #01</option>
                  <option value="Sophie Taylor (Courier)">Sophie Taylor — DPD Dedicated Courier</option>
                </select>
              </div>

              {/* Route Summary KPI Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', textAlign: 'center' }}>
                <div style={{ background: '#eff6ff', padding: '8px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                  <div style={{ fontSize: '0.6rem', color: '#1d4ed8', fontWeight: '800', textTransform: 'uppercase' }}>Stops</div>
                  <div style={{ fontSize: '1rem', fontWeight: '900', color: '#1e40af', marginTop: '2px' }}>{routeSequence.length} Deliveries</div>
                </div>
                <div style={{ background: '#f0fdf4', padding: '8px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: '0.6rem', color: '#15803d', fontWeight: '800', textTransform: 'uppercase' }}>Est. Drive</div>
                  <div style={{ fontSize: '1rem', fontWeight: '900', color: '#166534', marginTop: '2px' }}>1h 35m</div>
                </div>
                <div style={{ background: '#fef3c7', padding: '8px', borderRadius: '10px', border: '1px solid #fde68a' }}>
                  <div style={{ fontSize: '0.6rem', color: '#b45309', fontWeight: '800', textTransform: 'uppercase' }}>Distance</div>
                  <div style={{ fontSize: '1rem', fontWeight: '900', color: '#92400e', marginTop: '2px' }}>14.8 mi</div>
                </div>
              </div>

              {/* Optimize Sequence Button */}
              <button
                type="button"
                onClick={handleOptimizeSequence}
                style={{
                  padding: '9px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1.5px dashed #0284c7',
                  color: '#0284c7',
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Sparkles size={15} />
                <span>{isPt ? '⚡ Auto-Otimizar Sequência (Menor Distância)' : '⚡ Auto-Optimize Sequence (Shortest Distance)'}</span>
              </button>

              {/* Sequenced Stops List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {/* Hub Depot Starting Point */}
                <div style={{ background: '#fff7ed', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#ea580c', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: '900' }}>
                      0
                    </span>
                    <div>
                      <div style={{ fontWeight: '900', color: '#9a3412' }}>{STORE_DEPOT.name} (Depot)</div>
                      <div style={{ fontSize: '0.66rem', color: '#c2410c' }}>Start: 42 Baker Street, London</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.64rem', fontWeight: '800', color: '#c2410c' }}>START</span>
                </div>

                {/* Stops */}
                {routeSequence.map((stop, idx) => (
                  <div 
                    key={stop.id}
                    style={{
                      background: '#ffffff',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.74rem',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '75%' }}>
                      <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#0891b2', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '900', flexShrink: 0 }}>
                        {idx + 1}
                      </span>
                      <div>
                        <div style={{ fontWeight: '800', color: '#0f172a' }}>{stop.customerName}</div>
                        <div style={{ fontSize: '0.66rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {stop.deliveryAddress}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveStop(idx, -1)}
                        style={{
                          background: idx === 0 ? '#f1f5f9' : '#e0f2fe',
                          border: 'none',
                          borderRadius: '6px',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: idx === 0 ? '#cbd5e1' : '#0284c7',
                          cursor: idx === 0 ? 'not-allowed' : 'pointer',
                          fontWeight: '900'
                        }}
                      >
                        ↑
                      </button>

                      <button
                        type="button"
                        disabled={idx === routeSequence.length - 1}
                        onClick={() => handleMoveStop(idx, 1)}
                        style={{
                          background: idx === routeSequence.length - 1 ? '#f1f5f9' : '#e0f2fe',
                          border: 'none',
                          borderRadius: '6px',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: idx === routeSequence.length - 1 ? '#cbd5e1' : '#0284c7',
                          cursor: idx === routeSequence.length - 1 ? 'not-allowed' : 'pointer',
                          fontWeight: '900'
                        }}
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleLaunchGoogleMapsRoute}
                  style={{
                    padding: '11px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <ExternalLink size={15} color="#0284c7" />
                  <span>{isPt ? 'Abrir Rota no Google Maps (Multi-Paradas)' : 'Open Multi-Stop Route in Google Maps'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleConfirmRouteDispatch}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(8, 145, 178, 0.35)'
                  }}
                >
                  <Truck size={16} />
                  <span>{isPt ? 'Confirmar & Despachar Rota para Motorista' : 'Confirm & Dispatch Route to Driver'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL 2: BOOK NEW DELIVERY
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
                      {isPt ? 'Código Postal' : 'UK Postcode'}
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
                      <option value="Store Same-Day Express Van">Store Same-Day Express Van</option>
                      <option value="DPD Express Next-Day">DPD Express Next-Day</option>
                      <option value="Royal Mail Special Delivery 24">Royal Mail Special Delivery 24</option>
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
