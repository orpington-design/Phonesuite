'use client';

import { useState } from 'react';
import { 
  Store, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  Package, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useStaffLanguage } from '../context/StaffLanguageContext';
import { SHOP_CATEGORY_OPTIONS } from '../data/staffData';

export default function StaffShopTab({
  products = [],
  onOpenNewProduct,
  onOpenEditProduct,
  onDeleteProduct,
  tenantSlug
}) {
  const { t } = useStaffLanguage();
  const sh = t.shop;

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(p => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchBrand = p.brand?.toLowerCase().includes(q);
      const matchSpecs = p.specs?.toLowerCase().includes(q);
      return matchName || matchBrand || matchSpecs;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Top Banner & Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              {sh.title}
            </h2>
            <span style={{ fontSize: '0.62rem', backgroundColor: '#ecfdf5', color: '#059669', padding: '2px 6px', borderRadius: '6px', fontWeight: '800' }}>
              ONLINE
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>
            {sh.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewProduct}
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '0.6rem 0.9rem',
            fontSize: '0.8rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
          }}
        >
          <Plus size={16} />
          {sh.btnAddProduct}
        </button>
      </div>

      {/* Live sync notice banner */}
      <div style={{ backgroundColor: '#eff6ff', border: '1px solid #dbeafe', borderRadius: '14px', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1d4ed8', fontWeight: '600' }}>
          <Sparkles size={16} />
          <span>Any edit or product added here appears instantly on the Customer Portal.</span>
        </div>
        <a
          href={`/${tenantSlug || 'premiumphonex'}/portal?tab=shop`}
          target="_blank"
          rel="noreferrer"
          style={{
            color: '#2563eb',
            fontWeight: '700',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            whiteSpace: 'nowrap',
            marginLeft: '8px'
          }}
        >
          View Shop <ExternalLink size={12} />
        </a>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input
          type="text"
          placeholder={sh.searchProducts}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.65rem 1rem 0.65rem 2.3rem',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            fontSize: '0.82rem',
            color: '#0f172a'
          }}
        />
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.3rem' }}>
        {SHOP_CATEGORY_OPTIONS.map(c => {
          const isActive = selectedCategory === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              style={{
                padding: '0.45rem 0.8rem',
                borderRadius: '9999px',
                border: isActive ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                backgroundColor: isActive ? '#2563eb' : '#ffffff',
                color: isActive ? '#ffffff' : '#475569',
                fontWeight: isActive ? '800' : '600',
                fontSize: '0.75rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filteredProducts.map(product => {
          const isLowStock = Number(product.stock || 0) <= 2;
          const isOutStock = Number(product.stock || 0) <= 0;

          return (
            <div
              key={product.id}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                position: 'relative'
              }}
            >
              {/* Left: Thumbnail & Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', maxWidth: '65%' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '12px',
                    objectFit: 'cover',
                    border: '1px solid #f1f5f9'
                  }}
                />
                <div>
                  <div style={{ fontWeight: '800', fontSize: '0.85rem', color: '#0f172a', lineHeight: 1.25 }}>
                    {product.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                    {product.brand} &bull; {product.specs?.slice(0, 30)}
                  </div>
                  
                  {/* Stock status badge */}
                  <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span
                      style={{
                        fontSize: '0.62rem',
                        fontWeight: '800',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        backgroundColor: isOutStock ? '#fee2e2' : (isLowStock ? '#fef3c7' : '#dcfce7'),
                        color: isOutStock ? '#b91c1c' : (isLowStock ? '#b45309' : '#15803d')
                      }}
                    >
                      {isOutStock ? sh.outOfStock : (isLowStock ? sh.lowStock : sh.inStock)} ({product.stock || 0})
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Prices & Action Buttons */}
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: '900', color: '#0f172a' }}>
                    £{Number(product.price).toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: '700' }}>
                    £{Number(product.rtoMonthly || (product.price / 24)).toFixed(2)}/mo RTO
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => onOpenEditProduct(product)}
                    style={{
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      border: '1px solid #bfdbfe',
                      borderRadius: '8px',
                      padding: '4px 8px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <Edit3 size={12} />
                    {sh.editProduct}
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => onDeleteProduct(product.id)}
                    title={sh.deleteProduct}
                    style={{
                      backgroundColor: '#fff1f2',
                      color: '#e11d48',
                      border: '1px solid #fecdd3',
                      borderRadius: '8px',
                      padding: '4px 6px',
                      fontSize: '0.72rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
