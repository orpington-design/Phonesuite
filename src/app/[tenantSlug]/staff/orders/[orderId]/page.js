'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Printer, 
  X, 
  ShoppingBag, 
  CreditCard, 
  Building2, 
  Calendar, 
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { 
  INITIAL_ONLINE_ORDERS, 
  getSavedOnlineOrders, 
  persistOnlineOrders 
} from '../../data/staffData';
import { StaffLanguageProvider, useStaffLanguage } from '../../context/StaffLanguageContext';

export default function StaffOrderDetailPage() {
  return (
    <StaffLanguageProvider>
      <StaffOrderDetailContent />
    </StaffLanguageProvider>
  );
}

function StaffOrderDetailContent() {
  const router = useRouter();
  const params = useParams();
  const tenantSlug = params?.tenantSlug || 'premiumphonex';
  const orderId = params?.orderId;
  const { language } = useStaffLanguage();

  const [orders, setOrders] = useState(() => getSavedOnlineOrders());
  const [order, setOrder] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isPackingSlipOpen, setIsPackingSlipOpen] = useState(false);

  useEffect(() => {
    const found = orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (found) {
      setOrder(found);
    } else if (orders.length > 0) {
      setOrder(orders[0]); // Fallback to first if direct lookup missed
    }
  }, [orders, orderId]);

  // Handle status update & persist
  const handleUpdateStatus = (newStatus) => {
    if (!order) return;
    const updated = { ...order, fulfillmentStatus: newStatus };
    setOrder(updated);
    const updatedList = orders.map(o => o.id === order.id ? updated : o);
    setOrders(updatedList);
    persistOnlineOrders(updatedList);
  };

  // WhatsApp Notification
  const handleSendWhatsApp = () => {
    if (!order) return;
    const isPickup = order.fulfillmentType === 'pickup';
    const statusMsg = order.fulfillmentStatus === 'awaiting_dispatch'
      ? (isPickup ? 'is being prepared for your store collection at Baker Street' : 'is packed and scheduled for courier dispatch')
      : order.fulfillmentStatus === 'dispatched'
      ? (isPickup ? 'is now READY FOR PICKUP at the store! Please bring photo ID.' : `has been DISPATCHED with courier tracking code: ${order.trackingCode}`)
      : 'has been successfully delivered / collected!';

    const text = encodeURIComponent(
      `Hello ${order.customerName},\nThis is PhoneSuite UK regarding your online order #${order.orderNumber}.\n\nYour order ${statusMsg}\n\nFulfillment: ${isPickup ? 'Store Click & Collect' : 'Courier Delivery'}\nTotal Paid: £${Number(order.total).toFixed(2)}\n\nThank you for choosing PhoneSuite UK!`
    );
    window.open(`https://wa.me/${order.customerPhone?.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const handleCopyTracking = () => {
    if (!order?.trackingCode) return;
    navigator.clipboard.writeText(order.trackingCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!order) {
    return (
      <div className="mobile-portal-wrapper" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#64748b', fontWeight: '600' }}>Loading order details...</p>
      </div>
    );
  }

  const isAwaiting = order.fulfillmentStatus === 'awaiting_dispatch';
  const isDispatched = order.fulfillmentStatus === 'dispatched';
  const isDelivered = order.fulfillmentStatus === 'delivered';
  const isPickup = order.fulfillmentType === 'pickup';

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
            onClick={() => router.push(`/${tenantSlug}/staff/orders`)}
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
            <span>Orders</span>
          </button>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.94rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.02em' }}>
              Order #{order.orderNumber}
            </div>
            <div style={{ fontSize: '0.66rem', color: '#94a3b8', fontWeight: '600' }}>
              Portal Online Order
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsPackingSlipOpen(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '10px',
              height: '34px',
              padding: '0 9px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '0.72rem',
              fontWeight: '700'
            }}
            title="Print packing slip"
          >
            <Printer size={15} />
            <span>Slip</span>
          </button>
        </header>

        {/* Main Scroll Body */}
        <main className="mobile-scroll-body" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* 1. Fulfillment Hero Banner */}
          <div 
            style={{ 
              background: isDelivered 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                : isDispatched 
                ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' 
                : 'linear-gradient(135deg, #ff7a00 0%, #ea580c 100%)', 
              borderRadius: '18px', 
              padding: '1.25rem', 
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(234, 88, 12, 0.22)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#ffedd5' }}>
                CURRENT FULFILLMENT STATE
              </span>
              <span 
                style={{ 
                  fontSize: '0.62rem', 
                  fontWeight: '800', 
                  padding: '2px 8px', 
                  borderRadius: '9999px', 
                  background: 'rgba(255, 255, 255, 0.25)', 
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.35)' 
                }}
              >
                PAID &bull; £{Number(order.total).toFixed(2)}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isDelivered ? <CheckCircle2 size={22} /> : isDispatched ? <Truck size={22} /> : <Package size={22} />}
              </div>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '900', margin: 0, letterSpacing: '-0.02em', color: '#ffffff' }}>
                  {isDelivered ? 'Order Fulfilled & Delivered' : isDispatched ? 'Dispatched / In Transit' : 'Awaiting Dispatch'}
                </h2>
                <p style={{ fontSize: '0.74rem', color: '#ffedd5', margin: '2px 0 0 0' }}>
                  {isDelivered ? 'Customer received hardware successfully' : isDispatched ? `Handed over to carrier: ${order.trackingCode}` : 'Packed & awaiting carrier collection'}
                </p>
              </div>
            </div>

            {/* Stepper Dots */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginTop: '1.1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.3)', padding: '6px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.58rem', textTransform: 'uppercase', fontWeight: '700', color: '#ffedd5' }}>1. Paid</div>
                <div style={{ fontSize: '0.74rem', fontWeight: '900', marginTop: '1px' }}>Verified</div>
              </div>
              <div style={{ background: isDispatched || isDelivered ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', padding: '6px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.58rem', textTransform: 'uppercase', fontWeight: '700', color: '#ffedd5' }}>2. Dispatch</div>
                <div style={{ fontSize: '0.74rem', fontWeight: '900', marginTop: '1px' }}>{isDispatched || isDelivered ? 'Dispatched' : 'Pending'}</div>
              </div>
              <div style={{ background: isDelivered ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', padding: '6px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.58rem', textTransform: 'uppercase', fontWeight: '700', color: '#ffedd5' }}>3. Delivered</div>
                <div style={{ fontSize: '0.74rem', fontWeight: '900', marginTop: '1px' }}>{isDelivered ? 'Completed' : 'Pending'}</div>
              </div>
            </div>
          </div>

          {/* 2. Operations Primary Actions (Update Status & WhatsApp) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.6rem' }}>
            {isAwaiting && (
              <button
                type="button"
                onClick={() => handleUpdateStatus('dispatched')}
                style={{
                  background: '#ea580c',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '11px',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 3px 10px rgba(234, 88, 12, 0.35)'
                }}
              >
                <Truck size={17} strokeWidth={2.4} />
                <span>{isPickup ? 'Mark Ready for Pickup' : 'Dispatch Order'}</span>
              </button>
            )}

            {isDispatched && (
              <button
                type="button"
                onClick={() => handleUpdateStatus('delivered')}
                style={{
                  background: '#10b981',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '11px',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 3px 10px rgba(16, 185, 129, 0.35)'
                }}
              >
                <CheckCircle2 size={17} strokeWidth={2.4} />
                <span>Mark Delivered</span>
              </button>
            )}

            {isDelivered && (
              <button
                type="button"
                onClick={() => handleUpdateStatus('awaiting_dispatch')}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '11px',
                  color: '#475569',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>Re-open Order</span>
              </button>
            )}

            {/* WhatsApp Direct Action */}
            <button
              type="button"
              onClick={handleSendWhatsApp}
              style={{
                background: '#16a34a',
                border: 'none',
                borderRadius: '12px',
                padding: '11px',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 3px 10px rgba(22, 163, 74, 0.3)'
              }}
            >
              <MessageSquare size={17} strokeWidth={2.4} />
              <span>WhatsApp Customer</span>
            </button>
          </div>

          {/* 3. Customer & Delivery Address Card */}
          <div 
            style={{ 
              background: '#ffffff', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              padding: '1.1rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                CUSTOMER &amp; DELIVERY RECIPIENT
              </span>
              <span 
                style={{ 
                  fontSize: '0.62rem', 
                  fontWeight: '700', 
                  padding: '2px 8px', 
                  borderRadius: '6px', 
                  background: isPickup ? '#f3e8ff' : '#eff6ff', 
                  color: isPickup ? '#7e22ce' : '#1d4ed8' 
                }}
              >
                {isPickup ? 'Store Collection' : 'Royal Mail Courier'}
              </span>
            </div>

            <div style={{ fontSize: '1rem', fontWeight: '900', color: '#0f172a', marginBottom: '4px' }}>
              {order.customerName}
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '6px', color: '#475569', fontSize: '0.78rem' }}>
              <MapPin size={15} color="#ea580c" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Destination:</strong>
                <div>{order.deliveryAddress}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', fontSize: '0.76rem' }}>
              <div>
                <span style={{ color: '#94a3b8', fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: '700' }}>Telephone</span>
                <div>
                  <a href={`tel:${order.customerPhone}`} style={{ color: '#ea580c', fontWeight: '800', textDecoration: 'none' }}>
                    {order.customerPhone}
                  </a>
                </div>
              </div>
              <div>
                <span style={{ color: '#94a3b8', fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: '700' }}>Email</span>
                <div style={{ color: '#0f172a', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {order.customerEmail}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Ordered Items Breakdown */}
          <div 
            style={{ 
              background: '#ffffff', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              padding: '1.1rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)' 
            }}
          >
            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
              ORDERED ITEMS ({order.items?.length || 0})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {order.items?.map((item, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    paddingBottom: idx !== order.items.length - 1 ? '0.75rem' : '0',
                    borderBottom: idx !== order.items.length - 1 ? '1px dashed #f1f5f9' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #e2e8f0' }} 
                      />
                    ) : (
                      <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                        <ShoppingBag size={18} />
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#0f172a' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                        Qty: {item.qty || 1} &times; £{Number(item.price).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0f172a' }}>
                    £{(Number(item.price) * (item.qty || 1)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.78rem', color: '#64748b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal (Net):</span>
                <span>£{Number(order.subtotal || order.total * 0.8).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>VAT (20%):</span>
                <span>£{Number(order.vat || order.total * 0.2).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: '900', color: '#0f172a', paddingTop: '6px', borderTop: '1px solid #f1f5f9', marginTop: '4px' }}>
                <span>Total Paid in Full:</span>
                <span style={{ color: '#ea580c' }}>£{Number(order.total).toFixed(2)}</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: '700', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} />
                <span>Settled via {order.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* 5. Tracking & Waybill Reference Card */}
          <div 
            style={{ 
              background: '#ffffff', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              padding: '1.1rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)' 
            }}
          >
            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
              CARRIER WAYBILL &amp; TRACKING
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '0.64rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Waybill Code</div>
                <div style={{ fontSize: '0.94rem', fontWeight: '900', fontFamily: 'monospace', color: '#0f172a' }}>
                  {order.trackingCode}
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyTracking}
                style={{
                  background: isCopied ? '#ecfdf5' : '#ffffff',
                  border: isCopied ? '1px solid #10b981' : '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  color: isCopied ? '#059669' : '#0f172a',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {isCopied ? <Check size={13} /> : <Copy size={13} />}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '0.75rem' }}>
              <span>Fulfillment Branch:</span>
              <strong style={{ color: '#0f172a' }}>{order.branch}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '3px' }}>
              <span>Order Date:</span>
              <strong style={{ color: '#0f172a' }}>{new Date(order.createdAt).toLocaleString('en-GB')}</strong>
            </div>
          </div>

        </main>

      </div>

      {/* Printable Dispatch Note / Packing Slip Modal */}
      {isPackingSlipOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setIsPackingSlipOpen(false)}
        >
          <div 
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              maxWidth: '440px',
              width: '100%',
              padding: '1.5rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}>
                  <Printer size={17} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                    Dispatch Packing Slip
                  </h3>
                  <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: 0 }}>
                    Order #{order.orderNumber}
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsPackingSlipOpen(false)}
                style={{ background: '#f8fafc', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={16} />
              </button>
            </div>

            <div 
              style={{ 
                border: '1px dashed #cbd5e1', 
                borderRadius: '12px', 
                padding: '1.25rem', 
                background: '#fafafa',
                fontFamily: 'monospace'
              }}
            >
              <div style={{ textAlign: 'center', borderBottom: '1px dashed #cbd5e1', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '1rem', fontWeight: '900', color: '#0f172a' }}>PhoneSuite UK</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>E-Commerce Hub &bull; {order.branch}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.74rem', color: '#334155', marginBottom: '0.75rem' }}>
                <div><strong>Order Reference:</strong> #{order.orderNumber}</div>
                <div><strong>Recipient:</strong> {order.customerName}</div>
                <div><strong>Contact:</strong> {order.customerPhone}</div>
                <div><strong>Destination:</strong> {order.deliveryAddress}</div>
                <div><strong>Waybill / Tracking:</strong> {order.trackingCode}</div>
              </div>

              <div style={{ borderTop: '1px dashed #cbd5e1', borderBottom: '1px dashed #cbd5e1', padding: '0.65rem 0', margin: '0.75rem 0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 'bold', marginBottom: '4px' }}>DISPATCH ITEMS:</div>
                {order.items?.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', padding: '2px 0' }}>
                    <span>[{item.qty || 1}x] {item.name}</span>
                    <span>£{(Number(item.price) * (item.qty || 1)).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '900', marginTop: '0.5rem' }}>
                <span>TOTAL PAID:</span>
                <span>£{Number(order.total).toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  flex: 1,
                  background: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  fontSize: '0.82rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Printer size={15} />
                <span>Print Waybill Note</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPackingSlipOpen(false)}
                style={{
                  background: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.75rem 1.25rem',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
