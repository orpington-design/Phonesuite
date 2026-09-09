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
        background: 'rgba(0, 0, 0, 0.45)', 
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
          background: '#ffffff', 
          borderTopLeftRadius: '24px', 
          borderTopRightRadius: '24px', 
          border: '1px solid #e2e8f0',
          padding: '1.25rem 1.25rem 2rem 1.25rem',
          color: '#0f172a',
          position: 'relative',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 -20px 40px rgba(0, 0, 0, 0.15)'
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
            background: '#f8fafc', 
            marginBottom: '1rem',
            border: '1px solid #e2e8f0'
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
                background: product.tagColor || '#4318ff', 
                color: '#ffffff' 
              }}
            >
              {product.tag}
            </span>
          )}
        </div>

        {/* Brand & Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>
              {product.brand} &bull; {product.condition}
            </span>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: '2px 0 4px 0' }}>
              {product.name}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'rgba(245, 158, 11, 0.12)', padding: '3px 8px', borderRadius: '8px', color: '#d97706', fontSize: '0.75rem', fontWeight: '800' }}>
            <Star size={13} fill="#f59e0b" />
            <span>{product.rating}</span>
          </div>
        </div>

        {/* Specs & Description */}
        <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5, margin: '0.5rem 0' }}>
          {product.description}
        </p>

        {/* Color Options */}
        {product.colors && product.colors.length > 0 && (
          <div style={{ margin: '0.75rem 0' }}>
            <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '6px', fontWeight: '600' }}>
              Choose Color: <strong style={{ color: '#0f172a' }}>{selectedColor}</strong>
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
                    fontWeight: selectedColor === c ? '700' : '600',
                    border: `1px solid ${selectedColor === c ? '#4318ff' : '#cbd5e1'}`,
                    background: selectedColor === c ? '#4318ff' : '#f8fafc',
                    color: selectedColor === c ? '#ffffff' : '#334155',
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
            <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '6px', fontWeight: '600' }}>
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
                    fontWeight: selectedStorage === s ? '700' : '600',
                    border: `1px solid ${selectedStorage === s ? '#4318ff' : '#cbd5e1'}`,
                    background: selectedStorage === s ? '#4318ff' : '#f8fafc',
                    color: selectedStorage === s ? '#ffffff' : '#334155',
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
            background: '#f8fafc', 
            border: '1px solid #e2e8f0', 
            borderRadius: '14px', 
            padding: '0.85rem',
            margin: '0.85rem 0'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#4318ff' }}>
              <Sparkles size={15} />
              <span style={{ fontSize: '0.75rem', fontWeight: '800' }}>0% Rent-to-Own Financing</span>
            </div>
            <span style={{ fontSize: '0.68rem', color: '#059669', fontWeight: '700' }}>Pre-approved</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>
                £{monthlyEstimate.toFixed(2)}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}> / month</span>
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
                    fontWeight: financeTenure === months ? '700' : '600',
                    border: 'none',
                    background: financeTenure === months ? '#4318ff' : '#e2e8f0',
                    color: financeTenure === months ? '#ffffff' : '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  {months} Mo
                </button>
              ))}
            </div>
          </div>

          <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.35rem' }}>
            No upfront interest &bull; Weekly pay option: £{(monthlyEstimate / 4).toFixed(2)}/wk
          </div>
        </div>

        {/* Guarantee badges */}
        <div style={{ display: 'flex', gap: '0.85rem', fontSize: '0.7rem', color: '#64748b', margin: '0.5rem 0 1rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ShieldCheck size={14} style={{ color: '#059669' }} />
            <span>12-Mo Warranty</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Truck size={14} style={{ color: '#4318ff' }} />
            <span>Free Next-Day Collection</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button
            onClick={handleAdd}
            style={{
              flex: 1,
              background: addedNotice ? '#10b981' : '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '12px',
              padding: '0.75rem',
              color: addedNotice ? '#ffffff' : '#0f172a',
              fontWeight: '800',
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
              background: 'linear-gradient(135deg, #4318ff 0%, #06b6d4 100%)',
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
              boxShadow: '0 4px 15px rgba(67, 24, 255, 0.35)'
            }}
          >
            <Zap size={16} /> Finance with 0% RTO
          </button>
        </div>

      </div>
    </div>
  );
}
