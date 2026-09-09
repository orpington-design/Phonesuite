'use client';

import { useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  User, 
  Check, 
  Sparkles, 
  CreditCard, 
  Banknote, 
  Calendar, 
  ShieldCheck, 
  AlertCircle,
  Wrench,
  CheckCircle2,
  Package
} from 'lucide-react';
import { useStaffLanguage } from '../context/StaffLanguageContext';
import { SHOP_CATEGORY_OPTIONS } from '../data/staffData';

export default function StaffSaleTab({
  products = [],
  customers = [],
  onOpenNewCustomer,
  onCompleteSale,
  activeBranch = 'London Central Branch'
}) {
  const { t } = useStaffLanguage();
  const s = t.sale;

  // Selected customer
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const activeCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  // Basket items: [ { id, name, price, quantity, type, category } ]
  const [basket, setBasket] = useState([]);

  // Product catalog search & category
  const [catalogCategory, setCatalogCategory] = useState('all');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [itemsTab, setItemsTab] = useState('catalog'); // 'catalog' or 'custom_service'

  // Custom service charge inputs
  const [customDesc, setCustomDesc] = useState('Electronics Repair Diagnostic & Labor');
  const [customCost, setCustomCost] = useState('65.00');

  // Payment method: 'outright_card', 'outright_cash', 'rto'
  const [paymentMode, setPaymentMode] = useState('outright_card');

  // RTO parameters
  const [rtoTenureMonths, setRtoTenureMonths] = useState(12);
  const [rtoDeposit, setRtoDeposit] = useState('0');
  const [rtoFrequency, setRtoFrequency] = useState('monthly'); // 'monthly' or 'weekly'

  // Basket operations
  const handleAddToBasket = (product) => {
    setBasket(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: Number(product.price || 0),
        quantity: 1,
        type: 'product',
        image: product.image,
        category: product.category
      }];
    });
  };

  const handleAddCustomCharge = (e) => {
    e.preventDefault();
    const costNum = parseFloat(customCost);
    if (isNaN(costNum) || costNum <= 0 || !customDesc) {
      alert('Please enter valid description and cost.');
      return;
    }

    setBasket(prev => [
      ...prev,
      {
        id: `custom-svc-${Date.now()}`,
        name: customDesc,
        price: costNum,
        quantity: 1,
        type: 'service',
        category: 'repairs'
      }
    ]);
    setCustomDesc('Electronics Repair Diagnostic & Labor');
    setCustomCost('65.00');
  };

  const handleUpdateQuantity = (id, delta) => {
    setBasket(prev => prev.map(item => {
      if (item.id === id) {
        const nextQty = item.quantity + delta;
        return nextQty > 0 ? { ...item, quantity: nextQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const handleRemoveItem = (id) => {
    setBasket(prev => prev.filter(item => item.id !== id));
  };

  // Calculations
  const subtotal = basket.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const vatAmount = subtotal * 0.20; // 20% UK VAT
  const totalPayable = subtotal + vatAmount;

  // RTO Calculation
  const depositNum = parseFloat(rtoDeposit) || 0;
  const financedAmount = Math.max(0, totalPayable - depositNum);
  const monthlyRTO = rtoTenureMonths > 0 ? (financedAmount / rtoTenureMonths) : 0;
  const weeklyRTO = rtoTenureMonths > 0 ? (financedAmount / (rtoTenureMonths * 4.33)) : 0;

  // Credit check
  const customerLimit = activeCustomer?.credit_limit || 2000;
  const isCreditApproved = totalPayable <= customerLimit;

  // Catalog filtered
  const filteredProducts = products.filter(p => {
    if (catalogCategory !== 'all' && p.category !== catalogCategory) return false;
    if (catalogSearch.trim()) {
      const q = catalogSearch.toLowerCase();
      return p.name?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q);
    }
    return true;
  });

  const handleFinishSale = () => {
    if (basket.length === 0) {
      alert('Please add items or services to the basket.');
      return;
    }

    if (!activeCustomer) {
      alert('Please select or create a customer profile.');
      return;
    }

    const salePayload = {
      customer: activeCustomer,
      items: basket,
      subtotal,
      vat: vatAmount,
      total: totalPayable,
      paymentMode,
      isRto: paymentMode === 'rto',
      rtoDetails: paymentMode === 'rto' ? {
        contractId: `CON-${Date.now().toString().slice(-4)}`,
        term: rtoTenureMonths,
        deposit: depositNum,
        monthly: monthlyRTO.toFixed(2),
        frequency: rtoFrequency
      } : null,
      branch: activeBranch
    };

    onCompleteSale(salePayload);
    // Clear basket
    setBasket([]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            {s.title}
          </h2>
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '3px 0 0 0', fontWeight: '500' }}>
            {s.subtitle}
          </p>
        </div>
      </div>

      {/* STEP 1: Select Customer */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <User size={15} strokeWidth={2.4} />
            </div>
            <span>{s.stepCustomer}</span>
          </div>
          <button
            type="button"
            onClick={onOpenNewCustomer}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '5px 10px',
              fontSize: '0.72rem',
              fontWeight: '700',
              color: '#0f172a',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
            }}
          >
            {s.orQuickAddCustomer}
          </button>
        </div>

        {/* Customer Select Dropdown */}
        <select
          value={selectedCustomerId}
          onChange={(e) => setSelectedCustomerId(e.target.value)}
          style={{
            width: '100%',
            padding: '0.7rem 0.85rem',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            fontSize: '0.82rem',
            color: '#0f172a',
            outline: 'none',
            marginBottom: '0.75rem'
          }}
        >
          {customers.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} &bull; {c.phone} (Score: {c.credit_score})
            </option>
          ))}
        </select>

        {/* Active Customer Details Pill */}
        {activeCustomer && (
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.75rem 0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
            <div>
              <span style={{ fontWeight: '800', color: '#0f172a' }}>{activeCustomer.name}</span>
              <span style={{ color: '#64748b', marginLeft: '6px' }}>{activeCustomer.phone}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '6px', fontWeight: '800', fontSize: '0.68rem', border: '1px solid #a7f3d0' }}>
                Score: {activeCustomer.credit_score}
              </span>
              <span style={{ fontWeight: '800', color: '#0f172a' }}>
                Limit: £{Number(activeCustomer.credit_limit || 2000).toFixed(0)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* STEP 2: Select Items or Custom Service */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        
        {/* Toggle between Product Catalog vs Custom Service (Segmented Pill Style) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginBottom: '0.85rem', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
          <button
            type="button"
            onClick={() => setItemsTab('catalog')}
            style={{
              padding: '0.55rem',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: itemsTab === 'catalog' ? '#ffffff' : 'transparent',
              color: itemsTab === 'catalog' ? '#0f172a' : '#64748b',
              fontWeight: itemsTab === 'catalog' ? '800' : '600',
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              boxShadow: itemsTab === 'catalog' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Package size={15} strokeWidth={2.2} />
            {s.tabCatalog}
          </button>

          <button
            type="button"
            onClick={() => setItemsTab('custom_service')}
            style={{
              padding: '0.55rem',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: itemsTab === 'custom_service' ? '#ffffff' : 'transparent',
              color: itemsTab === 'custom_service' ? '#0f172a' : '#64748b',
              fontWeight: itemsTab === 'custom_service' ? '800' : '600',
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              boxShadow: itemsTab === 'custom_service' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Wrench size={15} strokeWidth={2.2} />
            {s.tabCustomService}
          </button>
        </div>

        {/* Tab A: Product Catalog */}
        {itemsTab === 'catalog' && (
          <div>
            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '0.6rem' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Quick search phone, tablet, accessories..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.85rem 0.55rem 2rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.8rem'
                }}
              />
            </div>

            {/* Category Filter Pills (Apple Segmented Style) */}
            <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.4rem', marginBottom: '0.75rem', scrollbarWidth: 'none' }}>
              {SHOP_CATEGORY_OPTIONS.map(c => {
                const isActive = catalogCategory === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCatalogCategory(c.id)}
                    style={{
                      padding: '0.4rem 0.75rem',
                      borderRadius: '10px',
                      border: isActive ? '1px solid #0f172a' : '1px solid #e2e8f0',
                      backgroundColor: isActive ? '#0f172a' : '#ffffff',
                      color: isActive ? '#ffffff' : '#64748b',
                      fontSize: '0.74rem',
                      fontWeight: isActive ? '800' : '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      boxShadow: isActive ? '0 2px 6px rgba(15, 23, 42, 0.2)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>

            {/* Scrollable mini product list */}
            <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {filteredProducts.slice(0, 8).map(prod => (
                <div
                  key={prod.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <img 
                      src={prod.image} 
                      alt={prod.name} 
                      style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #e2e8f0' }} 
                    />
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '0.8rem', color: '#0f172a' }}>
                        {prod.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '1px' }}>
                        Stock: <strong style={{ color: '#0f172a' }}>{prod.stock || 5}</strong> &bull; <span style={{ color: '#ea580c', fontWeight: '800' }}>£{Number(prod.price).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddToBasket(prod)}
                    style={{
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '5px 11px',
                      fontSize: '0.74rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)'
                    }}
                  >
                    <Plus size={13} strokeWidth={2.4} />
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab B: Custom Service / Repair Fee Form */}
        {itemsTab === 'custom_service' && (
          <form onSubmit={handleAddCustomCharge} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#475569', marginBottom: '0.2rem' }}>
                {s.serviceDesc}
              </label>
              <input
                type="text"
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                placeholder="e.g. Screen Replacement Labor or Diagnostic Fee"
                required
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#475569', marginBottom: '0.2rem' }}>
                  {s.serviceCost}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={customCost}
                  onChange={(e) => setCustomCost(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    fontWeight: '800'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    borderRadius: '10px',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Plus size={15} />
                  {s.addCustomCharge}
                </button>
              </div>
            </div>
          </form>
        )}

      </div>

      {/* STEP 3: Basket & Summary */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>
            <ShoppingCart size={16} color="#2563eb" />
            <span>{s.saleSummary} ({basket.length} {s.itemsCount})</span>
          </div>
          {basket.length > 0 && (
            <button
              type="button"
              onClick={() => setBasket([])}
              style={{ background: 'none', border: 'none', fontSize: '0.7rem', color: '#ef4444', fontWeight: '700', cursor: 'pointer' }}
            >
              Clear Basket
            </button>
          )}
        </div>

        {basket.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.25rem 0', color: '#94a3b8', fontSize: '0.78rem' }}>
            {s.cartEmpty}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.85rem' }}>
            {basket.map(item => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem',
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #f1f5f9'
                }}
              >
                <div style={{ maxWidth: '60%' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.78rem', color: '#0f172a' }}>{item.name}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>£{Number(item.price).toFixed(2)} each</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleUpdateQuantity(item.id, -1)}
                      style={{ background: 'none', border: 'none', padding: '3px 6px', cursor: 'pointer' }}
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', minWidth: '18px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQuantity(item.id, 1)}
                      style={{ background: 'none', border: 'none', padding: '3px 6px', cursor: 'pointer' }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <span style={{ fontWeight: '800', fontSize: '0.82rem', minWidth: '55px', textAlign: 'right' }}>
                    £{(item.price * item.quantity).toFixed(2)}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}

            {/* Financial Summary */}
            <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '0.5rem', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>{s.subtotal}:</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>{s.vatTax}:</span>
                <span>£{vatAmount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: '900', color: '#0f172a', borderTop: '1px solid #e2e8f0', paddingTop: '4px' }}>
                <span>{s.totalPayable}:</span>
                <span style={{ color: '#2563eb' }}>£{totalPayable.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* STEP 4: Payment & Financing Method Selection */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.6rem' }}>
          {s.stepPayment}
        </div>

        {/* 3 Mode buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.45rem', marginBottom: '0.9rem' }}>
          
          <button
            type="button"
            onClick={() => setPaymentMode('outright_card')}
            style={{
              padding: '0.7rem 0.4rem',
              borderRadius: '12px',
              border: paymentMode === 'outright_card' ? '1.5px solid #0f172a' : '1px solid #e2e8f0',
              backgroundColor: paymentMode === 'outright_card' ? '#f8fafc' : '#ffffff',
              color: paymentMode === 'outright_card' ? '#0f172a' : '#64748b',
              fontWeight: paymentMode === 'outright_card' ? '800' : '600',
              fontSize: '0.74rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              boxShadow: paymentMode === 'outright_card' ? '0 2px 8px rgba(15, 23, 42, 0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <CreditCard size={18} strokeWidth={2.2} />
            <span>Card / Stripe</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMode('outright_cash')}
            style={{
              padding: '0.7rem 0.4rem',
              borderRadius: '12px',
              border: paymentMode === 'outright_cash' ? '1.5px solid #0f172a' : '1px solid #e2e8f0',
              backgroundColor: paymentMode === 'outright_cash' ? '#f8fafc' : '#ffffff',
              color: paymentMode === 'outright_cash' ? '#0f172a' : '#64748b',
              fontWeight: paymentMode === 'outright_cash' ? '800' : '600',
              fontSize: '0.74rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              boxShadow: paymentMode === 'outright_cash' ? '0 2px 8px rgba(15, 23, 42, 0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Banknote size={18} strokeWidth={2.2} />
            <span>Cash Desk</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMode('rto')}
            style={{
              padding: '0.7rem 0.4rem',
              borderRadius: '12px',
              border: paymentMode === 'rto' ? '1.5px solid #ff7a00' : '1px solid #e2e8f0',
              backgroundColor: paymentMode === 'rto' ? '#fff7ed' : '#ffffff',
              color: paymentMode === 'rto' ? '#ea580c' : '#64748b',
              fontWeight: paymentMode === 'rto' ? '800' : '600',
              fontSize: '0.74rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              boxShadow: paymentMode === 'rto' ? '0 2px 8px rgba(234, 88, 12, 0.15)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Sparkles size={18} strokeWidth={2.2} />
            <span>0% RTO Plan</span>
          </button>

        </div>

        {/* If RTO Selected: Render Financing Term Configurator */}
        {paymentMode === 'rto' && (
          <div style={{ backgroundColor: '#fff7ed', borderRadius: '14px', padding: '0.9rem', border: '1px solid #fed7aa', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#ea580c', fontSize: '0.8rem', fontWeight: '800' }}>
              <Sparkles size={15} strokeWidth={2.4} />
              <span>Rent-to-Own Financing Agreement (0% APR)</span>
            </div>

            {/* Term selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '800', color: '#9a3412', marginBottom: '0.35rem' }}>
                {s.rtoTenure}:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
                {[6, 12, 18, 24].map(months => (
                  <button
                    key={months}
                    type="button"
                    onClick={() => setRtoTenureMonths(months)}
                    style={{
                      padding: '0.45rem',
                      borderRadius: '8px',
                      border: rtoTenureMonths === months ? '1.5px solid #ea580c' : '1px solid #fed7aa',
                      backgroundColor: rtoTenureMonths === months ? '#ea580c' : '#ffffff',
                      color: rtoTenureMonths === months ? '#ffffff' : '#9a3412',
                      fontWeight: '800',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    {months} mo
                  </button>
                ))}
              </div>
            </div>

            {/* Deposit Input */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '800', color: '#9a3412', marginBottom: '0.2rem' }}>
                  {s.rtoDeposit}
                </label>
                <input
                  type="number"
                  step="10"
                  value={rtoDeposit}
                  onChange={(e) => setRtoDeposit(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #fed7aa',
                    backgroundColor: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Monthly payment pill */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '0.6rem', border: '1px solid #fed7aa', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.65rem', color: '#9a3412', fontWeight: '800' }}>{s.rtoMonthlyEst}</span>
                <span style={{ fontSize: '1.05rem', fontWeight: '900', color: '#ea580c' }}>
                  £{monthlyRTO.toFixed(2)}/mo
                </span>
              </div>
            </div>

            {/* Credit limit validation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', fontWeight: '700', color: isCreditApproved ? '#059669' : '#dc2626' }}>
              {isCreditApproved ? <ShieldCheck size={16} /> : <AlertCircle size={16} />}
              <span>
                {isCreditApproved ? s.creditCheckApproved : s.creditCheckWarning}
              </span>
            </div>

          </div>
        )}

        {/* Complete Action Button */}
        <button
          type="button"
          disabled={basket.length === 0}
          onClick={handleFinishSale}
          style={{
            marginTop: '1rem',
            width: '100%',
            padding: '0.95rem',
            borderRadius: '14px',
            background: basket.length === 0 ? '#94a3b8' : 'linear-gradient(135deg, #ff7a00 0%, #ea580c 100%)',
            color: '#ffffff',
            border: 'none',
            fontSize: '0.94rem',
            fontWeight: '900',
            letterSpacing: '0.01em',
            cursor: basket.length === 0 ? 'not-allowed' : 'pointer',
            boxShadow: basket.length === 0 ? 'none' : '0 6px 20px rgba(234, 88, 12, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.15s ease'
          }}
        >
          <CheckCircle2 size={19} strokeWidth={2.5} />
          {paymentMode === 'rto' ? s.btnGenerateAgreement : s.btnCompleteSale}
        </button>

      </div>

    </div>
  );
}
