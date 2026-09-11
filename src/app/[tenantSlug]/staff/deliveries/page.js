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

// Real London Coordinates for Central Depot & Delivery Stops
const STORE_DEPOT = {
  id: 'depot-lon',
  name: 'PhoneSuite Central Hub',
  address: '42 Baker Street, Marylebone, London NW1 6XE',
  postcode: 'NW1 6XE',
  lat: 51.5186,
  lng: -0.1565,
  isDepot: true
};

const STOP_GEO_COORDINATES = {
  'del-101': { lat: 51.4816, lng: -0.0098, name: 'Greenwich', address: '19 Greenwich Church St, London SE10 9BJ' },
  'del-102': { lat: 51.5542, lng: -0.0968, name: 'Highbury', address: '72 Highbury New Park, London N5 2DJ' },
  'del-103': { lat: 51.4754, lng: -0.1812, name: 'Chelsea', address: '15 Chelsea Harbour Dr, London SW10 0XE' },
  'del-104': { lat: 51.5054, lng: -0.0210, name: 'Canary Wharf', address: '14 Canary Wharf Pier, London E14 4SG' },
};

const SIMULATED_DRIVER_PATH = [
  { lat: 51.5186, lng: -0.1565, label: 'Departing Central Hub (Baker St)', speed: 18, eta: '12 mins to Stop 1' },
  { lat: 51.5240, lng: -0.1430, label: 'Marylebone Rd / Regent’s Park', speed: 22, eta: '9 mins to Stop 1' },
  { lat: 51.5285, lng: -0.1330, label: 'Euston Road / St Pancras', speed: 28, eta: '7 mins to Stop 1' },
  { lat: 51.5320, lng: -0.1060, label: 'Angel Islington / Upper St', speed: 21, eta: '4 mins to Stop 1' },
  { lat: 51.5542, lng: -0.0968, label: 'Arrived at Stop 1 (Highbury N5)', speed: 0, eta: 'At Location' },
  { lat: 51.5350, lng: -0.0650, label: 'En Route A10 to Canary Wharf', speed: 30, eta: '11 mins to Stop 2' },
  { lat: 51.5054, lng: -0.0210, label: 'Arrived at Stop 2 (Canary Wharf E14)', speed: 0, eta: 'At Location' },
  { lat: 51.4920, lng: -0.0150, label: 'Blackwall Approach to Greenwich', speed: 26, eta: '8 mins to Stop 3' },
  { lat: 51.4816, lng: -0.0098, label: 'Approaching Stop 3 (Greenwich SE10)', speed: 14, eta: '3 mins to Stop 3' },
  { lat: 51.4880, lng: -0.1100, label: 'Thames Embankment toward Chelsea', speed: 32, eta: '14 mins to Stop 4' },
  { lat: 51.4754, lng: -0.1812, label: 'Approaching Stop 4 (Chelsea SW10)', speed: 12, eta: '2 mins to Stop 4' },
];

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

  // Google Maps State & Refs
  const mapContainerRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);
  const trafficLayerRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapLoadError, setMapLoadError] = useState(false);
  const [mapType, setMapType] = useState('roadmap'); // 'roadmap' | 'satellite'
  const [showTraffic, setShowTraffic] = useState(false);

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
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setDriverPosIndex(prev => (prev + 1) % SIMULATED_DRIVER_PATH.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isSimulating]);

  const currentDriverPos = SIMULATED_DRIVER_PATH[driverPosIndex];

  // -------------------------------------------------------------
  // Google Maps SDK Loader
  // -------------------------------------------------------------
  useEffect(() => {
    if (viewMode !== 'map') return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setMapLoadError(true);
      return;
    }

    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    if (typeof window !== 'undefined') {
      window.gm_authFailure = () => {
        console.warn('Google Maps authentication warning - switching to embed fallback');
        setMapLoadError(true);
      };
    }

    const scriptId = 'google-maps-js-sdk';
    const existing = document.getElementById(scriptId);
    if (!existing) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setMapLoaded(true);
      };
      script.onerror = () => {
        setMapLoadError(true);
      };
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, [viewMode]);

  // -------------------------------------------------------------
  // Initialize Google Map Instance & Interactive Pins
  // -------------------------------------------------------------
  useEffect(() => {
    if (!mapLoaded || viewMode !== 'map' || !mapContainerRef.current || mapLoadError) return;
    if (typeof window === 'undefined' || !window.google || !window.google.maps) return;

    try {
      const map = new window.google.maps.Map(mapContainerRef.current, {
        center: { lat: STORE_DEPOT.lat, lng: STORE_DEPOT.lng },
        zoom: 12,
        mapTypeId: mapType,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        gestureHandling: 'greedy'
      });

      googleMapRef.current = map;

      // Traffic Layer
      const trafficLayer = new window.google.maps.TrafficLayer();
      trafficLayerRef.current = trafficLayer;
      if (showTraffic) {
        trafficLayer.setMap(map);
      }

      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(new window.google.maps.LatLng(STORE_DEPOT.lat, STORE_DEPOT.lng));

      // Clean existing markers
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];

      // 1. Central Depot Marker
      const depotSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="46" viewBox="0 0 38 46">
          <defs>
            <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.4)" />
            </filter>
          </defs>
          <path d="M 19 0 C 8.5 0 0 8.5 0 19 C 0 31 19 44 19 44 C 19 44 38 31 38 19 C 38 8.5 29.5 0 19 0 Z" fill="#ea580c" stroke="#ffffff" stroke-width="2.5" filter="url(#s)" />
          <circle cx="19" cy="18" r="11" fill="#ffffff" />
          <text x="19" y="22" font-size="12" font-family="Arial, sans-serif" font-weight="900" fill="#ea580c" text-anchor="middle">🏢</text>
        </svg>
      `;
      const depotMarker = new window.google.maps.Marker({
        position: { lat: STORE_DEPOT.lat, lng: STORE_DEPOT.lng },
        map,
        title: STORE_DEPOT.name,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(depotSvg)}`,
          scaledSize: new window.google.maps.Size(38, 46),
          anchor: new window.google.maps.Point(19, 44)
        }
      });
      depotMarker.addListener('click', () => {
        setSelectedPinId('depot');
        map.panTo({ lat: STORE_DEPOT.lat, lng: STORE_DEPOT.lng });
      });
      markersRef.current.push(depotMarker);

      // 2. Stop Markers
      const activeRouteStops = routeSequence.length > 0 ? routeSequence : deliveries;
      const polyPath = [{ lat: STORE_DEPOT.lat, lng: STORE_DEPOT.lng }];

      activeRouteStops.forEach((del, idx) => {
        const geo = STOP_GEO_COORDINATES[del.id] || { 
          lat: 51.5186 + (idx * 0.015), 
          lng: -0.1565 + (idx * 0.02) 
        };
        polyPath.push({ lat: geo.lat, lng: geo.lng });
        bounds.extend(new window.google.maps.LatLng(geo.lat, geo.lng));

        const isDelivered = del.status === 'delivered';
        const isEnRoute = del.status === 'out_for_delivery';
        const pinColor = isDelivered ? '#10b981' : isEnRoute ? '#0284c7' : '#f59e0b';

        const stopSvg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
            <defs>
              <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.35)" />
              </filter>
            </defs>
            <path d="M 18 0 C 8.1 0 0 8.1 0 18 C 0 29 18 42 18 42 C 18 42 36 29 36 18 C 36 8.1 27.9 0 18 0 Z" fill="${pinColor}" stroke="#ffffff" stroke-width="2.5" filter="url(#s)" />
            <circle cx="18" cy="17" r="10" fill="#ffffff" />
            <text x="18" y="21" font-size="11" font-family="Arial, sans-serif" font-weight="900" fill="${pinColor}" text-anchor="middle">${idx + 1}</text>
          </svg>
        `;

        const stopMarker = new window.google.maps.Marker({
          position: { lat: geo.lat, lng: geo.lng },
          map,
          title: `Stop ${idx + 1}: ${del.customerName}`,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(stopSvg)}`,
            scaledSize: new window.google.maps.Size(36, 44),
            anchor: new window.google.maps.Point(18, 42)
          }
        });

        stopMarker.addListener('click', () => {
          setSelectedPinId(del.id);
          map.panTo({ lat: geo.lat, lng: geo.lng });
        });

        markersRef.current.push(stopMarker);
      });

      // 3. Polyline along route
      if (polylineRef.current) polylineRef.current.setMap(null);
      polylineRef.current = new window.google.maps.Polyline({
        path: polyPath,
        geodesic: true,
        strokeColor: '#0284c7',
        strokeOpacity: 0.85,
        strokeWeight: 4,
        map
      });

      // 4. Driver Marker
      const initialPos = SIMULATED_DRIVER_PATH[driverPosIndex] || SIMULATED_DRIVER_PATH[0];
      const driverSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 46 46">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle cx="23" cy="23" r="21" fill="rgba(2, 132, 199, 0.25)" />
          <circle cx="23" cy="23" r="15" fill="#0284c7" stroke="#ffffff" stroke-width="2.5" filter="url(#glow)" />
          <path d="M 16 21 L 19 18 L 24 18 L 26 21 L 28 21 L 28 26 L 16 26 Z" fill="#ffffff" />
          <circle cx="18" cy="26" r="1.8" fill="#0f172a" />
          <circle cx="25" cy="26" r="1.8" fill="#0f172a" />
        </svg>
      `;

      const driverMarker = new window.google.maps.Marker({
        position: { lat: initialPos.lat, lng: initialPos.lng },
        map,
        title: `${assignedDriver} (Live GPS)`,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(driverSvg)}`,
          scaledSize: new window.google.maps.Size(46, 46),
          anchor: new window.google.maps.Point(23, 23)
        },
        zIndex: 999
      });
      driverMarkerRef.current = driverMarker;

      map.fitBounds(bounds, { top: 40, bottom: 40, left: 40, right: 40 });

    } catch (err) {
      console.error('Error initializing Google Map:', err);
      setMapLoadError(true);
    }
  }, [mapLoaded, viewMode, routeSequence, deliveries, mapLoadError, showTraffic, mapType]);

  // Update Driver Marker Live Position
  useEffect(() => {
    if (!driverMarkerRef.current || !googleMapRef.current) return;
    const pos = SIMULATED_DRIVER_PATH[driverPosIndex];
    if (pos && window.google?.maps) {
      driverMarkerRef.current.setPosition(new window.google.maps.LatLng(pos.lat, pos.lng));
    }
  }, [driverPosIndex]);

  // Update Map Type
  useEffect(() => {
    if (googleMapRef.current) {
      googleMapRef.current.setMapTypeId(mapType);
    }
  }, [mapType]);

  // Update Traffic Layer
  useEffect(() => {
    if (trafficLayerRef.current && googleMapRef.current) {
      trafficLayerRef.current.setMap(showTraffic ? googleMapRef.current : null);
    }
  }, [showTraffic]);

  const handleCenterDriver = () => {
    if (googleMapRef.current) {
      const pos = SIMULATED_DRIVER_PATH[driverPosIndex];
      if (pos && window.google?.maps) {
        googleMapRef.current.panTo({ lat: pos.lat, lng: pos.lng });
        googleMapRef.current.setZoom(15);
      }
    }
  };

  const handleFitAllStops = () => {
    if (googleMapRef.current && window.google?.maps) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(new window.google.maps.LatLng(STORE_DEPOT.lat, STORE_DEPOT.lng));
      deliveries.forEach(del => {
        const geo = STOP_GEO_COORDINATES[del.id];
        if (geo) bounds.extend(new window.google.maps.LatLng(geo.lat, geo.lng));
      });
      googleMapRef.current.fitBounds(bounds, { top: 40, bottom: 40, left: 40, right: 40 });
    }
  };

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
      const posA = STOP_GEO_COORDINATES[a.id] || { lat: 51.51, lng: -0.12 };
      const posB = STOP_GEO_COORDINATES[b.id] || { lat: 51.51, lng: -0.12 };
      // Distances from Baker St Hub
      const distA = Math.hypot(posA.lat - STORE_DEPOT.lat, posA.lng - STORE_DEPOT.lng);
      const distB = Math.hypot(posB.lat - STORE_DEPOT.lat, posB.lng - STORE_DEPOT.lng);
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

              {/* ========================================================
                  GENUINE GOOGLE MAPS PLATFORM VIEW
              ======================================================== */}
              <div 
                style={{ 
                  background: '#ffffff', 
                  borderRadius: '20px', 
                  border: '1.5px solid #cbd5e1', 
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
                }}
              >
                {/* Google Maps Top Bar Controls */}
                <div 
                  style={{ 
                    padding: '8px 12px', 
                    background: '#f8fafc', 
                    borderBottom: '1px solid #e2e8f0', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '6px'
                  }}
                >
                  {/* Left: Map Type Switcher & Traffic */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <button
                      type="button"
                      onClick={() => setMapType('roadmap')}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '8px',
                        border: mapType === 'roadmap' ? '1px solid #0284c7' : '1px solid #cbd5e1',
                        background: mapType === 'roadmap' ? '#0284c7' : '#ffffff',
                        color: mapType === 'roadmap' ? '#ffffff' : '#475569',
                        fontSize: '0.68rem',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      {isPt ? '🗺️ Mapa' : '🗺️ Map'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setMapType('satellite')}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '8px',
                        border: mapType === 'satellite' ? '1px solid #0284c7' : '1px solid #cbd5e1',
                        background: mapType === 'satellite' ? '#0284c7' : '#ffffff',
                        color: mapType === 'satellite' ? '#ffffff' : '#475569',
                        fontSize: '0.68rem',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      {isPt ? '🛰️ Satélite' : '🛰️ Satellite'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowTraffic(!showTraffic)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '8px',
                        border: showTraffic ? '1px solid #10b981' : '1px solid #cbd5e1',
                        background: showTraffic ? '#dcfce7' : '#ffffff',
                        color: showTraffic ? '#15803d' : '#475569',
                        fontSize: '0.68rem',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      {isPt ? '🚦 Tráfego' : '🚦 Traffic'}
                    </button>
                  </div>

                  {/* Right: Quick Zoom & Driver Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <button
                      type="button"
                      onClick={handleCenterDriver}
                      style={{
                        padding: '5px 9px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        color: '#0284c7',
                        fontSize: '0.68rem',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Center on Live Driver"
                    >
                      <LocateFixed size={12} />
                      <span>{isPt ? 'Motorista' : 'Driver'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleFitAllStops}
                      style={{
                        padding: '5px 9px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        color: '#475569',
                        fontSize: '0.68rem',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Fit All Stops"
                    >
                      <Maximize2 size={12} />
                      <span>{isPt ? 'Paradas' : 'All Stops'}</span>
                    </button>
                  </div>
                </div>

                {/* Google Map Viewport */}
                <div style={{ position: 'relative', width: '100%', height: '390px' }}>
                  {mapLoadError ? (
                    <iframe
                      title="Google Maps Fleet View"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      src={`https://maps.google.com/maps?q=${STORE_DEPOT.lat},${STORE_DEPOT.lng}&z=12&output=embed`}
                      allowFullScreen
                      loading="lazy"
                    />
                  ) : (
                    <div 
                      ref={mapContainerRef} 
                      style={{ width: '100%', height: '100%', background: '#e5e7eb' }} 
                    />
                  )}

                  {!mapLoaded && !mapLoadError && (
                    <div 
                      style={{ 
                        position: 'absolute', 
                        inset: 0, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        background: '#f8fafc',
                        gap: '8px',
                        color: '#64748b'
                      }}
                    >
                      <MapIcon size={28} color="#0284c7" />
                      <span style={{ fontSize: '0.78rem', fontWeight: '700' }}>
                        {isPt ? 'Carregando Google Maps...' : 'Loading Google Maps...'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Map Bottom Legend Strip */}
                <div 
                  style={{ 
                    padding: '8px 12px', 
                    background: '#ffffff', 
                    borderTop: '1px solid #e2e8f0', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    fontSize: '0.68rem', 
                    color: '#64748b' 
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ea580c', fontWeight: '800' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ea580c', display: 'inline-block' }} /> 
                      {isPt ? 'Hub' : 'Hub'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0284c7', fontWeight: '800' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7', display: 'inline-block' }} /> 
                      {isPt ? 'Em Rota' : 'En Route'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#d97706', fontWeight: '800' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} /> 
                      {isPt ? 'Agendada' : 'Booked'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontWeight: '800' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} /> 
                      {isPt ? 'Entregue' : 'Delivered'}
                    </span>
                  </div>
                  <span style={{ color: '#0284c7', fontWeight: '800' }}>
                    {isPt ? 'Toque no marcador para detalhes' : 'Tap pin to view stop'}
                  </span>
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
