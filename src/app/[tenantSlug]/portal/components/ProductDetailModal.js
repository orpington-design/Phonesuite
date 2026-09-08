'use client';

import { useState } from 'react';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Check, 
  ShoppingBag, 
  Zap, 
  Truck, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export default function ProductDetailModal({ 
  product, 
  onClose, 
  onAddToCart,
  onFinanceWithRTO
}) {
  if (!product) return null;

  const [selectedStorage, setSelectedStorage] = useState(product.storage?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [financeTenure, setFinanceTenure] = useState(12); // 6, 12, 24 months
  const [addedNotice, setAddedNotice] = useState(false);

  const monthlyEstimate = product.rtoMonthly 
    ? (financeTenure === 6 ? product.rtoMonthly * 1.85 : financeTenure === 24 ? product.rtoMonthly * 0.58 : product.rtoMonthly)
    : (product.price / financeTenure);

  const handleAdd = () => {
    onAddToCart({
      ...product,
      selectedStorage,
      selectedColor
    });
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 900);
  };

  const handleApplyRTO = () => {
    onFinanceWithRTO({
      ...product,
      selectedStorage,
      selectedColor,
      financeTenure,
      monthlyEstimate
    });
    onClose();
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
        zIndex: 110
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
          maxHeight: '92vh',
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
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        {/* Product Image */}
        <div 
          style={{ 
            position: 'relative', 
            width: '100%', 
            paddingTop: '65%', 
            borderRadius: '16px', 
            overflow: 'hidden', 
            background: '#1e293b', 
            marginBottom: '1rem' 
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          {product.tag && (
            <span 
              style={{ 
                position: 'absolute', 
                bottom: '10px', 
                left: '10px', 
                fontSize: '0.68rem', 
                fontWeight: '800', 
                padding: '3px 8px', 
                borderRadius: '6px', 
                background: product.tagColor || '#38bdf8', 
                color: '#0f172a' 
              }}
            >
              {product.tag}
            </span>
          )}
        </div>

        {/* Brand & Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>
              {product.brand} &bull; {product.condition}
            </span>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '2px 0 4px 0' }}>
              {product.name}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'rgba(245, 158, 11, 0.15)', padding: '3px 8px', borderRadius: '8px', color: '#f59e0b', fontSize: '0.75rem', fontWeight: '700' }}>
            <Star size={13} fill="#f59e0b" />
            <span>{product.rating}</span>
          </div>
        </div>

        {/* Specs & Description */}
        <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5, margin: '0.5rem 0' }}>
          {product.description}
        </p>

        {/* Color Options */}
        {product.colors && product.colors.length > 0 && (
          <div style={{ margin: '0.75rem 0' }}>
            <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
              Choose Color: <strong style={{ color: '#fff' }}>{selectedColor}</strong>
            </label>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    fontWeight: selectedColor === c ? '700' : '500',
                    border: `1px solid ${selectedColor === c ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`,
                    background: selectedColor === c ? 'rgba(56, 189, 248, 0.2)' : 'rgba(30, 41, 59, 0.6)',
                    color: selectedColor === c ? '#ffffff' : '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Storage / Capacity Options */}
        {product.storage && product.storage.length > 1 && (
          <div style={{ margin: '0.75rem 0' }}>
            <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
              Storage / Configuration:
            </label>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {product.storage.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedStorage(s)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    fontWeight: selectedStorage === s ? '700' : '500',
                    border: `1px solid ${selectedStorage === s ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`,
                    background: selectedStorage === s ? 'rgba(56, 189, 248, 0.2)' : 'rgba(30, 41, 59, 0.6)',
                    color: selectedStorage === s ? '#ffffff' : '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Rent-to-Own Interactive Calculator Box */}
        <div 
          style={{ 
            background: 'rgba(15, 23, 42, 0.8)', 
            border: '1px solid rgba(56, 189, 248, 0.3)', 
            borderRadius: '14px', 
            padding: '0.85rem',
            margin: '0.85rem 0'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#38bdf8' }}>
              <Sparkles size={15} />
              <span style={{ fontSize: '0.75rem', fontWeight: '800' }}>0% Rent-to-Own Financing</span>
            </div>
            <span style={{ fontSize: '0.68rem', color: '#34d399', fontWeight: '700' }}>Pre-approved</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff' }}>
                £{monthlyEstimate.toFixed(2)}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}> / month</span>
            </div>

            <div style={{ display: 'flex', gap: '4px' }}>
              {[6, 12, 24].map((months) => (
                <button
                  key={months}
                  onClick={() => setFinanceTenure(months)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.68rem',
                    fontWeight: financeTenure === months ? '700' : '500',
                    border: 'none',
                    background: financeTenure === months ? '#38bdf8' : 'rgba(255,255,255,0.08)',
                    color: financeTenure === months ? '#0f172a' : '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  {months} Mo
                </button>
              ))}
            </div>
          </div>

          <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.35rem' }}>
            No upfront interest &bull; Weekly pay option: £{(monthlyEstimate / 4).toFixed(2)}/wk
          </div>
        </div>

        {/* Guarantee badges */}
        <div style={{ display: 'flex', gap: '0.85rem', fontSize: '0.7rem', color: '#94a3b8', margin: '0.5rem 0 1rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ShieldCheck size={14} style={{ color: '#10b981' }} />
            <span>12-Mo Warranty</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Truck size={14} style={{ color: '#38bdf8' }} />
            <span>Free Next-Day Collection</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button
            onClick={handleAdd}
            style={{
              flex: 1,
              background: addedNotice ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
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
            {addedNotice ? <Check size={16} /> : <ShoppingBag size={16} />}
            {addedNotice ? 'Added to Bag!' : `Add (£${product.price.toFixed(2)})`}
          </button>

          <button
            onClick={handleApplyRTO}
            style={{
              flex: 1.3,
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '0.75rem',
              color: '#ffffff',
              fontWeight: '800',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(6, 182, 212, 0.35)'
            }}
          >
            <Zap size={16} /> Finance with 0% RTO
          </button>
        </div>

      </div>
    </div>
  );
}
