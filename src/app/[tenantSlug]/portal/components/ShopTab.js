'use client';

import { useState, useMemo } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Sparkles, 
  Smartphone, 
  Tablet, 
  Watch, 
  Headphones, 
  Laptop, 
  Gamepad2, 
  Cable, 
  Star, 
  Plus, 
  Check, 
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { SHOP_CATEGORIES } from '../data/portalData';

export default function ShopTab({ 
  products, 
  cart, 
  onAddToCart, 
  onOpenProductDetail, 
  onOpenCart,
  customerCreditLimit = 2500
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [addedItemNotice, setAddedItemNotice] = useState(null);

  // Map category icons
  const getCategoryIcon = (id) => {
    switch (id) {
      case 'phones': return <Smartphone size={15} />;
      case 'ipads': return <Tablet size={15} />;
      case 'watches': return <Watch size={15} />;
      case 'airphones': return <Headphones size={15} />;
      case 'laptops': return <Laptop size={15} />;
      case 'videogames': return <Gamepad2 size={15} />;
      case 'accessories': return <Cable size={15} />;
      default: return <Sparkles size={15} />;
    }
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesQuery = !searchQuery || 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.specs?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rto-low') return (a.rtoMonthly || a.price / 12) - (b.rtoMonthly || b.price / 12);
        return 0; // featured
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleAdd = (e, product) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedItemNotice(product.id);
    setTimeout(() => {
      setAddedItemNotice(null);
    }, 1200);
  };

  const cartItemsCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* Hero Financing Bar (Vibrant Indigo to Cyan) */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #4318ff 0%, #06b6d4 100%)',
          borderRadius: '18px',
          padding: '1.1rem 1.15rem',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 25px rgba(67, 24, 255, 0.25)'
        }}
      >
        <div style={{ position: 'absolute', right: -10, top: -10, opacity: 0.18, color: '#fff' }}>
          <ShoppingBag size={110} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
          <Sparkles size={16} style={{ color: '#fef08a' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            PhoneSuite Official Store
          </span>
        </div>

        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 0.25rem 0', maxWidth: '85%' }}>
          Premium Tech & Devices
        </h3>
        <p style={{ fontSize: '0.76rem', color: '#e0f2fe', margin: '0 0 0.75rem 0', maxWidth: '85%', lineHeight: 1.4 }}>
          Phones, iPads, Watches, Airphones, Laptops & Videogames with instant 0% Rent-to-Own financing.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(0, 0, 0, 0.2)', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: '700' }}>
            <Zap size={13} style={{ color: '#fef08a' }} />
            <span>Pre-approved Limit: £{Number(customerCreditLimit).toLocaleString()}</span>
          </div>

          {cartItemsCount > 0 && (
            <button
              onClick={onOpenCart}
              style={{
                background: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '4px 12px',
                color: '#0f172a',
                fontSize: '0.75rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
              }}
            >
              <ShoppingBag size={13} /> View Bag ({cartItemsCount})
            </button>
          )}
        </div>
      </div>

      {/* Search & Sort Controls (Clean Light) */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <div 
          style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            background: '#ffffff', 
            border: '1px solid #e2e8f0', 
            borderRadius: '12px', 
            padding: '0.55rem 0.75rem', 
            gap: '0.5rem',
            boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
          }}
        >
          <Search size={16} style={{ color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search phones, iPads, laptops, games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#0f172a',
              fontSize: '0.82rem',
              width: '100%',
              fontWeight: '500'
            }}
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '0.55rem 0.65rem',
            color: '#475569',
            fontSize: '0.75rem',
            fontWeight: '600',
            outline: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
          }}
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rto-low">Lowest Monthly RTO</option>
        </select>
      </div>

      {/* Horizontal Category Filter Pills */}
      <div className="category-pills-row">
        {SHOP_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              className={`category-pill ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {getCategoryIcon(cat.id)}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="mobile-card" style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
          <Search size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4 }} />
          <h4 style={{ color: '#0f172a', fontWeight: '800', margin: '0 0 0.35rem 0' }}>No products found</h4>
          <p style={{ fontSize: '0.8rem', margin: 0 }}>Try clearing your search or choosing another category.</p>
        </div>
      ) : (
        <div className="mobile-products-grid">
          {filteredProducts.map((product) => {
            const isAdded = addedItemNotice === product.id;

            return (
              <div 
                key={product.id} 
                className="product-item-card"
                onClick={() => onOpenProductDetail(product)}
                style={{ cursor: 'pointer' }}
              >
                {/* Product Tag / Badge */}
                {product.tag && (
                  <span 
                    style={{ 
                      position: 'absolute', 
                      top: '8px', 
                      left: '8px', 
                      zIndex: 10,
                      fontSize: '0.62rem', 
                      fontWeight: '800', 
                      padding: '2px 7px', 
                      borderRadius: '6px', 
                      background: product.tagColor || '#4318ff', 
                      color: '#ffffff',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                    }}
                  >
                    {product.tag}
                  </span>
                )}

                {/* Product Image */}
                <div 
                  style={{ 
                    position: 'relative', 
                    width: '100%', 
                    paddingTop: '80%', 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    background: '#f1f5f9',
                    marginBottom: '0.65rem' 
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                </div>

                {/* Brand & Rating */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>
                    {product.brand}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b', fontSize: '0.68rem', fontWeight: '800' }}>
                    <Star size={11} fill="#f59e0b" />
                    <span>{product.rating}</span>
                  </div>
                </div>

                {/* Product Name */}
                <h4 
                  style={{ 
                    fontSize: '0.82rem', 
                    fontWeight: '800', 
                    color: '#0f172a', 
                    margin: '0 0 3px 0',
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {product.name}
                </h4>

                {/* Specs excerpt */}
                <p 
                  style={{ 
                    fontSize: '0.68rem', 
                    color: '#64748b', 
                    margin: '0 0 0.5rem 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {product.specs}
                </p>

                {/* Pricing & RTO Monthly */}
                <div style={{ marginTop: 'auto', paddingTop: '0.4rem', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0f172a' }}>
                      £{product.price.toFixed(2)}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: '#059669', fontWeight: '700' }}>
                      In Stock ({product.stock})
                    </span>
                  </div>

                  {product.rtoMonthly && (
                    <div style={{ fontSize: '0.68rem', color: '#4318ff', fontWeight: '700', marginTop: '1px' }}>
                      or £{product.rtoMonthly.toFixed(2)}/mo (0% RTO)
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <button
                    onClick={(e) => handleAdd(e, product)}
                    style={{
                      width: '100%',
                      marginTop: '0.5rem',
                      background: isAdded ? '#10b981' : '#f8fafc',
                      border: `1px solid ${isAdded ? '#10b981' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      padding: '0.45rem',
                      color: isAdded ? '#ffffff' : '#4318ff',
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.3rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isAdded ? (
                      <>
                        <Check size={13} /> Added to Bag
                      </>
                    ) : (
                      <>
                        <Plus size={13} /> Add to Bag
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
