'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  FileCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  CreditCard, 
  UserCheck, 
  UserX, 
  Smartphone, 
  Building2, 
  Calendar, 
  DollarSign, 
  FileText,
  User,
  Mail,
  MapPin,
  Check,
  Percent,
  TrendingUp,
  AlertCircle,
  Briefcase,
  Banknote,
  Receipt,
  Layers,
  ShoppingBag
} from 'lucide-react';
import { 
  INITIAL_FINANCE_REQUESTS, 
  getSavedFinanceRequests, 
  persistFinanceRequests 
} from '../../data/staffData';
import { StaffLanguageProvider, useStaffLanguage } from '../../context/StaffLanguageContext';

export default function StaffFinanceDetailPage() {
  return (
    <StaffLanguageProvider>
      <StaffFinanceDetailContent />
    </StaffLanguageProvider>
  );
}

function StaffFinanceDetailContent() {
  const router = useRouter();
  const params = useParams();
  const tenantSlug = params?.tenantSlug || 'premiumphonex';
  const requestId = params?.requestId;
  const { language } = useStaffLanguage();

  const [requests, setRequests] = useState(() => getSavedFinanceRequests());
  const [request, setRequest] = useState(null);
  const [notesInput, setNotesInput] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  useEffect(() => {
    const found = requests.find(r => r.id === requestId || r.applicationNumber === requestId);
    if (found) {
      setRequest(found);
      setNotesInput(found.decisionNotes || '');
    } else if (requests.length > 0) {
      setRequest(requests[0]);
      setNotesInput(requests[0].decisionNotes || '');
    }
  }, [requests, requestId]);

  // Update Decision Status & Persist
  const handleUpdateStatus = (newStatus, autoMsg = '') => {
    if (!request) return;
    const defaultNote = newStatus === 'approved'
      ? 'Approved by store management. Ready for contract execution.'
      : newStatus === 'guarantor_required'
      ? 'Approved conditional on UK homeowner guarantor.'
      : 'Application declined based on affordability index.';

    const updated = { 
      ...request, 
      status: newStatus,
      decisionNotes: autoMsg || request.decisionNotes || defaultNote
    };
    setRequest(updated);
    const updatedList = requests.map(r => r.id === request.id ? updated : r);
    setRequests(updatedList);
    persistFinanceRequests(updatedList);
  };

  const handleSaveNotes = () => {
    if (!request) return;
    const updated = { ...request, decisionNotes: notesInput };
    setRequest(updated);
    const updatedList = requests.map(r => r.id === request.id ? updated : r);
    setRequests(updatedList);
    persistFinanceRequests(updatedList);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  // WhatsApp Templates
  const handleSendWhatsApp = (type = 'general') => {
    if (!request) return;
    let text = '';
    if (type === 'approved' || request.status === 'approved') {
      text = `🎉 GREAT NEWS! Hello ${request.customerName}, your finance application #${request.applicationNumber} for the ${request.requestedItem} has been APPROVED by PhoneSuite UK!\n\nDown Payment: £${Number(request.downPayment).toFixed(2)}\nMonthly Installment: £${Number(request.installmentAmount).toFixed(2)}/mo (${request.termMonths} months)\n\nPlease visit our store at ${request.branch || 'our central branch'} with your photo ID to sign your agreement and collect your device!`;
    } else if (type === 'guarantor' || request.status === 'guarantor_required') {
      text = `Hello ${request.customerName}, this is PhoneSuite UK credit underwriting team regarding finance application #${request.applicationNumber} for the ${request.requestedItem}.\n\nYour preliminary application has been reviewed. To complete your financing approval, our risk department requires a UK guarantor or an increased upfront deposit. Please reply to this message so we can guide you through the next step!`;
    } else {
      text = `Hello ${request.customerName}, this is PhoneSuite UK regarding your finance application #${request.applicationNumber} for ${request.requestedItem}. Do you have any questions regarding your application?`;
    }
    window.open(`https://wa.me/${request.customerPhone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (!request) {
    return (
      <div className="mobile-portal-wrapper" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#64748b', fontWeight: '600' }}>Loading application details...</p>
      </div>
    );
  }

  const isPending = request.status === 'pending_review';
  const isApproved = request.status === 'approved';
  const isGuarantor = request.status === 'guarantor_required';
  const isRejected = request.status === 'rejected';
  const isRegular = request.customerStatus === 'Regular Customer' || request.id === 'fin-201' || request.id === 'fin-203';

  // Score styling
  const scoreColor = request.creditScore >= 700 ? '#10b981' : request.creditScore >= 600 ? '#f59e0b' : '#ef4444';
  const scoreBg = request.creditScore >= 700 ? '#ecfdf5' : request.creditScore >= 600 ? '#fffbeb' : '#fef2f2';

  // Products fallback list
  const productsList = request.products && request.products.length > 0 ? request.products : [
    {
      id: 'p-default',
      name: request.requestedItem || 'High-End Hardware Device',
      specs: 'Factory Unlocked, 1-Year Apple / OEM Warranty, Includes Fast Charger',
      price: request.itemPrice || 1199.00,
      vat: (request.itemPrice || 1199.00) * 0.2,
      qty: 1,
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80'
    }
  ];

  // SVG Gauge calculations (semi-circle arc)
  const minScore = 300;
  const maxScore = 850;
  const clampedScore = Math.max(minScore, Math.min(maxScore, request.creditScore || 650));
  const scorePct = (clampedScore - minScore) / (maxScore - minScore);
  const arcRadius = 70;
  const arcCircumference = Math.PI * arcRadius; // ~219.9
  const strokeOffset = arcCircumference * (1 - scorePct);

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
            onClick={() => router.push(`/${tenantSlug}/staff/finance`)}
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
            <span>Applications</span>
          </button>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.94rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.02em' }}>
              #{request.applicationNumber}
            </div>
            <div style={{ fontSize: '0.66rem', color: '#94a3b8', fontWeight: '600' }}>
              Credit Decision Desk
            </div>
          </div>

          <div style={{ width: '40px' }} />
        </header>

        {/* Main Scroll Body */}
        <main className="mobile-scroll-body" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '3rem' }}>

          {/* 1. Decision Status Hero Banner */}
          <div 
            style={{ 
              background: isApproved 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                : isGuarantor 
                ? 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)' 
                : isRejected 
                ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' 
                : 'linear-gradient(135deg, #ff7a00 0%, #ea580c 100%)', 
              borderRadius: '18px', 
              padding: '1.25rem', 
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(234, 88, 12, 0.22)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#ffedd5' }}>
                UNDERWRITING STATUS
              </span>
              <span 
                style={{ 
                  fontSize: '0.62rem', 
                  fontWeight: '800', 
                  padding: '2px 8px', 
                  borderRadius: '9999px', 
                  background: 'rgba(255, 255, 255, 0.25)', 
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.35)' 
                }}
              >
                APPLIED {new Date(request.createdAt).toLocaleDateString('en-GB')}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isApproved ? <CheckCircle2 size={24} /> : isGuarantor ? <UserCheck size={24} /> : isRejected ? <XCircle size={24} /> : <FileCheck size={24} />}
              </div>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '900', margin: 0, letterSpacing: '-0.02em', color: '#ffffff' }}>
                  {isApproved ? 'Application Approved' : isGuarantor ? 'Guarantor Requested' : isRejected ? 'Application Declined' : 'Decision Pending'}
                </h2>
                <p style={{ fontSize: '0.74rem', color: '#ffedd5', margin: '2px 0 0 0' }}>
                  {isApproved ? 'Customer eligible for 0% RTO agreement' : isGuarantor ? 'Subject to UK homeowner guarantor verification' : isRejected ? 'Failed risk or debt-to-income threshold' : 'Awaiting tenant credit decision'}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Customer details Card (Avatar before name, customer status, no employment) */}
          <div 
            style={{ 
              background: '#ffffff', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              padding: '1.15rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)' 
            }}
          >
            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.85rem' }}>
              CUSTOMER DETAILS
            </div>

            {/* Customer Avatar & Name & Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ position: 'relative' }}>
                {request.customerAvatar ? (
                  <img 
                    src={request.customerAvatar} 
                    alt={request.customerName} 
                    style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '50%', 
                      objectFit: 'cover', 
                      border: '2px solid #e2e8f0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                    }} 
                  />
                ) : (
                  <div 
                    style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, #ea580c 0%, #ff7a00 100%)', 
                      color: '#ffffff', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontWeight: '900',
                      fontSize: '1.1rem'
                    }}
                  >
                    {request.customerName?.charAt(0) || 'C'}
                  </div>
                )}
                <span 
                  style={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    right: 0, 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    background: '#10b981', 
                    border: '2px solid #ffffff' 
                  }} 
                />
              </div>

              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: '900', color: '#0f172a' }}>
                  {request.customerName}
                </div>
                <span 
                  style={{ 
                    fontSize: '0.65rem', 
                    fontWeight: '800', 
                    padding: '2px 8px', 
                    borderRadius: '9999px', 
                    background: isRegular ? '#ecfdf5' : '#eff6ff', 
                    color: isRegular ? '#059669' : '#1d4ed8', 
                    border: isRegular ? '1px solid #a7f3d0' : '1px solid #bfdbfe',
                    display: 'inline-block',
                    marginTop: '3px'
                  }}
                >
                  {isRegular ? 'REGULAR CUSTOMER' : 'NEW CUSTOMER'}
                </span>
              </div>
            </div>

            {/* Address */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '0.85rem', color: '#475569', fontSize: '0.78rem' }}>
              <MapPin size={15} color="#ea580c" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Registered UK Address:</strong>
                <div>{request.customerAddress}</div>
              </div>
            </div>

            {/* Contact row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', fontSize: '0.76rem' }}>
              <div>
                <span style={{ color: '#94a3b8', fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: '700' }}>Telephone</span>
                <div>
                  <a href={`tel:${request.customerPhone}`} style={{ color: '#ea580c', fontWeight: '800', textDecoration: 'none' }}>
                    {request.customerPhone}
                  </a>
                </div>
              </div>
              <div>
                <span style={{ color: '#94a3b8', fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: '700' }}>Email Address</span>
                <div style={{ color: '#0f172a', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {request.customerEmail}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Employment details Card (New Card underneath Customer details) */}
          <div 
            style={{ 
              background: '#ffffff', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              padding: '1.15rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)' 
            }}
          >
            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
              EMPLOYMENT DETAILS
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.78rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.66rem', textTransform: 'uppercase', fontWeight: '700' }}>Occupation / Role</span>
                <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
                  {request.jobTitle || 'Lead Professional'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                  {request.employerName || 'UK Registered Employer'}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.66rem', textTransform: 'uppercase', fontWeight: '700' }}>Net Monthly Salary</span>
                <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#059669', marginTop: '2px' }}>
                  £{Number(request.monthlyIncome || 3200).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                  {request.employmentType || 'Permanent Full-Time'}
                </div>
              </div>
            </div>

            {/* Income Verification Status Banner */}
            <div 
              style={{ 
                marginTop: '0.75rem', 
                padding: '0.65rem 0.85rem', 
                background: '#ecfdf5', 
                borderRadius: '10px', 
                border: '1px solid #a7f3d0', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                fontSize: '0.74rem', 
                color: '#065f46' 
              }}
            >
              <ShieldCheck size={16} color="#10b981" style={{ flexShrink: 0 }} />
              <div>
                <strong>Open Banking Payroll Verified:</strong> Consistent monthly salary deposits confirmed over 90 days.
              </div>
            </div>
          </div>

          {/* 4. Credit information Card (Beauty Centralized Score Chart, No Duration) */}
          <div 
            style={{ 
              background: '#ffffff', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              padding: '1.25rem 1.15rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)' 
            }}
          >
            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem', textAlign: 'center' }}>
              CREDIT INFORMATION
            </div>

            {/* Centralized Beautiful Score Radial Gauge Chart */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0.5rem 0' }}>
              <div style={{ position: 'relative', width: '200px', height: '115px', display: 'flex', justifyContent: 'center' }}>
                <svg width="200" height="115" viewBox="0 0 200 115" style={{ overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="scoreGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                  {/* Background Track Arc */}
                  <path
                    d="M 25 105 A 75 75 0 0 1 175 105"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="14"
                    strokeLinecap="round"
                  />
                  {/* Colored Value Arc */}
                  <path
                    d="M 25 105 A 75 75 0 0 1 175 105"
                    fill="none"
                    stroke={scoreColor}
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray="235.6"
                    strokeDashoffset={235.6 * (1 - scorePct)}
                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                  />
                </svg>

                {/* Centered Score Digits */}
                <div 
                  style={{ 
                    position: 'absolute', 
                    bottom: '6px', 
                    textAlign: 'center', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center' 
                  }}
                >
                  <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#0f172a', lineHeight: 1, letterSpacing: '-0.03em' }}>
                    {request.creditScore}
                  </div>
                  <div style={{ fontSize: '0.66rem', color: '#94a3b8', fontWeight: '700', marginTop: '2px' }}>
                    out of 850 Max Score
                  </div>
                </div>
              </div>

              {/* Tier Pill */}
              <div 
                style={{ 
                  marginTop: '6px', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '5px', 
                  padding: '3px 12px', 
                  borderRadius: '9999px', 
                  background: scoreBg, 
                  border: `1px solid ${scoreColor}`, 
                  color: scoreColor, 
                  fontSize: '0.72rem', 
                  fontWeight: '800' 
                }}
              >
                <CheckCircle2 size={13} strokeWidth={2.5} />
                <span>{request.creditTier} Tier &bull; Credit Profile</span>
              </div>
            </div>

            {/* Detailed Credit Info Underneath Chart */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', fontSize: '0.76rem' }}>
              
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', fontSize: '0.66rem', textTransform: 'uppercase', fontWeight: '700' }}>
                  Pre-Approved Limit
                </span>
                <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#0f172a', marginTop: '2px' }}>
                  £{Number(request.creditLimit).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                </div>
                <span style={{ fontSize: '0.64rem', color: '#10b981', fontWeight: '800' }}>
                  Direct Limit Granted
                </span>
              </div>

              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', fontSize: '0.66rem', textTransform: 'uppercase', fontWeight: '700' }}>
                  Customer History
                </span>
                <div style={{ fontSize: '1.15rem', fontWeight: '900', color: isRegular ? '#059669' : '#2563eb', marginTop: '2px' }}>
                  {isRegular ? 'Regular' : 'New'}
                </div>
                <span style={{ fontSize: '0.64rem', color: '#64748b', fontWeight: '600' }}>
                  {isRegular ? 'Previous prompt payments' : 'First-time applicant'}
                </span>
              </div>

              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', fontSize: '0.66rem', textTransform: 'uppercase', fontWeight: '700' }}>
                  Affordability Ratio
                </span>
                <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0f172a', marginTop: '2px' }}>
                  {request.affordabilityScore?.split('(')[0]?.trim() || '94% Affordability'}
                </div>
                <span style={{ fontSize: '0.64rem', color: '#10b981', fontWeight: '700' }}>
                  Open Banking Verified
                </span>
              </div>

              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', fontSize: '0.66rem', textTransform: 'uppercase', fontWeight: '700' }}>
                  Defaults / Arrears
                </span>
                <div style={{ fontSize: '0.92rem', fontWeight: '900', color: request.creditScore < 600 ? '#ef4444' : '#0f172a', marginTop: '2px' }}>
                  {request.creditScore < 600 ? '1 Late Payment' : '0 Defaults (36m)'}
                </div>
                <span style={{ fontSize: '0.64rem', color: '#64748b', fontWeight: '600' }}>
                  Equifax &amp; Experian UK
                </span>
              </div>

            </div>
          </div>

          {/* 5. Products Card (List of products, avatars, specs, prices, VAT) */}
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
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                PRODUCTS
              </span>
              <span style={{ fontSize: '0.66rem', fontWeight: '700', color: '#64748b' }}>
                {productsList.length} {productsList.length === 1 ? 'Item' : 'Items'} Requested
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {productsList.map((prod, idx) => (
                <div 
                  key={prod.id || idx}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    paddingBottom: idx !== productsList.length - 1 ? '0.85rem' : '0',
                    borderBottom: idx !== productsList.length - 1 ? '1px dashed #e2e8f0' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {prod.image ? (
                      <img 
                        src={prod.image} 
                        alt={prod.name} 
                        style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #e2e8f0' }} 
                      />
                    ) : (
                      <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                        <ShoppingBag size={20} />
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: '800', color: '#0f172a' }}>
                        {prod.name}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                        {prod.specs}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '1px' }}>
                        Qty: {prod.qty || 1} &bull; Net: £{Number(prod.price * 0.8).toFixed(2)} &bull; VAT (20%): £{Number(prod.price * 0.2).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.94rem', fontWeight: '900', color: '#0f172a' }}>
                      £{(Number(prod.price) * (prod.qty || 1)).toFixed(2)}
                    </div>
                    <span style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: '800' }}>
                      IN STOCK
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Hardware Retail Value */}
            <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '700' }}>
                Total Hardware Value (inc. VAT):
              </span>
              <span style={{ fontSize: '1.05rem', fontWeight: '900', color: '#0f172a' }}>
                £{Number(request.itemPrice).toFixed(2)}
              </span>
            </div>
          </div>

          {/* 6. Financial details Card (New Card underneath Products) */}
          <div 
            style={{ 
              background: '#ffffff', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              padding: '1.15rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)' 
            }}
          >
            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
              FINANCIAL DETAILS
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem', color: '#475569' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Cash Retail Price:</span>
                <strong style={{ color: '#0f172a' }}>£{Number(request.itemPrice).toFixed(2)}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Upfront Deposit (Down Payment):</span>
                <strong style={{ color: '#10b981' }}>£{Number(request.downPayment).toFixed(2)}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Financed Principal Balance:</span>
                <strong style={{ color: '#0f172a' }}>£{Number(request.financedAmount).toFixed(2)}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Contract Duration:</span>
                <strong style={{ color: '#0f172a' }}>{request.termMonths} Months</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Promotional APR:</span>
                <strong style={{ color: '#10b981' }}>{request.interestRate || '0% Promotional RTO'}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Payment Frequency:</span>
                <strong style={{ color: '#0f172a' }}>Monthly Direct Debit (BACS)</strong>
              </div>

              {/* Monthly Highlight Banner */}
              <div 
                style={{ 
                  marginTop: '6px',
                  padding: '0.75rem', 
                  borderRadius: '12px', 
                  background: '#fff7ed', 
                  border: '1px solid #ffedd5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.68rem', color: '#9a3412', textTransform: 'uppercase', fontWeight: '800' }}>
                    Monthly Installment Due
                  </span>
                  <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#ea580c' }}>
                    £{Number(request.installmentAmount).toFixed(2)} <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>/ month</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.66rem', color: '#9a3412', textTransform: 'uppercase', fontWeight: '700' }}>
                    Total Payable
                  </span>
                  <div style={{ fontSize: '0.94rem', fontWeight: '900', color: '#0f172a' }}>
                    £{(Number(request.installmentAmount) * Number(request.termMonths) + Number(request.downPayment)).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 7. Internal Decision Notes & Compliance */}
          <div 
            style={{ 
              background: '#ffffff', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              padding: '1.1rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)' 
            }}
          >
            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
              INTERNAL DECISION NOTES &amp; COMPLIANCE
            </div>

            <textarea
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              placeholder="Add underwriting notes or conditions (e.g. ID verified, proof of income checked)..."
              rows={3}
              style={{
                width: '100%',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                padding: '0.65rem',
                fontSize: '0.78rem',
                color: '#0f172a',
                outline: 'none',
                resize: 'none',
                background: '#f8fafc'
              }}
            />

            <button
              type="button"
              onClick={handleSaveNotes}
              style={{
                marginTop: '0.5rem',
                background: noteSaved ? '#10b981' : '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.74rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {noteSaved ? <Check size={13} /> : null}
              <span>{noteSaved ? 'Note Saved' : 'Save Underwriting Note'}</span>
            </button>
          </div>

          {/* 8. Executive Decision Controls (LAST ON THE PAGE AS REQUESTED) */}
          <div 
            style={{ 
              background: '#ffffff', 
              borderRadius: '16px', 
              border: '1.5px solid #fed7aa', 
              padding: '1.15rem',
              boxShadow: '0 4px 16px rgba(234, 88, 12, 0.12)' 
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: '900', color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.85rem' }}>
              EXECUTIVE DECISION CONTROLS
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {/* Approve Button */}
              <button
                type="button"
                onClick={() => {
                  handleUpdateStatus('approved');
                  handleSendWhatsApp('approved');
                }}
                style={{
                  background: isApproved ? '#ecfdf5' : '#10b981',
                  border: isApproved ? '1.5px solid #10b981' : 'none',
                  borderRadius: '12px',
                  padding: '12px 6px',
                  color: isApproved ? '#059669' : '#ffffff',
                  fontSize: '0.76rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: isApproved ? 'none' : '0 3px 8px rgba(16, 185, 129, 0.3)'
                }}
              >
                <CheckCircle2 size={20} strokeWidth={2.4} />
                <span>{isApproved ? 'Approved ✓' : 'Approve'}</span>
              </button>

              {/* Request Guarantor Button */}
              <button
                type="button"
                onClick={() => {
                  handleUpdateStatus('guarantor_required');
                  handleSendWhatsApp('guarantor');
                }}
                style={{
                  background: isGuarantor ? '#e0e7ff' : '#4f46e5',
                  border: isGuarantor ? '1.5px solid #4f46e5' : 'none',
                  borderRadius: '12px',
                  padding: '12px 6px',
                  color: isGuarantor ? '#3730a3' : '#ffffff',
                  fontSize: '0.76rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: isGuarantor ? 'none' : '0 3px 8px rgba(79, 70, 229, 0.3)'
                }}
              >
                <UserCheck size={20} strokeWidth={2.4} />
                <span>{isGuarantor ? 'Guarantor ✓' : 'Guarantor'}</span>
              </button>

              {/* Decline Button */}
              <button
                type="button"
                onClick={() => handleUpdateStatus('rejected')}
                style={{
                  background: isRejected ? '#fef2f2' : '#ffffff',
                  border: isRejected ? '1.5px solid #ef4444' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '12px 6px',
                  color: isRejected ? '#b91c1c' : '#64748b',
                  fontSize: '0.76rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <XCircle size={20} />
                <span>{isRejected ? 'Declined ✓' : 'Decline'}</span>
              </button>
            </div>

            {/* Direct WhatsApp Contact Button */}
            <button
              type="button"
              onClick={() => handleSendWhatsApp(isApproved ? 'approved' : isGuarantor ? 'guarantor' : 'general')}
              style={{
                width: '100%',
                marginTop: '0.85rem',
                background: '#16a34a',
                border: 'none',
                borderRadius: '12px',
                padding: '11px',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(22, 163, 74, 0.25)'
              }}
            >
              <MessageSquare size={17} strokeWidth={2.4} />
              <span>WhatsApp Applicant Directly</span>
            </button>
          </div>

        </main>

      </div>
    </div>
  );
}
