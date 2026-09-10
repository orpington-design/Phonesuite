// Mock data and operational fixtures for PhoneSuite Staff Mobile Web App
import { PRODUCTS_CATALOG as BASE_PRODUCTS } from '../../portal/data/portalData';

export const STAFF_MEMBERS = [
  { id: 'staff-01', name: 'Alex Rivera', role: 'Senior Electronics Technician & Sales', branch: 'London Central Branch', email: 'a.rivera@phonesuite.uk', phone: '+44 7700 900123' },
  { id: 'staff-02', name: 'Sophie Taylor', role: 'Store Manager', branch: 'London Central Branch', email: 's.taylor@phonesuite.uk', phone: '+44 7700 900456' },
  { id: 'staff-03', name: 'Marcus Vance', role: 'Hardware Diagnostic Specialist', branch: 'Manchester Deansgate', email: 'm.vance@phonesuite.uk', phone: '+44 7700 900789' }
];

export const STORE_BRANCHES = [
  { id: 'branch-lon', name: 'London Central Branch', address: '42 Baker Street, London NW1 6XE', phone: '+44 20 7946 0912' },
  { id: 'branch-man', name: 'Manchester Deansgate', address: '124 Deansgate, Manchester M3 2FW', phone: '+44 161 834 9100' },
  { id: 'branch-bri', name: 'Bristol Harbourside', address: '18 Anchor Road, Bristol BS1 5TT', phone: '+44 117 929 4400' }
];

export const formatMoney = (val) => {
  const num = Number(val || 0);
  return '£' + num.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const INITIAL_STAFF_CUSTOMERS = [
  {
    id: 'cust-001',
    name: 'Daniel Harris',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+44 7911 123456',
    email: 'd.harris@example.com',
    credit_score: 785,
    credit_limit: 2500.00,
    tier: 'Platinum VIP',
    status: 'Regular Customer',
    address: '42 Baker Street, Marylebone, London NW1 6XE',
    total_spent: 3450.00,
    active_repairs_count: 1,
    overdue_count: 0,
    kyc_status: 'Verified (Passport & Open Banking)',
    member_since: 'March 2024',
    orders_history: [
      { orderNumber: 'ORD-2026-9770', date: '2026-09-08', item: 'Apple Watch Ultra 2 GPS + Cellular', amount: 799.00, status: 'Delivered' },
      { orderNumber: 'ORD-2025-4412', date: '2025-11-20', item: 'iPad Air 11" M2 128GB (Starlight)', amount: 599.00, status: 'Delivered' },
      { orderNumber: 'ORD-2025-1029', date: '2025-04-15', item: 'AirPods Pro 2 USB-C MagSafe', amount: 229.00, status: 'Delivered' }
    ],
    finance_agreements_history: [
      { agreementNumber: 'RTO-2024-081', device: 'Apple iPhone 14 Pro 128GB', totalFinanced: 949.00, installmentsPaid: 12, totalInstallments: 12, status: 'Completed (Paid in Full)', onTimeRate: '100%' }
    ],
    repairs_history: [
      { repairId: 'REP-101', device: 'Apple iPhone 15 Pro', issue: 'Front OLED screen cracked after drop', cost: 149.00, status: 'Ready for Collection', date: '2026-09-07' }
    ]
  },
  {
    id: 'cust-002',
    name: 'Eleanor Wright',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    phone: '+44 7822 456789',
    email: 'eleanor.w@cloudmail.co.uk',
    credit_score: 610,
    credit_limit: 1200.00,
    tier: 'Gold Member',
    status: 'Regular Customer',
    address: '15 Gloucester Rd, Kensington, London SW7 4PP',
    total_spent: 1890.00,
    active_repairs_count: 1,
    overdue_count: 1,
    kyc_status: 'Verified (UK Driving Licence)',
    member_since: 'January 2025',
    orders_history: [
      { orderNumber: 'ORD-2025-8819', date: '2025-12-10', item: 'Samsung Galaxy Watch 6 44mm', amount: 289.00, status: 'Delivered' }
    ],
    finance_agreements_history: [
      { agreementNumber: 'RTO-2025-119', device: 'Apple iPad Pro 12.9" M2', totalFinanced: 899.00, installmentsPaid: 9, totalInstallments: 12, status: 'Active (1 Overdue Payment)', onTimeRate: '88%' }
    ],
    repairs_history: [
      { repairId: 'REP-102', device: 'Apple iPad Pro 12.9" M2', issue: 'USB-C charging port loose', cost: 115.00, status: 'In Repair', date: '2026-09-08' }
    ]
  },
  {
    id: 'cust-003',
    name: 'James Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    phone: '+44 7755 890123',
    email: 'j.rodriguez@techhub.io',
    credit_score: 820,
    credit_limit: 4000.00,
    tier: 'Platinum VIP',
    status: 'Regular Customer',
    address: '88 Camden High St, London NW1 0LT',
    total_spent: 5600.00,
    active_repairs_count: 0,
    overdue_count: 1,
    kyc_status: 'Verified (Biometric ID Check)',
    member_since: 'October 2023',
    orders_history: [
      { orderNumber: 'ORD-2026-0120', date: '2026-02-14', item: 'MacBook Pro 14" M3 Max 1TB', amount: 3199.00, status: 'Delivered' },
      { orderNumber: 'ORD-2025-7741', date: '2025-09-05', item: 'iPhone 15 Pro 256GB Black', amount: 1099.00, status: 'Delivered' }
    ],
    finance_agreements_history: [
      { agreementNumber: 'RTO-2024-012', device: 'MacBook Pro 16" M2', totalFinanced: 2499.00, installmentsPaid: 24, totalInstallments: 24, status: 'Completed (Paid in Full)', onTimeRate: '100%' }
    ],
    repairs_history: []
  },
  {
    id: 'cust-004',
    name: 'Chloe Bennett',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    phone: '+44 7933 671234',
    email: 'chloe.bennett@designcraft.com',
    credit_score: 685,
    credit_limit: 1800.00,
    tier: 'Silver Member',
    status: 'New Customer',
    address: '34 Shoreditch High St, London E1 6PG',
    total_spent: 850.00,
    active_repairs_count: 1,
    overdue_count: 0,
    kyc_status: 'Verified (UK Driving Licence & Open Banking)',
    member_since: 'August 2026',
    orders_history: [
      { orderNumber: 'ORD-2026-5501', date: '2026-08-25', item: 'Sony WH-1000XM5 Headphones', amount: 279.00, status: 'Delivered' }
    ],
    finance_agreements_history: [],
    repairs_history: [
      { repairId: 'REP-103', device: 'MacBook Air 13" M1', issue: 'Liquid spill on spacebar and left keys', cost: 175.00, status: 'Diagnostic Testing', date: '2026-09-09' }
    ]
  },
  {
    id: 'cust-005',
    name: 'Liam O\'Connor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+44 7899 112233',
    email: 'liam.oc@devstudio.co.uk',
    credit_score: 745,
    credit_limit: 2500.00,
    tier: 'Gold Member',
    status: 'Regular Customer',
    address: '22 Brick Lane, Tower Hamlets, London E1 6RF',
    total_spent: 2450.00,
    active_repairs_count: 0,
    overdue_count: 0,
    kyc_status: 'Verified (Passport & Open Banking Payroll)',
    member_since: 'April 2024',
    orders_history: [
      { orderNumber: 'ORD-2025-7822', date: '2025-10-18', item: 'Apple AirPods Max (Space Grey)', amount: 499.00, status: 'Delivered' },
      { orderNumber: 'ORD-2024-3310', date: '2024-05-12', item: 'Apple Studio Display 27" 5K', amount: 1499.00, status: 'Delivered' }
    ],
    finance_agreements_history: [
      { agreementNumber: 'RTO-2024-052', device: 'Apple iPhone 14 Pro Max 256GB', totalFinanced: 1199.00, installmentsPaid: 24, totalInstallments: 24, status: 'Completed (Paid in Full)', onTimeRate: '100%' }
    ],
    repairs_history: [
      { repairId: 'REP-088', device: 'iPhone 14 Pro Max', issue: 'Battery degradation diagnostic & replacement', cost: 89.00, status: 'Completed & Collected', date: '2025-06-11' }
    ]
  },
  {
    id: 'cust-006',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+44 7700 900789',
    email: 'm.vance@techmedia.co.uk',
    credit_score: 810,
    credit_limit: 3500.00,
    tier: 'Platinum VIP',
    status: 'Regular Customer',
    address: '88 Deansgate, Manchester M3 2FW',
    total_spent: 4200.00,
    active_repairs_count: 0,
    overdue_count: 0,
    kyc_status: 'Verified (UK Passport & Open Banking)',
    member_since: 'November 2023',
    orders_history: [
      { orderNumber: 'ORD-2025-4100', date: '2025-07-22', item: 'Apple iPad Pro 11" M4 256GB', amount: 999.00, status: 'Delivered' }
    ],
    finance_agreements_history: [
      { agreementNumber: 'RTO-2023-110', device: 'MacBook Pro 14" M2 Pro', totalFinanced: 1999.00, installmentsPaid: 24, totalInstallments: 24, status: 'Completed (Paid in Full)', onTimeRate: '100%' }
    ],
    repairs_history: []
  },
  {
    id: 'cust-007',
    name: 'Jordan Reed',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+44 7766 554433',
    email: 'jordan.reed@freemail.co.uk',
    credit_score: 540,
    credit_limit: 600.00,
    tier: 'Bronze',
    status: 'New Customer',
    address: '5 Stratford Broadway, London E15 4BQ',
    total_spent: 120.00,
    active_repairs_count: 0,
    overdue_count: 0,
    kyc_status: 'Conditional (National Insurance verified, manual address check)',
    member_since: 'September 2026',
    orders_history: [
      { orderNumber: 'ORD-2026-9011', date: '2026-09-02', item: 'Anker 65W GaN Fast Charger + 2m Cable', amount: 45.00, status: 'Delivered' }
    ],
    finance_agreements_history: [],
    repairs_history: []
  }
];

export function getSavedStaffCustomers() {
  if (typeof window === 'undefined') return INITIAL_STAFF_CUSTOMERS;
  try {
    const saved = localStorage.getItem('phonesuite_staff_customers');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return INITIAL_STAFF_CUSTOMERS;
}

export function persistStaffCustomers(list) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('phonesuite_staff_customers', JSON.stringify(list));
  } catch (e) {}
}

export const INITIAL_STAFF_REPAIRS = [
  {
    id: 'rep-101',
    customer_name: 'Daniel Harris',
    customer_phone: '+44 7911 123456',
    device_type: 'phone',
    device_model: 'Apple iPhone 15 Pro',
    device_serial: '358291048592019',
    issue_description: 'Front OLED screen cracked after drop, touch unresponsive at bottom.',
    diagnostic_notes: 'OEM grade 120Hz OLED fitted. Touch, TrueTone calibration passed.',
    status: 'ready', // received -> diagnosing -> repairing -> ready -> picked_up
    estimated_cost: 149.00,
    deposit_paid: 30.00,
    balance_due: 119.00,
    assigned_technician: 'Marcus Vance',
    created_at: '2026-09-07T10:30:00Z',
    branch: 'London Central Branch'
  },
  {
    id: 'rep-102',
    customer_name: 'Eleanor Wright',
    customer_phone: '+44 7822 456789',
    device_type: 'tablet',
    device_model: 'Apple iPad Pro 12.9" M2',
    device_serial: 'DMPZD880H8N',
    issue_description: 'USB-C charging port loose, only charges at specific angles.',
    diagnostic_notes: 'Inspecting daughterboard connection and microsoldering pin alignment.',
    status: 'repairing',
    estimated_cost: 115.00,
    deposit_paid: 25.00,
    balance_due: 90.00,
    assigned_technician: 'Alex Rivera',
    created_at: '2026-09-08T14:15:00Z',
    branch: 'London Central Branch'
  },
  {
    id: 'rep-103',
    customer_name: 'Chloe Bennett',
    customer_phone: '+44 7933 671234',
    device_type: 'laptop',
    device_model: 'MacBook Air 13" M1',
    device_serial: 'FVFXL99401P',
    issue_description: 'Liquid spill on spacebar and left keys, intermittent trackpad click.',
    diagnostic_notes: 'Ultrasonic board clean completed. Performing keyboard matrix replacement.',
    status: 'diagnosing',
    estimated_cost: 175.00,
    deposit_paid: 50.00,
    balance_due: 125.00,
    assigned_technician: 'Alex Rivera',
    created_at: '2026-09-09T09:20:00Z',
    branch: 'London Central Branch'
  },
  {
    id: 'rep-104',
    customer_name: 'Marcus Bell',
    customer_phone: '+44 7711 334455',
    device_type: 'phone',
    device_model: 'Samsung Galaxy S23 Ultra',
    device_serial: 'R5CW301889E',
    issue_description: 'Battery draining in 3 hours, back glass peeling from swollen cell.',
    diagnostic_notes: 'Checked safety battery isolation. New 5000mAh battery requested from stock.',
    status: 'received',
    estimated_cost: 85.00,
    deposit_paid: 0.00,
    balance_due: 85.00,
    assigned_technician: 'Marcus Vance',
    created_at: '2026-09-09T11:45:00Z',
    branch: 'London Central Branch'
  }
];

export const INITIAL_STAFF_INVOICES = [
  {
    id: 'inv-801',
    invoice_number: 'INV-2026-0982',
    customer_name: 'Daniel Harris',
    customer_phone: '+44 7911 123456',
    customer_email: 'd.harris@example.com',
    description: 'iPhone 15 Pro OLED Display Assembly & Repair Labor',
    amount: 149.00,
    due_date: '2026-09-14',
    status: 'pending',
    type: 'Repair Invoice',
    branch: 'London Central Branch',
    created_at: '2026-09-07T10:30:00Z'
  },
  {
    id: 'inv-802',
    invoice_number: 'RTO-2026-0044',
    customer_name: 'Eleanor Wright',
    customer_phone: '+44 7822 456789',
    customer_email: 'eleanor.w@cloudmail.co.uk',
    description: 'Rent-to-Own Installment #3 of 12 (iPad Pro M2)',
    amount: 68.00,
    due_date: '2026-08-30', // Overdue!
    status: 'overdue',
    type: 'RTO Installment',
    branch: 'London Central Branch',
    created_at: '2026-08-01T00:00:00Z'
  },
  {
    id: 'inv-803',
    invoice_number: 'INV-2026-0912',
    customer_name: 'James Rodriguez',
    customer_phone: '+44 7755 890123',
    customer_email: 'j.rodriguez@techhub.io',
    description: 'MacBook Pro Logic Board Diagnostics & GPU Reflow',
    amount: 220.00,
    due_date: '2026-08-25', // Overdue!
    status: 'overdue',
    type: 'Repair Invoice',
    branch: 'London Central Branch',
    created_at: '2026-08-11T12:00:00Z'
  },
  {
    id: 'inv-804',
    invoice_number: 'ORD-2026-0994',
    customer_name: 'Chloe Bennett',
    customer_phone: '+44 7933 671234',
    customer_email: 'chloe.bennett@designcraft.com',
    description: 'Apple 30W USB-C Kit + MagSafe Silicone Case',
    amount: 69.00,
    due_date: '2026-09-09',
    status: 'paid',
    type: 'POS Store Sale',
    branch: 'London Central Branch',
    paid_at: '2026-09-09T13:40:00Z',
    created_at: '2026-09-09T13:40:00Z'
  },
  {
    id: 'inv-805',
    invoice_number: 'ORD-2026-0993',
    customer_name: 'Daniel Harris',
    customer_phone: '+44 7911 123456',
    customer_email: 'd.harris@example.com',
    description: 'Anker Magnetic Wireless Power Bank (10,000mAh)',
    amount: 59.00,
    due_date: '2026-09-08',
    status: 'paid',
    type: 'POS Store Sale',
    branch: 'London Central Branch',
    paid_at: '2026-09-08T16:15:00Z',
    created_at: '2026-09-08T16:15:00Z'
  }
];

export const PRESET_TECH_IMAGES = [
  { label: 'iPhone 15 Pro', url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80', category: 'phones' },
  { label: 'Samsung Galaxy S24', url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80', category: 'phones' },
  { label: 'Google Pixel 9', url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80', category: 'phones' },
  { label: 'iPad Pro OLED', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80', category: 'ipads' },
  { label: 'Apple Watch Ultra', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80', category: 'watches' },
  { label: 'MacBook Air M3', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80', category: 'laptops' },
  { label: 'AirPods Max / Audio', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80', category: 'airphones' },
  { label: 'Gaming Console Pad', url: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600&auto=format&fit=crop&q=80', category: 'videogames' },
  { label: 'Fast Charger & Cable', url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80', category: 'accessories' }
];

export const SHOP_CATEGORY_OPTIONS = [
  { id: 'all', label: 'All Items' },
  { id: 'phones', label: 'Phones' },
  { id: 'ipads', label: 'iPads & Tablets' },
  { id: 'watches', label: 'Watches' },
  { id: 'airphones', label: 'Airphones & Audio' },
  { id: 'laptops', label: 'Laptops' },
  { id: 'videogames', label: 'Videogames & Consoles' },
  { id: 'accessories', label: 'Accessories' }
];

// Helper to get synced products (from localStorage or default base)
export function getSavedProducts() {
  if (typeof window === 'undefined') return BASE_PRODUCTS;
  try {
    const saved = localStorage.getItem('phonesuite_shared_products');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {}
  return BASE_PRODUCTS;
}

// Helper to save updated products
export function persistProducts(productsList) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('phonesuite_shared_products', JSON.stringify(productsList));
  } catch (e) {}
}

export const INITIAL_DEVICE_COLLECTIONS = [
  {
    id: 'col-1',
    customerName: 'Eleanor Wright',
    customerPhone: '+44 7822 456789',
    customerEmail: 'eleanor.w@cloudmail.co.uk',
    customerAddress: '15 Gloucester Rd, Kensington, London SW7 4PP',
    deviceModel: 'Apple iPad Pro 12.9" M2',
    deviceSerial: 'DMPZD880H8N',
    contractId: 'RTO-2026-0044',
    agreementDate: '2026-06-15',
    daysOverdue: 14,
    amountDue: 68.00,
    deviceValue: 899.00,
    status: 'pending_recovery', // 'pending_recovery' | 'recovery_dispatched' | 'retrieved'
    branch: 'London Central Branch',
    noticeSentCount: 1,
    lastNoticeDate: '2026-09-02'
  },
  {
    id: 'col-2',
    customerName: 'James Rodriguez',
    customerPhone: '+44 7755 890123',
    customerEmail: 'j.rodriguez@techhub.io',
    customerAddress: '88 Camden High St, London NW1 0LT',
    deviceModel: 'MacBook Pro 16" M2 Max (Space Grey)',
    deviceSerial: 'C02G80P7MD6M',
    contractId: 'RTO-2026-0028',
    agreementDate: '2026-04-10',
    daysOverdue: 22,
    amountDue: 220.00,
    deviceValue: 2450.00,
    status: 'recovery_dispatched',
    branch: 'London Central Branch',
    noticeSentCount: 2,
    lastNoticeDate: '2026-08-28'
  },
  {
    id: 'col-3',
    customerName: 'Marcus Bell',
    customerPhone: '+44 7711 334455',
    customerEmail: 'm.bell99@gmail.com',
    customerAddress: '19 Greenwich Church St, London SE10 9BJ',
    deviceModel: 'Samsung Galaxy S24 Ultra 512GB',
    deviceSerial: 'RF8N204910A',
    contractId: 'RTO-2026-0051',
    agreementDate: '2026-07-01',
    daysOverdue: 9,
    amountDue: 85.00,
    deviceValue: 950.00,
    status: 'pending_recovery',
    branch: 'London Central Branch',
    noticeSentCount: 0,
    lastNoticeDate: null
  }
];

export function getSavedCollections() {
  if (typeof window === 'undefined') return INITIAL_DEVICE_COLLECTIONS;
  try {
    const saved = localStorage.getItem('phonesuite_staff_collections');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return INITIAL_DEVICE_COLLECTIONS;
}

export function persistCollections(list) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('phonesuite_staff_collections', JSON.stringify(list));
  } catch (e) {}
}

export const INITIAL_STAFF_SALES = [
  {
    id: 'sale-001',
    receiptNumber: 'REC-2026-4401',
    customerName: 'Chloe Bennett',
    customerPhone: '+44 7933 671234',
    customerEmail: 'chloe.bennett@designcraft.com',
    items: [
      { name: 'Apple 30W USB-C Kit', price: 39.00, qty: 1 },
      { name: 'MagSafe Silicone Case (Midnight)', price: 30.00, qty: 1 }
    ],
    subtotal: 57.50,
    vat: 11.50,
    total: 69.00,
    paymentMethod: 'Card / Contactless',
    status: 'completed',
    branch: 'London Central Branch',
    staffMember: 'Alex Rivera',
    createdAt: '2026-09-09T13:40:00Z'
  },
  {
    id: 'sale-002',
    receiptNumber: 'REC-2026-4402',
    customerName: 'Daniel Harris',
    customerPhone: '+44 7911 123456',
    customerEmail: 'd.harris@example.com',
    items: [
      { name: 'Anker Magnetic Wireless Power Bank (10,000mAh)', price: 59.00, qty: 1 }
    ],
    subtotal: 49.17,
    vat: 9.83,
    total: 59.00,
    paymentMethod: 'Cash Register',
    status: 'completed',
    branch: 'London Central Branch',
    staffMember: 'Sophie Taylor',
    createdAt: '2026-09-08T16:15:00Z'
  },
  {
    id: 'sale-003',
    receiptNumber: 'REC-2026-4403',
    customerName: 'Sarah Jenkins',
    customerPhone: '+44 7922 112233',
    customerEmail: 's.jenkins@outlook.com',
    items: [
      { name: 'Apple iPhone 15 Pro 128GB - Natural Titanium', price: 899.00, qty: 1 },
      { name: 'Belkin UltraGlass 2 Screen Protector', price: 35.00, qty: 1 }
    ],
    subtotal: 778.33,
    vat: 155.67,
    total: 934.00,
    paymentMethod: 'Rent-to-Own Financing',
    isRto: true,
    rtoDetails: {
      contractNumber: 'RTO-2026-0062',
      downPayment: 180.00,
      weeklyInstallment: 41.50,
      termWeeks: 24
    },
    status: 'completed',
    branch: 'London Central Branch',
    staffMember: 'Alex Rivera',
    createdAt: '2026-09-08T11:20:00Z'
  },
  {
    id: 'sale-004',
    receiptNumber: 'REC-2026-4404',
    customerName: 'David Kim',
    customerPhone: '+44 7788 990011',
    customerEmail: 'david.kim@fintech.co.uk',
    items: [
      { name: 'Apple AirPods Pro 2 (USB-C MagSafe)', price: 219.00, qty: 1 },
      { name: 'Lightning to USB-C Braided Cable 2m', price: 29.00, qty: 1 }
    ],
    subtotal: 206.67,
    vat: 41.33,
    total: 248.00,
    paymentMethod: 'Apple Pay / Contactless',
    status: 'completed',
    branch: 'London Central Branch',
    staffMember: 'Sophie Taylor',
    createdAt: '2026-09-07T15:45:00Z'
  },
  {
    id: 'sale-005',
    receiptNumber: 'REC-2026-4405',
    customerName: 'Hannah Moore',
    customerPhone: '+44 7733 445566',
    customerEmail: 'hannah.m@studio.com',
    items: [
      { name: 'Screen Replacement Service (iPhone 14)', price: 115.00, qty: 1 }
    ],
    subtotal: 95.83,
    vat: 19.17,
    total: 115.00,
    paymentMethod: 'Card / Chip & PIN',
    status: 'completed',
    branch: 'London Central Branch',
    staffMember: 'Marcus Vance',
    createdAt: '2026-09-07T12:10:00Z'
  }
];

export function getSavedSales() {
  if (typeof window === 'undefined') return INITIAL_STAFF_SALES;
  try {
    const saved = localStorage.getItem('phonesuite_staff_sales');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return INITIAL_STAFF_SALES;
}

export function persistSales(list) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('phonesuite_staff_sales', JSON.stringify(list));
  } catch (e) {}
}

// -------------------------------------------------------------
// ONLINE ORDERS FIXTURES & HELPERS (Customer Portal Orders)
// -------------------------------------------------------------
export const INITIAL_ONLINE_ORDERS = [
  {
    id: 'ord-101',
    orderNumber: 'ORD-2026-9801',
    customerName: 'Marcus Bell',
    customerPhone: '+44 7711 334455',
    customerEmail: 'm.bell99@gmail.com',
    deliveryAddress: '19 Greenwich Church St, London SE10 9BJ',
    fulfillmentType: 'delivery',
    items: [
      { name: 'Apple iPhone 15 Pro 128GB (Natural Titanium)', price: 899.00, qty: 1, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80' },
      { name: '30W USB-C Fast Charging Kit', price: 35.00, qty: 1, image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80' }
    ],
    total: 934.00,
    subtotal: 778.33,
    vat: 155.67,
    paymentMethod: 'Card (Stripe Online Checkout)',
    paymentStatus: 'paid',
    fulfillmentStatus: 'awaiting_dispatch', // 'awaiting_dispatch' | 'dispatched' | 'delivered'
    createdAt: '2026-09-10T08:15:00Z',
    trackingCode: 'GB-PS-89128',
    branch: 'London Central Branch'
  },
  {
    id: 'ord-102',
    orderNumber: 'ORD-2026-9794',
    customerName: 'Eleanor Wright',
    customerPhone: '+44 7822 456789',
    customerEmail: 'eleanor.w@cloudmail.co.uk',
    deliveryAddress: 'Store Pickup: London Central Branch (Baker St)',
    fulfillmentType: 'pickup',
    items: [
      { name: 'Apple AirPods Max (Space Grey)', price: 499.00, qty: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80' }
    ],
    total: 499.00,
    subtotal: 415.83,
    vat: 83.17,
    paymentMethod: 'Apple Pay (Online Portal)',
    paymentStatus: 'paid',
    fulfillmentStatus: 'awaiting_dispatch',
    createdAt: '2026-09-09T17:40:00Z',
    trackingCode: 'PICKUP-LON-044',
    branch: 'London Central Branch'
  },
  {
    id: 'ord-103',
    orderNumber: 'ORD-2026-9788',
    customerName: 'Sarah Jenkins',
    customerPhone: '+44 7922 112233',
    customerEmail: 's.jenkins@outlook.com',
    deliveryAddress: '72 Highbury New Park, London N5 2DJ',
    fulfillmentType: 'delivery',
    items: [
      { name: 'Samsung Galaxy S24 Ultra 256GB', price: 1049.00, qty: 1, image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80' },
      { name: 'Belkin Wireless Duo Charging Pad', price: 45.00, qty: 1, image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80' }
    ],
    total: 1094.00,
    subtotal: 911.67,
    vat: 182.33,
    paymentMethod: 'Google Pay (Online Checkout)',
    paymentStatus: 'paid',
    fulfillmentStatus: 'dispatched',
    createdAt: '2026-09-09T14:20:00Z',
    trackingCode: 'DPD-GB-9921448',
    branch: 'London Central Branch'
  },
  {
    id: 'ord-104',
    orderNumber: 'ORD-2026-9772',
    customerName: 'David Kim',
    customerPhone: '+44 7788 990011',
    customerEmail: 'david.kim@fintech.co.uk',
    deliveryAddress: '14 Canary Wharf Pier, London E14 4SG',
    fulfillmentType: 'delivery',
    items: [
      { name: 'MacBook Air 15" M3 512GB (Midnight)', price: 1399.00, qty: 1, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80' }
    ],
    total: 1399.00,
    subtotal: 1165.83,
    vat: 233.17,
    paymentMethod: 'Card (Stripe Online Checkout)',
    paymentStatus: 'paid',
    fulfillmentStatus: 'delivered',
    createdAt: '2026-09-08T11:05:00Z',
    trackingCode: 'ROYALMAIL-TRK-7718',
    branch: 'London Central Branch'
  }
];

export function getSavedOnlineOrders() {
  if (typeof window === 'undefined') return INITIAL_ONLINE_ORDERS;
  try {
    const saved = localStorage.getItem('phonesuite_staff_online_orders');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return INITIAL_ONLINE_ORDERS;
}

export function persistOnlineOrders(list) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('phonesuite_staff_online_orders', JSON.stringify(list));
  } catch (e) {}
}

// -------------------------------------------------------------
// FINANCE APPLICATIONS / REQUESTS FIXTURES & HELPERS
// (Installment Credit Decisioning for Tenant Approval)
// -------------------------------------------------------------
export const INITIAL_FINANCE_REQUESTS = [
  {
    id: 'fin-201',
    customerId: 'cust-005',
    applicationNumber: 'FIN-2026-0412',
    customerName: 'Liam O\'Connor',
    customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    customerStatus: 'Regular Customer',
    customerPhone: '+44 7899 112233',
    customerEmail: 'liam.oc@devstudio.co.uk',
    customerAddress: '22 Brick Lane, Tower Hamlets, London E1 6RF',
    creditScore: 745,
    creditTier: 'Excellent',
    creditLimit: 2500.00,
    employmentStatus: 'Full-Time Software Engineer (£3,800/mo net)',
    employerName: 'DevStudio Cloud Labs Ltd',
    jobTitle: 'Senior Full-Stack Engineer',
    employmentType: 'Permanent Full-Time',
    monthlyIncome: 3800.00,
    payrollVerified: true,
    requestedItem: 'Apple iPhone 15 Pro Max 256GB (Natural Titanium)',
    itemPrice: 1199.00,
    downPayment: 150.00,
    financedAmount: 1049.00,
    installmentAmount: 48.50,
    installmentFrequency: 'monthly',
    termMonths: 24,
    interestRate: '0% Promotional RTO',
    affordabilityScore: '94% Affordability Index (Open Banking Verified)',
    status: 'pending_review', // 'pending_review' | 'approved' | 'guarantor_required' | 'rejected'
    decisionNotes: '',
    createdAt: '2026-09-10T07:45:00Z',
    branch: 'London Central Branch',
    products: [
      {
        id: 'p-101',
        name: 'Apple iPhone 15 Pro Max 256GB (Natural Titanium)',
        specs: 'A17 Pro Bionic, 48MP Triple Camera, 6.7" Super Retina XDR OLED, USB-C',
        price: 1199.00,
        vat: 199.83,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'fin-202',
    customerId: 'cust-004',
    applicationNumber: 'FIN-2026-0413',
    customerName: 'Chloe Bennett',
    customerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    customerStatus: 'New Customer',
    customerPhone: '+44 7933 671234',
    customerEmail: 'chloe.bennett@designcraft.com',
    customerAddress: '34 Shoreditch High St, London E1 6PG',
    creditScore: 685,
    creditTier: 'Good',
    creditLimit: 1800.00,
    employmentStatus: 'Self-Employed Graphic Designer (£2,400/mo)',
    employerName: 'DesignCraft Studio Ltd',
    jobTitle: 'Lead Brand Identity Designer',
    employmentType: 'Self-Employed (3+ yrs)',
    monthlyIncome: 2400.00,
    payrollVerified: true,
    requestedItem: 'Apple iPad Pro 12.9" M2 256GB + Apple Pencil 2',
    itemPrice: 989.00,
    downPayment: 100.00,
    financedAmount: 889.00,
    installmentAmount: 39.80,
    installmentFrequency: 'monthly',
    termMonths: 24,
    interestRate: '0% Promotional RTO',
    affordabilityScore: '86% Affordability Index',
    status: 'pending_review',
    decisionNotes: '',
    createdAt: '2026-09-09T18:20:00Z',
    branch: 'London Central Branch',
    products: [
      {
        id: 'p-102',
        name: 'Apple iPad Pro 12.9" M2 256GB (Space Grey)',
        specs: 'Apple Silicon M2, Liquid Retina XDR Mini-LED, ProMotion 120Hz',
        price: 860.00,
        vat: 143.33,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'p-103',
        name: 'Apple Pencil (2nd Generation)',
        specs: 'Magnetic Pairing & Charging, Wireless Bluetooth, Pressure Sensitivity',
        price: 129.00,
        vat: 21.50,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'fin-203',
    customerId: 'cust-006',
    applicationNumber: 'FIN-2026-0409',
    customerName: 'Marcus Vance',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    customerStatus: 'Regular Customer',
    customerPhone: '+44 7700 900789',
    customerEmail: 'm.vance@techmedia.co.uk',
    customerAddress: '88 Deansgate, Manchester M3 2FW',
    creditScore: 810,
    creditTier: 'Excellent',
    creditLimit: 3500.00,
    employmentStatus: 'Senior Studio Producer (£4,200/mo net)',
    employerName: 'MediaWorks UK Broadcasting',
    jobTitle: 'Senior Studio Producer & Director',
    employmentType: 'Permanent Full-Time (5+ yrs)',
    monthlyIncome: 4200.00,
    payrollVerified: true,
    requestedItem: 'MacBook Pro 16" M3 Max 1TB (Space Black)',
    itemPrice: 2899.00,
    downPayment: 350.00,
    financedAmount: 2549.00,
    installmentAmount: 112.50,
    installmentFrequency: 'monthly',
    termMonths: 24,
    interestRate: '0% Promotional RTO',
    affordabilityScore: '98% Affordability Index (Instant Pass)',
    status: 'approved',
    decisionNotes: 'Clean credit history, approved with £350 upfront downpayment.',
    createdAt: '2026-09-08T14:10:00Z',
    branch: 'London Central Branch',
    products: [
      {
        id: 'p-104',
        name: 'MacBook Pro 16" M3 Max 1TB (Space Black)',
        specs: '16-Core CPU, 40-Core GPU, 48GB Unified Memory, 1TB SSD Storage',
        price: 2899.00,
        vat: 483.17,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'fin-204',
    customerId: 'cust-007',
    applicationNumber: 'FIN-2026-0401',
    customerName: 'Jordan Reed',
    customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    customerStatus: 'New Customer',
    customerPhone: '+44 7766 554433',
    customerEmail: 'jordan.reed@freemail.co.uk',
    customerAddress: '5 Stratford Broadway, London E15 4BQ',
    creditScore: 540,
    creditTier: 'High Risk',
    creditLimit: 600.00,
    employmentStatus: 'Part-Time Courier (£1,100/mo)',
    employerName: 'Express Logistics Courier Network',
    jobTitle: 'Dispatch Driver / Courier',
    employmentType: 'Part-Time Contractor',
    monthlyIncome: 1100.00,
    payrollVerified: false,
    requestedItem: 'Sony PlayStation 5 Pro Console + 2 DualSense Controllers',
    itemPrice: 799.00,
    downPayment: 50.00,
    financedAmount: 749.00,
    installmentAmount: 68.00,
    installmentFrequency: 'monthly',
    termMonths: 12,
    interestRate: '0% Promotional RTO',
    affordabilityScore: '42% Affordability Index (High Debt-to-Income)',
    status: 'guarantor_required',
    decisionNotes: 'Requested UK homeowner guarantor or 35% cash downpayment.',
    createdAt: '2026-09-07T16:30:00Z',
    branch: 'London Central Branch',
    products: [
      {
        id: 'p-105',
        name: 'Sony PlayStation 5 Pro Console 2TB',
        specs: 'PlayStation Spectral Super Resolution (PSSR), Enhanced Ray Tracing, 2TB SSD',
        price: 699.00,
        vat: 116.50,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'p-106',
        name: 'DualSense Wireless Controller (Midnight Black)',
        specs: 'Haptic Feedback, Dynamic Adaptive Triggers, Built-in Microphone',
        price: 100.00,
        vat: 16.67,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80'
      }
    ]
  }
];

export function getSavedFinanceRequests() {
  if (typeof window === 'undefined') return INITIAL_FINANCE_REQUESTS;
  try {
    const saved = localStorage.getItem('phonesuite_staff_finance_requests');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return INITIAL_FINANCE_REQUESTS;
}

export function persistFinanceRequests(list) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('phonesuite_staff_finance_requests', JSON.stringify(list));
  } catch (e) {}
}
