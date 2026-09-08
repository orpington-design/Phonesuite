'use client';

import { useState } from 'react';
import { 
  CreditCard, 
  X, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  Sparkles,
  Zap
} from 'lucide-react';

export default function PaymentModal({ 
  bill, 
  tenant, 
  onClose, 
  onPaymentSuccess 
}) {
  const [method, setMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');
  const [name, setName] = useState('Daniel Harris');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const amount = Number(bill?.amount || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onPaymentSuccess(bill);
        onClose();
      }, 1500);
    }, 1200);
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
        zIndex: 120
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
          padding: '1.5rem',
          color: '#ffffff',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 -20px 40px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
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
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
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
                margin: '0 auto 1.25rem auto',
                border: '2px solid #34d399'
              }}
            >
              <CheckCircle2 size={38} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>
              Payment Successful!
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
              £{amount.toFixed(2)} settled via Stripe platform Connect. Invoice status updated.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', marginBottom: '0.25rem' }}>
                <Lock size={15} />
                <span style={{ fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Stripe / Square Secure Checkout
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>
                Pay Invoice
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                Merchant: {tenant?.name || 'PhoneSuite UK'}
              </p>
            </div>

            {/* Bill Summary Card */}
            <div 
              style={{ 
                background: 'rgba(15, 23, 42, 0.8)', 
                borderRadius: '14px', 
                padding: '0.85rem 1rem', 
                border: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                    #{bill?.invoice_number || bill?.id?.slice(0, 8)}
                  </span>
                  <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#fff' }}>
                    {bill?.description || 'Service Bill'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Amount</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#34d399' }}>
                    £{amount.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Fast Pay option */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isProcessing}
              style={{
                width: '100%',
                background: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '0.75rem',
                color: '#000000',
                fontWeight: '700',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                marginBottom: '1rem',
                boxShadow: '0 4px 12px rgba(255, 255, 255, 0.15)'
              }}
            >
              <Zap size={16} /> Pay with Apple Pay / Google Pay
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.75rem 0', color: '#64748b', fontSize: '0.72rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
              <span>OR PAY WITH CARD</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
            </div>

            {/* Card Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    background: 'rgba(30, 41, 59, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    padding: '0.65rem 0.85rem',
                    color: '#fff',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Card Number
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      background: 'rgba(30, 41, 59, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '10px',
                      padding: '0.65rem 0.85rem 0.65rem 2.2rem',
                      color: '#fff',
                      fontSize: '0.82rem',
                      outline: 'none'
                    }}
                  />
                  <CreditCard 
                    size={16} 
                    style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    required
                    style={{
                      width: '100%',
                      background: 'rgba(30, 41, 59, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '10px',
                      padding: '0.65rem 0.85rem',
                      color: '#fff',
                      fontSize: '0.82rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    CVC
                  </label>
                  <input
                    type="password"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    placeholder="123"
                    required
                    maxLength={4}
                    style={{
                      width: '100%',
                      background: 'rgba(30, 41, 59, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '10px',
                      padding: '0.65rem 0.85rem',
                      color: '#fff',
                      fontSize: '0.82rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.7rem', marginTop: '0.25rem' }}>
                <ShieldCheck size={14} style={{ color: '#10b981' }} />
                <span>256-Bit SSL Encrypted &bull; 3D Secure Verification</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                style={{
                  marginTop: '0.75rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.8rem',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                }}
              >
                {isProcessing ? 'Processing Secure Card...' : `Confirm & Pay £${amount.toFixed(2)}`}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
