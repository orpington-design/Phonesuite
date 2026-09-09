'use client';

import { useState, useEffect } from 'react';
import { X, Package, Sparkles, Image as ImageIcon, Check } from 'lucide-react';
import { useStaffLanguage } from '../context/StaffLanguageContext';
import { PRESET_TECH_IMAGES, SHOP_CATEGORY_OPTIONS } from '../data/staffData';

export default function ProductEditorModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  productToEdit = null 
}) {
  const { t } = useStaffLanguage();
  const m = t.modals;

  const isEdit = Boolean(productToEdit);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('phones');
  const [brand, setBrand] = useState('Apple');
  const [price, setPrice] = useState('999.00');
  const [rtoMonthly, setRtoMonthly] = useState('42.00');
  const [stock, setStock] = useState('5');
  const [condition, setCondition] = useState('Brand New (Sealed)');
  const [specs, setSpecs] = useState('256GB - 5G - High Resolution');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_TECH_IMAGES[0]?.url || '');
  const [colors, setColors] = useState('Black, Silver, Blue');
  const [storage, setStorage] = useState('128GB, 256GB, 512GB');
  const [warranty, setWarranty] = useState('12 Months PhoneSuite Store Care');

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || '');
      setCategory(productToEdit.category || 'phones');
      setBrand(productToEdit.brand || 'Tech');
      setPrice(String(productToEdit.price || 0));
      setRtoMonthly(String(productToEdit.rtoMonthly || ((productToEdit.price || 0) / 24).toFixed(2)));
      setStock(String(productToEdit.stock || 5));
      setCondition(productToEdit.condition || 'Brand New');
      setSpecs(productToEdit.specs || '');
      setDescription(productToEdit.description || '');
      setImageUrl(productToEdit.image || '');
      setColors(Array.isArray(productToEdit.colors) ? productToEdit.colors.join(', ') : 'Default');
      setStorage(Array.isArray(productToEdit.storage) ? productToEdit.storage.join(', ') : 'Standard');
      setWarranty(productToEdit.warranty || '12 Months PhoneSuite Store Care');
    } else {
      setName('');
      setCategory('phones');
      setBrand('Apple');
      setPrice('999.00');
      setRtoMonthly('42.00');
      setStock('5');
      setCondition('Brand New (Sealed)');
      setSpecs('256GB - 5G - High Resolution');
      setDescription('Official premium hardware available directly at store branch.');
      setImageUrl(PRESET_TECH_IMAGES[0]?.url || '');
      setColors('Titanium Black, Natural Silver, Blue');
      setStorage('256GB, 512GB');
      setWarranty('12 Months PhoneSuite Store Care');
    }
  }, [productToEdit, isOpen]);

  // Automatically update monthly estimate when price changes
  const handlePriceChange = (val) => {
    setPrice(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setRtoMonthly((num / 24).toFixed(2));
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price) {
      alert('Please provide at least Product Name and Price.');
      return;
    }

    const priceNum = parseFloat(price) || 0;
    const rtoMonthlyNum = parseFloat(rtoMonthly) || (priceNum / 24);
    const stockNum = parseInt(stock, 10) || 0;

    const updatedProduct = {
      id: productToEdit ? productToEdit.id : `prod-${Date.now()}`,
      name,
      category,
      brand,
      price: priceNum,
      rtoMonthly: Number(rtoMonthlyNum.toFixed(2)),
      rtoWeeks: Number((rtoMonthlyNum / 4).toFixed(2)),
      stock: stockNum,
      condition,
      specs,
      description: description || `Official hardware available with store guarantee.`,
      image: imageUrl || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
      colors: colors.split(',').map(s => s.trim()).filter(Boolean),
      storage: storage.split(',').map(s => s.trim()).filter(Boolean),
      warranty,
      rating: productToEdit?.rating || 4.9,
      tag: productToEdit?.tag || (stockNum < 3 ? 'Low Stock' : 'Official'),
      tagColor: productToEdit?.tagColor || '#38bdf8'
    };

    onSubmit(updatedProduct);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(11, 19, 43, 0.65)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      zIndex: 100,
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div 
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '92vh',
          backgroundColor: '#ffffff',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          padding: '1.25rem 1.25rem 2.5rem 1.25rem',
          overflowY: 'auto',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#ffedd5',
              color: '#ea580c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Package size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                {isEdit ? m.productEditorTitleEdit : m.productEditorTitleNew}
              </h2>
              <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: '600' }}>
                &bull; {t.shop.visibleOnPortal}
              </span>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            style={{
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
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          
          {/* Name & Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>
                {m.productName} *
              </label>
              <input
                type="text"
                placeholder="e.g. Apple iPhone 15 Pro Max"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>
                {m.category}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.6rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  backgroundColor: '#ffffff'
                }}
              >
                {SHOP_CATEGORY_OPTIONS.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Brand & Condition */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>
                {m.brand}
              </label>
              <input
                type="text"
                placeholder="Apple, Samsung, Sony..."
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>
                {m.condition}
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.6rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  backgroundColor: '#ffffff'
                }}
              >
                <option value="Brand New (Sealed)">Brand New (Sealed)</option>
                <option value="Pristine Grade A+">Pristine Grade A+</option>
                <option value="Excellent Condition">Excellent Condition</option>
                <option value="Store Refurbished">Store Refurbished</option>
              </select>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>
                {m.sellPrice} *
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => handlePriceChange(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  fontWeight: '800',
                  color: '#0f172a'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>
                {m.rtoMonthlyPrice}
              </label>
              <input
                type="number"
                step="0.01"
                value={rtoMonthly}
                onChange={(e) => setRtoMonthly(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  fontWeight: '800',
                  color: '#2563eb'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>
                {m.stockQuantity}
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  color: '#059669'
                }}
              />
            </div>
          </div>

          {/* Preset Images Gallery Picker */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
              {m.usePresetImage}
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
              {PRESET_TECH_IMAGES.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImageUrl(img.url)}
                  style={{
                    flexShrink: 0,
                    width: '60px',
                    height: '60px',
                    borderRadius: '10px',
                    border: imageUrl === img.url ? '2.5px solid #2563eb' : '1px solid #e2e8f0',
                    overflow: 'hidden',
                    position: 'relative',
                    padding: 0,
                    cursor: 'pointer'
                  }}
                  title={img.label}
                >
                  <img src={img.url} alt={img.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {imageUrl === img.url && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(37, 99, 235, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Check size={16} color="#fff" strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <input
              type="url"
              placeholder="Or paste custom image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              style={{
                marginTop: '0.35rem',
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '0.78rem',
                color: '#475569'
              }}
            />
          </div>

          {/* Specs & Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>
              {m.specs}
            </label>
            <input
              type="text"
              placeholder="e.g. 256GB - Titanium Gray - Dual SIM 5G"
              value={specs}
              onChange={(e) => setSpecs(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>
              {m.description}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                fontFamily: 'inherit',
                resize: 'none'
              }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            style={{
              marginTop: '0.5rem',
              width: '100%',
              padding: '0.9rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ff7a00 0%, #ea580c 100%)',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.92rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <Package size={18} />
            {m.btnSaveProduct}
          </button>

        </form>
      </div>
    </div>
  );
}
