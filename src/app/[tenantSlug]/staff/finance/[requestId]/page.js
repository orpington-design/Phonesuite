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
  AlertCircle
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
        <main className="mobile-scroll-body" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

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

          {/* 2. Tenant Decision Action Buttons */}
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
                  padding: '10px 6px',
                  color: isApproved ? '#059669' : '#ffffff',
                  fontSize: '0.74rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: isApproved ? 'none' : '0 3px 8px rgba(16, 185, 129, 0.3)'
                }}
              >
                <CheckCircle2 size={18} strokeWidth={2.4} />
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
                  padding: '10px 6px',
                  color: isGuarantor ? '#3730a3' : '#ffffff',
                  fontSize: '0.74rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: isGuarantor ? 'none' : '0 3px 8px rgba(79, 70, 229, 0.3)'
                }}
              >
                <UserCheck size={18} strokeWidth={2.4} />
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
                  padding: '10px 6px',
                  color: isRejected ? '#b91c1c' : '#64748b',
                  fontSize: '0.74rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <XCircle size={18} />
                <span>{isRejected ? 'Declined ✓' : 'Decline'}</span>
              </button>
            </div>

            {/* Direct WhatsApp Contact Button */}
            <button
              type="button"
              onClick={() => handleSendWhatsApp(isApproved ? 'approved' : isGuarantor ? 'guarantor' : 'general')}
              style={{
                width: '100%',
                marginTop: '0.75rem',
                background: '#16a34a',
                border: 'none',
                borderRadius: '12px',
                padding: '10px',
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
              <MessageSquare size={16} strokeWidth={2.4} />
              <span>WhatsApp Applicant Directly</span>
            </button>
          </div>

          {/* 3. Applicant Profile Card */}
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
              APPLICANT IDENTITY &amp; INCOME
            </div>

            <div style={{ fontSize: '1rem', fontWeight: '900', color: '#0f172a' }}>
              {request.customerName}
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '6px', color: '#475569', fontSize: '0.78rem' }}>
              <MapPin size={15} color="#ea580c" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Registered UK Address:</strong>
                <div>{request.customerAddress}</div>
              </div>
            </div>

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
                <span style={{ color: '#94a3b8', fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: '700' }}>Employment</span>
                <div style={{ color: '#0f172a', fontWeight: '800' }}>
                  {request.employmentStatus}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Bureau Underwriting & Open Banking Risk Assessment */}
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
              CREDIT BUREAU &amp; OPEN BANKING VERIFICATION
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', textAlign: 'center' }}>
              <div style={{ background: scoreBg, border: `1px solid ${scoreColor}`, borderRadius: '10px', padding: '8px' }}>
                <div style={{ fontSize: '0.6rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Credit Score</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '900', color: scoreColor, lineHeight: 1.15, marginTop: '2px' }}>{request.creditScore}</div>
                <div style={{ fontSize: '0.6rem', color: scoreColor, fontWeight: '800' }}>{request.creditTier}</div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px' }}>
                <div style={{ fontSize: '0.6rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Credit Limit</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#0f172a', lineHeight: 1.15, marginTop: '2px' }}>£{Number(request.creditLimit).toFixed(0)}</div>
                <div style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: '800' }}>Pre-Approved</div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px' }}>
                <div style={{ fontSize: '0.6rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Duration</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#0f172a', lineHeight: 1.15, marginTop: '2px' }}>{request.termMonths}m</div>
                <div style={{ fontSize: '0.6rem', color: '#ea580c', fontWeight: '800' }}>Installments</div>
              </div>
            </div>

            <div style={{ marginTop: '0.85rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#334155' }}>
              <ShieldCheck size={18} color="#10b981" style={{ flexShrink: 0 }} />
              <div>
                <strong>Affordability Check:</strong> {request.affordabilityScore}
              </div>
            </div>
          </div>

          {/* 5. Requested Hardware & Installment Breakdown */}
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
              REQUESTED HARDWARE &amp; FINANCING TERMS
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}>
                <Smartphone size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#0f172a' }}>
                  {request.requestedItem}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  Branch: {request.branch}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', color: '#64748b', paddingTop: '0.65rem', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Outright Retail Price:</span>
                <span style={{ fontWeight: '800', color: '#0f172a' }}>£{Number(request.itemPrice).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Upfront Down Payment:</span>
                <span style={{ fontWeight: '800', color: '#10b981' }}>£{Number(request.downPayment).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Financed Principal Amount:</span>
                <span style={{ fontWeight: '800', color: '#0f172a' }}>£{Number(request.financedAmount).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Promotional Interest:</span>
                <span style={{ fontWeight: '800', color: '#10b981' }}>{request.interestRate || '0% APR'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: '900', color: '#0f172a', paddingTop: '6px', borderTop: '1px solid #f1f5f9', marginTop: '2px' }}>
                <span>Monthly Installment:</span>
                <span style={{ color: '#ea580c' }}>£{Number(request.installmentAmount).toFixed(2)} / mo</span>
              </div>
            </div>
          </div>

          {/* 6. Underwriting Notes & Audit Trail */}
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

        </main>

      </div>
    </div>
  );
}
