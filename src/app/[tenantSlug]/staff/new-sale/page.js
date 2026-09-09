'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Banknote, 
  Sparkles, 
  CheckCircle2, 
  MessageSquare, 
  Printer, 
  User, 
  UserPlus, 
  Tag, 
  Percent, 
  Smartphone, 
  Tablet, 
  Laptop, 
  Headphones, 
  Layers,
  Wrench,
  Check,
  X
} from 'lucide-react';
import { 
  INITIAL_STAFF_CUSTOMERS, 
  getSavedProducts, 
  getSavedSales, 
  persistSales,
  SHOP_CATEGORY_OPTIONS 
} from '../data/staffData';

export default function NewSalePage() {
  const router = useRouter();
  const params = useParams();
  const tenantSlug = params.tenantSlug || 'premiumphonex';

  const [products] = useState(() => getSavedProducts());
  const [customers, setCustomers] = useState(INITIAL_STAFF_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Cart: [{ id, name, price, qty, image, category }]
  const [cart, setCart] = useState([]);

  // Custom Item Intake
  const [showCustomItem, setShowCustomItem] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');

  // Payment Method: 'card', 'cash', 'rto'
  const [paymentMode, setPaymentMode] = useState('card');

  // RTO Financing Params
  const [downPayment, setDownPayment] = useState('');
  const [rtoTermWeeks, setRtoTermWeeks] = useState(24);

  // New Customer Modal
  const [isNewCustModalOpen, setIsNewCustModalOpen] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');

  // Success Receipt State
  const [completedSale, setCompletedSale] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + (Number(item.price) * item.qty), 0);
  const vatAmount = cartSubtotal * 0.20;
  const cartTotal = cartSubtotal; // prices in UK electronics retail are VAT inclusive

  // RTO Calculations
  const calculatedDownPayment = downPayment !== '' ? parseFloat(downPayment) : Math.min(100, Math.round(cartTotal * 0.2));
  const rtoRemainingBalance = Math.max(0, cartTotal - calculatedDownPayment);
  const weeklyInstallment = rtoRemainingBalance > 0 ? (rtoRemainingBalance / rtoTermWeeks) * 1.05 : 0; // 5% flat financing fee

  // Cart operations
  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleAddCustomItem = (e) => {
    e.preventDefault();
    if (!customName || !customPrice) return;

    const newItem = {
      id: `custom-${Date.now()}`,
      name: customName,
      price: parseFloat(customPrice) || 0,
      qty: 1,
      category: 'services'
    };

    setCart(prev => [...prev, newItem]);
    setCustomName('');
    setCustomPrice('');
    setShowCustomItem(false);
  };

  const handleCreateCustomer = (e) => {
    e.preventDefault();
    if (!newCustName) return;

    const newCust = {
      id: `cust-${Date.now()}`,
      name: newCustName,
      phone: newCustPhone || '+44 7900 000000',
      email: newCustEmail || '',
      tier: 'Standard VIP',
      credit_score: 720,
      credit_limit: 1500.00,
      address: 'London, UK',
      total_spent: 0,
      active_repairs_count: 0,
      overdue_count: 0
    };

    setCustomers(prev => [newCust, ...prev]);
    setSelectedCustomer(newCust);
    setIsNewCustModalOpen(false);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustEmail('');
  };

  // Complete Sale
  const handleFinalizeSale = () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      const receiptNo = `REC-2026-${Math.floor(4000 + Math.random() * 5999)}`;
      const isRto = paymentMode === 'rto';
      
      const newSaleRecord = {
        id: `sale-${Date.now()}`,
        receiptNumber: receiptNo,
        customerName: selectedCustomer?.name || 'Walk-in Guest',
        customerPhone: selectedCustomer?.phone || '+44 7900 000000',
        customerEmail: selectedCustomer?.email || '',
        items: cart.map(i => ({ name: i.name, price: i.price, qty: i.qty })),
        subtotal: cartTotal * 0.8,
        vat: cartTotal * 0.2,
        total: cartTotal,
        paymentMethod: isRto ? 'Rent-to-Own Financing' : paymentMode === 'cash' ? 'Cash Register' : 'Card / Contactless',
        isRto,
        rtoDetails: isRto ? {
          contractNumber: `RTO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          downPayment: calculatedDownPayment,
          weeklyInstallment: weeklyInstallment,
          termWeeks: rtoTermWeeks
        } : null,
        status: 'completed',
        branch: 'London Central Branch',
        staffMember: 'Alex Rivera',
        createdAt: new Date().toISOString()
      };

      const existingSales = getSavedSales();
      persistSales([newSaleRecord, ...existingSales]);

      setIsProcessing(false);
      setCompletedSale(newSaleRecord);
      setCart([]);
    }, 600);
  };

  const handleSendWhatsAppReceipt = (sale) => {
    const itemsText = sale.items.map(i => `• ${i.name} (x${i.qty}) - £${Number(i.price).toFixed(2)}`).join('\n');
    const msg = encodeURIComponent(
      `Receipt from PhoneSuite UK\nReceipt: #${sale.receiptNumber}\nCustomer: ${sale.customerName}\nBranch: ${sale.branch}\n\nItems:\n${itemsText}\n\nTotal Paid: £${Number(sale.total).toFixed(2)}\nPayment: ${sale.paymentMethod}\n\nThank you for choosing PhoneSuite UK!`
    );
    window.open(`https://wa.me/${sale.customerPhone?.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (!search.trim()) return true;
    return p.name?.toLowerCase().includes(search.toLowerCase());
  });

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
              New POS Sale
            </h1>
            <span style={{ fontSize: '0.65rem', color: '#ea580c', fontWeight: '800', textTransform: 'uppercase' }}>
              Checkout &amp; Financing
            </span>
          </div>

          <div style={{ position: 'relative' }}>
            <div 
              style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '10px', 
                background: cart.length > 0 ? '#ea580c' : '#f1f5f9', 
                color: cart.length > 0 ? '#ffffff' : '#64748b', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: cart.length > 0 ? '0 2px 8px rgba(234, 88, 12, 0.3)' : 'none'
              }}
            >
              <ShoppingCart size={17} />
            </div>
            {cart.length > 0 && (
              <span 
                style={{ 
                  position: 'absolute', 
                  top: '-4px', 
                  right: '-4px', 
                  background: '#0f172a', 
                  color: '#fff', 
                  fontSize: '0.62rem', 
                  fontWeight: '900', 
                  width: '16px', 
                  height: '16px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              >
                {cart.reduce((sum, i) => sum + i.qty, 0)}
              </span>
            )}
          </div>
        </header>

        {/* Scrollable Body */}
        <main className="mobile-scroll-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '5rem' }}>

          {/* 1. Customer Selector Box */}
          <div 
            style={{ 
              background: '#ffffff', 
              border: '1px solid #e2e8f0', 
              borderRadius: '18px', 
              padding: '0.85rem 1rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>
                CUSTOMER ACCOUNT
              </span>
              <button
                type="button"
                onClick={() => setIsNewCustModalOpen(true)}
                style={{
                  background: '#eff6ff',
                  color: '#2563eb',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  fontSize: '0.68rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <UserPlus size={12} />
                + New Customer
              </button>
            </div>

            <select
              value={selectedCustomer?.id || ''}
              onChange={(e) => {
                const found = customers.find(c => c.id === e.target.value);
                if (found) setSelectedCustomer(found);
              }}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '12px',
                border: '1.5px solid #cbd5e1',
                backgroundColor: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: '700',
                color: '#0f172a'
              }}
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone}) &bull; {c.tier || 'VIP'}
                </option>
              ))}
            </select>

            {selectedCustomer && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.7rem', color: '#64748b' }}>
                <span>Credit Score: <strong style={{ color: '#059669' }}>{selectedCustomer.credit_score || 750}</strong></span>
                <span>Limit: <strong style={{ color: '#0f172a' }}>£{Number(selectedCustomer.credit_limit || 2000).toFixed(2)}</strong></span>
              </div>
            )}
          </div>

          {/* 2. Cart Summary Box (if cart not empty) */}
          {cart.length > 0 && (
            <div 
              style={{
                background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)',
                border: '1.5px solid #fed7aa',
                borderRadius: '20px',
                padding: '1rem',
                boxShadow: '0 4px 16px rgba(234, 88, 12, 0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '900', color: '#9a3412', textTransform: 'uppercase' }}>
                  CURRENT CART ({cart.reduce((s, i) => s + i.qty, 0)} items)
                </span>
                <button
                  type="button"
                  onClick={() => setCart([])}
                  style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.7rem', fontWeight: '700', cursor: 'pointer' }}
                >
                  Clear All
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.85rem' }}>
                {cart.map((item) => (
                  <div 
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#ffffff',
                      borderRadius: '12px',
                      padding: '0.55rem 0.75rem',
                      border: '1px solid #f1f5f9'
                    }}
                  >
                    <div style={{ flex: 1, paddingRight: '0.5rem' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#ea580c', fontWeight: '700' }}>
                        £{Number(item.price).toFixed(2)} each
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, -1)}
                        style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '0.82rem', fontWeight: '900', minWidth: '16px', textAlign: 'center' }}>
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, 1)}
                        style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        style={{ width: '24px', height: '24px', borderRadius: '6px', border: 'none', background: '#fee2e2', color: '#b91c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginLeft: '2px' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div style={{ borderTop: '1px dashed #fed7aa', paddingTop: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Includes 20% VAT (£{vatAmount.toFixed(2)})</div>
                  <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em' }}>
                    Total: £{cartTotal.toFixed(2)}
                  </div>
                </div>

                <span style={{ fontSize: '0.65rem', background: '#ea580c', color: '#fff', padding: '3px 8px', borderRadius: '9999px', fontWeight: '800' }}>
                  READY FOR PAYMENT
                </span>
              </div>

              {/* Payment Mode Selector */}
              <div style={{ marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>
                  CHOOSE PAYMENT TERM
                </span>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMode('card')}
                    style={{
                      padding: '0.6rem 0.4rem',
                      borderRadius: '12px',
                      border: paymentMode === 'card' ? '2px solid #059669' : '1px solid #cbd5e1',
                      background: paymentMode === 'card' ? '#ecfdf5' : '#ffffff',
                      color: paymentMode === 'card' ? '#047857' : '#0f172a',
                      fontSize: '0.74rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <CreditCard size={15} />
                    <span>Card POS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMode('cash')}
                    style={{
                      padding: '0.6rem 0.4rem',
                      borderRadius: '12px',
                      border: paymentMode === 'cash' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                      background: paymentMode === 'cash' ? '#f0f9ff' : '#ffffff',
                      color: paymentMode === 'cash' ? '#0369a1' : '#0f172a',
                      fontSize: '0.74rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <Banknote size={15} />
                    <span>Cash Desk</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMode('rto')}
                    style={{
                      padding: '0.6rem 0.4rem',
                      borderRadius: '12px',
                      border: paymentMode === 'rto' ? '2px solid #ea580c' : '1px solid #cbd5e1',
                      background: paymentMode === 'rto' ? '#fff7ed' : '#ffffff',
                      color: paymentMode === 'rto' ? '#c2410c' : '#0f172a',
                      fontSize: '0.74rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <Percent size={15} />
                    <span>RTO Finance</span>
                  </button>
                </div>

                {/* RTO Parameters if RTO mode is selected */}
                {paymentMode === 'rto' && (
                  <div style={{ background: '#fff7ed', borderRadius: '12px', padding: '0.75rem', border: '1px solid #fed7aa', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#9a3412' }}>Downpayment Required:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '900' }}>£</span>
                        <input
                          type="number"
                          value={downPayment}
                          placeholder={Math.round(cartTotal * 0.2).toString()}
                          onChange={(e) => setDownPayment(e.target.value)}
                          style={{ width: '75px', padding: '3px 6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', fontWeight: '800' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#9a3412' }}>Term Weeks:</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[12, 24, 36].map(w => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => setRtoTermWeeks(w)}
                            style={{
                              padding: '2px 7px',
                              borderRadius: '6px',
                              border: 'none',
                              fontSize: '0.7rem',
                              fontWeight: '800',
                              background: rtoTermWeeks === w ? '#ea580c' : '#ffffff',
                              color: rtoTermWeeks === w ? '#ffffff' : '#64748b',
                              cursor: 'pointer'
                            }}
                          >
                            {w}w
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid #fed7aa', paddingTop: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#9a3412' }}>
                      <span>Weekly Installment:</span>
                      <strong style={{ fontSize: '0.88rem', color: '#ea580c' }}>£{weeklyInstallment.toFixed(2)}/week</strong>
                    </div>
                  </div>
                )}

                {/* Final Checkout Button */}
                <button
                  type="button"
                  onClick={handleFinalizeSale}
                  disabled={isProcessing}
                  style={{
                    marginTop: '0.4rem',
                    background: 'linear-gradient(135deg, #ff7a00 0%, #ea580c 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '0.9rem',
                    fontSize: '0.95rem',
                    fontWeight: '900',
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 15px rgba(234, 88, 12, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  {isProcessing ? (
                    <span>Processing Sale...</span>
                  ) : (
                    <>
                      <CheckCircle2 size={18} strokeWidth={2.5} />
                      <span>Charge £{paymentMode === 'rto' ? calculatedDownPayment.toFixed(2) : cartTotal.toFixed(2)} &amp; Print</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* 3. Catalog & Quick Add Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                PRODUCTS &amp; SERVICES CATALOG
              </span>

              <button
                type="button"
                onClick={() => setShowCustomItem(!showCustomItem)}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '4px 8px',
                  fontSize: '0.68rem',
                  fontWeight: '800',
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                + Custom Line Item
              </button>
            </div>

            {/* Custom Item Quick Form */}
            {showCustomItem && (
              <form 
                onSubmit={handleAddCustomItem}
                style={{
                  background: '#f8fafc',
                  borderRadius: '14px',
                  padding: '0.75rem',
                  border: '1px solid #cbd5e1',
                  display: 'flex',
                  gap: '0.4rem',
                  alignItems: 'center'
                }}
              >
                <input
                  type="text"
                  required
                  placeholder="e.g. Screen Replacement Labor"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  style={{ flex: 2, padding: '0.5rem 0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                />
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="£"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  style={{ width: '65px', padding: '0.5rem 0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                />
                <button
                  type="submit"
                  style={{
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  Add
                </button>
              </form>
            )}

            {/* Category Pills */}
            <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '2px' }}>
              {SHOP_CATEGORY_OPTIONS.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '9999px',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    border: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    background: selectedCategory === cat.id ? '#0f172a' : '#ffffff',
                    color: selectedCategory === cat.id ? '#ffffff' : '#64748b',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search catalog devices, accessories..."
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

            {/* Product Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '0.75rem',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.5rem'
                  }}
                >
                  {prod.image && (
                    <img
                      src={prod.image}
                      alt={prod.name}
                      style={{
                        width: '100%',
                        height: '90px',
                        objectFit: 'cover',
                        borderRadius: '10px'
                      }}
                    />
                  )}

                  <div>
                    <span style={{ fontSize: '0.6rem', color: '#ea580c', fontWeight: '800', textTransform: 'uppercase' }}>
                      {prod.category}
                    </span>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a', margin: '2px 0 0 0', lineHeight: 1.25 }}>
                      {prod.name}
                    </h4>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: '900', color: '#0f172a' }}>
                      £{Number(prod.price).toFixed(2)}
                    </span>

                    <button
                      type="button"
                      onClick={() => addToCart(prod)}
                      style={{
                        background: '#0f172a',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '5px 9px',
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <Plus size={12} />
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </main>

        {/* Modal: New Customer Quick Register */}
        {isNewCustModalOpen && (
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
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              backdropFilter: 'blur(4px)'
            }}
          >
            <div 
              style={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                padding: '1.5rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                  Quick Customer Intake
                </h3>
                <button
                  type="button"
                  onClick={() => setIsNewCustModalOpen(false)}
                  style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleCreateCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    PHONE NUMBER
                  </label>
                  <input
                    type="text"
                    placeholder="+44 7922 112233"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    marginTop: '0.5rem',
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.8rem',
                    fontSize: '0.88rem',
                    fontWeight: '900',
                    cursor: 'pointer'
                  }}
                >
                  Attach &amp; Proceed
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Completed Sale & Receipt */}
        {completedSale && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
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
                borderRadius: '24px',
                padding: '1.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              {/* Success Badge */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem auto' }}>
                  <CheckCircle2 size={32} strokeWidth={2.5} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                  Sale Complete!
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Receipt #{completedSale.receiptNumber}
                </span>
              </div>

              {/* Receipt Summary Box */}
              <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '0.85rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Customer:</span>
                  <strong style={{ color: '#0f172a' }}>{completedSale.customerName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Method:</span>
                  <strong style={{ color: '#0f172a' }}>{completedSale.paymentMethod}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '4px', marginTop: '2px', fontSize: '1.05rem', fontWeight: '900', color: '#0f172a' }}>
                  <span>Total Paid:</span>
                  <span>£{Number(completedSale.total).toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => handleSendWhatsAppReceipt(completedSale)}
                  style={{
                    background: '#22c55e',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.8rem',
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <MessageSquare size={16} />
                  Send WhatsApp Receipt
                </button>

                <button
                  type="button"
                  onClick={() => router.push(`/${tenantSlug}/staff/sales`)}
                  style={{
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.8rem',
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  View Sales Feed
                </button>

                <button
                  type="button"
                  onClick={() => setCompletedSale(null)}
                  style={{
                    background: '#f1f5f9',
                    color: '#475569',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.65rem',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Start Another Sale
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
