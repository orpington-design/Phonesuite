'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Phone, 
  MessageSquare, 
  MapPin, 
  ExternalLink, 
  Printer, 
  X, 
  ShoppingBag, 
  CreditCard,
  Building2,
  ChevronRight,
  Filter,
  ArrowRight
} from 'lucide-react';
import { 
  INITIAL_ONLINE_ORDERS, 
  getSavedOnlineOrders, 
  persistOnlineOrders 
} from '../data/staffData';
import { useStaffLanguage } from '../context/StaffLanguageContext';

export default function StaffOrdersTab({ tenant, branch, tenantSlug }) {
  const router = useRouter();
  const { t, language } = useStaffLanguage();

  const [orders, setOrders] = useState(() => getSavedOnlineOrders());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'awaiting_dispatch' | 'dispatched' | 'delivered'
  const [activePackingSlip, setActivePackingSlip] = useState(null);

  useEffect(() => {
    persistOnlineOrders(orders);
  }, [orders]);

  // Counts & Metrics
  const totalOrders = orders.length;
  const awaitingCount = orders.filter(o => o.fulfillmentStatus === 'awaiting_dispatch').length;
  const dispatchedCount = orders.filter(o => o.fulfillmentStatus === 'dispatched').length;
  const deliveredCount = orders.filter(o => o.fulfillmentStatus === 'delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);

  // Status Filter options
  const filterTabs = [
    { id: 'all', label: language === 'pt' ? 'Todos' : 'All Orders', count: totalOrders },
    { id: 'awaiting_dispatch', label: language === 'pt' ? 'Aguardando Envio' : 'Awaiting Dispatch', count: awaitingCount },
    { id: 'dispatched', label: language === 'pt' ? 'Enviados' : 'Dispatched', count: dispatchedCount },
    { id: 'delivered', label: language === 'pt' ? 'Entregues' : 'Delivered', count: deliveredCount },
  ];

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all' && order.fulfillmentStatus !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      order.orderNumber?.toLowerCase().includes(q) ||
      order.customerName?.toLowerCase().includes(q) ||
      order.customerPhone?.toLowerCase().includes(q) ||
      order.customerEmail?.toLowerCase().includes(q) ||
      order.trackingCode?.toLowerCase().includes(q) ||
      order.items?.some(item => item.name?.toLowerCase().includes(q))
    );
  });

  // Action: Advance fulfillment status
  const handleAdvanceStatus = (orderId) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      let nextStatus = order.fulfillmentStatus;
      if (order.fulfillmentStatus === 'awaiting_dispatch') {
        nextStatus = 'dispatched';
      } else if (order.fulfillmentStatus === 'dispatched') {
        nextStatus = 'delivered';
      }
      return { ...order, fulfillmentStatus: nextStatus };
    }));
  };

  // Action: Contact on WhatsApp
  const handleWhatsAppContact = (order) => {
    const isPickup = order.fulfillmentType === 'pickup';
    const statusText = order.fulfillmentStatus === 'awaiting_dispatch'
      ? (isPickup ? 'is being prepared for your store collection' : 'is currently packed and awaiting courier dispatch')
      : order.fulfillmentStatus === 'dispatched'
      ? (isPickup ? 'is ready for collection at the store' : `has been dispatched with tracking number ${order.trackingCode}`)
      : 'has been delivered';

    const text = encodeURIComponent(
      `Hello ${order.customerName}, this is ${tenant?.name || 'PhoneSuite UK'} store regarding your online order #${order.orderNumber}.\n\nYour order ${statusText}.\nFulfillment: ${isPickup ? 'Store Collection' : 'Home Delivery'}\nTotal Paid: £${Number(order.total).toFixed(2)}\n\nIf you have any questions, please reply here!`
    );
    window.open(`https://wa.me/${order.customerPhone?.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', paddingBottom: '2rem' }}>
      
      {/* 1. Header Banner & Store Info */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #0b132b 0%, #1c2541 100%)', 
          borderRadius: '18px', 
          padding: '1.25rem', 
          color: '#ffffff',
          boxShadow: '0 4px 20px rgba(11, 19, 43, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div 
              style={{ 
                width: '38px', 
                height: '38px', 
                borderRadius: '12px', 
                background: 'rgba(234, 88, 12, 0.2)', 
                border: '1px solid rgba(234, 88, 12, 0.4)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#ff7a00' 
              }}
            >
              <Package size={20} strokeWidth={2.4} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0, letterSpacing: '-0.02em' }}>
                {language === 'pt' ? 'Pedidos da Loja Online' : 'Customer Portal Orders'}
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                {language === 'pt' ? 'Pedidos pagos via portal do cliente' : 'Paid customer orders ready for fulfillment'}
              </p>
            </div>
          </div>

          <span 
            style={{ 
              fontSize: '0.65rem', 
              fontWeight: '800', 
              padding: '3px 8px', 
              borderRadius: '9999px', 
              background: '#10b981', 
              color: '#ffffff',
              letterSpacing: '0.04em'
            }}
          >
            LIVE SYNC
          </span>
        </div>

        {/* Top 3 KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '1rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '0.65rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '0.62rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>
              {language === 'pt' ? 'Total Pedidos' : 'Total Orders'}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#ffffff', marginTop: '2px' }}>
              {totalOrders}
            </div>
            <div style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: '600', marginTop: '2px' }}>
              £{totalRevenue.toFixed(2)}
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '0.65rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '0.62rem', color: '#fbbf24', textTransform: 'uppercase', fontWeight: '700' }}>
              {language === 'pt' ? 'Pendente Envio' : 'Awaiting'}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#fef08a', marginTop: '2px' }}>
              {awaitingCount}
            </div>
            <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: '500', marginTop: '2px' }}>
              Needs Pack &amp; Post
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '0.65rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '0.62rem', color: '#60a5fa', textTransform: 'uppercase', fontWeight: '700' }}>
              {language === 'pt' ? 'Em Trânsito' : 'Dispatched'}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#93c5fd', marginTop: '2px' }}>
              {dispatchedCount}
            </div>
            <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: '500', marginTop: '2px' }}>
              With Couriers
            </div>
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Segmented Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {/* Search Bar */}
        <div style={{ position: 'relative' }}>
          <Search 
            size={16} 
            color="#94a3b8" 
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} 
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'pt' ? 'Buscar pedido #, cliente, produto...' : 'Search order #, customer, product or tracking...'}
            style={{
              width: '100%',
              padding: '0.68rem 1rem 0.68rem 2.3rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              fontSize: '0.82rem',
              color: '#0f172a',
              outline: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8'
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filter Segmented Pills */}
        <div 
          style={{ 
            display: 'flex', 
            background: '#f1f5f9', 
            borderRadius: '12px', 
            padding: '3px', 
            gap: '3px',
            overflowX: 'auto'
          }}
        >
          {filterTabs.map(tab => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                style={{
                  flex: 1,
                  minWidth: '78px',
                  padding: '6px 8px',
                  borderRadius: '9px',
                  border: 'none',
                  background: isActive ? '#ffffff' : 'transparent',
                  color: isActive ? '#0f172a' : '#64748b',
                  fontSize: '0.72rem',
                  fontWeight: isActive ? '800' : '600',
                  boxShadow: isActive ? '0 1px 4px rgba(0, 0, 0, 0.08)' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{tab.label}</span>
                <span 
                  style={{ 
                    fontSize: '0.62rem', 
                    padding: '1px 5px', 
                    borderRadius: '9999px',
                    background: isActive ? '#ea580c' : '#e2e8f0',
                    color: isActive ? '#ffffff' : '#64748b',
                    fontWeight: '800'
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Orders List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {filteredOrders.length === 0 ? (
          <div 
            style={{ 
              background: '#ffffff', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              padding: '2.5rem 1rem', 
              textAlign: 'center' 
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto', color: '#94a3b8' }}>
              <Package size={22} />
            </div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.25rem 0' }}>
              {language === 'pt' ? 'Nenhum pedido encontrado' : 'No online orders found'}
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
              {language === 'pt' ? 'Tente ajustar os filtros ou termo de busca' : 'Orders placed on the customer portal will appear here automatically'}
            </p>
          </div>
        ) : (
          filteredOrders.map(order => {
            const isAwaiting = order.fulfillmentStatus === 'awaiting_dispatch';
            const isDispatched = order.fulfillmentStatus === 'dispatched';
            const isDelivered = order.fulfillmentStatus === 'delivered';
            const isPickup = order.fulfillmentType === 'pickup';

            return (
              <div
                key={order.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  padding: '1.1rem',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}
              >
                {/* Header: Order #, Date, Status Badges */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.86rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.01em' }}>
                        #{order.orderNumber}
                      </span>
                      <span 
                        style={{ 
                          fontSize: '0.6rem', 
                          fontWeight: '800', 
                          padding: '2px 6px', 
                          borderRadius: '6px', 
                          background: '#ecfdf5', 
                          color: '#059669', 
                          border: '1px solid #a7f3d0' 
                        }}
                      >
                        PAID ONLINE
                      </span>
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px', fontWeight: '500' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {/* Fulfillment Status Chip */}
                  <div>
                    {isAwaiting && (
                      <span 
                        style={{ 
                          fontSize: '0.64rem', 
                          fontWeight: '800', 
                          padding: '3px 8px', 
                          borderRadius: '9999px', 
                          background: '#fef3c7', 
                          color: '#b45309', 
                          border: '1px solid #fde68a',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Clock size={11} strokeWidth={2.5} />
                        AWAITING DISPATCH
                      </span>
                    )}
                    {isDispatched && (
                      <span 
                        style={{ 
                          fontSize: '0.64rem', 
                          fontWeight: '800', 
                          padding: '3px 8px', 
                          borderRadius: '9999px', 
                          background: '#dbeafe', 
                          color: '#1d4ed8', 
                          border: '1px solid #bfdbfe',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Truck size={11} strokeWidth={2.5} />
                        DISPATCHED
                      </span>
                    )}
                    {isDelivered && (
                      <span 
                        style={{ 
                          fontSize: '0.64rem', 
                          fontWeight: '800', 
                          padding: '3px 8px', 
                          borderRadius: '9999px', 
                          background: '#dcfce7', 
                          color: '#15803d', 
                          border: '1px solid #bbf7d0',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <CheckCircle2 size={11} strokeWidth={2.5} />
                        DELIVERED
                      </span>
                    )}
                  </div>
                </div>

                {/* Customer Details & Delivery Type */}
                <div 
                  style={{ 
                    background: '#f8fafc', 
                    borderRadius: '12px', 
                    padding: '0.75rem', 
                    border: '1px solid #f1f5f9',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>
                      {order.customerName}
                    </span>
                    <span 
                      style={{ 
                        fontSize: '0.62rem', 
                        fontWeight: '700', 
                        padding: '2px 7px', 
                        borderRadius: '6px', 
                        background: isPickup ? '#f3e8ff' : '#eff6ff', 
                        color: isPickup ? '#7e22ce' : '#1d4ed8' 
                      }}
                    >
                      {isPickup ? 'Store Collection' : 'Royal Mail / Courier'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#64748b' }}>
                    <MapPin size={12} color="#94a3b8" />
                    <span>{order.deliveryAddress}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px', fontSize: '0.7rem', color: '#64748b' }}>
                    <span>Phone: <strong style={{ color: '#0f172a' }}>{order.customerPhone}</strong></span>
                    <span>Tracking: <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>{order.trackingCode}</strong></span>
                  </div>
                </div>

                {/* Ordered Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '0.66rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    ORDERED ITEMS ({order.items?.length || 0})
                  </div>
                  {order.items?.map((item, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '4px 0',
                        borderBottom: idx !== order.items.length - 1 ? '1px dashed #f1f5f9' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            style={{ width: '32px', height: '32px', borderRadius: '7px', objectFit: 'cover', border: '1px solid #e2e8f0' }} 
                          />
                        ) : (
                          <div style={{ width: '32px', height: '32px', borderRadius: '7px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                            <ShoppingBag size={14} />
                          </div>
                        )}
                        <div>
                          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0f172a' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.66rem', color: '#64748b' }}>
                            Qty: {item.qty || 1} × £{Number(item.price).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>
                        £{(Number(item.price) * (item.qty || 1)).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Financial Summary Line */}
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    paddingTop: '0.5rem', 
                    borderTop: '1px solid #f1f5f9' 
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Paid via <span style={{ fontWeight: '700', color: '#0f172a' }}>{order.paymentMethod}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Total (inc. VAT)</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em' }}>
                      £{Number(order.total).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Operations Action Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '0.45rem', marginTop: '0.2rem' }}>
                  
                  {/* Status Progression Button */}
                  {isAwaiting && (
                    <button
                      type="button"
                      onClick={() => handleAdvanceStatus(order.id)}
                      style={{
                        background: '#ea580c',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '8px 10px',
                        color: '#ffffff',
                        fontSize: '0.74rem',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                        boxShadow: '0 2px 6px rgba(234, 88, 12, 0.3)'
                      }}
                    >
                      <Truck size={14} strokeWidth={2.4} />
                      <span>{isPickup ? 'Mark Ready' : 'Dispatch'}</span>
                    </button>
                  )}

                  {isDispatched && (
                    <button
                      type="button"
                      onClick={() => handleAdvanceStatus(order.id)}
                      style={{
                        background: '#10b981',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '8px 10px',
                        color: '#ffffff',
                        fontSize: '0.74rem',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                        boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
                      }}
                    >
                      <CheckCircle2 size={14} strokeWidth={2.4} />
                      <span>Complete</span>
                    </button>
                  )}

                  {isDelivered && (
                    <div
                      style={{
                        background: '#f1f5f9',
                        borderRadius: '10px',
                        padding: '8px 10px',
                        color: '#64748b',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <CheckCircle2 size={13} color="#10b981" />
                      <span>Fulfilled</span>
                    </div>
                  )}

                  {/* WhatsApp Action */}
                  <button
                    type="button"
                    onClick={() => handleWhatsAppContact(order)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '8px 8px',
                      color: '#0f172a',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                    title="Notify customer on WhatsApp"
                  >
                    <MessageSquare size={13} color="#16a34a" />
                    <span>WhatsApp</span>
                  </button>

                  {/* Packing Slip / Invoice Action */}
                  <button
                    type="button"
                    onClick={() => setActivePackingSlip(order)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '8px 8px',
                      color: '#0f172a',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <Printer size={13} color="#64748b" />
                    <span>Packing Slip</span>
                  </button>

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* 4. Packing Slip & Dispatch Note Modal */}
      {activePackingSlip && (
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
          onClick={() => setActivePackingSlip(null)}
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
            {/* Modal Header */}
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
                    Official Order #{activePackingSlip.orderNumber}
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setActivePackingSlip(null)}
                style={{ background: '#f8fafc', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Slip Paper Sheet Look */}
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
                <div style={{ fontSize: '1rem', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase' }}>
                  {tenant?.name || 'PhoneSuite UK'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  E-Commerce Dispatch Hub &bull; {activePackingSlip.branch}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.74rem', color: '#334155', marginBottom: '0.75rem' }}>
                <div><strong>Order Reference:</strong> #{activePackingSlip.orderNumber}</div>
                <div><strong>Date Paid:</strong> {new Date(activePackingSlip.createdAt).toLocaleString()}</div>
                <div><strong>Customer:</strong> {activePackingSlip.customerName}</div>
                <div><strong>Contact:</strong> {activePackingSlip.customerPhone}</div>
                <div><strong>Address:</strong> {activePackingSlip.deliveryAddress}</div>
                <div><strong>Fulfillment Method:</strong> {activePackingSlip.fulfillmentType === 'pickup' ? 'Click & Collect' : 'Courier Dispatch'}</div>
                <div><strong>Tracking / Waybill:</strong> {activePackingSlip.trackingCode}</div>
              </div>

              <div style={{ borderTop: '1px dashed #cbd5e1', borderBottom: '1px dashed #cbd5e1', padding: '0.65rem 0', margin: '0.75rem 0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 'bold', marginBottom: '4px' }}>ORDER ITEMS:</div>
                {activePackingSlip.items?.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', padding: '2px 0' }}>
                    <span>[{item.qty || 1}x] {item.name}</span>
                    <span>£{(Number(item.price) * (item.qty || 1)).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '900', marginTop: '0.5rem' }}>
                <span>TOTAL PAID IN FULL:</span>
                <span>£{Number(activePackingSlip.total).toFixed(2)}</span>
              </div>
            </div>

            {/* Print & Close Actions */}
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
                <span>Print Dispatch Note</span>
              </button>

              <button
                type="button"
                onClick={() => setActivePackingSlip(null)}
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
