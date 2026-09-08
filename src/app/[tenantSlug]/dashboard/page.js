'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '../../../utils/supabase/client';
import { 
  Building2, Users, Layers, Wrench, BarChart3, 
  Receipt, Settings2, Plus, LogOut, Trash2, 
  DollarSign, ShoppingCart, Send, UserCheck, 
  CheckCircle2, AlertTriangle, HelpCircle, Check, Laptop, Copy,
  ChevronDown, ChevronRight, ChevronLeft, User,
  UploadCloud, MapPin, Map, Key, Lock, Unlock, X, Edit3, Calendar, Save, Phone
} from 'lucide-react';

export default function Dashboard() {
  const params = useParams();
  const router = useRouter();
  const tenantSlug = params.tenantSlug;

  const [tenant, setTenant] = useState(null);
  const [branches, setBranches] = useState([]);
  const [activeBranch, setActiveBranch] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // UI States
  const [isBusinessSettingsOpen, setIsBusinessSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [profileTitle, setProfileTitle] = useState('');
  const [profileFirstName, setProfileFirstName] = useState('');
  const [profileLastName, setProfileLastName] = useState('');
  const [profileMobile, setProfileMobile] = useState('');
  const [profileWhatsapp, setProfileWhatsapp] = useState('');
  const [profileDob, setProfileDob] = useState('');
  
  // New States
  const [profileAddresses, setProfileAddresses] = useState([]);
  const [profileAvatarUrl, setProfileAvatarUrl] = useState('');
  
  // Security States
  const [oldPassword, setOldPassword] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI States for Profile
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isTitleDropdownOpen, setIsTitleDropdownOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isEditPersonalInfoModalOpen, setIsEditPersonalInfoModalOpen] = useState(false);
  
  // Address Modal States
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddressDoor, setNewAddressDoor] = useState('');
  const [newAddressPostcode, setNewAddressPostcode] = useState('');
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [pendingAddressList, setPendingAddressList] = useState(null);
  
  const [isSwitchStoreModalOpen, setIsSwitchStoreModalOpen] = useState(false);

  const [isBranchAddressModalOpen, setIsBranchAddressModalOpen] = useState(false);
  const [branchAddressPostcode, setBranchAddressPostcode] = useState('');
  const [isFetchingBranchAddress, setIsFetchingBranchAddress] = useState(false);
  const [pendingBranchAddressList, setPendingBranchAddressList] = useState(null);
  const [branchAddressTarget, setBranchAddressTarget] = useState(null); // 'new' or 'edit'

  useEffect(() => {
    if (currentUser) {
      setProfileTitle(currentUser.title || '');
      setProfileFirstName(currentUser.first_name || '');
      setProfileLastName(currentUser.last_name || '');
      setProfileMobile(currentUser.mobile || '');
      setProfileWhatsapp(currentUser.whatsapp || '');
      setProfileDob(currentUser.dob || '');
      setProfileAddresses(currentUser.addresses || []);
      setProfileAvatarUrl(currentUser.avatar_url || '');
      
      // Fallback for legacy name
      if (!currentUser.first_name && currentUser.name) {
        const parts = currentUser.name.split(' ');
        setProfileFirstName(parts[0] || '');
        setProfileLastName(parts.slice(1).join(' ') || '');
      }
    }
  }, [currentUser]);

  // Handle Avatar Upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    const supabase = createClient();
    
    // Fetch auth user directly to guarantee we have an ID
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) {
      alert("Authentication error: Please log in again.");
      setIsUploadingAvatar(false);
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${authData.user.id}-${Math.random()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file);

    if (uploadError) {
      alert('Error uploading avatar: ' + uploadError.message);
      setIsUploadingAvatar(false);
      return;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
    setProfileAvatarUrl(data.publicUrl);
    setIsUploadingAvatar(false);
  };

  // Google Maps Address Lookup
  const handleLookupAddress = async () => {
    if (!newAddressPostcode) return alert('Please enter a postcode');
    setIsFetchingAddress(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        alert('Google Maps API key is missing. Please add it to your .env.local file as NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.');
        setIsFetchingAddress(false);
        return;
      }
      
      const query = encodeURIComponent(newAddressPostcode);
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${apiKey}`);
      const data = await res.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        setPendingAddressList({
          baseAddress: result.formatted_address,
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng
        });
      } else {
        console.error('Google Maps API Error:', data);
        alert(`Google Maps API Error: ${data.status}\n${data.error_message || 'Please check the door number and postcode.'}`);
      }
    } catch (err) {
      alert('Error fetching address: ' + err.message);
    }
    setIsFetchingAddress(false);
  };
  
  const handleConfirmSaveAddress = (selectedAddr) => {
    const newAddr = {
      id: Date.now().toString(),
      door: selectedAddr.door,
      postcode: newAddressPostcode,
      full_address: selectedAddr.formattedAddress,
      lat: selectedAddr.lat,
      lng: selectedAddr.lng
    };
    setProfileAddresses([...profileAddresses, newAddr]);
    setIsAddressModalOpen(false);
    setNewAddressDoor('');
    setNewAddressPostcode('');
    setPendingAddressList(null);
  };

  // Branch Address Lookup
  const handleLookupBranchAddress = async () => {
    if (!branchAddressPostcode) return alert('Please enter a postcode');
    setIsFetchingBranchAddress(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        alert('Google Maps API key is missing.');
        setIsFetchingBranchAddress(false);
        return;
      }
      
      const query = encodeURIComponent(branchAddressPostcode);
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${apiKey}`);
      const data = await res.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        setPendingBranchAddressList({
          baseAddress: result.formatted_address,
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng
        });
      } else {
        alert(`Google Maps API Error: ${data.status}`);
      }
    } catch (err) {
      alert('Error fetching address: ' + err.message);
    }
    setIsFetchingBranchAddress(false);
  };

  const handleConfirmBranchAddress = (selectedAddr) => {
    if (branchAddressTarget === 'new') {
      setNewBranch({ ...newBranch, address: selectedAddr.formattedAddress, lat: selectedAddr.lat, lng: selectedAddr.lng });
    } else if (branchAddressTarget === 'edit') {
      setEditBranchData({ ...editBranchData, address: selectedAddr.formattedAddress, lat: selectedAddr.lat, lng: selectedAddr.lng });
    }
    setIsBranchAddressModalOpen(false);
    setBranchAddressPostcode('');
    setPendingBranchAddressList(null);
    setBranchAddressTarget(null);
  };

  const handleRemoveAddress = (id) => {
    setProfileAddresses(profileAddresses.filter(a => a.id !== id));
  };

  // Forgot Password
  const handleForgotPassword = async () => {
    const supabase = createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) { alert('Please wait for profile to load.'); return; }
    
    if (!confirm('Send a password recovery link to ' + authData.user.email + '?')) return;
    const { error } = await supabase.auth.resetPasswordForEmail(authData.user.email);
    if (error) alert('Error sending recovery email: ' + error.message);
    else alert('Recovery link sent! Please check your email inbox.');
  };

  const handleSavePersonalInfo = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    
    const supabase = createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) {
       alert('Authentication error: Please log in again.'); 
       setIsUpdatingProfile(false); 
       return;
    }

    const fullName = `${profileFirstName} ${profileLastName}`.trim();
    
    const { error } = await supabase
      .from('profiles')
      .update({ 
        name: fullName,
        title: profileTitle,
        first_name: profileFirstName,
        last_name: profileLastName,
        mobile: profileMobile,
        whatsapp: profileWhatsapp,
        dob: profileDob || null,
        avatar_url: profileAvatarUrl,
        addresses: profileAddresses
      })
      .eq('id', authData.user.id);
      
    if (!error) {
      setCurrentUser({ 
        ...(currentUser || {}), 
        name: fullName,
        title: profileTitle,
        first_name: profileFirstName,
        last_name: profileLastName,
        mobile: profileMobile,
        whatsapp: profileWhatsapp,
        dob: profileDob,
        avatar_url: profileAvatarUrl,
        addresses: profileAddresses
      });
      setIsEditPersonalInfoModalOpen(false);
    } else {
      console.error(error);
      alert('Error updating profile data. Did you run the SQL migration snippet to add the dob column?');
    }
    
    setIsUpdatingProfile(false);
  };

  const handleSaveSecurity = async (e) => {
    e.preventDefault();
    if (!oldPassword || !profilePassword || !confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }
    setIsUpdatingProfile(true);
    
    const supabase = createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) {
       alert('Authentication error: Please log in again.'); 
       setIsUpdatingProfile(false); 
       return;
    }
    
    if (profilePassword !== confirmPassword) {
       alert('New passwords do not match.'); setIsUpdatingProfile(false); return;
    }
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: authData.user.email,
      password: oldPassword
    });
    if (signInError) {
       alert('Old password is incorrect.'); setIsUpdatingProfile(false); return;
    }
    const { error: updateAuthError } = await supabase.auth.updateUser({ password: profilePassword });
    if (updateAuthError) {
       alert('Failed to update password: ' + updateAuthError.message); setIsUpdatingProfile(false); return;
    } else {
       alert('Password updated successfully!');
       setOldPassword('');
       setProfilePassword('');
       setConfirmPassword('');
    }
    setIsUpdatingProfile(false);
  };

  // Operational Data States
  const [inventory, setInventory] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [sales, setSales] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [bills, setBills] = useState([]);
  const [vendorBills, setVendorBills] = useState([]);
  const [salesItems, setSalesItems] = useState([]);

  // Form Inputs & Modals
  const [isNewItemModal, setIsNewItemModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', sku: '', buy_price: '', sell_price: '', quantity: 10, min_stock: 2, commission_override: '' });
  
  const [isNewRepairModal, setIsNewRepairModal] = useState(false);
  const [newRepair, setNewRepair] = useState({ customer_id: '', device_type: 'phone', device_model: '', device_serial: '', issue_description: '', estimated_cost: '', assigned_staff_id: '' });

  const [isNewCustomerModal, setIsNewCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ 
    title: 'Mr', first_name: '', last_name: '', name: '', email: '', 
    phone: '', whatsapp: '', dob: '', notes: '', 
    address: '', lat: null, lng: null,
    referees: [], // Array of { name: '', phone: '', relationship: '' }
    id_documents: []
  });

  const [isNewVendorBillModal, setIsNewVendorBillModal] = useState(false);
  const [newVendorBill, setNewVendorBill] = useState({ vendor_name: '', amount: '', due_date: '' });

  const [isCreatingBranch, setIsCreatingBranch] = useState(false);
  const [newBranch, setNewBranch] = useState({ name: '', address: '', phone: '', lat: null, lng: null });
  const [editingBranch, setEditingBranch] = useState(null);
  const [editBranchData, setEditBranchData] = useState({ name: '', address: '', phone: '', lat: null, lng: null });

  // POS States
  const [posCart, setPosCart] = useState([]);
  const [posCustomer, setPosCustomer] = useState('');
  const [posStaff, setPosStaff] = useState('');
  const [posPaymentMethod, setPosPaymentMethod] = useState('card');
  const [posDeliveryMethod, setPosDeliveryMethod] = useState('collection');
  const [posTradeInAmount, setPosTradeInAmount] = useState(0);
  const [posDeliveryFee, setPosDeliveryFee] = useState(0);
  const [isCalculatingDelivery, setIsCalculatingDelivery] = useState(false);
  // RTO Calculations
  const [rtoUpfront, setRtoUpfront] = useState(150);
  const [rtoTermMonths, setRtoTermMonths] = useState(6);
  const [rtoFrequency, setRtoFrequency] = useState('monthly');
  const [rtoInterest, setRtoInterest] = useState(12); // 12% flat mark up
  const [rtoDispatchedModal, setRtoDispatchedModal] = useState(null);

  // Staff Commission override
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [customCommissionRate, setCustomCommissionRate] = useState('');

  // Payment Setup States
  const [stripeConnId, setStripeConnId] = useState('');
  const [squareToken, setSquareToken] = useState('');
  const [squareLocId, setSquareLocId] = useState('');

  // Delivery Settings State
  const [isFreeDelivery, setIsFreeDelivery] = useState(false);
  const [minDeliveryFee, setMinDeliveryFee] = useState(10.00);
  const [baseDeliveryMiles, setBaseDeliveryMiles] = useState(3);
  const [perMileRate, setPerMileRate] = useState(1.50);
  const [isSavingDelivery, setIsSavingDelivery] = useState(false);

  useEffect(() => {
    const fetchTenantData = async () => {
      const supabase = createClient();
      
      // 1. Fetch Tenant
      const { data: tData, error: tError } = await supabase
        .from('tenants')
        .select('*')
        .eq('slug', tenantSlug)
        .single();
        
      if (!tData || tError) {
        console.error("Tenant not found", tError);
        router.push('/');
        return;
      }
      setTenant(tData);

      // 2. Fetch Branches
      const { data: bList, error: bError } = await supabase
        .from('branches')
        .select('*')
        .eq('tenant_id', tData.id);
        
      if (bList) {
        setBranches(bList);
        if (bList.length > 0) {
          setActiveBranch(bList[0]);
        }
      }

      // 3. Set Payment keys
      setStripeConnId(tData.stripe_connect_id || '');
      setSquareToken(tData.square_access_token || '');
      setSquareLocId(tData.square_location_id || '');

      if (tData.delivery_settings) {
        setIsFreeDelivery(tData.delivery_settings.free_delivery || false);
        setMinDeliveryFee(tData.delivery_settings.min_fee || 10.00);
        setBaseDeliveryMiles(tData.delivery_settings.base_miles || 3);
        setPerMileRate(tData.delivery_settings.per_mile_rate || 1.50);
      }

      // 4. Fetch Current User Session & Profile
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        const { data: pData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();
        if (pData) {
          setCurrentUser(pData);
        }
      }
    };
    
    fetchTenantData();
  }, [tenantSlug]);

  useEffect(() => {
    if (!tenant || !activeBranch) return;
    refreshData();
  }, [tenant, activeBranch]);

  const refreshData = async () => {
    const tenantId = tenant.id;
    const branchId = activeBranch.id;
    const supabase = createClient();
    
    // Fetch all related operational data from Supabase
    const [
      { data: invData },
      { data: custData },
      { data: repData },
      { data: saleData },
      { data: contData },
      { data: profData },
      { data: billData },
      { data: vBillData },
      { data: sItemsData }
    ] = await Promise.all([
      supabase.from('inventory').select('*').eq('branch_id', branchId),
      supabase.from('customers').select('*').eq('tenant_id', tenantId),
      supabase.from('repairs').select('*').eq('branch_id', branchId),
      supabase.from('sales').select('*').eq('branch_id', branchId),
      supabase.from('contracts').select('*').eq('branch_id', branchId),
      supabase.from('profiles').select('*').eq('tenant_id', tenantId),
      supabase.from('bills').select('*').eq('tenant_id', tenantId),
      supabase.from('vendor_bills').select('*').eq('branch_id', branchId),
      supabase.from('sales_items').select('*, sales!inner(*)') // Will manually filter by branch in state
    ]);

    setInventory(invData || []);
    setCustomers(custData || []);
    setRepairs(repData || []);
    setSales(saleData || []);
    setContracts(contData || []);
    setProfiles(profData || []);
    setBills(billData || []);
    setVendorBills(vBillData || []);
    
    // Filter sales_items to only those belonging to sales in this branch
    if (sItemsData && saleData) {
      const branchSaleIds = new Set(saleData.map(s => s.id));
      setSalesItems(sItemsData.filter(si => branchSaleIds.has(si.sale_id)));
    } else {
      setSalesItems([]);
    }
  };

  // Onboarding submissions
  const handleSaveStripe = async (e) => {
    e.preventDefault();
    const supabase = createClient();
    const { error } = await supabase.from('tenants').update({ stripe_connect_id: stripeConnId }).eq('id', tenant.id);
    if (error) { alert('Error saving Stripe: ' + error.message); return; }
    setTenant({ ...tenant, stripe_connect_id: stripeConnId });
    alert('Stripe Connect referral credentials integrated successfully!');
  };

  const handleSaveSquare = async (e) => {
    e.preventDefault();
    const supabase = createClient();
    const { error } = await supabase.from('tenants').update({ square_access_token: squareToken, square_location_id: squareLocId }).eq('id', tenant.id);
    if (error) { alert('Error saving Square: ' + error.message); return; }
    setTenant({ ...tenant, square_access_token: squareToken, square_location_id: squareLocId });
    alert('Square OAuth credentials integrated successfully!');
  };

  const handleSaveDelivery = async (e) => {
    e.preventDefault();
    setIsSavingDelivery(true);
    const supabase = createClient();
    
    const deliverySettings = {
      free_delivery: isFreeDelivery,
      min_fee: parseFloat(minDeliveryFee) || 0,
      base_miles: parseFloat(baseDeliveryMiles) || 0,
      per_mile_rate: parseFloat(perMileRate) || 0
    };

    const { error } = await supabase.from('tenants').update({ delivery_settings: deliverySettings }).eq('id', tenant.id);
    setIsSavingDelivery(false);
    
    if (error) { 
      alert('Error saving Delivery Settings: ' + error.message); 
      return; 
    }
    
    setTenant({ ...tenant, delivery_settings: deliverySettings });
    alert('Delivery configuration saved successfully!');
  };

  // inventory handlers
  const handleAddInventory = async (e) => {
    e.preventDefault();
    const supabase = createClient();
    const payload = {
      tenant_id: tenant.id,
      branch_id: activeBranch.id,
      name: newItem.name,
      sku: newItem.sku,
      buy_price: parseFloat(newItem.buy_price) || 0,
      sell_price: parseFloat(newItem.sell_price) || 0,
      quantity: parseInt(newItem.quantity) || 0,
      min_stock: parseInt(newItem.min_stock) || 5,
      commission_override: newItem.commission_override ? parseFloat(newItem.commission_override) : null
    };
    const { error } = await supabase.from('inventory').insert([payload]);
    if (error) { alert('Error adding inventory: ' + error.message); return; }
    setIsNewItemModal(false);
    setNewItem({ name: '', sku: '', buy_price: '', sell_price: '', quantity: 10, min_stock: 2, commission_override: '' });
    refreshData();
  };

  // customer handlers
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    const supabase = createClient();
    
    // Auto-generate full name
    const fullName = `${newCustomer.first_name} ${newCustomer.last_name}`.trim();
    
    const payload = {
      tenant_id: tenant.id,
      title: newCustomer.title,
      name: fullName || newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone || null,
      whatsapp: newCustomer.whatsapp || null,
      dob: newCustomer.dob || null,
      address: newCustomer.address || null,
      lat: newCustomer.lat || null,
      lng: newCustomer.lng || null,
      notes: newCustomer.notes || null,
      referees: newCustomer.referees || [],
      id_documents: newCustomer.id_documents || [],
      credit_score: 100
    };
    const { error } = await supabase.from('customers').insert([payload]);
    if (error) { alert('Error adding customer: ' + error.message); return; }
    setIsNewCustomerModal(false);
    setNewCustomer({ 
      title: 'Mr', first_name: '', last_name: '', name: '', email: '', 
      phone: '', whatsapp: '', dob: '', notes: '', address: '', lat: null, lng: null, referees: [], id_documents: []
    });
    refreshData();
  };

  const handleLookupCustomerAddress = async () => {
    if (!newAddressPostcode) return alert('Please enter a postcode');
    setIsFetchingAddress(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        alert('Google Maps API key is missing.');
        setIsFetchingAddress(false);
        return;
      }
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(newAddressPostcode)}&key=${apiKey}`);
      const data = await res.json();
      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        setNewCustomer({
          ...newCustomer,
          address: result.formatted_address,
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng
        });
      } else {
        alert(`Google Maps API Error: ${data.status}`);
      }
    } catch (err) {
      alert('Error fetching address: ' + err.message);
    }
    setIsFetchingAddress(false);
  };

  // repair ticket handlers
  const handleAddRepair = async (e) => {
    e.preventDefault();
    const supabase = createClient();
    const payload = {
      tenant_id: tenant.id,
      branch_id: activeBranch.id,
      customer_id: newRepair.customer_id,
      device_type: newRepair.device_type,
      device_model: newRepair.device_model,
      device_serial: newRepair.device_serial || null,
      issue_description: newRepair.issue_description,
      estimated_cost: newRepair.estimated_cost ? parseFloat(newRepair.estimated_cost) : null,
      assigned_staff_id: newRepair.assigned_staff_id || null,
      status: 'received'
    };
    const { error } = await supabase.from('repairs').insert([payload]);
    if (error) { alert('Error adding repair: ' + error.message); return; }
    setIsNewRepairModal(false);
    setNewRepair({ customer_id: '', device_type: 'phone', device_model: '', device_serial: '', issue_description: '', estimated_cost: '', assigned_staff_id: '' });
    refreshData();
  };

  // vendor bill handlers
  const handleAddVendorBill = async (e) => {
    e.preventDefault();
    const supabase = createClient();
    const payload = {
      tenant_id: tenant.id,
      branch_id: activeBranch.id,
      vendor_name: newVendorBill.vendor_name,
      amount: parseFloat(newVendorBill.amount) || 0,
      due_date: newVendorBill.due_date,
      status: 'pending'
    };
    const { error } = await supabase.from('vendor_bills').insert([payload]);
    if (error) { alert('Error adding vendor bill: ' + error.message); return; }
    setIsNewVendorBillModal(false);
    setNewVendorBill({ vendor_name: '', amount: '', due_date: '' });
    refreshData();
  };

  // Inline table update helpers
  const handleUpdateRepairStatus = async (repairId, newStatus) => {
    const supabase = createClient();
    const { error } = await supabase.from('repairs').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', repairId);
    if (error) alert('Error updating status: ' + error.message);
    else refreshData();
  };

  const handleUpdateRepairNotes = async (repairId, notes) => {
    const supabase = createClient();
    const { error } = await supabase.from('repairs').update({ diagnostic_notes: notes, updated_at: new Date().toISOString() }).eq('id', repairId);
    if (error) alert('Error updating notes: ' + error.message);
    else refreshData();
  };

  const handleUpdateInventoryQty = async (itemId, newQty) => {
    const supabase = createClient();
    const { error } = await supabase.from('inventory').update({ quantity: newQty }).eq('id', itemId);
    if (error) alert('Error updating stock: ' + error.message);
    else refreshData();
  };

  const handlePayCustomerBill = async (billId) => {
    const supabase = createClient();
    const { error } = await supabase.from('bills').update({ status: 'paid' }).eq('id', billId);
    if (error) alert('Error paying bill: ' + error.message);
    else refreshData();
  };

  // branch handlers
  const handleAddBranch = async (e) => {
    e.preventDefault();
    const supabase = createClient();
    const { error } = await supabase.from('branches').insert([{ tenant_id: tenant.id, ...newBranch }]);
    if (error) { alert('Error adding branch: ' + error.message); return; }
    
    setIsCreatingBranch(false);
    setNewBranch({ name: '', address: '', phone: '', lat: null, lng: null });
    
    const { data: bList } = await supabase.from('branches').select('*').eq('tenant_id', tenant.id);
    if (bList) setBranches(bList);
  };

  const handleUpdateBranch = async (e) => {
    e.preventDefault();
    if (!editBranchData.name) return;
    const supabase = createClient();
    const { error } = await supabase.from('branches').update(editBranchData).eq('id', editingBranch.id);
    if (error) { alert('Error updating branch: ' + error.message); return; }
    
    const { data: bList } = await supabase.from('branches').select('*').eq('tenant_id', tenant.id);
    if (bList) {
      setBranches(bList);
      if (activeBranch.id === editingBranch.id) {
        const updated = bList.find(b => b.id === editingBranch.id);
        if (updated) setActiveBranch(updated);
      }
    }
    setEditingBranch(null);
  };

  const handleDeleteBranch = async (id) => {
    if (confirm('Are you sure you want to delete this branch?')) {
      const supabase = createClient();
      const { error } = await supabase.from('branches').delete().eq('id', id);
      if (error) { alert('Error deleting branch: ' + error.message); return; }
      
      const { data: bList } = await supabase.from('branches').select('*').eq('tenant_id', tenant.id);
      if (bList) {
        setBranches(bList);
        if (activeBranch.id === id && bList.length > 0) {
          setActiveBranch(bList[0]);
        }
      }
    }
  };

  // POS Add to Cart
  const addToCart = (item) => {
    const existing = posCart.find(c => c.id === item.id);
    if (existing) {
      if (existing.quantity >= item.quantity) {
        alert("Cannot add more than physical stock count.");
        return;
      }
      setPosCart(posCart.map(c => c.id === item.id ? { ...c, cartQty: c.cartQty + 1 } : c));
    } else {
      setPosCart([...posCart, { ...item, cartQty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setPosCart(posCart.filter(c => c.id !== id));
  };

  useEffect(() => {
    if (posDeliveryMethod !== 'delivery') {
      setPosDeliveryFee(0);
      return;
    }
    
    if (!posCustomer) return;
    
    const calculateDelivery = async () => {
      const selectedCustomer = customers.find(c => c.id === posCustomer);
      if (!selectedCustomer || !selectedCustomer.lat || !selectedCustomer.lng) {
        alert('Customer address is incomplete or missing coordinates. Cannot calculate delivery.');
        setPosDeliveryMethod('collection');
        return;
      }
      if (!activeBranch || !activeBranch.lat || !activeBranch.lng) {
        alert('Branch location is missing coordinates. Cannot calculate delivery.');
        setPosDeliveryMethod('collection');
        return;
      }
      
      const { free_delivery, min_fee, base_miles, per_mile_rate } = tenantData?.delivery_settings || { free_delivery: false, min_fee: 5, base_miles: 3, per_mile_rate: 1.5 };
      if (free_delivery) {
        setPosDeliveryFee(0);
        return;
      }
      
      setIsCalculatingDelivery(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        const origin = `${activeBranch.lat},${activeBranch.lng}`;
        const dest = `${selectedCustomer.lat},${selectedCustomer.lng}`;
        const res = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${dest}&units=imperial&key=${apiKey}`);
        const data = await res.json();
        
        if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
          const distanceText = data.rows[0].elements[0].distance.text; // e.g. "5.5 mi"
          const distanceMiles = parseFloat(distanceText.replace(/[^0-9.]/g, ''));
          
          let fee = parseFloat(min_fee) || 0;
          if (distanceMiles > (parseFloat(base_miles) || 0)) {
            const extraMiles = distanceMiles - (parseFloat(base_miles) || 0);
            fee += extraMiles * (parseFloat(per_mile_rate) || 0);
          }
          setPosDeliveryFee(Math.round(fee * 100) / 100);
        } else {
          alert('Could not calculate delivery distance.');
          setPosDeliveryFee(0);
        }
      } catch (err) {
        console.error(err);
      }
      setIsCalculatingDelivery(false);
    };
    
    calculateDelivery();
  }, [posDeliveryMethod, posCustomer, activeBranch, tenantData, customers]);

  // POS Checkout Submit
  const handlePOSCheckout = async () => {
    if (posCart.length === 0) return alert('Your cart is empty');
    if (!posCustomer) return alert('Select customer for this checkout');
    if (!posStaff) return alert('Select staff member handling the transaction');

    const cartCash = posCart.reduce((sum, item) => sum + (item.sell_price * item.cartQty), 0);
    const total = Math.max(0, cartCash - posTradeInAmount) + posDeliveryFee;
    const staffProfile = profiles.find(p => p.id === posStaff);
    const staffCommRate = staffProfile ? parseFloat(staffProfile.commission_rate) : 0;
    
    const supabase = createClient();

    let saleId = null;

    try {
      // 1. Create Sale
      const salePayload = {
        tenant_id: tenant.id,
        branch_id: activeBranch.id,
        customer_id: posCustomer,
        staff_id: posStaff,
        total_amount: total,
        payment_method: posPaymentMethod === 'rto_installments' ? 'rto_installments' : posPaymentMethod,
        payment_status: posPaymentMethod === 'rto_installments' ? 'pending' : 'paid'
      };
      
      const { data: saleRes, error: saleErr } = await supabase.from('sales').insert([salePayload]).select().single();
      if (saleErr) throw new Error('Failed to create sale: ' + saleErr.message);
      saleId = saleRes.id;

      // 2. Create Sale Items & Deduct Inventory
      const saleItemsToInsert = posCart.map(item => {
        let commEarned = 0;
        if (item.commission_override) {
          commEarned = parseFloat(item.commission_override) * item.cartQty;
        } else {
          const margin = item.sell_price - item.buy_price;
          if (margin > 0) commEarned = margin * (staffCommRate / 100) * item.cartQty;
        }
        
        return {
          sale_id: saleId,
          inventory_id: item.id,
          quantity: item.cartQty,
          unit_price: item.sell_price,
          commission_earned: commEarned
        };
      });

      const { error: itemsErr } = await supabase.from('sales_items').insert(saleItemsToInsert);
      if (itemsErr) throw new Error('Failed to insert sale items: ' + itemsErr.message);

      // Deduct inventory sequentially (could use an RPC in production)
      for (const item of posCart) {
        const newQty = item.quantity - item.cartQty;
        await supabase.from('inventory').update({ quantity: newQty }).eq('id', item.id);
      }

      if (posPaymentMethod === 'rto_installments') {
        // Rent-to-Own checkout logic
        const balance = total - rtoUpfront;
        const totalWithInterest = balance * (1 + (rtoInterest / 100));
        const installmentAmt = (totalWithInterest / rtoTermMonths);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit code

        const customerObj = customers.find(c => c.id === posCustomer);
        const agreementTxt = `HIRE-PURCHASE FINANCE AGREEMENT (UK CONSUMER RIGHTS COMPLIANT)\n\nTenant Vendor: ${tenant.name} (Branch: ${activeBranch.name})\nCustomer: ${customerObj?.name} (Email: ${customerObj?.email})\nDevice Details: ${posCart.map(i => `${i.name} [SKU: ${i.sku}]`).join(', ')}\n\n1. FINANCIAL SUMMARY\n   Total Cash Price: £${total.toFixed(2)}\n   Upfront Deposit Paid: £${rtoUpfront.toFixed(2)}\n   Principal financed: £${balance.toFixed(2)}\n   Financing Interest Rate: ${rtoInterest}% Flat Rate Markup\n   Total Amount Payable on finance: £${totalWithInterest.toFixed(2)}\n   Installment Schedule: ${rtoTermMonths} ${rtoFrequency} payments of £${installmentAmt.toFixed(2)} each.\n\n2. PROPERTY RETENTION\n   The device remains the physical property of ${tenant.name} until all installments are paid in full.\n   In case of default, the vendor reserves the right to recover the device and chase unpaid bills under UK small claims court.`;

        const contractPayload = {
          tenant_id: tenant.id,
          branch_id: activeBranch.id,
          customer_id: posCustomer,
          sale_id: saleId,
          upfront_amount: rtoUpfront,
          financed_amount: balance,
          interest_rate: rtoInterest,
          frequency: rtoFrequency,
          total_installments: rtoTermMonths,
          installment_amount: installmentAmt,
          agreement_text: agreementTxt,
          verification_code: verificationCode,
          status: 'draft'
        };

        const { data: contractRes, error: contractErr } = await supabase.from('contracts').insert([contractPayload]).select().single();
        if (contractErr) throw new Error('Failed to generate contract: ' + contractErr.message);

        setRtoDispatchedModal({
          contractId: contractRes.id,
          email: customerObj.email,
          pin: verificationCode
        });

      } else {
        alert('Checkout completed successfully and inventory levels updated!');
      }
    } catch (err) {
      alert(err.message);
      return;
    }

    setPosCart([]);
    setPosCustomer('');
    setPosStaff('');
    setPosPaymentMethod('card');
    setPosDeliveryMethod('collection');
    setPosTradeInAmount(0);
    setPosDeliveryFee(0);
    
    alert('Sale Transaction Completed Successfully! Receipt ID: ' + saleId);
    refreshData();
  };

  const handleUpdateCommission = async (e) => {
    e.preventDefault();
    if (!selectedStaffId || !customCommissionRate) return;
    const supabase = createClient();
    const { error } = await supabase.from('profiles').update({ commission_rate: parseFloat(customCommissionRate) }).eq('id', selectedStaffId);
    if (error) { alert('Error updating commission: ' + error.message); return; }
    alert('Staff commission settings updated successfully.');
    setSelectedStaffId('');
    setCustomCommissionRate('');
    refreshData();
  };

  if (!tenant || !activeBranch) return <div style={{ color: 'var(--text-secondary)', padding: '2rem' }}>Loading Workspace...</div>;

  // Metric Math calculations
  const totalSalesVolume = sales.reduce((acc, curr) => acc + curr.total_amount, 0);
  const activeRepairCount = repairs.filter(r => r.status !== 'picked_up' && r.status !== 'cancelled').length;
  const overdueBillsVolume = bills.filter(b => b.status === 'overdue').reduce((acc, c) => acc + c.amount, 0);
  const lowStockAlertCount = inventory.filter(i => i.quantity <= i.min_stock).length;

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'var(--nav-orange)', color: '#ffffff' }}>
            <Laptop size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '800', color: '#ffffff', letterSpacing: '0.02em' }}>{tenant.name.toUpperCase()}</h1>
            <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '600', letterSpacing: '0.05em' }}>SAAS CRM & POS</span>
          </div>
        </div>

        <ul className="nav-menu" style={{ marginTop: '2rem' }}>
          <li>
            <button className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              <div className="nav-link-content"><BarChart3 size={18} /> Dashboard</div>
            </button>
          </li>
          <li>
            <button className={`nav-link ${activeTab === 'pos' ? 'active' : ''}`} onClick={() => setActiveTab('pos')}>
              <div className="nav-link-content"><ShoppingCart size={18} /> POS Checkout</div>
              <ChevronRight size={14} style={{ opacity: 0.5 }} />
            </button>
          </li>
          <li>
            <button className={`nav-link ${activeTab === 'repairs' ? 'active' : ''}`} onClick={() => setActiveTab('repairs')}>
              <div className="nav-link-content"><Wrench size={18} /> Repairs & Service</div>
              <ChevronRight size={14} style={{ opacity: 0.5 }} />
            </button>
          </li>
          <li>
            <button className={`nav-link ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
              <div className="nav-link-content"><Layers size={18} /> Stock Inventory</div>
              <ChevronRight size={14} style={{ opacity: 0.5 }} />
            </button>
          </li>
          <li>
            <button className={`nav-link ${activeTab === 'billing' ? 'active' : ''}`} onClick={() => setActiveTab('billing')}>
              <div className="nav-link-content"><Receipt size={18} /> Bills & Accounts</div>
              <ChevronRight size={14} style={{ opacity: 0.5 }} />
            </button>
          </li>
          <li>
            <button className={`nav-link ${activeTab === 'commissions' ? 'active' : ''}`} onClick={() => setActiveTab('commissions')}>
              <div className="nav-link-content"><Users size={18} /> Staff Commissions</div>
              <ChevronRight size={14} style={{ opacity: 0.5 }} />
            </button>
          </li>
          <li>
            <button className="nav-link" onClick={() => setIsBusinessSettingsOpen(!isBusinessSettingsOpen)}>
              <div className="nav-link-content"><Settings2 size={18} /> Business Settings</div>
              {isBusinessSettingsOpen ? <ChevronDown size={14} style={{ opacity: 0.5 }} /> : <ChevronRight size={14} style={{ opacity: 0.5 }} />}
            </button>
            
            {isBusinessSettingsOpen && (
              <ul style={{ listStyle: 'none', margin: '0.25rem 0 0 1.5rem', padding: '0', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <li>
                  <button className={`nav-link ${activeTab === 'branches' ? 'active' : ''}`} onClick={() => setActiveTab('branches')} style={{ padding: '0.6rem 1rem', fontSize: '0.8rem' }}>
                    <div className="nav-link-content"><Building2 size={16} /> Store Branches</div>
                  </button>
                </li>
                <li>
                  <button className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')} style={{ padding: '0.6rem 1rem', fontSize: '0.8rem' }}>
                    <div className="nav-link-content"><DollarSign size={16} /> Payment Gateways</div>
                  </button>
                </li>
                <li>
                  <button className={`nav-link ${activeTab === 'delivery_setup' ? 'active' : ''}`} onClick={() => setActiveTab('delivery_setup')} style={{ padding: '0.6rem 1rem', fontSize: '0.8rem' }}>
                    <div className="nav-link-content"><Truck size={16} /> Delivery Setup</div>
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </aside>

      {/* Main Panel Content */}
      <main className="main-content">
        <header className="header-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-base)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <ChevronLeft size={16} />
            </button>
          </div>
          
          <div style={{ position: 'relative', width: '280px' }}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              style={{ width: '100%', background: 'var(--bg-surface-solid)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', cursor: 'pointer', boxShadow: 'var(--card-shadow)', transition: 'var(--transition-smooth)' }}
            >
              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '0.02em', textTransform: 'capitalize', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{currentUser?.name || 'Loading...'}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--nav-orange)', fontWeight: '800', marginTop: '0.1rem', textTransform: 'capitalize', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{activeBranch?.name}</span>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0A1128', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.1rem', flexShrink: 0, overflow: 'hidden' }}>
                {currentUser?.avatar_url ? (
                  <img src={currentUser.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  currentUser?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'
                )}
              </div>
            </button>

            {isProfileOpen && (
              <div className="profile-dropdown-card" style={{ width: '280px', right: 0 }}>
                <div className="profile-avatar-large" style={{ overflow: 'hidden' }}>
                  {currentUser?.avatar_url ? (
                    <img src={currentUser.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    currentUser?.name?.charAt(0) || 'U'
                  )}
                </div>
                <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.15rem' }}>{currentUser?.name || 'Loading...'}</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{activeBranch.name}</span>
                <span className="badge badge-info" style={{ marginBottom: '1.5rem' }}>{currentUser?.role?.replace('_', ' ') || 'Staff'}</span>
                
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <button className="dropdown-action-btn" onClick={() => { setIsProfileOpen(false); setIsSwitchStoreModalOpen(true); }}>
                    <Building2 size={16} /> Switch Store
                  </button>
                  <button className="dropdown-action-btn" onClick={() => { setIsProfileOpen(false); setActiveTab('profile'); }}>
                    <User size={16} /> Profile Settings
                  </button>
                  <button className="dropdown-action-btn danger" onClick={async () => {
                    const supabase = createClient();
                    await supabase.auth.signOut();
                    router.push('/');
                  }}>
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="container">

          {/* Tab: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.75rem', margin: '0 0 0.5rem 0' }}>Profile Settings</h2>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Manage your account details, contact info, and security.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* Personal Information Card (Read Only) */}
                <div className="glass-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', margin: 0 }}><User size={20} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '0.5rem' }} />Personal Information</h3>
                    <button type="button" onClick={() => setIsEditPersonalInfoModalOpen(true)} style={{ background: 'var(--primary-glow)', border: '1px solid var(--primary)', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: '0.4rem 0.8rem', fontWeight: '600' }}>
                      <Edit3 size={14} /> Edit Info
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div className="profile-avatar-large" style={{ margin: 0, width: '80px', height: '80px', fontSize: '2rem', overflow: 'hidden' }}>
                      {profileAvatarUrl ? (
                        <img src={profileAvatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        currentUser?.name?.charAt(0) || 'U'
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 0.25rem 0', fontWeight: '700', fontSize: '1.2rem', color: 'var(--text-primary)' }}>{profileTitle} {profileFirstName} {profileLastName}</p>
                      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600' }}>{currentUser?.role?.replace('_', ' ').toUpperCase() || 'STAFF'}</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>Email Address</span>
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '1rem' }}>{currentUser?.email || '-'}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>Date of Birth</span>
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '1rem' }}>{profileDob ? new Date(profileDob).toLocaleDateString('en-GB') : '-'}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>Mobile Number</span>
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '1rem' }}>{profileMobile || '-'}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>WhatsApp Number</span>
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '1rem' }}>{profileWhatsapp || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* Addresses Card */}
                <div className="glass-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', margin: 0 }}><MapPin size={20} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '0.5rem' }} />Saved Addresses</h3>
                    <button type="button" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => setIsAddressModalOpen(true)}>
                      <Plus size={16} /> Add Address
                    </button>
                  </div>
                  
                  {profileAddresses.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed var(--border-color)', borderRadius: '12px', color: 'var(--text-muted)' }}>
                      <Map size={32} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                      <p>No addresses saved yet.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {profileAddresses.map(addr => (
                        <div key={addr.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-base)' }}>
                          <div>
                            <p style={{ margin: '0 0 0.25rem 0', fontWeight: '600' }}>{addr.door} {addr.postcode}</p>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{addr.full_address}</p>
                          </div>
                          <button type="button" onClick={() => handleRemoveAddress(addr.id)} style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', padding: '0.25rem' }}>
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Security Card */}
                <form onSubmit={handleSaveSecurity} className="glass-card" style={{ border: '1px solid rgba(238, 93, 80, 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--accent-rose)' }}><Lock size={20} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '0.5rem' }} />Security & Password</h3>
                    <button type="button" onClick={handleForgotPassword} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}>
                      Forgot Password?
                    </button>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', maxWidth: '400px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Current Password <span style={{ color: 'var(--accent-rose)' }}>*</span></label>
                      <input type="password" className="input-field" value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="Enter current password to make changes" />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">New Password</label>
                      <input type="password" className="input-field" value={profilePassword} onChange={e => setProfilePassword(e.target.value)} placeholder="Enter new password" />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Confirm New Password</label>
                      <input type="password" className="input-field" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginTop: '-0.5rem' }}>Leave New Password blank if you only want to update other profile details.</span>
                  </div>
                  <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary" disabled={isUpdatingProfile || !oldPassword || !profilePassword} style={{ background: 'var(--accent-rose)' }}>
                      {isUpdatingProfile ? 'Saving...' : 'Update Password'}
                    </button>
                  </div>
                </form>

              </div>
            </div>
          )}

          
          {/* Personal Info Edit Modal */}
          {isEditPersonalInfoModalOpen && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
              <div className="glass-card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border-color)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Edit3 size={24} color="var(--primary)" /> Edit Personal Info</h3>
                  <button type="button" onClick={() => setIsEditPersonalInfoModalOpen(false)} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={16} /></button>
                </div>
                
                <form onSubmit={handleSavePersonalInfo} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  {/* Avatar Upload in Modal */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--bg-surface)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div className="profile-avatar-large" style={{ margin: 0, width: '60px', height: '60px', fontSize: '1.5rem', overflow: 'hidden', position: 'relative', cursor: 'pointer' }} onClick={() => document.getElementById('modal-avatar-upload').click()}>
                      {profileAvatarUrl ? (
                        <img src={profileAvatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        currentUser?.name?.charAt(0) || 'U'
                      )}
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '0.5rem', textAlign: 'center', padding: '0.2rem 0' }}>{isUploadingAvatar ? '...' : 'EDIT'}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>Update Profile Picture</p>
                      <input type="file" id="modal-avatar-upload" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
                      <button type="button" className="btn btn-secondary" onClick={() => document.getElementById('modal-avatar-upload').click()} disabled={isUploadingAvatar} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                        <UploadCloud size={14} /> {isUploadingAvatar ? 'Uploading...' : 'Choose Image'}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="form-group" style={{ marginBottom: 0, position: 'relative' }}>
                      <label className="form-label">Title</label>
                      <div 
                        onClick={() => setIsTitleDropdownOpen(!isTitleDropdownOpen)}
                        style={{ padding: '0.75rem', background: 'var(--bg-base)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '42px' }}
                      >
                        <span>{profileTitle || 'Select Title'}</span>
                        <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
                      </div>
                      {isTitleDropdownOpen && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-surface-solid)', border: '1px solid var(--border-color)', borderRadius: '8px', marginTop: '0.25rem', zIndex: 10, boxShadow: 'var(--card-shadow)', overflow: 'hidden' }}>
                          {['Mr', 'Mrs', 'Ms', 'Miss', 'Dr'].map(title => (
                            <div 
                              key={title} 
                              onClick={() => { setProfileTitle(title); setIsTitleDropdownOpen(false); }}
                              style={{ padding: '0.75rem 1rem', cursor: 'pointer', transition: 'background 0.2s', color: 'var(--text-primary)' }}
                              onMouseEnter={(e) => e.target.style.background = 'var(--bg-base)'}
                              onMouseLeave={(e) => e.target.style.background = 'transparent'}
                            >
                              {title}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Date of Birth</label>
                      <div style={{ position: 'relative' }}>
                        <input 
                          type="date" 
                          className="input-field" 
                          value={profileDob} 
                          onChange={e => setProfileDob(e.target.value)} 
                          style={{ 
                            colorScheme: 'dark', 
                            paddingRight: '2.5rem',
                            fontFamily: 'inherit',
                            cursor: 'pointer'
                          }} 
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">First Name</label>
                      <input type="text" className="input-field" value={profileFirstName} onChange={e => setProfileFirstName(e.target.value)} required />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Last Name</label>
                      <input type="text" className="input-field" value={profileLastName} onChange={e => setProfileLastName(e.target.value)} required />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Mobile Number</label>
                      <input type="tel" className="input-field" value={profileMobile} onChange={e => setProfileMobile(e.target.value)} placeholder="+44 7700 900000" />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">WhatsApp Number</label>
                      <input type="tel" className="input-field" value={profileWhatsapp} onChange={e => setProfileWhatsapp(e.target.value)} placeholder="+44 7700 900000" />
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                    <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsEditPersonalInfoModalOpen(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={isUpdatingProfile}>
                      <Save size={16} /> {isUpdatingProfile ? 'Saving...' : 'Save Personal Info'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Address Modal */}
          {isAddressModalOpen && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
              <div className="glass-card" style={{ width: '100%', maxWidth: '400px', margin: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Add New Address</h3>
                  <button type="button" onClick={() => setIsAddressModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={20} /></button>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Postcode / Zip Code</label>
                  <input type="text" className="input-field" value={newAddressPostcode} onChange={e => setNewAddressPostcode(e.target.value)} placeholder="e.g. SW1A 1AA" />
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsAddressModalOpen(false)}>Cancel</button>
                  <button type="button" className="btn btn-primary" style={{ flex: 2 }} onClick={handleLookupAddress} disabled={isFetchingAddress || !newAddressPostcode}>
                    {isFetchingAddress ? 'Searching...' : 'Search'}
                  </button>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem', margin: '1rem 0 0 0' }}>
                  Uses Google Maps API to fetch precise location.
                </p>
              </div>
            </div>
          )}

          
          {/* Tab 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              <div className="dashboard-grid">
                <div className="glass-card metric-card">
                  <div className="metric-title">TOTAL SALES VALUE ({activeBranch.name})</div>
                  <div className="metric-value">£{totalSalesVolume.toFixed(2)}</div>
                  <div className="metric-trend trend-up"><DollarSign size={14} /> Branch POS revenue ledger</div>
                </div>

                <div className="glass-card metric-card">
                  <div className="metric-title">ACTIVE REPAIR TICKETS</div>
                  <div className="metric-value">{activeRepairCount}</div>
                  <div className="metric-trend trend-up" style={{ color: 'var(--accent-cyan)' }}><Wrench size={14} /> Diagnostics & assemblies</div>
                </div>

                <div className="glass-card metric-card">
                  <div className="metric-title">LOW STOCK ITEMS</div>
                  <div className="metric-value" style={{ color: lowStockAlertCount > 0 ? 'var(--accent-rose)' : 'inherit' }}>{lowStockAlertCount}</div>
                  <div className={`metric-trend ${lowStockAlertCount > 0 ? 'trend-down' : 'trend-up'}`}>
                    <AlertTriangle size={14} /> Below threshold stock levels
                  </div>
                </div>

                <div className="glass-card metric-card">
                  <div className="metric-title">UNPAID CUSTOMER BILLS</div>
                  <div className="metric-value">£{overdueBillsVolume.toFixed(2)}</div>
                  <div className="metric-trend trend-down"><Receipt size={14} /> Due to receive</div>
                </div>
              </div>

              {/* Bottom detail lists split */}
              <div className="grid-cols-2">
                <div className="glass-card">
                  <h3>Recent Sales Items</h3>
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Sale ID</th>
                          <th>Total</th>
                          <th>Method</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sales.slice(-5).map(s => (
                          <tr key={s.id}>
                            <td><code>{s.id.substr(0,8)}</code></td>
                            <td>£{s.total_amount.toFixed(2)}</td>
                            <td><span className="badge badge-info">{s.payment_method}</span></td>
                            <td><span className={`badge ${s.payment_status === 'paid' ? 'badge-success' : 'badge-warning'}`}>{s.payment_status}</span></td>
                          </tr>
                        ))}
                        {sales.length === 0 && (
                          <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No sales transactions found</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="glass-card">
                  <h3>Active Repair Status</h3>
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Device</th>
                          <th>Problem</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {repairs.slice(-5).map(r => (
                          <tr key={r.id}>
                            <td>{r.device_model}</td>
                            <td>{r.issue_description}</td>
                            <td><span className="badge badge-warning">{r.status}</span></td>
                          </tr>
                        ))}
                        {repairs.length === 0 && (
                          <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No repair tickets registered</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: POS CHECKOUT */}
          {activeTab === 'pos' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '2rem', alignItems: 'start' }}>
              
              {/* POS Left: Inventory selection */}
              <div className="glass-card">
                <h3>Select Items to Sell</h3>
                <p className="subtitle">Physical store inventory at {activeBranch.name}</p>
                
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.map(item => (
                        <tr key={item.id}>
                          <td>
                            <strong>{item.name}</strong><br/>
                            <code style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SKU: {item.sku}</code>
                          </td>
                          <td>£{item.sell_price.toFixed(2)}</td>
                          <td>{item.quantity}</td>
                          <td>
                            <button 
                              className="btn btn-secondary" 
                              style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                              onClick={() => addToCart(item)}
                              disabled={item.quantity === 0}
                            >
                              Add
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* POS Right: Shopping Cart and Checkout configurations */}
              <div className="glass-card" style={{ position: 'sticky', top: '2rem' }}>
                <h3>POS Checkout Terminal</h3>
                <p className="subtitle">Customer purchase configuration & billing</p>
                
                {posCart.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                    <ShoppingCart size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                    <p>Select products from inventory to begin checkout</p>
                  </div>
                ) : (
                  <div>
                    {/* Cart Items List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                      {posCart.map(c => (
                        <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
                          <div>
                            <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{c.name}</span><br/>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>£{c.sell_price.toFixed(2)} x {c.cartQty}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontWeight: '600' }}>£{(c.sell_price * c.cartQty).toFixed(2)}</span>
                            <button className="btn btn-danger" style={{ padding: '0.25rem', borderRadius: '4px' }} onClick={() => removeFromCart(c.id)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {(posTradeInAmount > 0 || posDeliveryFee > 0) && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontSize: '1rem', color: 'var(--text-muted)' }}>
                          <span>SUBTOTAL:</span>
                          <span>£{posCart.reduce((sum, item) => sum + (item.sell_price * item.cartQty), 0).toFixed(2)}</span>
                        </div>
                      )}
                      {posTradeInAmount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontSize: '1rem', color: 'var(--accent-green)' }}>
                          <span>TRADE-IN APPLIED:</span>
                          <span>-£{posTradeInAmount.toFixed(2)}</span>
                        </div>
                      )}
                      {posDeliveryFee > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontSize: '1rem', color: 'var(--text-secondary)' }}>
                          <span>DELIVERY FEE:</span>
                          <span>+£{posDeliveryFee.toFixed(2)}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', fontSize: '1.1rem', fontWeight: '700', borderTop: (posTradeInAmount > 0 || posDeliveryFee > 0) ? '1px solid var(--border-color)' : 'none' }}>
                        <span>TOTAL PAYABLE:</span>
                        <span>£{(Math.max(0, posCart.reduce((sum, item) => sum + (item.sell_price * item.cartQty), 0) - posTradeInAmount) + posDeliveryFee).toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Section 1: Transaction Parties */}
                    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '1rem' }}>
                      <h4 style={{ margin: '0 0 1rem 0', color: 'var(--nav-orange)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={16} /> 1. Transaction Parties
                      </h4>
                      <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                        <label className="form-label" style={{ fontSize: '0.8rem' }}>Assign Customer</label>
                        <select className="select-field" value={posCustomer} onChange={e => setPosCustomer(e.target.value)}>
                          <option value="">-- Choose Customer --</option>
                          {customers.map(c => (
                            <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.8rem' }}>Sales Attendant (For Commission)</label>
                        <select className="select-field" value={posStaff} onChange={e => setPosStaff(e.target.value)}>
                          <option value="">-- Choose Attendant --</option>
                          {profiles.filter(p => p.role !== 'customer').map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Section 2: Delivery & Fulfillment */}
                    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '1rem' }}>
                      <h4 style={{ margin: '0 0 1rem 0', color: 'var(--nav-orange)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Truck size={16} /> 2. Delivery & Fulfillment
                      </h4>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.8rem' }}>Fulfillment Method</label>
                        <select className="select-field" value={posDeliveryMethod} onChange={e => setPosDeliveryMethod(e.target.value)}>
                          <option value="collection">In-Store Collection</option>
                          <option value="delivery">Local Delivery (Auto-calculated fee)</option>
                        </select>
                      </div>
                      {posDeliveryMethod === 'delivery' && (
                        <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'rgba(var(--nav-orange-rgb),0.05)', border: '1px solid rgba(var(--nav-orange-rgb),0.2)', borderRadius: '6px', fontSize: '0.8rem' }}>
                          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Delivery Fee will be auto-calculated upon checkout based on the customer's postcode and business delivery settings.</p>
                        </div>
                      )}
                    </div>

                    {/* Section 3: Trade-In */}
                    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '1rem' }}>
                      <h4 style={{ margin: '0 0 1rem 0', color: 'var(--nav-orange)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <RefreshCcw size={16} /> 3. Trade-In Discount
                      </h4>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.8rem' }}>Agreed Trade-In Value (£)</label>
                        <input 
                          type="number" 
                          step="0.01" 
                          className="input-field" 
                          value={posTradeInAmount} 
                          onChange={e => setPosTradeInAmount(parseFloat(e.target.value) || 0)} 
                          placeholder="e.g. 150.00"
                        />
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>This amount will be deducted from the total balance.</span>
                      </div>
                    </div>

                    {/* Section 4: Payment Method */}
                    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '1rem' }}>
                      <h4 style={{ margin: '0 0 1rem 0', color: 'var(--nav-orange)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CreditCard size={16} /> 4. Payment Method
                      </h4>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <select className="select-field" value={posPaymentMethod} onChange={e => setPosPaymentMethod(e.target.value)}>
                          <option value="card">Credit/Debit Card (Direct POS)</option>
                          <option value="cash">Cash (Direct POS)</option>
                          <option value="rto_installments">Rent-To-Own (Financing Contract)</option>
                        </select>
                      </div>
                    </div>


                    {/* Rent-to-own Options */}
                    {posPaymentMethod === 'rto_installments' && (
                      <div className="glass-card" style={{ background: 'rgba(255,255,255,0.02)', margin: '1rem 0' }}>
                        <h4>Rent-to-Own Financing Setup</h4>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                          <div className="form-group">
                            <label className="form-label">Upfront Deposit (£)</label>
                            <input 
                              type="number" 
                              className="input-field" 
                              value={rtoUpfront} 
                              onChange={e => setRtoUpfront(parseFloat(e.target.value) || 0)} 
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label">Installment Term</label>
                            <select className="select-field" value={rtoTermMonths} onChange={e => setRtoTermMonths(parseInt(e.target.value))}>
                              <option value="3">3 Months</option>
                              <option value="6">6 Months</option>
                              <option value="12">12 Months</option>
                              <option value="24">24 Months</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label className="form-label">Payment Frequency</label>
                            <select className="select-field" value={rtoFrequency} onChange={e => setRtoFrequency(e.target.value)}>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                              <option value="quarterly">Quarterly</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label className="form-label">Flat Interest Mark-up (%)</label>
                            <input 
                              type="number" 
                              className="input-field" 
                              value={rtoInterest} 
                              onChange={e => setRtoInterest(parseFloat(e.target.value) || 0)} 
                            />
                          </div>
                        </div>

                        {/* Instant breakdown calculation visualization */}
                        {(() => {
                          const cash = Math.max(0, posCart.reduce((sum, item) => sum + (item.sell_price * item.cartQty), 0) - posTradeInAmount);
                          const balance = Math.max(0, cash - rtoUpfront);
                          const totalInt = balance * (rtoInterest / 100);
                          const dueFinance = balance + totalInt;
                          const perInstallment = rtoTermMonths > 0 ? (dueFinance / rtoTermMonths) : 0;
                          return (
                            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontSize: '0.85rem' }}>
                              <p>Financed Amount (After Deposit & Trade-In): <strong>£{balance.toFixed(2)}</strong></p>
                              <p>Markup Interest ({rtoInterest}%): <strong>£{totalInt.toFixed(2)}</strong></p>
                              <p>Total Installment Debt: <strong>£{dueFinance.toFixed(2)}</strong></p>
                              <p style={{ color: 'var(--accent-amber)', fontWeight: '600', marginTop: '0.4rem' }}>
                                Payment: {rtoTermMonths} {rtoFrequency} installments of <strong>£{perInstallment.toFixed(2)}</strong>
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    <button className="btn btn-success" onClick={handlePOSCheckout} style={{ width: '100%', marginTop: '1rem' }}>
                      <CheckCircle2 size={18} /> Complete Sale Transaction
                    </button>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* Tab 3: REPAIRS */}
          {activeTab === 'repairs' && (
            <div className="glass-card">
              <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                <div>
                  <h3>Repairs & Diagnostics Tickets</h3>
                  <p className="subtitle">Service management pipeline for electronics maintenance</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsNewRepairModal(true)}>
                  <Plus size={18} /> Create Repair Ticket
                </button>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Customer</th>
                      <th>Device Model</th>
                      <th>IMEI/Serial</th>
                      <th>Reported Issue</th>
                      <th>Status</th>
                      <th>Assigned</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {repairs.map(r => {
                      const customer = customers.find(c => c.id === r.customer_id);
                      const staff = profiles.find(p => p.id === r.assigned_staff_id);
                      return (
                        <tr key={r.id}>
                          <td><code>{r.id.substr(0, 8)}</code></td>
                          <td>
                            <strong>{customer?.name}</strong><br/>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{customer?.phone}</span>
                          </td>
                          <td>{r.device_model}</td>
                          <td><code>{r.device_serial || 'N/A'}</code></td>
                          <td>{r.issue_description}</td>
                          <td>
                            <select 
                              className="select-field"
                              value={r.status}
                              onChange={(e) => handleUpdateRepairStatus(r.id, e.target.value)}
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                            >
                              <option value="received">Received</option>
                              <option value="diagnosing">Diagnosing</option>
                              <option value="waiting_parts">Waiting Parts</option>
                              <option value="repairing">Repairing</option>
                              <option value="ready">Ready for Pickup</option>
                              <option value="picked_up">Picked Up</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td>{staff ? staff.name : 'Unassigned'}</td>
                          <td>
                            <button 
                              className="btn btn-secondary" 
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                              onClick={() => {
                                const note = prompt('Update diagnostics/parts usage notes:', r.diagnostic_notes || '');
                                if (note !== null) {
                                  handleUpdateRepairNotes(r.id, note);
                                }
                              }}
                            >
                              Notes
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 4: INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="glass-card">
              <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                <div>
                  <h3>Stock & Inventory Ledger</h3>
                  <p className="subtitle">Manage items, buy/sell ratios, and commissions overrides</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsNewItemModal(true)}>
                  <Plus size={18} /> Add Stock Item
                </button>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product Info</th>
                      <th>SKU</th>
                      <th>Buy Price</th>
                      <th>Sell Price</th>
                      <th>Margin</th>
                      <th>Quantity</th>
                      <th>Min Alert</th>
                      <th>Commission Override</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map(item => {
                      const margin = item.sell_price - item.buy_price;
                      return (
                        <tr key={item.id}>
                          <td><strong>{item.name}</strong></td>
                          <td><code>{item.sku}</code></td>
                          <td>£{item.buy_price.toFixed(2)}</td>
                          <td>£{item.sell_price.toFixed(2)}</td>
                          <td style={{ color: 'var(--accent-emerald)', fontWeight: '600' }}>£{margin.toFixed(2)}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span>{item.quantity}</span>
                              <button 
                                className="btn btn-secondary" 
                                style={{ padding: '0.1rem 0.4rem', fontSize: '0.8rem' }}
                                onClick={() => {
                                  const newQty = prompt('Set physical quantity count:', item.quantity);
                                  if (newQty !== null && !isNaN(parseInt(newQty))) {
                                    handleUpdateInventoryQty(item.id, parseInt(newQty));
                                  }
                                }}
                              >
                                Edit
                              </button>
                            </div>
                          </td>
                          <td>{item.min_stock}</td>
                          <td>{item.commission_override ? `£${parseFloat(item.commission_override).toFixed(2)} (Fixed)` : 'Profile Default'}</td>
                          <td>
                            {item.quantity <= item.min_stock && (
                              <span className="badge badge-danger">Restock</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 5: BILLING & ACCOUNTS */}
          {activeTab === 'billing' && (
            <div className="grid-cols-2">
              {/* Bills Receivable */}
              <div className="glass-card">
                <h3>Bills to Receive (Customer Accounts)</h3>
                <p className="subtitle">Outstanding payments due to the shop</p>

                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bills.map(b => {
                        const customer = customers.find(c => c.id === b.customer_id);
                        return (
                          <tr key={b.id}>
                            <td>
                              <strong>{customer?.name}</strong><br/>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{customer?.email}</span>
                            </td>
                            <td>£{b.amount.toFixed(2)}</td>
                            <td>{b.due_date}</td>
                            <td><span className={`badge ${b.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>{b.status}</span></td>
                            <td>
                              {b.status !== 'paid' && (
                                <button 
                                  className="btn btn-success" 
                                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                                  onClick={() => handlePayCustomerBill(b.id)}
                                >
                                  Mark Paid
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Vendor Bills Payable */}
              <div className="glass-card">
                <div className="flex-between">
                  <h3>Bills to Pay (Vendor Expenses)</h3>
                  <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => setIsNewVendorBillModal(true)}>
                    <Plus size={14} /> Add Vendor Bill
                  </button>
                </div>
                <p className="subtitle" style={{ marginTop: '0.5rem' }}>Outgoings for parts, licenses, and rent</p>

                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Vendor Name</th>
                        <th>Amount</th>
                        <th>Due Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendorBills.map(vb => (
                        <tr key={vb.id}>
                          <td><strong>{vb.vendor_name}</strong></td>
                          <td>£{vb.amount.toFixed(2)}</td>
                          <td>{vb.due_date}</td>
                          <td><span className={`badge ${vb.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>{vb.status}</span></td>
                        </tr>
                      ))}
                      {vendorBills.length === 0 && (
                        <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No vendor bills registered</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: STAFF COMMISSIONS */}
          {activeTab === 'commissions' && (
            <div>
              <div className="glass-card" style={{ marginBottom: '2rem' }}>
                <h3>Staff Configurations & Commission Settings</h3>
                <p className="subtitle">Set default commission rates percentage by staff member individually</p>
                
                <form onSubmit={handleUpdateCommission} className="flex-row-gap" style={{ flexWrap: 'wrap' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <select 
                      className="select-field"
                      value={selectedStaffId}
                      onChange={e => setSelectedStaffId(e.target.value)}
                      required
                    >
                      <option value="">-- Select Attendant --</option>
                      {profiles.filter(p => p.role !== 'customer').map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <input 
                      type="number" 
                      className="input-field" 
                      placeholder="e.g. 7.5 (%)"
                      step="0.1"
                      value={customCommissionRate}
                      onChange={e => setCustomCommissionRate(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">Update Settings</button>
                </form>
              </div>

              <div className="glass-card">
                <h3>Commissions Ledger & Ledger Reports</h3>
                <p className="subtitle">Real-time reports for staff sales transaction payouts</p>
                
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Staff Member</th>
                        <th>Role</th>
                        <th>Standard Commission %</th>
                        <th>Total Volume Sold</th>
                        <th>Commissions Earned</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profiles.filter(p => p.role !== 'customer').map(staff => {
                        // Calculate total sales volume handled by this staff
                        const staffSales = sales.filter(s => s.staff_id === staff.id);
                        const volume = staffSales.reduce((acc, curr) => acc + curr.total_amount, 0);
                        
                        // Calculate total commission earned from items
                        // Fetch all sale IDs for sales handled by this staff member
                        const saleIds = new Set(staffSales.map(s => s.id));
                        
                        // Filter salesItems to only those attached to this staff's sales
                        const staffItems = salesItems.filter(item => saleIds.has(item.sale_id));
                        
                        // Sum up the commission earned
                        const totalComm = staffItems.reduce((sum, item) => sum + parseFloat(item.commission_earned), 0);

                        return (
                          <tr key={staff.id}>
                            <td><strong>{staff.name}</strong><br/><code>{staff.email}</code></td>
                            <td><span className="badge badge-info">{staff.role}</span></td>
                            <td>{staff.commission_rate}%</td>
                            <td>£{volume.toFixed(2)}</td>
                            <td style={{ color: 'var(--accent-emerald)', fontWeight: '600' }}>£{totalComm.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 7: STORE BRANCHES */}
          {activeTab === 'branches' && (
            <div className="glass-card">
              {isCreatingBranch ? (
                <div>
                  <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                    <div>
                      <h3>Create New Branch</h3>
                      <p className="subtitle">Set up a new operational location</p>
                    </div>
                    <button className="btn btn-secondary" onClick={() => setIsCreatingBranch(false)}>
                      <ChevronLeft size={18} style={{ marginRight: '0.5rem' }} /> Back to Branches
                    </button>
                  </div>
                  
                  <form onSubmit={handleAddBranch} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem' }}>
                    
                    {/* General Information Section */}
                    <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-base)' }}>
                      <h4 style={{ margin: '0 0 1rem 0' }}>General Information</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        <div className="form-group">
                          <label className="form-label">Branch Name *</label>
                          <input type="text" className="input-field" value={newBranch.name} onChange={e => setNewBranch({...newBranch, name: e.target.value})} placeholder="e.g. Orpington Store" required />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Phone Number</label>
                          <input type="text" className="input-field" value={newBranch.phone} onChange={e => setNewBranch({...newBranch, phone: e.target.value})} placeholder="e.g. 02082596543" />
                        </div>
                      </div>
                    </div>

                    {/* Location Section */}
                    <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>
                      <div className="flex-between" style={{ marginBottom: '1rem' }}>
                        <h4 style={{ margin: 0 }}>Location</h4>
                      </div>
                      
                      {!newBranch.address ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '2.5rem', gap: '1rem', background: 'var(--bg-card)' }}>
                          <div style={{ background: 'var(--bg-base)', padding: '1rem', borderRadius: '50%', border: '1px solid var(--border-color)' }}>
                            <MapPin size={32} style={{ color: 'var(--text-secondary)' }} />
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>No Address Selected</h5>
                            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '300px' }}>Search for a postcode to automatically fetch and save the store's geographic location.</p>
                          </div>
                          <button type="button" className="btn btn-secondary" onClick={() => { setBranchAddressTarget('new'); setIsBranchAddressModalOpen(true); }} style={{ marginTop: '0.5rem' }}>
                            <MapPin size={16} style={{ marginRight: '0.5rem' }} /> Add Address
                          </button>
                        </div>
                      ) : (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid var(--primary)', borderRadius: '8px', padding: '1.5rem', background: 'var(--primary-glow)' }}>
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flex: 1 }}>
                            <div style={{ background: 'var(--primary)', padding: '0.75rem', borderRadius: '50%', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                              <MapPin size={24} />
                            </div>
                            <div>
                              <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Branch Address</h5>
                              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.5, fontSize: '0.95rem' }}>{newBranch.address}</p>
                              {newBranch.lat && newBranch.lng && (
                                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600' }}>
                                  ✓ Coordinates captured successfully
                                </p>
                              )}
                            </div>
                          </div>
                          <button type="button" className="btn btn-secondary" style={{ marginTop: '1.5rem', width: '100%', background: 'var(--bg-card)' }} onClick={() => { setBranchAddressTarget('new'); setIsBranchAddressModalOpen(true); }}>
                            Edit Address
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1rem' }}>
                      <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Save Branch</button>
                    </div>
                  </form>
                </div>
              ) : editingBranch ? (
                <div>
                  <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                    <div>
                      <h3>Edit Branch: {editingBranch.name}</h3>
                      <p className="subtitle">Update branch details and contact information</p>
                    </div>
                    <button className="btn btn-secondary" onClick={() => setEditingBranch(null)}>
                      <ChevronLeft size={18} style={{ marginRight: '0.5rem' }} /> Back to Branches
                    </button>
                  </div>
                  
                  <form onSubmit={handleUpdateBranch} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem' }}>
                    
                    {/* General Information Section */}
                    <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-base)' }}>
                      <h4 style={{ margin: '0 0 1rem 0' }}>General Information</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        <div className="form-group">
                          <label className="form-label">Branch Name *</label>
                          <input type="text" className="input-field" value={editBranchData.name} onChange={e => setEditBranchData({...editBranchData, name: e.target.value})} required />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Phone Number</label>
                          <input type="text" className="input-field" value={editBranchData.phone} onChange={e => setEditBranchData({...editBranchData, phone: e.target.value})} />
                        </div>
                      </div>
                    </div>

                    {/* Location Section */}
                    <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>
                      <div className="flex-between" style={{ marginBottom: '1rem' }}>
                        <h4 style={{ margin: 0 }}>Location</h4>
                      </div>
                      
                      {!editBranchData.address ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '2.5rem', gap: '1rem', background: 'var(--bg-card)' }}>
                          <div style={{ background: 'var(--bg-base)', padding: '1rem', borderRadius: '50%', border: '1px solid var(--border-color)' }}>
                            <MapPin size={32} style={{ color: 'var(--text-secondary)' }} />
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>No Address Selected</h5>
                            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '300px' }}>Search for a postcode to automatically fetch and save the store's geographic location.</p>
                          </div>
                          <button type="button" className="btn btn-secondary" onClick={() => { setBranchAddressTarget('edit'); setIsBranchAddressModalOpen(true); }} style={{ marginTop: '0.5rem' }}>
                            <MapPin size={16} style={{ marginRight: '0.5rem' }} /> Add Address
                          </button>
                        </div>
                      ) : (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid var(--primary)', borderRadius: '8px', padding: '1.5rem', background: 'var(--primary-glow)' }}>
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flex: 1 }}>
                            <div style={{ background: 'var(--primary)', padding: '0.75rem', borderRadius: '50%', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                              <MapPin size={24} />
                            </div>
                            <div>
                              <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Branch Address</h5>
                              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.5, fontSize: '0.95rem' }}>{editBranchData.address}</p>
                              {editBranchData.lat && editBranchData.lng && (
                                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600' }}>
                                  ✓ Coordinates captured successfully
                                </p>
                              )}
                            </div>
                          </div>
                          <button type="button" className="btn btn-secondary" style={{ marginTop: '1.5rem', width: '100%', background: 'var(--bg-card)' }} onClick={() => { setBranchAddressTarget('edit'); setIsBranchAddressModalOpen(true); }}>
                            Edit Address
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Save Changes</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setEditingBranch(null)} style={{ padding: '0.75rem 2rem' }}>Cancel</button>
                      </div>
                      {branches.length > 1 && (
                        <button type="button" className="btn" style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', display: 'flex', alignItems: 'center' }} onClick={() => handleDeleteBranch(editingBranch.id)}>
                          <Trash2 size={16} style={{ marginRight: '0.5rem' }} /> Delete Branch
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              ) : (
                <>
                  <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                    <div>
                      <h3>Branch Locations</h3>
                      <p className="subtitle">Manage store branches and operational sites</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setIsCreatingBranch(true)}>
                      <Plus size={18} /> Add Branch
                    </button>
                  </div>

                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Branch Name</th>
                          <th>Address</th>
                          <th>Phone</th>
                        </tr>
                      </thead>
                      <tbody>
                        {branches.map(b => (
                          <tr 
                            key={b.id} 
                            onClick={() => { setEditingBranch(b); setEditBranchData({ name: b.name, address: b.address || '', phone: b.phone || '', lat: b.lat || null, lng: b.lng || null }); }}
                            style={{ cursor: 'pointer', transition: 'background 0.2s ease' }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <td><strong>{b.name}</strong> {branches.length === 1 && <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>(Primary)</span>}</td>
                            <td>{b.address || 'N/A'}</td>
                            <td>{b.phone || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Tab 8: PAYMENT SETTINGS */}
          {activeTab === 'settings' && (
            <div className="grid-cols-2">
              {/* Stripe Setup */}
              <div className="glass-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ color: '#635bff' }}><ShoppingCart size={24} /></div>
                  <h3>Stripe Connect Platform</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Connect your Stripe account to receive card payments from customers directly. We route transactions using our partner program so that you onboarding is instant. 
                </p>

                <form onSubmit={handleSaveStripe}>
                  <div className="form-group">
                    <label className="form-label">Stripe Connect Account ID</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="e.g. acct_123456789" 
                      value={stripeConnId}
                      onChange={e => setStripeConnId(e.target.value)}
                    />
                  </div>
                  
                  <div style={{ padding: '0.75rem', background: 'rgba(99,91,255,0.08)', border: '1px solid rgba(99,91,255,0.2)', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    <p style={{ color: '#8f88ff' }}>
                      💡 Don't have a Stripe merchant account? <br/>
                      <a href="https://connect.stripe.com/oauth/authorize?client_id=ca_phonesuite_referral" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                        Click here to create a Stripe account under PhoneSuite Affiliate Link
                      </a>
                    </p>
                  </div>

                  <button type="submit" className="btn btn-primary">Connect Stripe</button>
                </form>
              </div>

              {/* Square Setup */}
              <div className="glass-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ color: '#00f' }}><Building2 size={24} /></div>
                  <h3>Square Web Payments OAuth</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Use Square terminals or online payment sheets. Paste your Square API access token and location identifier below.
                </p>

                <form onSubmit={handleSaveSquare}>
                  <div className="form-group">
                    <label className="form-label">Square Access Token</label>
                    <input 
                      type="password" 
                      className="input-field" 
                      placeholder="EAAA..." 
                      value={squareToken}
                      onChange={e => setSquareToken(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Square Location ID</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="L-..." 
                      value={squareLocId}
                      onChange={e => setSquareLocId(e.target.value)}
                    />
                  </div>

                  <div style={{ padding: '0.75rem', background: 'rgba(0,0,255,0.05)', border: '1px solid rgba(0,0,255,0.1)', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      💡 Square merchant payments include partner fee split on checkout API calls.
                    </p>
                  </div>

                  <button type="submit" className="btn btn-primary">Connect Square</button>
                </form>
              </div>
            </div>
          )}

          {/* Tab 9: DELIVERY SETTINGS */}
          {activeTab === 'delivery_setup' && (
            <div className="grid-cols-2">
              <div className="glass-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ color: 'var(--nav-orange)' }}><Truck size={24} /></div>
                  <h3>Automated Delivery Rules</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Configure your POS delivery fees. Our system automatically calculates Google Maps driving distance and adds fees to the quote.
                </p>

                <form onSubmit={handleSaveDelivery}>
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                    <input 
                      type="checkbox" 
                      id="freeDelivery"
                      checked={isFreeDelivery} 
                      onChange={e => setIsFreeDelivery(e.target.checked)} 
                      style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                    />
                    <label htmlFor="freeDelivery" style={{ cursor: 'pointer', margin: 0, fontWeight: '600' }}>Enable Free Delivery for all orders</label>
                  </div>

                  {!isFreeDelivery && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                      <div className="form-group">
                        <label className="form-label">Minimum Fee (£)</label>
                        <input 
                          type="number" 
                          step="0.01" 
                          className="input-field" 
                          value={minDeliveryFee} 
                          onChange={e => setMinDeliveryFee(e.target.value)} 
                          placeholder="10.00"
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>Base charge for nearby deliveries.</span>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Base Included Miles</label>
                        <input 
                          type="number" 
                          className="input-field" 
                          value={baseDeliveryMiles} 
                          onChange={e => setBaseDeliveryMiles(e.target.value)} 
                          placeholder="3"
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>Miles covered under the minimum fee.</span>
                      </div>
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Charge Per Extra Mile (£)</label>
                        <input 
                          type="number" 
                          step="0.01" 
                          className="input-field" 
                          value={perMileRate} 
                          onChange={e => setPerMileRate(e.target.value)} 
                          placeholder="1.50"
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>Fee added for every mile beyond the base limit.</span>
                      </div>
                    </div>
                  )}

                  <div style={{ padding: '0.75rem', background: 'rgba(var(--nav-orange-rgb),0.05)', border: '1px solid rgba(var(--nav-orange-rgb),0.2)', borderRadius: '8px', fontSize: '0.85rem', margin: '1.5rem 0' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      💡 For example: If Minimum Fee is £10 (up to 3 miles) and Charge Per Extra Mile is £1.50. A 5-mile delivery would cost £10 + (2 * £1.50) = <strong>£13.00</strong>.
                    </p>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={isSavingDelivery}>
                    {isSavingDelivery ? 'Saving...' : 'Save Delivery Settings'}
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ==========================================
          MODALS & DIALOGS
      ========================================== */}

      {/* RTO E-Signature Link Dispatched Modal */}
      {rtoDispatchedModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '600px', width: '100%', border: '1px solid var(--accent-amber)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent-amber)', marginBottom: '1rem' }}>
              <Send size={24} />
              <h3 style={{ margin: 0 }}>Rent-to-Own Verification Sent</h3>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              We have simulated sending the e-signature email dispatch to <strong>{rtoDispatchedModal.email}</strong>. Compliant with UK regulations, the user must input their DOB and the 6-digit pin code below to verify their identity.
            </p>

            <div style={{ padding: '1rem', background: 'rgba(245,158,11,0.06)', borderRadius: '8px', border: '1px solid rgba(245,158,11,0.2)', marginBottom: '1.5rem' }}>
              <p style={{ marginBottom: '0.5rem' }}>Verification Code: <strong style={{ fontSize: '1.2rem', color: 'var(--text-primary)', letterSpacing: '0.1em' }}>{rtoDispatchedModal.pin}</strong></p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', background: '#070913', padding: '0.5rem', borderRadius: '4px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {typeof window !== 'undefined' ? `${window.location.origin}/sign/${rtoDispatchedModal.contractId}` : `/sign/${rtoDispatchedModal.contractId}`}
                </span>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', gap: '0.2rem' }}
                  onClick={() => {
                    const url = typeof window !== 'undefined' ? `${window.location.origin}/sign/${rtoDispatchedModal.contractId}` : `/sign/${rtoDispatchedModal.contractId}`;
                    navigator.clipboard.writeText(url);
                    alert('Sign link copied to clipboard!');
                  }}
                >
                  <Copy size={12} /> Copy
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  const url = `/sign/${rtoDispatchedModal.contractId}`;
                  window.open(url, '_blank');
                  setRtoDispatchedModal(null);
                }}
              >
                Open Signing Portal
              </button>
              <button className="btn btn-secondary" onClick={() => setRtoDispatchedModal(null)}>Dismiss</button>
            </div>
          </div>
        </div>
      )}

      {/* New Inventory Item Modal */}
      {isNewItemModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 90 }}>
          <div className="glass-card" style={{ maxWidth: '500px', width: '100%' }}>
            <h3>Register Stock Product</h3>
            <form onSubmit={handleAddInventory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Item Name</label>
                <input type="text" className="input-field" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">SKU Code</label>
                <input type="text" className="input-field" value={newItem.sku} onChange={e => setNewItem({ ...newItem, sku: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Buy Cost (£)</label>
                  <input type="number" step="0.01" className="input-field" value={newItem.buy_price} onChange={e => setNewItem({ ...newItem, buy_price: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Sell Price (£)</label>
                  <input type="number" step="0.01" className="input-field" value={newItem.sell_price} onChange={e => setNewItem({ ...newItem, sell_price: e.target.value })} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Qty in Stock</label>
                  <input type="number" className="input-field" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Min Alert Stock</label>
                  <input type="number" className="input-field" value={newItem.min_stock} onChange={e => setNewItem({ ...newItem, min_stock: parseInt(e.target.value) || 0 })} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Fixed Commission Override (£, Optional)</label>
                <input type="number" className="input-field" placeholder="e.g. 50.00" value={newItem.commission_override} onChange={e => setNewItem({ ...newItem, commission_override: e.target.value })} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsNewItemModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Repair Ticket Modal */}
      {isNewRepairModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 90 }}>
          <div className="glass-card" style={{ maxWidth: '500px', width: '100%' }}>
            <h3>Create Repair Ticket</h3>
            <form onSubmit={handleAddRepair} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              
              <div className="form-group">
                <label className="form-label">Assign Customer</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select className="select-field" style={{ flex: 1 }} value={newRepair.customer_id} onChange={e => setNewRepair({ ...newRepair, customer_id: e.target.value })} required>
                    <option value="">-- Choose Customer --</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                    ))}
                  </select>
                  <button type="button" className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={() => setIsNewCustomerModal(true)}>
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Device Type</label>
                  <select className="select-field" value={newRepair.device_type} onChange={e => setNewRepair({ ...newRepair, device_type: e.target.value })} required>
                    <option value="phone">iPhone / SmartPhone</option>
                    <option value="tablet">iPad / Tablet</option>
                    <option value="laptop">Macbook / Laptop</option>
                    <option value="smartwatch">AppleWatch / Wearable</option>
                    <option value="audio">JBL Boombox / Speaker</option>
                    <option value="hairdryer">Dyson Hairdryer / Appliance</option>
                    <option value="other">Other Electronics</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Device Model Name</label>
                  <input type="text" className="input-field" placeholder="e.g. iPhone 15 Pro" value={newRepair.device_model} onChange={e => setNewRepair({ ...newRepair, device_model: e.target.value })} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">IMEI / Serial Reference</label>
                <input type="text" className="input-field" placeholder="IMEI or Serial Number" value={newRepair.device_serial} onChange={e => setNewRepair({ ...newRepair, device_serial: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Problem Fault Description</label>
                <textarea className="textarea-field" rows="3" placeholder="Explain details of damage or issues" value={newRepair.issue_description} onChange={e => setNewRepair({ ...newRepair, issue_description: e.target.value })} required></textarea>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Estimated Cost (£)</label>
                  <input type="number" step="0.01" className="input-field" value={newRepair.estimated_cost} onChange={e => setNewRepair({ ...newRepair, estimated_cost: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Assign Repair Staff</label>
                  <select className="select-field" value={newRepair.assigned_staff_id} onChange={e => setNewRepair({ ...newRepair, assigned_staff_id: e.target.value })}>
                    <option value="">-- Assign Staff --</option>
                    {profiles.filter(p => p.role !== 'customer').map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsNewRepairModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Customer Modal */}
      {isNewCustomerModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Users size={24} style={{ color: 'var(--nav-orange)' }} />
                <h3 style={{ margin: 0 }}>Register Customer Profile</h3>
              </div>
              <button className="btn btn-secondary" onClick={() => setIsNewCustomerModal(false)} style={{ padding: '0.5rem' }}><X size={16} /></button>
            </div>

            <form onSubmit={handleAddCustomer}>
              {/* KYC Section */}
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>1. Personal KYC Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '0.5fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <select className="select-field" value={newCustomer.title} onChange={e => setNewCustomer({ ...newCustomer, title: e.target.value })}>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                    <option value="Miss">Miss</option>
                    <option value="Dr">Dr</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input type="text" className="input-field" value={newCustomer.first_name} onChange={e => setNewCustomer({ ...newCustomer, first_name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input type="text" className="input-field" value={newCustomer.last_name} onChange={e => setNewCustomer({ ...newCustomer, last_name: e.target.value })} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="input-field" value={newCustomer.email} onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input type="date" className="input-field" value={newCustomer.dob} onChange={e => setNewCustomer({ ...newCustomer, dob: e.target.value })} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input type="tel" className="input-field" value={newCustomer.phone} onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">WhatsApp Number</label>
                  <input type="tel" className="input-field" value={newCustomer.whatsapp} onChange={e => setNewCustomer({ ...newCustomer, whatsapp: e.target.value })} />
                </div>
              </div>

              {/* Address Section */}
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>2. Primary Address (For Delivery / Contract)</h4>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Search Postcode</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. SW1A 1AA" 
                    value={newAddressPostcode}
                    onChange={e => setNewAddressPostcode(e.target.value.toUpperCase())}
                  />
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={handleLookupCustomerAddress}
                    disabled={isFetchingAddress}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {isFetchingAddress ? '...' : <MapPin size={16} />} Find
                  </button>
                </div>
                {newCustomer.address && (
                  <div style={{ padding: '0.75rem', background: 'rgba(46, 213, 115, 0.1)', border: '1px solid rgba(46, 213, 115, 0.3)', borderRadius: '8px', marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    ✅ <strong>Verified:</strong> {newCustomer.address}
                  </div>
                )}
              </div>

              {/* ID Documents Section */}
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>3. Identity Documents</h4>
              <div style={{ padding: '2rem', border: '2px dashed var(--border-color)', borderRadius: '12px', textAlign: 'center', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.01)' }}>
                <UploadCloud size={32} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Drag & Drop Passport or ID (Front/Back)</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Supported files: JPG, PNG, PDF</p>
                <button type="button" className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => alert('Storage bucket upload triggered...')}>Upload Document</button>
              </div>

              {/* Referees Section */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, color: 'var(--text-secondary)' }}>4. Referees</h4>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                  onClick={() => setNewCustomer({ ...newCustomer, referees: [...newCustomer.referees, { name: '', phone: '', relationship: '' }] })}
                >
                  <Plus size={14} /> Add Referee
                </button>
              </div>
              
              {newCustomer.referees.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '1.5rem' }}>No referees added.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {newCustomer.referees.map((ref, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'end' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Referee Name</label>
                        <input type="text" className="input-field" value={ref.name} onChange={e => {
                          const newRefs = [...newCustomer.referees];
                          newRefs[idx].name = e.target.value;
                          setNewCustomer({ ...newCustomer, referees: newRefs });
                        }} required />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Phone Number</label>
                        <input type="tel" className="input-field" value={ref.phone} onChange={e => {
                          const newRefs = [...newCustomer.referees];
                          newRefs[idx].phone = e.target.value;
                          setNewCustomer({ ...newCustomer, referees: newRefs });
                        }} required />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Relationship</label>
                        <input type="text" className="input-field" placeholder="e.g. Brother" value={ref.relationship} onChange={e => {
                          const newRefs = [...newCustomer.referees];
                          newRefs[idx].relationship = e.target.value;
                          setNewCustomer({ ...newCustomer, referees: newRefs });
                        }} required />
                      </div>
                      <button 
                        type="button" 
                        className="btn btn-danger" 
                        style={{ padding: '0.65rem' }}
                        onClick={() => {
                          const newRefs = newCustomer.referees.filter((_, i) => i !== idx);
                          setNewCustomer({ ...newCustomer, referees: newRefs });
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Internal Notes</label>
                <textarea className="textarea-field" rows="2" value={newCustomer.notes} onChange={e => setNewCustomer({ ...newCustomer, notes: e.target.value })}></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsNewCustomerModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Complete Registration</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Vendor Bill Modal */}
      {isNewVendorBillModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 90 }}>
          <div className="glass-card" style={{ maxWidth: '450px', width: '100%' }}>
            <h3>Record Vendor Bill (Expenses)</h3>
            <form onSubmit={handleAddVendorBill} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Vendor Business Name</label>
                <input type="text" className="input-field" placeholder="e.g. Parts Express UK" value={newVendorBill.vendor_name} onChange={e => setNewVendorBill({ ...newVendorBill, vendor_name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Amount Owed (£)</label>
                <input type="number" step="0.01" className="input-field" value={newVendorBill.amount} onChange={e => setNewVendorBill({ ...newVendorBill, amount: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Payment Due Date</label>
                <input type="date" className="input-field" value={newVendorBill.due_date} onChange={e => setNewVendorBill({ ...newVendorBill, due_date: e.target.value })} required />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsNewVendorBillModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Record Bill</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Address Confirmation Modal */}
      {pendingAddressList && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(11, 15, 25, 0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="glass-card" style={{ maxWidth: '450px', width: '100%', padding: '2rem', textAlign: 'center', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', flexShrink: 0 }}>
              <MapPin size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', flexShrink: 0 }}>Select Your Address</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.5', flexShrink: 0 }}>
              We found multiple addresses for this postcode. Please select the correct one below.
            </p>
            
            <div style={{ flex: 1, textAlign: 'left', background: 'rgba(0,0,0,0.1)', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.5rem', padding: '1.5rem' }}>
              <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                Street Found:<br/>
                <strong style={{ color: 'var(--text-primary)' }}>{pendingAddressList.baseAddress}</strong>
              </p>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600' }}>Building Name or Number</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Unit 4, or 12" 
                  id="customerDoorInput"
                  autoFocus
                />
              </div>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}
                onClick={() => {
                  const door = document.getElementById('customerDoorInput').value.trim();
                  const finalAddress = door ? `${door}, ${pendingAddressList.baseAddress}` : pendingAddressList.baseAddress;
                  handleConfirmSaveAddress({
                    door: door || '',
                    formattedAddress: finalAddress,
                    lat: pendingAddressList.lat,
                    lng: pendingAddressList.lng
                  });
                }}
              >
                Confirm Address
              </button>
            </div>

            <div style={{ display: 'flex', flexShrink: 0 }}>
              <button type="button" className="btn btn-secondary" style={{ width: '100%' }} onClick={() => setPendingAddressList(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Switch Store Modal */}
      {isSwitchStoreModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
          <div style={{ maxWidth: '900px', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="flex-between">
              <div>
                <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: '#fff', fontWeight: '700' }}>Switch Store Location</h2>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', margin: 0 }}>Select an operational branch to switch your active dashboard workspace.</p>
              </div>
              <button className="btn" onClick={() => setIsSwitchStoreModalOpen(false)} style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', color: '#0f172a', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '60vh', overflowY: 'auto', paddingRight: '1rem', scrollbarWidth: 'thin' }}>
              {branches.map(branch => {
                const isActive = activeBranch?.id === branch.id;
                return (
                  <div 
                    key={branch.id}
                    onClick={() => { setActiveBranch(branch); setIsSwitchStoreModalOpen(false); }}
                    className="glass-card"
                    style={{ 
                      cursor: 'pointer', 
                      position: 'relative',
                      border: isActive ? '2px solid var(--nav-orange)' : '1px solid var(--border-color)',
                      background: 'var(--bg-card, #ffffff)',
                      transition: 'all 0.3s ease',
                      padding: '1.5rem',
                      boxShadow: isActive ? '0 12px 24px var(--nav-orange-glow)' : '0 4px 12px rgba(0,0,0,0.05)',
                      borderRadius: '16px',
                      flex: '0 0 auto',
                    }}
                    onMouseOver={(e) => { 
                      e.currentTarget.style.transform = 'translateY(-4px)'; 
                      e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.15)'; 
                      e.currentTarget.style.borderColor = 'var(--nav-orange)'; 
                      const icon = e.currentTarget.querySelector('.branch-icon');
                      if (icon) {
                        icon.style.color = 'var(--nav-orange)';
                        icon.style.background = 'var(--nav-orange-glow)';
                        icon.style.borderColor = 'rgba(255, 122, 0, 0.2)';
                      }
                    }}
                    onMouseOut={(e) => { 
                      e.currentTarget.style.transform = 'none'; 
                      e.currentTarget.style.boxShadow = isActive ? '0 12px 24px var(--nav-orange-glow)' : '0 4px 12px rgba(0,0,0,0.05)'; 
                      e.currentTarget.style.borderColor = isActive ? 'var(--nav-orange)' : 'var(--border-color)'; 
                      const icon = e.currentTarget.querySelector('.branch-icon');
                      if (icon && !isActive) {
                        icon.style.color = '#64748b';
                        icon.style.background = '#f8fafc';
                        icon.style.borderColor = '#e2e8f0';
                      }
                    }}
                  >
                    {isActive && (
                      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: '#fff', background: 'var(--nav-orange)', padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.5px', boxShadow: '0 4px 12px var(--nav-orange-glow)' }}>
                        ACTIVE
                      </div>
                    )}
                    <div className="branch-icon" style={{ width: '56px', height: '56px', borderRadius: '14px', background: isActive ? 'var(--nav-orange-glow)' : '#f8fafc', border: '1px solid', borderColor: isActive ? 'rgba(255, 122, 0, 0.2)' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: isActive ? 'var(--nav-orange)' : '#64748b', transition: 'all 0.3s ease' }}>
                      <Building2 size={28} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontWeight: '700' }}>{branch.name}</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <MapPin size={16} style={{ marginTop: '0.15rem', color: '#94a3b8', minWidth: '16px' }} />
                        <span style={{ lineHeight: '1.4' }}>{branch.address || 'No address registered'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Phone size={16} style={{ color: '#94a3b8', minWidth: '16px' }} />
                        <span>{branch.phone || 'No phone number'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Branch Address Lookup Modal */}
      {isBranchAddressModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '2rem' }}>
          <div className="glass-card" style={{ maxWidth: '600px', width: '100%', background: 'var(--bg-card, #ffffff)' }}>
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>Find Branch Address</h3>
              <button className="btn" onClick={() => setIsBranchAddressModalOpen(false)} style={{ background: 'transparent', color: 'var(--text-secondary)', padding: '0.5rem' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Enter Postcode (e.g. SW1A 1AA)" 
                value={branchAddressPostcode} 
                onChange={e => setBranchAddressPostcode(e.target.value)} 
                style={{ flex: 1 }}
              />
              <button className="btn btn-primary" onClick={handleLookupBranchAddress} disabled={isFetchingBranchAddress}>
                {isFetchingBranchAddress ? 'Searching...' : 'Search'}
              </button>
            </div>

            {pendingBranchAddressList && (
              <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-base)' }}>
                <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  Street Found:<br/>
                  <strong style={{ color: 'var(--text-primary)' }}>{pendingBranchAddressList.baseAddress}</strong>
                </p>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: '600' }}>Building Name or Number</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. Unit 4, or 12" 
                    id="branchDoorInput"
                    autoFocus
                  />
                </div>
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}
                  onClick={() => {
                    const door = document.getElementById('branchDoorInput').value.trim();
                    const finalAddress = door ? `${door}, ${pendingBranchAddressList.baseAddress}` : pendingBranchAddressList.baseAddress;
                    handleConfirmBranchAddress({
                      formattedAddress: finalAddress,
                      lat: pendingBranchAddressList.lat,
                      lng: pendingBranchAddressList.lng
                    });
                  }}
                >
                  Confirm Address
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
