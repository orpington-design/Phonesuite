'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '../../../utils/supabase/client';

import BottomNavBar from './components/BottomNavBar';
import DashboardTab from './components/DashboardTab';
import BillsTab from './components/BillsTab';
import ShopTab from './components/ShopTab';
import ScoreTab from './components/ScoreTab';
import SettingsTab from './components/SettingsTab';
import PaymentModal from './components/PaymentModal';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';

import { 
  PRODUCTS_CATALOG, 
  DEFAULT_CUSTOMER, 
  INITIAL_BILLS, 
  INITIAL_REPAIRS, 
  INITIAL_CONTRACTS 
} from './data/portalData';

import { 
  ShoppingBag, 
  Sparkles, 
  Smartphone, 
  ShieldCheck, 
  Store, 
  Bell, 
  Maximize2, 
  Minimize2,
  ChevronLeft
} from 'lucide-react';

export default function MobileCustomerPortal() {
  const params = useParams();
  const router = useRouter();
  const tenantSlug = params.tenantSlug;

  // Global State
  const [tenant, setTenant] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tab State: 'dashboard', 'bills', 'shop', 'score', 'settings'
  const [activeTab, setActiveTabState] = useState('dashboard');

  const setActiveTab = (newTab) => {
    setActiveTabState(newTab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', newTab);
      window.history.replaceState({}, '', url.toString());
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam && ['dashboard', 'bills', 'shop', 'score', 'settings'].includes(tabParam)) {
        setActiveTabState(tabParam);
      }
    }
  }, []);

  // Business Data State
  const [bills, setBills] = useState(INITIAL_BILLS);
  const [repairs, setRepairs] = useState(INITIAL_REPAIRS);
  const [contracts, setContracts] = useState(INITIAL_CONTRACTS);
  const [products, setProducts] = useState(PRODUCTS_CATALOG);

  // Cart State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modals
  const [payingBill, setPayingBill] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Viewport display mode: false = mobile shell (480px), true = full width
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 1. Initial Load & Supabase Fetch
  useEffect(() => {
    const initData = async () => {
      try {
        const supabase = createClient();
        const { data: tData } = await supabase
          .from('tenants')
          .select('*')
          .eq('slug', tenantSlug)
          .maybeSingle();

        const currentTenant = tData || {
          id: '402bb3e5-1a10-4d90-bf13-1ffe169a9352',
          name: tenantSlug ? tenantSlug.charAt(0).toUpperCase() + tenantSlug.slice(1) : 'PhoneSuite UK',
          slug: tenantSlug || 'premiumphonex'
        };
        setTenant(currentTenant);

        // Fetch Customers for this tenant
        const { data: custs } = await supabase
          .from('customers')
          .select('*')
          .eq('tenant_id', currentTenant.id);

        if (custs && custs.length > 0) {
          setCustomers(custs);
          setActiveCustomer(custs[0]);
        } else {
          setCustomers([DEFAULT_CUSTOMER]);
          setActiveCustomer(DEFAULT_CUSTOMER);
        }

        // Fetch Inventory from DB if available
        const { data: invData } = await supabase
          .from('inventory')
          .select('*')
          .eq('tenant_id', currentTenant.id);

        if (invData && invData.length > 0) {
          // Merge custom database items with curated catalog
          const mappedInv = invData.map((item, idx) => ({
            id: item.id || `inv-${idx}`,
            category: 'phones',
            name: item.name,
            brand: 'Tech',
            specs: `SKU: ${item.sku} - Stock: ${item.quantity}`,
            price: Number(item.sell_price || 99),
            rtoMonthly: Number((item.sell_price / 12).toFixed(2)),
            image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
            tag: 'Shop Inventory',
            tagColor: '#38bdf8',
            stock: item.quantity || 5,
            condition: 'Available in Store',
            rating: 4.8,
            description: `Official inventory item available directly at ${currentTenant.name}.`,
            storage: ['Standard'],
            colors: ['Default']
          }));
          setProducts([...mappedInv, ...PRODUCTS_CATALOG]);
        } else {
          setProducts(PRODUCTS_CATALOG);
        }

      } catch (err) {
        console.error('Failed fetching tenant portal data:', err);
        setTenant({
          id: '402bb3e5-1a10-4d90-bf13-1ffe169a9352',
          name: 'PhoneSuite UK',
          slug: tenantSlug || 'premiumphonex'
        });
        setCustomers([DEFAULT_CUSTOMER]);
        setActiveCustomer(DEFAULT_CUSTOMER);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [tenantSlug]);

  // 2. Refresh Customer Specific Data (Bills, Repairs, Contracts)
  useEffect(() => {
    if (!activeCustomer || !tenant) return;

    const fetchCustomerRecords = async () => {
      try {
        const supabase = createClient();
        const custId = activeCustomer.id;
        const tenantId = tenant.id;

        const [
          { data: bData },
          { data: rData },
          { data: cData }
        ] = await Promise.all([
          supabase.from('bills').select('*').eq('tenant_id', tenantId).eq('customer_id', custId),
          supabase.from('repairs').select('*').eq('tenant_id', tenantId).eq('customer_id', custId),
          supabase.from('contracts').select('*').eq('tenant_id', tenantId).eq('customer_id', custId)
        ]);

        if (bData && bData.length > 0) setBills(bData);
        if (rData && rData.length > 0) setRepairs(rData);
        if (cData && cData.length > 0) setContracts(cData);
      } catch (err) {
        console.log('Using default sample customer records:', err);
      }
    };

    fetchCustomerRecords();
  }, [activeCustomer, tenant]);

  // Handle Payment Settlement
  const handlePaymentSuccess = async (bill) => {
    try {
      const supabase = createClient();
      await supabase.from('bills').update({ status: 'paid' }).eq('id', bill.id);
    } catch (e) {
      console.log('Local payment settlement:', e);
    }

    // Update local state instantly
    setBills(prev => prev.map(b => b.id === bill.id ? { ...b, status: 'paid', paid_at: new Date().toISOString() } : b));
  };

  // Cart Operations
  const handleAddToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (id, quantity) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const handleRemoveFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Checkout Outright
  const handleCheckoutOutright = (cartItems, total, fulfillment) => {
    const newBill = {
      id: `bill-${Date.now()}`,
      description: `Purchase: ${cartItems.map(i => `${i.name} (x${i.quantity || 1})`).join(', ')}`,
      amount: total,
      due_date: new Date().toISOString().split('T')[0],
      status: 'paid',
      type: 'Store Order',
      invoice_number: `ORD-${Date.now().toString().slice(-4)}`,
      paid_at: new Date().toISOString()
    };
    setBills(prev => [newBill, ...prev]);
    setCart([]);
  };

  // Checkout with Rent-to-Own Financing
  const handleCheckoutRTO = (cartItems, totalMonthly, fulfillment) => {
    const firstItem = cartItems[0];
    const newContract = {
      id: `con-${Date.now()}`,
      item_name: cartItems.length === 1 ? firstItem.name : `${firstItem.name} + ${cartItems.length - 1} more`,
      financed_amount: cartItems.reduce((acc, i) => acc + (i.price * (i.quantity || 1)), 0),
      upfront_amount: 0.00,
      interest_rate: 0.00,
      frequency: 'monthly',
      total_installments: 12,
      paid_installments: 0,
      installment_amount: totalMonthly,
      status: 'active',
      agreement_date: new Date().toISOString().split('T')[0]
    };
    setContracts(prev => [newContract, ...prev]);

    // Create first monthly installment bill
    const firstInstallmentBill = {
      id: `bill-rto-${Date.now()}`,
      description: `RTO Installment #1 of 12 (${newContract.item_name})`,
      amount: totalMonthly,
      due_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: 'pending',
      type: 'RTO Installment',
      invoice_number: `RTO-${Date.now().toString().slice(-4)}`
    };
    setBills(prev => [firstInstallmentBill, ...prev]);
    setCart([]);
  };

  // Direct Finance Single Product from Detail Modal
  const handleDirectFinance = (productConfig) => {
    handleCheckoutRTO([productConfig], productConfig.monthlyEstimate, 'collection');
  };

  const unpaidBillsCount = bills.filter(b => b.status !== 'paid').length;
  const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  if (loading) {
    return (
      <div className="mobile-portal-wrapper" style={{ alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #4318ff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }} />
          <p style={{ color: '#64748b', fontWeight: '600' }}>Loading PhoneSuite Customer Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-portal-wrapper">
      
      {/* Mobile App Shell */}
      <div className={`mobile-app-shell ${isFullscreen ? 'fullscreen-mode' : ''}`}>
        
        {/* Sticky Mobile App Header */}
        <header className="mobile-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            
            {/* Brand Logo & Shop Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '9px', 
                  background: 'linear-gradient(135deg, #4318ff 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 2px 8px rgba(67, 24, 255, 0.3)'
                }}
              >
                <Smartphone size={18} />
              </div>
              <div>
                <h1 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>
                  {tenant?.name || 'PhoneSuite'}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: '600' }}>
                    Customer Portal
                  </span>
                </div>
              </div>
            </div>

            {/* Right Action Icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              
              {/* Bag Button with Badge */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                style={{
                  position: 'relative',
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0f172a',
                  cursor: 'pointer'
                }}
                aria-label="View Shopping Bag"
              >
                <ShoppingBag size={17} />
                {cartCount > 0 && (
                  <span 
                    style={{ 
                      position: 'absolute', 
                      top: '-4px', 
                      right: '-4px', 
                      background: '#ef4444', 
                      color: '#fff', 
                      fontSize: '0.62rem', 
                      fontWeight: '800', 
                      minWidth: '17px', 
                      height: '17px', 
                      borderRadius: '9px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1.5px solid #ffffff'
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Viewport mode toggle button */}
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b',
                  cursor: 'pointer'
                }}
                title={isFullscreen ? 'Switch to Mobile Phone Shell' : 'Switch to Full Width'}
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>

            </div>

          </div>
        </header>

        {/* Scrollable View Body for the 5 Tabs */}
        <main className="mobile-scroll-body">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <DashboardTab
              customer={activeCustomer}
              tenant={tenant}
              bills={bills}
              repairs={repairs}
              contracts={contracts}
              setActiveTab={setActiveTab}
              onTriggerPayment={(b) => setPayingBill(b)}
            />
          )}

          {/* TAB 2: BILLS */}
          {activeTab === 'bills' && (
            <BillsTab
              bills={bills}
              contracts={contracts}
              onTriggerPayment={(b) => setPayingBill(b)}
              tenant={tenant}
              customer={activeCustomer}
            />
          )}

          {/* TAB 3: SHOP (MIDDLE & MAIN ONE) */}
          {activeTab === 'shop' && (
            <ShopTab
              products={products}
              cart={cart}
              onAddToCart={handleAddToCart}
              onOpenProductDetail={(p) => setSelectedProduct(p)}
              onOpenCart={() => setIsCartOpen(true)}
              customerCreditLimit={activeCustomer?.credit_limit || 2500}
            />
          )}

          {/* TAB 4: SCORE */}
          {activeTab === 'score' && (
            <ScoreTab
              customer={activeCustomer}
              tenant={tenant}
              onGoToShop={() => setActiveTab('shop')}
            />
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <SettingsTab
              customer={activeCustomer}
              setCustomer={setActiveCustomer}
              customersList={customers}
              tenant={tenant}
              isFullscreen={isFullscreen}
              setIsFullscreen={setIsFullscreen}
            />
          )}

        </main>

        {/* ========================================================
            FIXED BOTTOM NAVIGATION BAR (WITH CENTER PROMINENT SHOP)
        ======================================================== */}
        <BottomNavBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unpaidBillsCount={unpaidBillsCount}
          cartCount={cartCount}
          creditScore={activeCustomer?.credit_score || 785}
        />

      </div>

      {/* ========================================================
          MODALS & DRAWERS
      ======================================================== */}
      
      {/* Payment Checkout Modal */}
      {payingBill && (
        <PaymentModal
          bill={payingBill}
          tenant={tenant}
          onClose={() => setPayingBill(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onFinanceWithRTO={handleDirectFinance}
        />
      )}

      {/* Slide-Up Cart Drawer */}
      {isCartOpen && (
        <CartDrawer
          cart={cart}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveFromCart}
          onCheckoutOutright={handleCheckoutOutright}
          onCheckoutRTO={handleCheckoutRTO}
          tenant={tenant}
        />
      )}

    </div>
  );
}
