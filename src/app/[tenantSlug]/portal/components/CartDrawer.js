'use client';

import { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ShieldCheck, 
  CreditCard, 
  Sparkles, 
  CheckCircle2, 
  Truck, 
  Store,
  Zap
} from 'lucide-react';

export default function CartDrawer({ 
  cart, 
  onClose, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckoutOutright, 
  onCheckoutRTO,
  tenant 
}) {
  const [fulfillment, setFulfillment] = useState('collection'); // 'collection', 'delivery'
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMode, setSuccessMode] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  const deliveryFee = fulfillment === 'delivery' ? 4.99 : 0.00;
  const grandTotal = subtotal + deliveryFee;

  const totalMonthlyRTO = cart.reduce((acc, item) => {
    const monthly = item.rtoMonthly || (item.price / 12);
    return acc + (monthly * (item.quantity || 1));
  }, 0);

  const handleOutrightPay = () => {
    setSuccessMode('outright');
    setIsSuccess(true);
    setTimeout(() => {
      onCheckoutOutright(cart, grandTotal, fulfillment);
      onClose();
    }, 1800);
  };

  const handleRTOPay = () => {
    setSuccessMode('rto');
    setIsSuccess(true);
    setTimeout(() => {
      onCheckoutRTO(cart, totalMonthlyRTO, fulfillment);
      onClose();
    }, 1800);
  };

  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        background: 'rgba(15, 23, 42, 0.45)', 
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', 
        alignItems: 'flex-end',
        justifyContent: 'center', 
        zIndex: 130
      }}
    >
      <div 
        style={{ 
          maxWidth: '480px', 
          width: '100%', 
          background: '#ffffff', 
          borderTopLeftRadius: '24px', 
          borderTopRightRadius: '24px', 
          border: '1px solid #e2e8f0',
          padding: '1.25rem 1.25rem 2.25rem 1.25rem',
          color: '#0f172a',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 -15px 35px rgba(0, 0, 0, 0.12)'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div 
              style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                background: 'rgba(16, 185, 129, 0.12)', 
                color: '#059669', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 1rem auto',
                border: '2px solid #10b981'
              }}
            >
              <CheckCircle2 size={38} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 0.5rem 0', color: '#0f172a' }}>
              {successMode === 'rto' ? 'Rent-to-Own Agreement Created!' : 'Order Placed Successfully!'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
              {successMode === 'rto' 
                ? `Hardware agreement signed for £${totalMonthlyRTO.toFixed(2)}/mo. Ready for ${fulfillment === 'collection' ? 'collection at store' : 'courier delivery'}!`
                : `£${grandTotal.toFixed(2)} charged to payment card. Confirmation dispatched.`}
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '7px', borderRadius: '10px', background: '#e0e7ff', color: '#4318ff' }}>
                <ShoppingBag size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: '#0f172a' }}>
                  My Tech Bag
                </h3>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  {cart.length} {cart.length === 1 ? 'item' : 'items'} &bull; {tenant?.name || 'PhoneSuite'}
                </span>
              </div>
            </div>

            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                <ShoppingBag size={42} style={{ margin: '0 auto 0.75rem auto', color: '#cbd5e1' }} />
                <h4 style={{ color: '#0f172a', margin: '0 0 0.25rem 0', fontWeight: '700' }}>Your bag is empty</h4>
                <p style={{ fontSize: '0.82rem', margin: 0 }}>Browse phones, iPads, laptops and tech from the Shop tab!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {cart.map((item) => (
                  <div 
                    key={item.id} 
                    style={{ 
                      display: 'flex', 
                      gap: '0.75rem', 
                      background: '#f8fafc', 
                      borderRadius: '14px', 
                      padding: '0.75rem',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <div style={{ width: '56px', height: '56px', borderRadius: '10px', overflow: 'hidden', background: '#ffffff', border: '1px solid #e2e8f0', flexShrink: 0 }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.84rem', fontWeight: '700', margin: '0 0 2px 0', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </h4>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        {item.selectedStorage || item.specs} {item.selectedColor ? `&bull; ${item.selectedColor}` : ''}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '3px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>
                          £{item.price.toFixed(2)}
                        </span>
                        {item.rtoMonthly && (
                          <span style={{ fontSize: '0.72rem', color: '#4318ff', fontWeight: '600' }}>
                            or £{item.rtoMonthly.toFixed(2)}/mo
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Modifier */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#ffffff', padding: '3px 6px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                          style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#0f172a', padding: '0 4px' }}>
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                          style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Fulfillment Selection */}
                <div style={{ margin: '0.5rem 0' }}>
                  <label style={{ fontSize: '0.74rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>
                    Choose Fulfillment Method:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setFulfillment('collection')}
                      style={{
                        padding: '0.75rem 0.6rem',
                        borderRadius: '12px',
                        border: fulfillment === 'collection' ? '2px solid #4318ff' : '1px solid #e2e8f0',
                        background: fulfillment === 'collection' ? '#f5f3ff' : '#f8fafc',
                        color: '#0f172a',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Store size={16} style={{ color: '#4318ff' }} />
                      <div>
                        <div style={{ fontSize: '0.76rem', fontWeight: '700', color: '#0f172a' }}>In-Store Pickup</div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Free &bull; Ready in 1hr</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFulfillment('delivery')}
                      style={{
                        padding: '0.75rem 0.6rem',
                        borderRadius: '12px',
                        border: fulfillment === 'delivery' ? '2px solid #4318ff' : '1px solid #e2e8f0',
                        background: fulfillment === 'delivery' ? '#f5f3ff' : '#f8fafc',
                        color: '#0f172a',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Truck size={16} style={{ color: '#10b981' }} />
                      <div>
                        <div style={{ fontSize: '0.76rem', fontWeight: '700', color: '#0f172a' }}>Express Courier</div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b' }}>+£4.99 &bull; Next Day</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Subtotal Calculation */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.9rem', borderRadius: '14px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                    <span>Subtotal:</span>
                    <span style={{ color: '#0f172a', fontWeight: '600' }}>£{subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                    <span>Fulfillment:</span>
                    <span style={{ color: deliveryFee > 0 ? '#0f172a' : '#059669', fontWeight: '600' }}>
                      {deliveryFee > 0 ? `£${deliveryFee.toFixed(2)}` : 'FREE Collection'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                    <span style={{ fontWeight: '700', color: '#0f172a' }}>Total Amount:</span>
                    <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#4318ff' }}>
                      £{grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Dual Checkout Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
                  {/* Option A: Rent-to-Own Financing */}
                  <button
                    onClick={handleRTOPay}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #4318ff 0%, #06b6d4 100%)',
                      border: 'none',
                      borderRadius: '14px',
                      padding: '0.85rem',
                      color: '#ffffff',
                      fontWeight: '800',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(67, 24, 255, 0.25)'
                    }}
                  >
                    <Zap size={16} /> Finance for £{totalMonthlyRTO.toFixed(2)}/mo (0% RTO)
                  </button>

                  {/* Option B: Outright Purchase */}
                  <button
                    onClick={handleOutrightPay}
                    style={{
                      width: '100%',
                      background: '#ffffff',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '14px',
                      padding: '0.8rem',
                      color: '#0f172a',
                      fontWeight: '700',
                      fontSize: '0.84rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      cursor: 'pointer'
                    }}
                  >
                    <CreditCard size={15} /> Buy Outright (£{grandTotal.toFixed(2)})
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
