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
        background: 'rgba(0, 0, 0, 0.85)', 
        backdropFilter: 'blur(10px)',
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
          background: '#0b1120', 
          borderTopLeftRadius: '24px', 
          borderTopRightRadius: '24px', 
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '1.25rem 1.25rem 2rem 1.25rem',
          color: '#ffffff',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 -20px 40px rgba(0, 0, 0, 0.7)'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94a3b8',
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
                background: 'rgba(16, 185, 129, 0.2)', 
                color: '#34d399', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 1rem auto',
                border: '2px solid #34d399'
              }}
            >
              <CheckCircle2 size={38} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>
              {successMode === 'rto' ? 'Rent-to-Own Agreement Created!' : 'Order Placed Successfully!'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
              {successMode === 'rto' 
                ? `Hardware agreement signed for £${totalMonthlyRTO.toFixed(2)}/mo. Ready for ${fulfillment === 'collection' ? 'collection at store' : 'courier delivery'}!`
                : `£${grandTotal.toFixed(2)} charged to payment card. Confirmation dispatched.`}
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                <ShoppingBag size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>
                  My Tech Bag
                </h3>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {cart.length} {cart.length === 1 ? 'item' : 'items'} &bull; {tenant?.name || 'PhoneSuite'}
                </span>
              </div>
            </div>

            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
                <ShoppingBag size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
                <h4 style={{ color: '#fff', margin: '0 0 0.25rem 0' }}>Your bag is empty</h4>
                <p style={{ fontSize: '0.8rem', margin: 0 }}>Browse phones, iPads, laptops and tech from the Shop tab!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {cart.map((item) => (
                  <div 
                    key={item.id} 
                    style={{ 
                      display: 'flex', 
                      gap: '0.75rem', 
                      background: 'rgba(30, 41, 59, 0.6)', 
                      borderRadius: '12px', 
                      padding: '0.65rem',
                      border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}
                  >
                    <div style={{ width: '56px', height: '56px', borderRadius: '8px', overflow: 'hidden', background: '#1e293b', flexShrink: 0 }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.82rem', fontWeight: '700', margin: '0 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </h4>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                        {item.selectedStorage || item.specs} {item.selectedColor ? `&bull; ${item.selectedColor}` : ''}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '2px' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#fff' }}>
                          £{item.price.toFixed(2)}
                        </span>
                        {item.rtoMonthly && (
                          <span style={{ fontSize: '0.68rem', color: '#38bdf8' }}>
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
                      >
                        <Trash2 size={14} />
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(15, 23, 42, 0.8)', padding: '2px 4px', borderRadius: '6px' }}>
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                          style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex' }}
                        >
                          <Minus size={11} />
                        </button>
                        <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '0 3px' }}>
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                          style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex' }}
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Fulfillment Selection */}
                <div style={{ margin: '0.5rem 0' }}>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                    Choose Fulfillment Method:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setFulfillment('collection')}
                      style={{
                        padding: '0.65rem 0.5rem',
                        borderRadius: '10px',
                        border: `1px solid ${fulfillment === 'collection' ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`,
                        background: fulfillment === 'collection' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(30, 41, 59, 0.6)',
                        color: '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <Store size={15} style={{ color: '#38bdf8' }} />
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '700' }}>In-Store Pickup</div>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Free &bull; Ready in 1hr</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFulfillment('delivery')}
                      style={{
                        padding: '0.65rem 0.5rem',
                        borderRadius: '10px',
                        border: `1px solid ${fulfillment === 'delivery' ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`,
                        background: fulfillment === 'delivery' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(30, 41, 59, 0.6)',
                        color: '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <Truck size={15} style={{ color: '#10b981' }} />
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '700' }}>Express Courier</div>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>+£4.99 &bull; Next Day</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Subtotal Calculation */}
                <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '0.85rem', borderRadius: '12px', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                    <span>Subtotal:</span>
                    <span style={{ color: '#fff' }}>£{subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                    <span>Fulfillment:</span>
                    <span style={{ color: deliveryFee > 0 ? '#fff' : '#34d399' }}>
                      {deliveryFee > 0 ? `£${deliveryFee.toFixed(2)}` : 'FREE Collection'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                    <span style={{ fontWeight: '700' }}>Total Amount:</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#38bdf8' }}>
                      £{grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Dual Checkout Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {/* Option A: Rent-to-Own Financing */}
                  <button
                    onClick={handleRTOPay}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '0.8rem',
                      color: '#ffffff',
                      fontWeight: '800',
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(6, 182, 212, 0.35)'
                    }}
                  >
                    <Zap size={16} /> Finance for £{totalMonthlyRTO.toFixed(2)}/mo (0% RTO)
                  </button>

                  {/* Option B: Outright Purchase */}
                  <button
                    onClick={handleOutrightPay}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      padding: '0.75rem',
                      color: '#ffffff',
                      fontWeight: '700',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
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
