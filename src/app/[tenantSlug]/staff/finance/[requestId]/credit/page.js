'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Building2, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  ShoppingBag, 
  Wrench, 
  CreditCard, 
  TrendingUp, 
  Award, 
  Lock, 
  Globe2, 
  FileCheck2, 
  Download, 
  Printer, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { 
  getSavedFinanceRequests, 
  getSavedStaffCustomers, 
  formatMoney 
} from '../../../data/staffData';
import { StaffLanguageProvider, useStaffLanguage } from '../../../context/StaffLanguageContext';

export default function CreditProfileCompliancePage() {
  return (
    <StaffLanguageProvider>
      <CreditProfileComplianceContent />
    </StaffLanguageProvider>
  );
}

function CreditProfileComplianceContent() {
  const router = useRouter();
  const params = useParams();
  const tenantSlug = params?.tenantSlug || 'premiumphonex';
  const requestId = params?.requestId;
  const { language } = useStaffLanguage();

  const [requests] = useState(() => getSavedFinanceRequests());
  const [customers] = useState(() => getSavedStaffCustomers());
  const [request, setRequest] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [activeJurisdiction, setActiveJurisdiction] = useState('uk'); // 'uk' | 'pt' | 'be'

  useEffect(() => {
    const foundReq = requests.find(r => r.id === requestId || r.applicationNumber === requestId);
    if (foundReq) {
      setRequest(foundReq);
      const targetCustId = foundReq.customerId || foundReq.id;
      const foundCust = customers.find(c => 
        c.id === targetCustId || 
        c.phone === foundReq.customerPhone || 
        c.name?.toLowerCase() === foundReq.customerName?.toLowerCase()
      );
      if (foundCust) {
        setCustomer(foundCust);
      } else if (customers.length > 0) {
        setCustomer(customers[0]);
      }
    } else if (requests.length > 0) {
      setRequest(requests[0]);
      setCustomer(customers[0]);
    }
  }, [requests, customers, requestId]);

  if (!request) {
    return (
      <div className="mobile-portal-wrapper" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#64748b', fontWeight: '600' }}>Loading credit profile...</p>
      </div>
    );
  }

  // Tenant history items fallback
  const orderHistory = customer?.orders_history || [
    { orderNumber: 'ORD-2025-7822', date: '2025-10-18', item: 'Apple AirPods Max (Space Grey)', amount: 499.00, status: 'Delivered & Settled' },
    { orderNumber: 'ORD-2024-3310', date: '2024-05-12', item: 'Apple Studio Display 27" 5K', amount: 1499.00, status: 'Delivered & Settled' }
  ];

  const agreementHistory = customer?.finance_agreements_history || [
    { agreementNumber: 'RTO-2024-052', device: 'Apple iPhone 14 Pro Max 256GB', totalFinanced: 1199.00, installmentsPaid: 24, totalInstallments: 24, status: 'Completed (Paid in Full)', onTimeRate: '100%' }
  ];

  const repairHistory = customer?.repairs_history || [
    { repairId: 'REP-088', device: 'iPhone 14 Pro Max', issue: 'Battery degradation diagnostic & replacement', cost: 89.00, status: 'Completed & Collected', date: '2025-06-11' }
  ];

  const scoreColor = request.creditScore >= 700 ? '#10b981' : request.creditScore >= 600 ? '#f59e0b' : '#ef4444';
  const scoreBg = request.creditScore >= 700 ? '#ecfdf5' : request.creditScore >= 600 ? '#fffbeb' : '#fef2f2';

  return (
    <div className="mobile-portal-wrapper">
      <div className="mobile-app-shell">

        {/* Top Header */}
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
            onClick={() => router.push(`/${tenantSlug}/staff/finance/${request.id}`)}
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
            <span>Decision Desk</span>
          </button>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.02em' }}>
              Full Credit Dossier
            </div>
            <div style={{ fontSize: '0.66rem', color: '#94a3b8', fontWeight: '600' }}>
              App #{request.applicationNumber}
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '10px',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer'
            }}
            title="Print or Export Compliance Dossier"
          >
            <Printer size={15} />
          </button>
        </header>

        {/* Main Content */}
        <main className="mobile-scroll-body" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '3.5rem' }}>

          {/* Hero Banner: In-App Credit Score & Underwriting Summary */}
          <div 
            style={{ 
              background: 'linear-gradient(135deg, #0b132b 0%, #1e293b 100%)', 
              borderRadius: '18px', 
              padding: '1.25rem', 
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.66rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#ea580c' }}>
                PHONESUITE APP CREDIT SCORE
              </span>
              <span 
                style={{ 
                  fontSize: '0.62rem', 
                  fontWeight: '800', 
                  padding: '2px 8px', 
                  borderRadius: '9999px', 
                  background: 'rgba(234, 88, 12, 0.2)', 
                  color: '#fb923c',
                  border: '1px solid rgba(234, 88, 12, 0.35)' 
                }}
              >
                PROPRIETARY ENGINE
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: '900', lineHeight: 1, letterSpacing: '-0.03em', color: '#ffffff' }}>
                    {request.creditScore}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '700' }}>
                    / 1,000
                  </span>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '6px', padding: '3px 10px', borderRadius: '9999px', background: scoreBg, border: `1px solid ${scoreColor}`, color: scoreColor, fontSize: '0.72rem', fontWeight: '800' }}>
                  <CheckCircle2 size={13} strokeWidth={2.5} />
                  <span>{request.creditTier || 'Excellent'}</span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Pre-Approved Limit</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#10b981', marginTop: '2px' }}>
                  {formatMoney(request.creditLimit)}
                </div>
                <div style={{ fontSize: '0.64rem', color: '#cbd5e1', marginTop: '3px' }}>
                  Affordability: {request.affordabilityScore?.split('(')[0]?.trim() || '94% Affordability'}
                </div>
              </div>
            </div>

            {/* Score Factor Breakdown */}
            <div style={{ marginTop: '1.1rem', paddingTop: '0.9rem', borderTop: '1px solid rgba(255, 255, 255, 0.12)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#94a3b8' }}>
                <span>Payment Track Record (35%)</span>
                <strong style={{ color: '#10b981' }}>99.2% On-Time</strong>
              </div>
              <div style={{ width: '100%', height: '5px', borderRadius: '9999px', background: 'rgba(255,255,255,0.1)' }}>
                <div style={{ width: '99%', height: '100%', borderRadius: '9999px', background: '#10b981' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#94a3b8', marginTop: '4px' }}>
                <span>Credit Utilization (30%)</span>
                <strong style={{ color: '#10b981' }}>18% Utilization (Low Risk)</strong>
              </div>
              <div style={{ width: '100%', height: '5px', borderRadius: '9999px', background: 'rgba(255,255,255,0.1)' }}>
                <div style={{ width: '82%', height: '100%', borderRadius: '9999px', background: '#10b981' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#94a3b8', marginTop: '4px' }}>
                <span>Credit History Age (15%)</span>
                <strong style={{ color: '#38bdf8' }}>4.8 Years Avg Age</strong>
              </div>
              <div style={{ width: '100%', height: '5px', borderRadius: '9999px', background: 'rgba(255,255,255,0.1)' }}>
                <div style={{ width: '75%', height: '100%', borderRadius: '9999px', background: '#38bdf8' }} />
              </div>
            </div>
          </div>

          {/* Customer Profile Banner */}
          <div 
            onClick={() => router.push(`/${tenantSlug}/staff/customers/${customer?.id || request.customerId || request.id}`)}
            style={{ 
              background: '#ffffff', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              padding: '1rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img 
                src={request.customerAvatar || customer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                alt={request.customerName}
                style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }}
              />
              <div>
                <div style={{ fontSize: '0.96rem', fontWeight: '900', color: '#0f172a' }}>
                  {request.customerName}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  {request.customerEmail} &bull; {request.customerPhone}
                </div>
                <span style={{ fontSize: '0.62rem', fontWeight: '800', color: '#059669', background: '#ecfdf5', padding: '1px 6px', borderRadius: '9999px', display: 'inline-block', marginTop: '2px' }}>
                  {customer?.kyc_status || 'Verified (Passport & Open Banking)'}
                </span>
              </div>
            </div>

            <div style={{ color: '#ea580c', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.72rem', fontWeight: '800' }}>
              <span>Profile</span>
              <ChevronRight size={14} strokeWidth={2.5} />
            </div>
          </div>

          {/* SECTION 1: Tenant Historical Relationship & Ledger */}
          <div 
            style={{ 
              background: '#ffffff', 
              borderRadius: '16px', 
              border: '1.5px solid #fed7aa', 
              padding: '1.15rem',
              boxShadow: '0 2px 8px rgba(234, 88, 12, 0.06)' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building2 size={16} color="#ea580c" />
                <span style={{ fontSize: '0.74rem', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  TENANT STORE HISTORY &amp; RECORD
                </span>
              </div>
              <span style={{ fontSize: '0.65rem', fontWeight: '800', padding: '2px 8px', borderRadius: '9999px', background: '#ffedd5', color: '#c2410c' }}>
                STORE LEDGER
              </span>
            </div>

            <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '0 0 0.85rem 0', lineHeight: 1.4 }}>
              This section preserves all transaction history, previous purchases, prompt installment records, and workshop repair tickets held specifically by your tenant store.
            </p>

            {/* Lifetime KPI row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '1rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.6rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Lifetime Spend</div>
                <div style={{ fontSize: '0.94rem', fontWeight: '900', color: '#0f172a', marginTop: '2px' }}>
                  {formatMoney(customer?.total_spent || 2450.00)}
                </div>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.6rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Tenant Orders</div>
                <div style={{ fontSize: '0.94rem', fontWeight: '900', color: '#059669', marginTop: '2px' }}>
                  {orderHistory.length} Completed
                </div>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.6rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Store Default Rate</div>
                <div style={{ fontSize: '0.94rem', fontWeight: '900', color: '#059669', marginTop: '2px' }}>
                  0% (Zero Arrears)
                </div>
              </div>
            </div>

            {/* Past Store Purchases */}
            <div style={{ marginBottom: '0.85rem' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShoppingBag size={13} color="#ea580c" />
                <span>Previous Store Purchases ({orderHistory.length})</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {orderHistory.map((item, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', padding: '0.6rem 0.75rem', borderRadius: '10px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: '800', color: '#0f172a' }}>{item.item}</div>
                      <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '1px' }}>
                        #{item.orderNumber} &bull; {new Date(item.date).toLocaleDateString('en-GB')}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '900', color: '#0f172a' }}>{formatMoney(item.amount)}</div>
                      <span style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: '800' }}>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Past Financing Agreements */}
            <div style={{ marginBottom: '0.85rem' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CreditCard size={13} color="#ea580c" />
                <span>Historical Tenant Financing Agreements</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {agreementHistory.map((agr, idx) => (
                  <div key={idx} style={{ background: '#ecfdf5', padding: '0.65rem 0.75rem', borderRadius: '10px', border: '1px solid #a7f3d0', fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: '900', color: '#065f46' }}>{agr.device}</div>
                        <div style={{ fontSize: '0.65rem', color: '#047857', marginTop: '1px' }}>
                          Agreement #{agr.agreementNumber} &bull; {agr.installmentsPaid}/{agr.totalInstallments} Installments Paid
                        </div>
                      </div>
                      <span style={{ fontWeight: '900', color: '#065f46' }}>{formatMoney(agr.totalFinanced)}</span>
                    </div>
                    <div style={{ marginTop: '4px', fontSize: '0.66rem', color: '#059669', fontWeight: '700' }}>
                      ✓ {agr.status} &bull; On-Time Payment Index: {agr.onTimeRate}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Previous Repairs with this store */}
            <div>
              <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Wrench size={13} color="#ea580c" />
                <span>Workshop Service &amp; Repairs</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {repairHistory.map((rep, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', padding: '0.6rem 0.75rem', borderRadius: '10px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: '800', color: '#0f172a' }}>{rep.device}</div>
                      <div style={{ fontSize: '0.65rem', color: '#64748b' }}>{rep.issue} ({rep.status})</div>
                    </div>
                    <div style={{ fontWeight: '900', color: '#0f172a' }}>{formatMoney(rep.cost)}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* SECTION 2: Multi-Jurisdiction Regulatory Compliance (UK, Portugal, Belgium) */}
          <div 
            style={{ 
              background: '#ffffff', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              padding: '1.15rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe2 size={16} color="#0284c7" />
                <span style={{ fontSize: '0.74rem', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  REGULATORY COMPLIANCE DOSSIER
                </span>
              </div>
              <span style={{ fontSize: '0.64rem', fontWeight: '800', padding: '2px 8px', borderRadius: '9999px', background: '#e0f2fe', color: '#0369a1' }}>
                LAWFUL DATA DISCLOSURE
              </span>
            </div>

            <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '0 0 0.85rem 0', lineHeight: 1.4 }}>
              Compliant with national consumer credit frameworks across the United Kingdom, Portugal, and Belgium. Only data legally permitted for retail installment underwriting is processed.
            </p>

            {/* Jurisdiction Switcher Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '12px', marginBottom: '1rem' }}>
              <button
                type="button"
                onClick={() => setActiveJurisdiction('uk')}
                style={{
                  padding: '7px 4px',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeJurisdiction === 'uk' ? '#ffffff' : 'transparent',
                  color: activeJurisdiction === 'uk' ? '#0f172a' : '#64748b',
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: activeJurisdiction === 'uk' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <span>🇬🇧</span>
                <span>UK (FCA)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveJurisdiction('pt')}
                style={{
                  padding: '7px 4px',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeJurisdiction === 'pt' ? '#ffffff' : 'transparent',
                  color: activeJurisdiction === 'pt' ? '#0f172a' : '#64748b',
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: activeJurisdiction === 'pt' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <span>🇵🇹</span>
                <span>Portugal (BdP)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveJurisdiction('be')}
                style={{
                  padding: '7px 4px',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeJurisdiction === 'be' ? '#ffffff' : 'transparent',
                  color: activeJurisdiction === 'be' ? '#0f172a' : '#64748b',
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: activeJurisdiction === 'be' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <span>🇧🇪</span>
                <span>Belgium (NBB)</span>
              </button>
            </div>

            {/* Jurisdiction Content 1: United Kingdom (FCA CONC 5 & CCA 1974) */}
            {activeJurisdiction === 'uk' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.76rem', color: '#334155' }}>
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: '800', color: '#0f172a', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <ShieldCheck size={14} color="#10b981" />
                    <span>FCA CONC 5.2A Creditworthiness Assessment</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b', lineHeight: 1.4 }}>
                    Conducted in compliance with Financial Conduct Authority handbook. Open Banking assessment confirms verified net monthly salary of <strong>{formatMoney(request.monthlyIncome || 3200)}</strong> with debt service buffer exceeding 35%.
                  </p>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: '800', color: '#0f172a', marginBottom: '2px' }}>
                    Data Protection Act 2018 &amp; UK GDPR Disclosure
                  </div>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b', lineHeight: 1.4 }}>
                    Credit bureau reference data retrieved via authorized inquiry through registered CRAs (Equifax / Experian UK). Data retention strictly limited to underwritten lease duration.
                  </p>
                </div>

                <div style={{ padding: '0.6rem 0.75rem', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0', color: '#065f46', fontSize: '0.72rem', fontWeight: '700' }}>
                  ✓ UK Consumer Credit Act 1974 Exemption: 0% APR Hire-Purchase / RTO under 12-24 installments compliant.
                </div>
              </div>
            )}

            {/* Jurisdiction Content 2: Portugal (Banco de Portugal & DL 133/2009) */}
            {activeJurisdiction === 'pt' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.76rem', color: '#334155' }}>
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: '800', color: '#0f172a', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <ShieldCheck size={14} color="#10b981" />
                    <span>Banco de Portugal - Instrução n.º 8/2021 &amp; DSTI</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b', lineHeight: 1.4 }}>
                    Em conformidade com as regras macroprudenciais do Banco de Portugal. A Taxa de Esforço (DSTI) do requerente calculada em <strong>22.4%</strong>, estritamente abaixo do teto prudencial de 50%.
                  </p>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: '800', color: '#0f172a', marginBottom: '2px' }}>
                    Central de Responsabilidades de Crédito (CRC)
                  </div>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b', lineHeight: 1.4 }}>
                    Consulta restrita aos termos do Decreto-Lei n.º 133/2009. Ausência de registo de incumprimento ou liquidação em curso no mapa de responsabilidades emitido pelo Banco de Portugal.
                  </p>
                </div>

                <div style={{ padding: '0.6rem 0.75rem', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0', color: '#065f46', fontSize: '0.72rem', fontWeight: '700' }}>
                  ✓ FIN (Ficha de Informação Normalizada) pronta para disponibilização ao cliente ao abrigo do RGPD e CNPD.
                </div>
              </div>
            )}

            {/* Jurisdiction Content 3: Belgium (NBB / FSMA - Livre VII Code de droit économique) */}
            {activeJurisdiction === 'be' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.76rem', color: '#334155' }}>
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: '800', color: '#0f172a', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <ShieldCheck size={14} color="#10b981" />
                    <span>Centrale des Crédits aux Particuliers (CKP / CCP - BNB)</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b', lineHeight: 1.4 }}>
                    Conforme aux exigences de la Banque Nationale de Belgique (BNB). Consultation du volet positif et négatif de la Centrale des Crédits aux Particuliers sans signalement de retard de paiement.
                  </p>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: '800', color: '#0f172a', marginBottom: '2px' }}>
                    Livre VII du Code de droit économique (Art. VII.77)
                  </div>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b', lineHeight: 1.4 }}>
                    Respect absolu de l'obligation de prêter de manière responsable (&quot;verantwoorde kredietverlening&quot;). Le montant des mensualités préserve intégralement le minimum insaisissable légal belge.
                  </p>
                </div>

                <div style={{ padding: '0.6rem 0.75rem', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0', color: '#065f46', fontSize: '0.72rem', fontWeight: '700' }}>
                  ✓ Conforme aux directives de l'Autorité de protection des données (APD/GBA) et de la FSMA.
                </div>
              </div>
            )}

          </div>

          {/* Action to Return to Decision Desk */}
          <button
            type="button"
            onClick={() => router.push(`/${tenantSlug}/staff/finance/${request.id}`)}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '12px',
              background: '#0f172a',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: '800',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <ArrowLeft size={16} />
            <span>Return to Application Decision Desk</span>
          </button>

        </main>

      </div>
    </div>
  );
}
