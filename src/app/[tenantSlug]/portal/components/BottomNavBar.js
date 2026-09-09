'use client';

import { 
  LayoutDashboard, 
  Receipt, 
  ShoppingBag, 
  Award, 
  Settings, 
  Sparkles 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function BottomNavBar({ 
  activeTab, 
  setActiveTab, 
  unpaidBillsCount = 0, 
  cartCount = 0,
  creditScore = 785
}) {
  const { t } = useLanguage();
  return (
    <nav className="mobile-bottom-nav" aria-label="Customer Navigation">
      {/* 1. Dashboard */}
      <button
        type="button"
        className={`mobile-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
        onClick={() => setActiveTab('dashboard')}
        aria-label="Dashboard"
      >
        <div className="nav-icon-wrapper">
          <LayoutDashboard size={21} strokeWidth={activeTab === 'dashboard' ? 2.4 : 1.8} />
        </div>
        <span className="nav-label">{t.nav.home}</span>
      </button>

      {/* 2. Bills */}
      <button
        type="button"
        className={`mobile-nav-item ${activeTab === 'bills' ? 'active' : ''}`}
        onClick={() => setActiveTab('bills')}
        aria-label={t.nav.bills}
      >
        <div className="nav-icon-wrapper">
          <Receipt size={21} strokeWidth={activeTab === 'bills' ? 2.4 : 1.8} />
          {unpaidBillsCount > 0 && (
            <span className="nav-badge" title={`${unpaidBillsCount} ${t.dashboard.pendingBills}`}>
              {unpaidBillsCount}
            </span>
          )}
        </div>
        <span className="nav-label">{t.nav.bills}</span>
      </button>

      {/* 3. CENTER & MAIN: SHOP (Elevated Floating Beauty Button) */}
      <div className="mobile-shop-center-container">
        <button
          type="button"
          className={`mobile-shop-center-btn ${activeTab === 'shop' ? 'active' : ''}`}
          onClick={() => setActiveTab('shop')}
          aria-label={t.nav.shop}
          title={t.shop.catalogTitle}
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingBag size={25} strokeWidth={2.4} />
            <Sparkles 
              size={12} 
              style={{ 
                position: 'absolute', 
                top: -3, 
                right: -4, 
                color: '#fef08a', 
                filter: 'drop-shadow(0 0 4px rgba(253, 224, 71, 0.9))' 
              }} 
            />
          </div>
          {cartCount > 0 && (
            <span className="shop-badge">
              {cartCount}
            </span>
          )}
        </button>
        <span className="shop-center-label">{t.nav.shop}</span>
      </div>

      {/* 4. Score */}
      <button
        type="button"
        className={`mobile-nav-item ${activeTab === 'score' ? 'active' : ''}`}
        onClick={() => setActiveTab('score')}
        aria-label={t.nav.score}
      >
        <div className="nav-icon-wrapper">
          <Award size={21} strokeWidth={activeTab === 'score' ? 2.4 : 1.8} />
          <span 
            style={{ 
              position: 'absolute', 
              bottom: -2, 
              right: -6, 
              fontSize: '0.55rem', 
              background: '#059669', 
              color: '#fff', 
              padding: '0.5px 3px', 
              borderRadius: '4px',
              fontWeight: 700 
            }}
          >
            {creditScore}
          </span>
        </div>
        <span className="nav-label">{t.nav.score}</span>
      </button>

      {/* 5. Settings */}
      <button
        type="button"
        className={`mobile-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
        onClick={() => setActiveTab('settings')}
        aria-label={t.nav.settings}
      >
        <div className="nav-icon-wrapper">
          <Settings size={21} strokeWidth={activeTab === 'settings' ? 2.4 : 1.8} />
        </div>
        <span className="nav-label">{t.nav.settings}</span>
      </button>
    </nav>
  );
}
