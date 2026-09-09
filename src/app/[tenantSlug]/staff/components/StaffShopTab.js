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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              {sh.title}
            </h2>
            <span style={{ fontSize: '0.62rem', backgroundColor: '#ecfdf5', color: '#059669', padding: '2px 7px', borderRadius: '6px', fontWeight: '800', border: '1px solid #a7f3d0' }}>
              ONLINE
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '3px 0 0 0', fontWeight: '500' }}>
            {sh.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewProduct}
          style={{
            background: 'linear-gradient(135deg, #ff7a00 0%, #ea580c 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '0.62rem 0.95rem',
            fontSize: '0.8rem',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)',
            letterSpacing: '0.01em'
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
          {sh.btnAddProduct}
        </button>
      </div>

      {/* Live sync notice banner */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '0.75rem 0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#334155', fontWeight: '600' }}>
          <Sparkles size={16} color="#ea580c" />
          <span>Any edit or product added here appears instantly on the Customer Portal.</span>
        </div>
        <a
          href={`/${tenantSlug || 'premiumphonex'}/portal?tab=shop`}
          target="_blank"
          rel="noreferrer"
          style={{
            color: '#ea580c',
            fontWeight: '800',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            whiteSpace: 'nowrap',
            marginLeft: '8px'
          }}
        >
          View Shop <ExternalLink size={12} strokeWidth={2.4} />
        </a>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative' }}>
        <Search size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input
          type="text"
          placeholder={sh.searchProducts}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.72rem 1rem 0.72rem 2.5rem',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            fontSize: '0.82rem',
            color: '#0f172a',
            outline: 'none',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
        />
      </div>

      {/* Category Pills (Apple Segmented Style) */}
      <div style={{ display: 'flex', gap: '0.45rem', overflowX: 'auto', paddingBottom: '0.3rem', scrollbarWidth: 'none' }}>
        {SHOP_CATEGORY_OPTIONS.map(c => {
          const isActive = selectedCategory === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              style={{
                padding: '0.48rem 0.85rem',
                borderRadius: '11px',
                border: isActive ? '1px solid #0f172a' : '1px solid #e2e8f0',
                backgroundColor: isActive ? '#0f172a' : '#ffffff',
                color: isActive ? '#ffffff' : '#64748b',
                fontWeight: isActive ? '800' : '600',
                fontSize: '0.76rem',
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
                  <div style={{ fontSize: '1.05rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em' }}>
                    £{Number(product.price).toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#ea580c', fontWeight: '800' }}>
                    £{Number(product.rtoMonthly || (product.price / 24)).toFixed(2)}/mo RTO
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => onOpenEditProduct(product)}
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '5px 10px',
                      fontSize: '0.74rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                    }}
                  >
                    <Edit3 size={13} strokeWidth={2.2} />
                    {sh.editProduct}
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => onDeleteProduct(product.id)}
                    title={sh.deleteProduct}
                    style={{
                      backgroundColor: 'rgba(244, 63, 94, 0.08)',
                      color: '#e11d48',
                      border: '1px solid rgba(244, 63, 94, 0.25)',
                      borderRadius: '8px',
                      padding: '5px 8px',
                      fontSize: '0.74rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={13} strokeWidth={2.2} />
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
