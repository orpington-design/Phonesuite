'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  ShoppingBag, 
  Wrench, 
  CreditCard, 
  Calendar, 
  Building2, 
  MessageSquare, 
  FileText, 
  Plus, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { 
  getSavedStaffCustomers, 
  getSavedFinanceRequests,
  formatMoney 
} from '../../data/staffData';
import { StaffLanguageProvider, useStaffLanguage } from '../../context/StaffLanguageContext';

export default function CustomerDetailPage() {
  return (
    <StaffLanguageProvider>
      <CustomerDetailContent />
    </StaffLanguageProvider>
  );
}

function CustomerDetailContent() {
  const router = useRouter();
  const params = useParams();
  const tenantSlug = params?.tenantSlug || 'premiumphonex';
  const customerId = params?.customerId;
  const { language } = useStaffLanguage();

  const [customers] = useState(() => getSavedStaffCustomers());
  const [financeRequests] = useState(() => getSavedFinanceRequests());
  const [customer, setCustomer] = useState(null);
  const [matchedFinanceReq, setMatchedFinanceReq] = useState(null);

  useEffect(() => {
    // 1. Direct search by ID
    let found = customers.find(c => c.id === customerId);

    // 2. Search if customerId is a finance requestId (e.g. fin-201)
    if (!found) {
      const financeReq = financeRequests.find(f => f.id === customerId || f.applicationNumber === customerId);
      if (financeReq) {
        setMatchedFinanceReq(financeReq);
        found = customers.find(c => 
          c.id === financeReq.customerId || 
          c.phone === financeReq.customerPhone || 
          c.name?.toLowerCase() === financeReq.customerName?.toLowerCase()
        );
        if (!found) {
          // Construct customer object from finance request
          found = {
            id: financeReq.customerId || financeReq.id,
            name: financeReq.customerName,
            avatar: financeReq.customerAvatar,
            phone: financeReq.customerPhone,
            email: financeReq.customerEmail,
            credit_score: financeReq.creditScore,
            credit_limit: financeReq.creditLimit,
            tier: financeReq.creditTier === 'Excellent' ? 'Platinum VIP' : 'Gold Member',
            status: financeReq.customerStatus || 'Regular Customer',
            address: financeReq.customerAddress,
            total_spent: 2450.00,
            active_repairs_count: 0,
            overdue_count: 0,
            kyc_status: 'Verified (Passport & Open Banking)',
            member_since: 'April 2024',
            orders_history: [
              { orderNumber: 'ORD-2025-7822', date: '2025-10-18', item: 'Apple AirPods Max (Space Grey)', amount: 499.00, status: 'Delivered' }
            ],
            finance_agreements_history: [
              { agreementNumber: 'RTO-2024-052', device: 'Apple iPhone 14 Pro Max 256GB', totalFinanced: 1199.00, installmentsPaid: 24, totalInstallments: 24, status: 'Completed (Paid in Full)', onTimeRate: '100%' }
            ],
            repairs_history: []
          };
        }
      }
    }

    if (found) {
      setCustomer(found);
      if (!matchedFinanceReq) {
        const matchingReq = financeRequests.find(f => 
          f.customerId === found.id || 
          f.customerPhone === found.phone || 
          f.customerName?.toLowerCase() === found.name?.toLowerCase()
        );
        if (matchingReq) setMatchedFinanceReq(matchingReq);
      }
    } else if (customers.length > 0) {
      setCustomer(customers[0]);
    }
  }, [customers, financeRequests, customerId, matchedFinanceReq]);

  if (!customer) {
    return (
      <div className="mobile-portal-wrapper" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#64748b', fontWeight: '600' }}>Loading customer profile...</p>
      </div>
    );
  }

  const isRegular = customer.status === 'Regular Customer' || customer.id === 'cust-001' || customer.id === 'cust-005';
  const cleanPhone = customer.phone?.replace(/[^0-9]/g, '');

  return (
    <div className="mobile-portal-wrapper">
      <div className="mobile-app-shell">

        {/* Header */}
        <header 
          className="mobile-header mobile-header-dark" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            backgroundColor: '#0b132b', 
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0.75rem 1rem'
          }}
        >
          <button
            type="button"
            onClick={() => router.back()}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '10px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.94rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.02em' }}>
              Customer Details
            </div>
            <div style={{ fontSize: '0.66rem', color: '#94a3b8', fontWeight: '600' }}>
              #{customer.id}
            </div>
          </div>

          <div style={{ width: '40px' }} />
        </header>

        {/* Main Content */}
        <main className="mobile-scroll-body" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '3.5rem' }}>

          {/* 1. Customer Hero Card */}
          <div 
            style={{ 
              background: '#ffffff', 
              borderRadius: '18px', 
              border: '1px solid #e2e8f0', 
              padding: '1.25rem',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            {/* Large Avatar with Online Indicator */}
            <div style={{ position: 'relative', marginBottom: '0.65rem' }}>
              {customer.avatar ? (
                <img 
                  src={customer.avatar} 
                  alt={customer.name} 
                  style={{ width: '68px', height: '68px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
                />
              ) : (
                <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff7a00, #ea580c)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '900' }}>
                  {customer.name?.charAt(0)}
                </div>
              )}
              <span style={{ position: 'absolute', bottom: 2, right: 2, width: '15px', height: '15px', borderRadius: '50%', background: '#10b981', border: '2px solid #ffffff' }} />
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0f172a', margin: '0 0 4px 0' }}>
              {customer.name}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '2px' }}>
              <span style={{ fontSize: '0.66rem', fontWeight: '800', padding: '2px 8px', borderRadius: '9999px', background: isRegular ? '#ecfdf5' : '#eff6ff', color: isRegular ? '#059669' : '#1d4ed8', border: isRegular ? '1px solid #a7f3d0' : '1px solid #bfdbfe' }}>
                {customer.tier || (isRegular ? 'Regular Customer' : 'New Customer')}
              </span>
              <span style={{ fontSize: '0.66rem', fontWeight: '700', padding: '2px 8px', borderRadius: '9999px', background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }}>
                Member since {customer.member_since || '2024'}
              </span>
            </div>

            {/* Quick Action Buttons (Call, WhatsApp, Email, Sale) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', width: '100%', marginTop: '1.1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
              <a 
                href={`tel:${customer.phone}`}
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none', color: '#0f172a', fontSize: '0.68rem', fontWeight: '800' }}
              >
                <Phone size={18} color="#ea580c" />
                <span>Call</span>
              </a>

              <a 
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '10px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none', color: '#065f46', fontSize: '0.68rem', fontWeight: '800' }}
              >
                <MessageSquare size={18} color="#10b981" />
                <span>WhatsApp</span>
              </a>

              <a 
                href={`mailto:${customer.email}`}
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none', color: '#0f172a', fontSize: '0.68rem', fontWeight: '800' }}
              >
                <Mail size={18} color="#0284c7" />
                <span>Email</span>
              </a>

              <button
                type="button"
                onClick={() => router.push(`/${tenantSlug}/staff/new-sale`)}
                style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', padding: '10px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#c2410c', fontSize: '0.68rem', fontWeight: '800', cursor: 'pointer' }}
              >
                <Plus size={18} color="#ea580c" />
                <span>New Sale</span>
              </button>
            </div>
          </div>

          {/* 2. Key Tenant Financial Summary Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '0.9rem', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '0.64rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800' }}>Lifetime Store Spend</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0f172a', marginTop: '2px' }}>
                {formatMoney(customer.total_spent)}
              </div>
              <div style={{ fontSize: '0.64rem', color: '#10b981', fontWeight: '700', marginTop: '2px' }}>
                ✓ Clean Payment Ledger
              </div>
            </div>

            <div 
              onClick={() => {
                if (matchedFinanceReq) {
                  router.push(`/${tenantSlug}/staff/finance/${matchedFinanceReq.id}/credit`);
                }
              }}
              style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '0.9rem', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', cursor: matchedFinanceReq ? 'pointer' : 'default' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.64rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800' }}>Credit Score</span>
                {matchedFinanceReq && <ChevronRight size={13} color="#ea580c" />}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '900', color: customer.credit_score >= 700 ? '#10b981' : '#f59e0b', marginTop: '2px' }}>
                {customer.credit_score || 745} <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '600' }}>/ 1,000</span>
              </div>
              <div style={{ fontSize: '0.64rem', color: '#ea580c', fontWeight: '700', marginTop: '2px' }}>
                Limit: {formatMoney(customer.credit_limit)}
              </div>
            </div>
          </div>

          {/* 3. Address & KYC Information Card */}
          <div 
            style={{ 
              background: '#ffffff', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              padding: '1.1rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)' 
            }}
          >
            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
              VERIFIED IDENTIFICATION &amp; ADDRESS
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#334155', fontSize: '0.78rem' }}>
              <MapPin size={16} color="#ea580c" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Registered Address:</strong>
                <div>{customer.address}</div>
              </div>
            </div>

            <div style={{ marginTop: '0.85rem', padding: '0.65rem 0.85rem', background: '#ecfdf5', borderRadius: '10px', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.74rem', color: '#065f46' }}>
              <ShieldCheck size={16} color="#10b981" style={{ flexShrink: 0 }} />
              <div>
                <strong>KYC Status:</strong> {customer.kyc_status || 'Verified via UK Driving Licence & Open Banking'}.
              </div>
            </div>
          </div>

          {/* 4. Previous Orders & Invoices with this Tenant */}
          <div 
            style={{ 
              background: '#ffffff', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              padding: '1.1rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShoppingBag size={15} color="#ea580c" />
                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  PURCHASE HISTORY ({customer.orders_history?.length || 0})
                </span>
              </div>
              <span style={{ fontSize: '0.64rem', color: '#64748b', fontWeight: '700' }}>Tenant Store Invoices</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(customer.orders_history || []).map((order, idx) => (
                <div 
                  key={idx} 
                  style={{ background: '#f8fafc', padding: '0.65rem 0.8rem', borderRadius: '10px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem' }}
                >
                  <div>
                    <div style={{ fontWeight: '800', color: '#0f172a' }}>{order.item}</div>
                    <div style={{ fontSize: '0.66rem', color: '#64748b', marginTop: '1px' }}>
                      #{order.orderNumber} &bull; {new Date(order.date).toLocaleDateString('en-GB')}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '900', color: '#0f172a' }}>{formatMoney(order.amount)}</div>
                    <span style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: '800' }}>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Past Financing & RTO Leases with this Tenant */}
          {(customer.finance_agreements_history || []).length > 0 && (
            <div 
              style={{ 
                background: '#ffffff', 
                borderRadius: '16px', 
                border: '1px solid #e2e8f0', 
                padding: '1.1rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.75rem' }}>
                <CreditCard size={15} color="#ea580c" />
                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  FINANCING &amp; LEASING AGREEMENTS
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {customer.finance_agreements_history.map((agr, idx) => (
                  <div key={idx} style={{ background: '#ecfdf5', padding: '0.7rem 0.85rem', borderRadius: '10px', border: '1px solid #a7f3d0', fontSize: '0.76rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: '900', color: '#065f46' }}>{agr.device}</div>
                        <div style={{ fontSize: '0.66rem', color: '#047857', marginTop: '2px' }}>
                          Agreement #{agr.agreementNumber} &bull; {agr.installmentsPaid}/{agr.totalInstallments} Installments
                        </div>
                      </div>
                      <span style={{ fontWeight: '900', color: '#065f46' }}>{formatMoney(agr.totalFinanced)}</span>
                    </div>
                    <div style={{ marginTop: '4px', fontSize: '0.66rem', color: '#059669', fontWeight: '700' }}>
                      ✓ {agr.status} &bull; On-Time Ratio: {agr.onTimeRate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Repairs History */}
          {(customer.repairs_history || []).length > 0 && (
            <div 
              style={{ 
                background: '#ffffff', 
                borderRadius: '16px', 
                border: '1px solid #e2e8f0', 
                padding: '1.1rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.75rem' }}>
                <Wrench size={15} color="#ea580c" />
                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  WORKSHOP REPAIRS ({customer.repairs_history.length})
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {customer.repairs_history.map((rep, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', padding: '0.65rem 0.8rem', borderRadius: '10px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem' }}>
                    <div>
                      <div style={{ fontWeight: '800', color: '#0f172a' }}>{rep.device}</div>
                      <div style={{ fontSize: '0.66rem', color: '#64748b' }}>{rep.issue} ({rep.status})</div>
                    </div>
                    <div style={{ fontWeight: '900', color: '#0f172a' }}>{formatMoney(rep.cost)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>

      </div>
    </div>
  );
}
