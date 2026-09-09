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

export const INITIAL_STAFF_CUSTOMERS = [
  {
    id: 'cust-001',
    name: 'Daniel Harris',
    phone: '+44 7911 123456',
    email: 'd.harris@example.com',
    credit_score: 785,
    credit_limit: 2500.00,
    tier: 'Platinum VIP',
    address: '42 Baker Street, Marylebone, London NW1 6XE',
    total_spent: 3450.00,
    active_repairs_count: 1,
    overdue_count: 0
  },
  {
    id: 'cust-002',
    name: 'Eleanor Wright',
    phone: '+44 7822 456789',
    email: 'eleanor.w@cloudmail.co.uk',
    credit_score: 610,
    credit_limit: 1200.00,
    tier: 'Gold Member',
    address: '15 Gloucester Rd, Kensington, London SW7 4PP',
    total_spent: 1890.00,
    active_repairs_count: 1,
    overdue_count: 1
  },
  {
    id: 'cust-003',
    name: 'James Rodriguez',
    phone: '+44 7755 890123',
    email: 'j.rodriguez@techhub.io',
    credit_score: 820,
    credit_limit: 4000.00,
    tier: 'Platinum VIP',
    address: '88 Camden High St, London NW1 0LT',
    total_spent: 5600.00,
    active_repairs_count: 0,
    overdue_count: 1
  },
  {
    id: 'cust-004',
    name: 'Chloe Bennett',
    phone: '+44 7933 671234',
    email: 'chloe.bennett@designcraft.com',
    credit_score: 740,
    credit_limit: 2000.00,
    tier: 'Silver Member',
    address: '34 Shoreditch High St, London E1 6PG',
    total_spent: 850.00,
    active_repairs_count: 1,
    overdue_count: 0
  }
];

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
