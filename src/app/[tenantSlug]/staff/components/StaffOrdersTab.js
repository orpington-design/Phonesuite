'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  persistOnlineOrders,
  formatMoney
} from '../data/staffData';
import { useStaffLanguage } from '../context/StaffLanguageContext';

export default function StaffOrdersTab({ tenant, branch, tenantSlug }) {
  const router = useRouter();
  const params = useParams();
  const activeSlug = tenantSlug || params?.tenantSlug || tenant?.slug || 'premiumphonex';
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', paddingBottom: '2rem' }}>
      
      {/* 1. Header Banner & Store Info - Orange Luxury Card */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #ff7a00 0%, #ea580c 100%)', 
          borderRadius: '18px', 
          padding: '1.25rem', 
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(234, 88, 12, 0.28)',
          border: '1px solid rgba(255, 255, 255, 0.25)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div 
              style={{ 
                width: '38px', 
                height: '38px', 
                borderRadius: '12px', 
                background: 'rgba(255, 255, 255, 0.22)', 
                border: '1px solid rgba(255, 255, 255, 0.35)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#ffffff' 
              }}
            >
              <Package size={20} strokeWidth={2.4} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0, letterSpacing: '-0.02em', color: '#ffffff' }}>
                {language === 'pt' ? 'Pedidos da Loja Online' : 'Customer Portal Orders'}
              </h2>
              <p style={{ fontSize: '0.74rem', color: '#ffedd5', margin: 0 }}>
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
              background: 'rgba(255, 255, 255, 0.25)', 
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              letterSpacing: '0.04em'
            }}
          >
            LIVE SYNC
          </span>
        </div>

        {/* Top 3 KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '1rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.18)', borderRadius: '12px', padding: '0.65rem', border: '1px solid rgba(255, 255, 255, 0.25)' }}>
            <div style={{ fontSize: '0.62rem', color: '#ffedd5', textTransform: 'uppercase', fontWeight: '700' }}>
              {language === 'pt' ? 'Total Pedidos' : 'Total Orders'}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#ffffff', marginTop: '2px' }}>
              {totalOrders}
            </div>
            <div style={{ fontSize: '0.62rem', color: '#ffffff', fontWeight: '700', marginTop: '2px' }}>
              £{totalRevenue.toFixed(2)}
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.18)', borderRadius: '12px', padding: '0.65rem', border: '1px solid rgba(255, 255, 255, 0.25)' }}>
            <div style={{ fontSize: '0.62rem', color: '#ffedd5', textTransform: 'uppercase', fontWeight: '700' }}>
              {language === 'pt' ? 'Pendente Envio' : 'Awaiting'}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#ffffff', marginTop: '2px' }}>
              {awaitingCount}
            </div>
            <div style={{ fontSize: '0.62rem', color: '#ffedd5', fontWeight: '600', marginTop: '2px' }}>
              Needs Pack &amp; Post
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.18)', borderRadius: '12px', padding: '0.65rem', border: '1px solid rgba(255, 255, 255, 0.25)' }}>
            <div style={{ fontSize: '0.62rem', color: '#ffedd5', textTransform: 'uppercase', fontWeight: '700' }}>
              {language === 'pt' ? 'Em Trânsito' : 'Dispatched'}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#ffffff', marginTop: '2px' }}>
              {dispatchedCount}
            </div>
            <div style={{ fontSize: '0.62rem', color: '#ffedd5', fontWeight: '600', marginTop: '2px' }}>
              With Couriers
            </div>
          </div>
        </div>
      </div>

      {/* 2. Search & Segmented Filter Bar */}
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

        {/* Filter Segmented Pills - Scrollable and never overlapping */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '6px',
            overflowX: 'auto',
            padding: '2px 0 6px 0',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
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
                  flexShrink: 0,
                  padding: '7px 13px',
                  borderRadius: '10px',
                  border: isActive ? '1.5px solid #ea580c' : '1px solid #e2e8f0',
                  background: isActive ? '#fff7ed' : '#ffffff',
                  color: isActive ? '#c2410c' : '#64748b',
                  fontSize: '0.74rem',
                  fontWeight: isActive ? '800' : '600',
                  boxShadow: isActive ? '0 1px 4px rgba(234, 88, 12, 0.15)' : '0 1px 2px rgba(0,0,0,0.03)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{tab.label}</span>
                <span 
                  style={{ 
                    fontSize: '0.64rem', 
                    padding: '2px 6px', 
                    borderRadius: '9999px',
                    background: isActive ? '#ea580c' : '#f1f5f9',
                    color: isActive ? '#ffffff' : '#475569',
                    fontWeight: '800',
                    lineHeight: 1
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Orders List - Clickable Cards Without Cluttering Buttons */}
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
                onClick={() => router.push(`/${activeSlug}/staff/orders/${order.id}`)}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  padding: '1.1rem',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  cursor: 'pointer',
                  transition: 'transform 0.12s ease, box-shadow 0.12s ease'
                }}
              >
                {/* Header: Order #, Date, Status Badges */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.01em' }}>
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
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.deliveryAddress}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px', fontSize: '0.7rem', color: '#64748b' }}>
                    <span>Phone: <strong style={{ color: '#0f172a' }}>{order.customerPhone}</strong></span>
                    <span>Tracking: <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>{order.trackingCode}</strong></span>
                  </div>
                </div>

                {/* Ordered Items Preview */}
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
                        padding: '3px 0',
                        borderBottom: idx !== order.items.length - 1 ? '1px dashed #f1f5f9' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            style={{ width: '30px', height: '30px', borderRadius: '7px', objectFit: 'cover', border: '1px solid #e2e8f0' }} 
                          />
                        ) : (
                          <div style={{ width: '30px', height: '30px', borderRadius: '7px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                            <ShoppingBag size={13} />
                          </div>
                        )}
                        <div>
                          <div style={{ fontSize: '0.76rem', fontWeight: '700', color: '#0f172a' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.64rem', color: '#64748b' }}>
                            Qty: {item.qty || 1} × {formatMoney(item.price)}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a' }}>
                        {formatMoney(Number(item.price) * (item.qty || 1))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Clickable Card Footer with Total & Details Link */}
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    paddingTop: '0.65rem', 
                    borderTop: '1px solid #f1f5f9' 
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Total: <strong style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: '900' }}>{formatMoney(order.total)}</strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ea580c', fontSize: '0.74rem', fontWeight: '800' }}>
                    <span>View Order Details</span>
                    <ChevronRight size={15} strokeWidth={2.4} />
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
