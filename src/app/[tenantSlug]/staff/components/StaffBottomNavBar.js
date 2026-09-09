'use client';

import { 
  LayoutDashboard, 
  Receipt, 
  ShoppingCart, 
  Store, 
  Settings, 
  Sparkles,
  Wrench
} from 'lucide-react';
import { useStaffLanguage } from '../context/StaffLanguageContext';

export default function StaffBottomNavBar({ 
  activeTab, 
  setActiveTab, 
  overdueCount = 0,
  activeRepairsCount = 0,
  cartItemsCount = 0
}) {
  const { t } = useStaffLanguage();

  return (
    <nav className="mobile-bottom-nav staff-bottom-nav" aria-label="Staff Navigation">
      
      {/* 1. Dashboard */}
      <button
        type="button"
        className={`mobile-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
        onClick={() => setActiveTab('dashboard')}
        aria-label={t.nav.dashboard}
      >
        <div className="nav-icon-wrapper">
          <LayoutDashboard size={21} strokeWidth={activeTab === 'dashboard' ? 2.4 : 1.8} />
          {activeRepairsCount > 0 && (
            <span 
              className="staff-mini-badge" 
              style={{ backgroundColor: '#2563eb' }}
              title={`${activeRepairsCount} active repairs`}
            >
              {activeRepairsCount}
            </span>
          )}
        </div>
        <span className="nav-label">{t.nav.dashboard}</span>
      </button>

      {/* 2. Invoices */}
      <button
        type="button"
        className={`mobile-nav-item ${activeTab === 'invoices' ? 'active' : ''}`}
        onClick={() => setActiveTab('invoices')}
        aria-label={t.nav.invoices}
      >
        <div className="nav-icon-wrapper">
          <Receipt size={21} strokeWidth={activeTab === 'invoices' ? 2.4 : 1.8} />
          {overdueCount > 0 && (
            <span 
              className="nav-badge" 
              title={`${overdueCount} overdue invoices`}
            >
              {overdueCount}
            </span>
          )}
        </div>
        <span className="nav-label">{t.nav.invoices}</span>
      </button>

      {/* 3. CENTER & MAIN: SALE (Elevated Floating Action Button) */}
      <div className="mobile-shop-center-container">
        <span 
          style={{
            position: 'absolute',
            top: '-32px',
            background: '#0c1328',
            border: '1px solid #ff7a00',
            color: '#ffedd5',
            fontSize: '0.54rem',
            fontWeight: '900',
            padding: '1px 6px',
            borderRadius: '9999px',
            letterSpacing: '0.05em',
            zIndex: 65,
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
          }}
        >
          MAIN
        </span>
        <button
          type="button"
          className={`mobile-shop-center-btn staff-sale-center-btn ${activeTab === 'sale' ? 'active' : ''}`}
          onClick={() => setActiveTab('sale')}
          aria-label={t.nav.sale}
          title="Point of Sale & RTO Financing"
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart size={23} strokeWidth={2.4} />
            <Sparkles 
              size={11} 
              style={{ 
                position: 'absolute', 
                top: -3, 
                right: -4, 
                color: '#fef08a', 
                filter: 'drop-shadow(0 0 4px rgba(253, 224, 71, 0.9))' 
              }} 
            />
          </div>
          {cartItemsCount > 0 && (
            <span className="shop-badge">
              {cartItemsCount}
            </span>
          )}
        </button>
        <span className="shop-center-label staff-sale-label">{t.nav.sale}</span>
      </div>

      {/* 4. Shop (Manage Customer Products) */}
      <button
        type="button"
        className={`mobile-nav-item ${activeTab === 'shop' ? 'active' : ''}`}
        onClick={() => setActiveTab('shop')}
        aria-label={t.nav.shop}
      >
        <div className="nav-icon-wrapper">
          <Store size={21} strokeWidth={activeTab === 'shop' ? 2.4 : 1.8} />
        </div>
        <span className="nav-label">{t.nav.shop}</span>
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
