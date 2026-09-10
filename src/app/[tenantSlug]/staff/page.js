'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '../../../utils/supabase/client';

import StaffBottomNavBar from './components/StaffBottomNavBar';
import StaffDashboardTab from './components/StaffDashboardTab';
import StaffInvoicesTab from './components/StaffInvoicesTab';
import StaffFinanceTab from './components/StaffFinanceTab';
import StaffSaleTab from './components/StaffSaleTab';
import StaffOrdersTab from './components/StaffOrdersTab';
import StaffShopTab from './components/StaffShopTab';
import StaffSettingsTab from './components/StaffSettingsTab';

import NewRepairJobModal from './components/NewRepairJobModal';
import NewInvoiceModal from './components/NewInvoiceModal';
import NewCustomerModal from './components/NewCustomerModal';
import ProductEditorModal from './components/ProductEditorModal';
import ReceiptModal from './components/ReceiptModal';

import { 
  STORE_BRANCHES, 
  STAFF_MEMBERS, 
  INITIAL_STAFF_CUSTOMERS, 
  INITIAL_STAFF_REPAIRS, 
  INITIAL_STAFF_INVOICES,
  getSavedProducts,
  persistProducts,
  getSavedFinanceRequests,
  getSavedOnlineOrders
} from './data/staffData';

import { 
  Smartphone, 
  Check, 
  Globe, 
  Bell, 
  ShieldCheck, 
  Store, 
  Layers 
} from 'lucide-react';

import { StaffLanguageProvider, useStaffLanguage } from './context/StaffLanguageContext';

export default function MobileStaffPortal() {
  return (
    <StaffLanguageProvider>
      <StaffContent />
    </StaffLanguageProvider>
  );
}

function StaffContent() {
  const { language, setLanguage, t } = useStaffLanguage();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const tenantSlug = params.tenantSlug || 'premiumphonex';

  // Global Tenant & Branch State
  const [tenant, setTenant] = useState(null);
  const [branches, setBranches] = useState(STORE_BRANCHES);
  const [branch, setBranch] = useState(STORE_BRANCHES[0]);
  const [loading, setLoading] = useState(true);

  // Tab State: 'dashboard', 'invoices', 'sale', 'shop', 'settings'
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
      if (tabParam && ['dashboard', 'invoices', 'finance', 'sale', 'orders', 'shop', 'settings'].includes(tabParam)) {
        setActiveTabState(tabParam);
      }
    }
  }, []);

  // Operational Business Data
  const [customers, setCustomers] = useState(INITIAL_STAFF_CUSTOMERS);
  const [repairs, setRepairs] = useState(INITIAL_STAFF_REPAIRS);
  const [invoices, setInvoices] = useState(INITIAL_STAFF_INVOICES);
  const [products, setProducts] = useState(() => getSavedProducts());
  const [financeRequests, setFinanceRequests] = useState(() => getSavedFinanceRequests());
  const [onlineOrders, setOnlineOrders] = useState(() => getSavedOnlineOrders());

  // Modals state
  const [isNewRepairOpen, setIsNewRepairOpen] = useState(false);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);
  const [isProductEditorOpen, setIsProductEditorOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [activeReceipt, setActiveReceipt] = useState(null);

  // Viewport mode: false = 480px mobile frame, true = full width
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 1. Initial Load & Supabase fetch
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

        // Fetch Branches from DB
        const { data: bData } = await supabase
          .from('branches')
          .select('*')
          .eq('tenant_id', currentTenant.id);

        if (bData && bData.length > 0) {
          setBranches(bData);
          setBranch(bData[0]);
        }

        // Fetch Customers from DB if available
        const { data: cData } = await supabase
          .from('customers')
          .select('*')
          .eq('tenant_id', currentTenant.id);

        if (cData && cData.length > 0) {
          setCustomers(cData);
        }

        // Fetch DB inventory if available
        const { data: invData } = await supabase
          .from('inventory')
          .select('*')
          .eq('tenant_id', currentTenant.id);

        if (invData && invData.length > 0) {
          const mappedInv = invData.map((item, idx) => ({
            id: item.id || `inv-${idx}`,
            category: 'phones',
            name: item.name,
            brand: 'Tech',
            specs: `SKU: ${item.sku} - Stock: ${item.quantity}`,
            price: Number(item.sell_price || 99),
            rtoMonthly: Number((item.sell_price / 12).toFixed(2)),
            image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
            stock: item.quantity || 5,
            condition: 'Available in Store',
            description: `Official inventory item available directly at ${currentTenant.name}.`
          }));
          const merged = [...mappedInv, ...getSavedProducts()];
          setProducts(merged);
        }
      } catch (err) {
        console.error('Failed fetching tenant staff data:', err);
        setTenant({
          id: '402bb3e5-1a10-4d90-bf13-1ffe169a9352',
          name: 'PhoneSuite UK',
          slug: tenantSlug || 'premiumphonex'
        });
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [tenantSlug]);

  // Operational Handlers

  // 1. Repair Job Status Advance
  const handleUpdateRepairStatus = (repairId, nextStatus) => {
    setRepairs(prev => prev.map(r => {
      if (r.id === repairId) {
        return { ...r, status: nextStatus, updated_at: new Date().toISOString() };
      }
      return r;
    }));
  };

  // 2. Add New Repair Job
  const handleCreateRepair = (newRepair) => {
    setRepairs(prev => [newRepair, ...prev]);
    // Also create corresponding invoice if balance due exists
    if (newRepair.estimated_cost > 0) {
      const repairInvoice = {
        id: `inv-${Date.now()}`,
        invoice_number: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        customer_name: newRepair.customer_name,
        customer_phone: newRepair.customer_phone,
        description: `Repair Service: ${newRepair.device_model} (${newRepair.issue_description?.slice(0, 35)}...)`,
        amount: newRepair.estimated_cost,
        due_date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        status: newRepair.deposit_paid >= newRepair.estimated_cost ? 'paid' : 'pending',
        type: 'Repair Invoice',
        branch: branch?.name || 'London Central Branch',
        created_at: new Date().toISOString()
      };
      setInvoices(prev => [repairInvoice, ...prev]);
    }
  };

  // 3. Add New Standalone Invoice
  const handleCreateInvoice = (newInvoice) => {
    setInvoices(prev => [newInvoice, ...prev]);
  };

  // 4. Settle / Mark Invoice Paid
  const handleSettleInvoice = (invoiceId) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        return { ...inv, status: 'paid', paid_at: new Date().toISOString() };
      }
      return inv;
    }));
  };

  // 5. Add New Customer
  const handleCreateCustomer = (newCustomer) => {
    setCustomers(prev => [newCustomer, ...prev]);
  };

  // 6. Add or Edit Product in Shop
  const handleSaveProduct = (productData) => {
    setProducts(prev => {
      let updated;
      const exists = prev.some(p => p.id === productData.id);
      if (exists) {
        updated = prev.map(p => p.id === productData.id ? productData : p);
      } else {
        updated = [productData, ...prev];
      }
      // Persist so customer portal immediately reads it
      persistProducts(updated);
      return updated;
    });
    setProductToEdit(null);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm(t.shop.confirmDelete)) {
      setProducts(prev => {
        const updated = prev.filter(p => p.id !== productId);
        persistProducts(updated);
        return updated;
      });
    }
  };

  // 7. Complete Sale & POS Transaction
  const handleCompleteSale = (saleData) => {
    const isRto = saleData.isRto;
    const invNumber = `${isRto ? 'RTO' : 'ORD'}-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newInvoice = {
      id: `inv-${Date.now()}`,
      invoice_number: invNumber,
      customer_name: saleData.customer.name,
      customer_phone: saleData.customer.phone,
      customer_email: saleData.customer.email,
      description: saleData.items.map(i => `${i.name} (x${i.quantity})`).join(', '),
      amount: saleData.total,
      due_date: new Date().toISOString().split('T')[0],
      status: isRto ? 'pending' : 'paid',
      type: isRto ? 'RTO Installment' : 'POS Store Sale',
      branch: branch?.name || 'London Central Branch',
      paid_at: isRto ? null : new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    setInvoices(prev => [newInvoice, ...prev]);

    // Deduct stock for products
    setProducts(prev => {
      const updated = prev.map(p => {
        const sold = saleData.items.find(item => item.id === p.id);
        if (sold) {
          const newStock = Math.max(0, (p.stock || 5) - sold.quantity);
          return { ...p, stock: newStock };
        }
        return p;
      });
      persistProducts(updated);
      return updated;
    });

    // Open Printable Receipt Modal
    setActiveReceipt({
      receiptNumber: invNumber,
      customerName: saleData.customer.name,
      customerPhone: saleData.customer.phone,
      branch: branch?.name || 'London Central Branch',
      items: saleData.items,
      subtotal: saleData.subtotal,
      vat: saleData.vat,
      total: saleData.total,
      paymentMethod: isRto ? '0% Rent-to-Own Financing Agreement' : (saleData.paymentMode === 'outright_cash' ? 'Cash at Counter' : 'Card (Stripe Terminal)'),
      isRto: saleData.isRto,
      rtoDetails: saleData.rtoDetails
    });
  };

  const overdueCount = invoices.filter(i => i.status === 'overdue').length;
  const activeRepairsCount = repairs.filter(r => r.status !== 'picked_up' && r.status !== 'cancelled').length;
  const pendingFinanceCount = financeRequests.filter(r => r.status === 'pending_review').length;
  const awaitingOrdersCount = onlineOrders.filter(o => o.fulfillmentStatus === 'awaiting_dispatch').length;

  if (loading) {
    return (
      <div className="mobile-portal-wrapper" style={{ alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }} />
          <p style={{ color: '#64748b', fontWeight: '600' }}>Loading PhoneSuite Staff Operations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-portal-wrapper">
      
      {/* Mobile Shell Frame */}
      <div className={`mobile-app-shell ${isFullscreen ? 'fullscreen-mode' : ''}`}>
        
        {/* Sticky Staff App Header */}
        <header className="mobile-header mobile-header-dark" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: '#0b132b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            
            {/* Brand Logo & Staff Ops Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div 
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '11px', 
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ff7a00',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)'
                }}
              >
                <Smartphone size={18} strokeWidth={2.4} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <h1 style={{ fontSize: '0.94rem', fontWeight: '900', color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
                    {tenant?.name || 'PhoneSuite'}
                  </h1>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '1px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: '600' }}>
                    {branch?.name || 'London Central Branch'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Action Icons (Translate & Fullscreen) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              
              {/* Language Switcher Button */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '10px',
                    height: '36px',
                    padding: '0 9px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    transition: 'all 0.15s ease'
                  }}
                  aria-label={t.header?.switchLang || 'Change Language'}
                  title={language === 'en' ? 'Mudar para Português (Brasil)' : 'Switch to English (UK)'}
                >
                  <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>{language === 'en' ? '🇬🇧' : '🇧🇷'}</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#f1f5f9' }}>
                    {language === 'en' ? 'EN' : 'PT'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isLangMenuOpen && (
                  <>
                    <div 
                      style={{ position: 'fixed', inset: 0, zIndex: 90 }} 
                      onClick={() => setIsLangMenuOpen(false)} 
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 6px)',
                        right: 0,
                        background: '#0b132b',
                        borderRadius: '12px',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.12)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        padding: '6px',
                        minWidth: '165px',
                        zIndex: 99,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => { setLanguage('en'); setIsLangMenuOpen(false); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: 'none',
                          background: language === 'en' ? 'rgba(234, 88, 12, 0.18)' : 'transparent',
                          color: language === 'en' ? '#ff7a00' : '#f1f5f9',
                          fontWeight: language === 'en' ? '700' : '500',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          width: '100%'
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1.15rem' }}>🇬🇧</span>
                          <span>English (UK)</span>
                        </span>
                        {language === 'en' && <Check size={14} color="#ff7a00" strokeWidth={2.5} />}
                      </button>

                      <button
                        type="button"
                        onClick={() => { setLanguage('pt'); setIsLangMenuOpen(false); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: 'none',
                          background: language === 'pt' ? 'rgba(234, 88, 12, 0.18)' : 'transparent',
                          color: language === 'pt' ? '#ff7a00' : '#f1f5f9',
                          fontWeight: language === 'pt' ? '700' : '500',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          width: '100%'
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1.15rem' }}>🇧🇷</span>
                          <span>Português (BR)</span>
                        </span>
                        {language === 'pt' && <Check size={14} color="#ff7a00" strokeWidth={2.5} />}
                      </button>
                    </div>
                  </>
                )}
              </div>

            </div>

          </div>
        </header>

        {/* Main Scroll Body for 5 Tabs */}
        <main className="mobile-scroll-body">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <StaffDashboardTab
              tenant={tenant}
              branch={branch}
              repairs={repairs}
              invoices={invoices}
              customers={customers}
              onUpdateRepairStatus={handleUpdateRepairStatus}
              onOpenNewRepair={() => setIsNewRepairOpen(true)}
              onOpenNewInvoice={() => setIsNewInvoiceOpen(true)}
              onOpenNewCustomer={() => setIsNewCustomerOpen(true)}
              onOpenNewProduct={() => {
                setProductToEdit(null);
                setIsProductEditorOpen(true);
              }}
              setActiveTab={setActiveTab}
              onSettleInvoice={handleSettleInvoice}
            />
          )}

          {/* TAB 2: FINANCE APPLICATIONS & REQUESTS */}
          {activeTab === 'finance' && (
            <StaffFinanceTab
              tenant={tenant}
              branch={branch}
              tenantSlug={tenantSlug}
            />
          )}

          {/* TAB: INVOICES (Backwards-compatibility) */}
          {activeTab === 'invoices' && (
            <StaffInvoicesTab
              invoices={invoices}
              onOpenNewInvoice={() => setIsNewInvoiceOpen(true)}
              onSettleInvoice={handleSettleInvoice}
              onViewReceipt={(inv) => {
                setActiveReceipt({
                  receiptNumber: inv.invoice_number,
                  customerName: inv.customer_name,
                  customerPhone: inv.customer_phone,
                  branch: inv.branch || branch?.name,
                  items: [{ name: inv.description, price: inv.amount, quantity: 1 }],
                  subtotal: inv.amount * 0.8,
                  vat: inv.amount * 0.2,
                  total: inv.amount,
                  paymentMethod: inv.status === 'paid' ? 'Settled in Full' : 'Pending Payment Terms',
                  isRto: inv.type?.toLowerCase().includes('rto')
                });
              }}
              tenant={tenant}
            />
          )}

          {/* TAB 3: SALE (MIDDLE & MAIN ONE) */}
          {activeTab === 'sale' && (
            <StaffSaleTab
              products={products}
              customers={customers}
              onOpenNewCustomer={() => setIsNewCustomerOpen(true)}
              onCompleteSale={handleCompleteSale}
              activeBranch={branch?.name}
            />
          )}

          {/* TAB 4: ORDERS (CUSTOMER PORTAL ONLINE ORDERS) */}
          {activeTab === 'orders' && (
            <StaffOrdersTab
              tenant={tenant}
              branch={branch}
              tenantSlug={tenantSlug}
            />
          )}

          {/* TAB: SHOP (Manage Products) */}
          {activeTab === 'shop' && (
            <StaffShopTab
              products={products}
              onOpenNewProduct={() => {
                setProductToEdit(null);
                setIsProductEditorOpen(true);
              }}
              onOpenEditProduct={(prod) => {
                setProductToEdit(prod);
                setIsProductEditorOpen(true);
              }}
              onDeleteProduct={handleDeleteProduct}
              tenantSlug={tenantSlug}
            />
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <StaffSettingsTab
              tenant={tenant}
              branch={branch}
              setBranch={setBranch}
              branches={branches}
              tenantSlug={tenantSlug}
              isFullscreen={isFullscreen}
              setIsFullscreen={setIsFullscreen}
            />
          )}

        </main>

        {/* Fixed 5-Item Bottom Navigation Bar */}
        <StaffBottomNavBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          overdueCount={overdueCount}
          activeRepairsCount={activeRepairsCount}
          financeRequestsCount={pendingFinanceCount}
          onlineOrdersCount={awaitingOrdersCount}
        />

      </div>

      {/* ========================================================
          MODAL DIALOGS
      ======================================================== */}
      
      {/* 1. New Repair Job Modal */}
      <NewRepairJobModal
        isOpen={isNewRepairOpen}
        onClose={() => setIsNewRepairOpen(false)}
        onSubmit={handleCreateRepair}
        customers={customers}
        activeBranch={branch?.name}
      />

      {/* 2. New Invoice Modal */}
      <NewInvoiceModal
        isOpen={isNewInvoiceOpen}
        onClose={() => setIsNewInvoiceOpen(false)}
        onSubmit={handleCreateInvoice}
        customers={customers}
        activeBranch={branch?.name}
      />

      {/* 3. New Customer Modal */}
      <NewCustomerModal
        isOpen={isNewCustomerOpen}
        onClose={() => setIsNewCustomerOpen(false)}
        onSubmit={handleCreateCustomer}
      />

      {/* 4. Product Editor / Creator Modal */}
      <ProductEditorModal
        isOpen={isProductEditorOpen}
        onClose={() => {
          setIsProductEditorOpen(false);
          setProductToEdit(null);
        }}
        onSubmit={handleSaveProduct}
        productToEdit={productToEdit}
      />

      {/* 5. Printable Receipt Modal */}
      <ReceiptModal
        isOpen={Boolean(activeReceipt)}
        onClose={() => setActiveReceipt(null)}
        receiptData={activeReceipt}
        tenantName={tenant?.name || 'PhoneSuite UK'}
      />

    </div>
  );
}
