'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  TrendingUp, 
  ShoppingCart, 
  CreditCard, 
  Banknote, 
  Receipt, 
  Search, 
  Plus, 
  MessageSquare, 
  Printer, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  X
} from 'lucide-react';
import { 
  INITIAL_STAFF_SALES, 
  getSavedSales, 
  persistSales 
} from '../data/staffData';

export default function StaffSalesPage() {
  const router = useRouter();
  const params = useParams();
  const tenantSlug = params.tenantSlug || 'premiumphonex';

  const [sales, setSales] = useState(() => getSavedSales());
  const [search, setSearch] = useState('');
  const [filterMethod, setFilterMethod] = useState('all'); // all, card, cash, rto
  const [activeReceipt, setActiveReceipt] = useState(null);

  useEffect(() => {
    persistSales(sales);
  }, [sales]);

  // Calculations
  const totalSalesAmount = sales.reduce((sum, s) => sum + Number(s.total || 0), 0);
  const cardSalesTotal = sales
    .filter(s => s.paymentMethod?.toLowerCase().includes('card') || s.paymentMethod?.toLowerCase().includes('pay'))
    .reduce((sum, s) => sum + Number(s.total || 0), 0);
  const cashSalesTotal = sales
    .filter(s => s.paymentMethod?.toLowerCase().includes('cash'))
    .reduce((sum, s) => sum + Number(s.total || 0), 0);
  const rtoSalesTotal = sales
    .filter(s => s.isRto || s.paymentMethod?.toLowerCase().includes('rent') || s.paymentMethod?.toLowerCase().includes('rto'))
    .reduce((sum, s) => sum + Number(s.total || 0), 0);

  // Filtered List
  const filtered = sales.filter(s => {
    if (filterMethod === 'card' && !s.paymentMethod?.toLowerCase().includes('card') && !s.paymentMethod?.toLowerCase().includes('pay')) return false;
    if (filterMethod === 'cash' && !s.paymentMethod?.toLowerCase().includes('cash')) return false;
    if (filterMethod === 'rto' && !s.isRto && !s.paymentMethod?.toLowerCase().includes('rto') && !s.paymentMethod?.toLowerCase().includes('rent')) return false;
    
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.customerName?.toLowerCase().includes(q) ||
      s.receiptNumber?.toLowerCase().includes(q) ||
      s.items?.some(i => i.name?.toLowerCase().includes(q))
    );
  });

  const handleSendReceiptWhatsApp = (sale) => {
    const itemsSummary = sale.items?.map(i => `• ${i.name} (x${i.qty || 1}) - £${Number(i.price).toFixed(2)}`).join('\n');
    const text = encodeURIComponent(
      `Receipt from PhoneSuite UK\nReceipt: #${sale.receiptNumber}\nCustomer: ${sale.customerName}\nBranch: ${sale.branch}\n\nItems:\n${itemsSummary}\n\nTotal Paid: £${Number(sale.total).toFixed(2)}\nPayment: ${sale.paymentMethod}\n\nThank you for choosing PhoneSuite UK!`
    );
    window.open(`https://wa.me/${sale.customerPhone?.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="mobile-portal-wrapper">
      <div className="mobile-app-shell">

        {/* Header */}
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
              Sales &amp; Orders
            </h1>
            <span style={{ fontSize: '0.65rem', color: '#059669', fontWeight: '800', textTransform: 'uppercase' }}>
              Store POS Volume
            </span>
          </div>

          <button
            type="button"
            onClick={() => router.push(`/${tenantSlug}/staff/new-sale`)}
            style={{
              background: 'linear-gradient(135deg, #ff7a00 0%, #ea580c 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.74rem',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(234, 88, 12, 0.3)'
            }}
          >
            <Plus size={15} strokeWidth={2.6} />
            <span>New Sale</span>
          </button>
        </header>

        {/* Scroll Body */}
        <main className="mobile-scroll-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '3rem' }}>

          {/* Sales Hero Metrics */}
          <div 
            style={{
              background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
              border: '1.5px solid #a7f3d0',
              borderRadius: '22px',
              padding: '1.25rem',
              boxShadow: '0 8px 24px -4px rgba(5, 150, 105, 0.12)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                GROSS SALES VOLUME
              </span>
              <span style={{ fontSize: '0.62rem', background: '#059669', color: '#fff', padding: '2px 8px', borderRadius: '9999px', fontWeight: '800' }}>
                {sales.length} ORDERS
              </span>
            </div>

            <div style={{ fontSize: '2.1rem', fontWeight: '900', color: '#064e3b', letterSpacing: '-0.03em', lineHeight: 1 }}>
              £{totalSalesAmount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
            </div>
            
            <div style={{ fontSize: '0.72rem', color: '#047857', marginTop: '6px', fontWeight: '600' }}>
              Total electronic retail sales &amp; service revenue across branches
            </div>

            {/* Payment Method Breakdown Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '1rem' }}>
              
              <div style={{ background: 'rgba(255, 255, 255, 0.75)', borderRadius: '12px', padding: '0.55rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <span style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block' }}>
                  Card / Apple Pay
                </span>
                <span style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0f172a' }}>
                  £{cardSalesTotal.toFixed(0)}
                </span>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.75)', borderRadius: '12px', padding: '0.55rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <span style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block' }}>
                  Cash Register
                </span>
                <span style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0f172a' }}>
                  £{cashSalesTotal.toFixed(0)}
                </span>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.75)', borderRadius: '12px', padding: '0.55rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <span style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block' }}>
                  RTO Financed
                </span>
                <span style={{ fontSize: '0.92rem', fontWeight: '900', color: '#ea580c' }}>
                  £{rtoSalesTotal.toFixed(0)}
                </span>
              </div>

            </div>
          </div>

          {/* Quick CTA to New Sale */}
          <button
            type="button"
            onClick={() => router.push(`/${tenantSlug}/staff/new-sale`)}
            style={{
              background: 'linear-gradient(135deg, #ff7a00 0%, #ea580c 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '16px',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(234, 88, 12, 0.3)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingCart size={17} color="#ffffff" strokeWidth={2.4} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#ffffff' }}>
                  Start New Checkout / POS Sale
                </div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                  Card, Cash or Rent-to-Own Financing
                </div>
              </div>
            </div>
            <ChevronRight size={18} color="#ffffff" />
          </button>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '2px' }}>
            <button
              type="button"
              onClick={() => setFilterMethod('all')}
              style={{
                padding: '6px 12px',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: '800',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: filterMethod === 'all' ? '#0f172a' : '#ffffff',
                color: filterMethod === 'all' ? '#ffffff' : '#64748b',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
              }}
            >
              All Sales ({sales.length})
            </button>

            <button
              type="button"
              onClick={() => setFilterMethod('card')}
              style={{
                padding: '6px 12px',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: '800',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: filterMethod === 'card' ? '#059669' : '#ffffff',
                color: filterMethod === 'card' ? '#ffffff' : '#64748b',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
              }}
            >
              Card &amp; Contactless
            </button>

            <button
              type="button"
              onClick={() => setFilterMethod('cash')}
              style={{
                padding: '6px 12px',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: '800',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: filterMethod === 'cash' ? '#0284c7' : '#ffffff',
                color: filterMethod === 'cash' ? '#ffffff' : '#64748b',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
              }}
            >
              Cash Desk
            </button>

            <button
              type="button"
              onClick={() => setFilterMethod('rto')}
              style={{
                padding: '6px 12px',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: '800',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: filterMethod === 'rto' ? '#ea580c' : '#ffffff',
                color: filterMethod === 'rto' ? '#ffffff' : '#64748b',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
              }}
            >
              RTO Financed
            </button>
          </div>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by customer, item, or receipt #..."
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

          {/* Sales List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: '#fff', borderRadius: '18px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                <Receipt size={36} color="#94a3b8" style={{ margin: '0 auto 0.5rem auto' }} />
                <p style={{ fontWeight: '800', fontSize: '0.95rem', color: '#0f172a' }}>No Sales Found</p>
                <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>No transactions match your search filter.</p>
              </div>
            ) : (
              filtered.map((sale) => (
                <div
                  key={sale.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '18px',
                    padding: '1.1rem',
                    boxShadow: '0 3px 12px rgba(0, 0, 0, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem'
                  }}
                >
                  {/* Top Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontWeight: '900', fontSize: '0.92rem', color: '#0f172a' }}>
                          {sale.customerName}
                        </span>
                        <span 
                          style={{ 
                            fontSize: '0.6rem', 
                            padding: '2px 7px', 
                            borderRadius: '6px', 
                            fontWeight: '800',
                            background: sale.isRto ? '#fff7ed' : '#ecfdf5',
                            color: sale.isRto ? '#c2410c' : '#047857',
                            border: sale.isRto ? '1px solid #fed7aa' : '1px solid #a7f3d0'
                          }}
                        >
                          {sale.paymentMethod}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                        {sale.receiptNumber} &bull; {new Date(sale.createdAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0f172a' }}>
                        £{Number(sale.total).toFixed(2)}
                      </div>
                      <span style={{ fontSize: '0.62rem', color: '#059669', fontWeight: '700' }}>
                        PAID IN FULL
                      </span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '0.6rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {sale.items?.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#334155' }}>
                        <span>{item.name} {item.qty > 1 && `(x${item.qty})`}</span>
                        <strong style={{ color: '#0f172a' }}>£{Number(item.price * (item.qty || 1)).toFixed(2)}</strong>
                      </div>
                    ))}
                  </div>

                  {/* RTO note if present */}
                  {sale.isRto && sale.rtoDetails && (
                    <div style={{ fontSize: '0.7rem', color: '#c2410c', background: '#fff7ed', padding: '5px 8px', borderRadius: '8px', border: '1px solid #fed7aa', fontWeight: '600' }}>
                      Agreement #{sale.rtoDetails.contractNumber} &bull; Downpayment: £{Number(sale.rtoDetails.downPayment).toFixed(2)} &bull; £{Number(sale.rtoDetails.weeklyInstallment).toFixed(2)}/wk ({sale.rtoDetails.termWeeks} wks)
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '0.6rem', marginTop: '0.1rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                      Staff: <strong style={{ color: '#0f172a' }}>{sale.staffMember || 'Alex Rivera'}</strong>
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={() => handleSendReceiptWhatsApp(sale)}
                        style={{
                          background: '#22c55e',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <MessageSquare size={13} />
                        WhatsApp
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveReceipt(sale)}
                        style={{
                          background: '#0f172a',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Receipt size={13} />
                        Receipt
                      </button>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>

        </main>

        {/* Interactive Printable Receipt Modal */}
        {activeReceipt && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              backdropFilter: 'blur(5px)'
            }}
          >
            <div 
              style={{
                width: '100%',
                maxWidth: '380px',
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                padding: '1.5rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              {/* Receipt Header */}
              <div style={{ textAlign: 'center', borderBottom: '1px dashed #cbd5e1', paddingBottom: '0.85rem', position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setActiveReceipt(null)}
                  style={{ position: 'absolute', right: 0, top: 0, background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={15} />
                </button>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                  PHONESUITE UK
                </h3>
                <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  Electronics Sales &amp; Technical Services
                </p>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '4px' }}>
                  Branch: {activeReceipt.branch || 'London Central Branch'}
                </div>
              </div>

              {/* Receipt Info */}
              <div style={{ fontSize: '0.74rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Receipt #:</span>
                  <strong style={{ color: '#0f172a' }}>{activeReceipt.receiptNumber}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Customer:</span>
                  <strong style={{ color: '#0f172a' }}>{activeReceipt.customerName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Payment:</span>
                  <strong style={{ color: '#0f172a' }}>{activeReceipt.paymentMethod}</strong>
                </div>
              </div>

              {/* Items Table */}
              <div style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '0.65rem 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {activeReceipt.items?.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem' }}>
                    <span>{item.qty || 1}x {item.name}</span>
                    <strong style={{ color: '#0f172a' }}>£{Number(item.price * (item.qty || 1)).toFixed(2)}</strong>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Subtotal (Net):</span>
                  <span>£{Number(activeReceipt.subtotal || activeReceipt.total * 0.8).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>VAT (20%):</span>
                  <span>£{Number(activeReceipt.vat || activeReceipt.total * 0.2).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '900', color: '#0f172a', borderTop: '1px dashed #cbd5e1', paddingTop: '6px', marginTop: '2px' }}>
                  <span>Total Paid:</span>
                  <span>£{Number(activeReceipt.total).toFixed(2)}</span>
                </div>
              </div>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => handleSendReceiptWhatsApp(activeReceipt)}
                  style={{
                    flex: 1,
                    background: '#22c55e',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.75rem',
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <MessageSquare size={15} />
                  WhatsApp
                </button>
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
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Printer size={15} />
                  Print
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
