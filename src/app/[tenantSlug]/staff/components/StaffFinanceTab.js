'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileCheck, 
  Search, 
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
  ExternalLink, 
  X, 
  Smartphone, 
  FileText,
  Building2,
  ChevronRight,
  TrendingUp,
  Percent,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { 
  INITIAL_FINANCE_REQUESTS, 
  getSavedFinanceRequests, 
  persistFinanceRequests 
} from '../data/staffData';
import { useStaffLanguage } from '../context/StaffLanguageContext';

export default function StaffFinanceTab({ tenant, branch, tenantSlug }) {
  const router = useRouter();
  const { t, language } = useStaffLanguage();

  const [requests, setRequests] = useState(() => getSavedFinanceRequests());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending_review' | 'approved' | 'guarantor_required' | 'rejected'
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [decisionNotes, setDecisionNotes] = useState('');

  useEffect(() => {
    persistFinanceRequests(requests);
  }, [requests]);

  // Counts & Metrics
  const totalRequests = requests.length;
  const pendingCount = requests.filter(r => r.status === 'pending_review').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const guarantorCount = requests.filter(r => r.status === 'guarantor_required').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;
  const totalPipelineValue = requests.reduce((sum, r) => sum + Number(r.financedAmount || 0), 0);

  // Status Filter Tabs
  const filterTabs = [
    { id: 'all', label: language === 'pt' ? 'Todos' : 'All Requests', count: totalRequests },
    { id: 'pending_review', label: language === 'pt' ? 'Para Análise' : 'Pending', count: pendingCount },
    { id: 'approved', label: language === 'pt' ? 'Aprovados' : 'Approved', count: approvedCount },
    { id: 'guarantor_required', label: language === 'pt' ? 'Avalista' : 'Guarantor', count: guarantorCount },
    { id: 'rejected', label: language === 'pt' ? 'Recusados' : 'Rejected', count: rejectedCount }
  ];

  // Filtered requests
  const filteredRequests = requests.filter(req => {
    if (statusFilter !== 'all' && req.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      req.applicationNumber?.toLowerCase().includes(q) ||
      req.customerName?.toLowerCase().includes(q) ||
      req.customerPhone?.toLowerCase().includes(q) ||
      req.customerEmail?.toLowerCase().includes(q) ||
      req.requestedItem?.toLowerCase().includes(q)
    );
  });

  // Action: Update Decision Status
  const handleUpdateStatus = (reqId, newStatus, customNotes = '') => {
    setRequests(prev => prev.map(req => {
      if (req.id !== reqId) return req;
      return {
        ...req,
        status: newStatus,
        decisionNotes: customNotes || (
          newStatus === 'approved' 
            ? 'Application approved by store management.' 
            : newStatus === 'guarantor_required' 
            ? 'Approved subject to qualified UK homeowner guarantor.' 
            : 'Application rejected due to credit affordability criteria.'
        )
      };
    }));

    if (selectedApplication?.id === reqId) {
      setSelectedApplication(prev => prev ? {
        ...prev,
        status: newStatus,
        decisionNotes: customNotes || prev.decisionNotes
      } : null);
    }
  };

  // WhatsApp Actions
  const handleWhatsAppContact = (req, messageType = 'general') => {
    let text = '';
    if (messageType === 'approved') {
      text = `🎉 GREAT NEWS! Hello ${req.customerName}, your finance application #${req.applicationNumber} for the ${req.requestedItem} has been APPROVED by ${tenant?.name || 'PhoneSuite UK'}!\n\nDown Payment: £${Number(req.downPayment).toFixed(2)}\nMonthly Installment: £${Number(req.installmentAmount).toFixed(2)}/mo (${req.termMonths} mos)\n\nPlease visit our store at ${req.branch || 'our central branch'} with your photo ID to sign your agreement and collect your device!`;
    } else if (messageType === 'guarantor') {
      text = `Hello ${req.customerName}, this is ${tenant?.name || 'PhoneSuite UK'} underwriting team regarding finance application #${req.applicationNumber} for the ${req.requestedItem}.\n\nYour preliminary application has been reviewed. To complete your financing approval, our risk department requires a UK guarantor or a 35% upfront deposit. Please reply to this message so we can guide you through the next step!`;
    } else {
      text = `Hello ${req.customerName}, this is ${tenant?.name || 'PhoneSuite UK'} regarding your finance application #${req.applicationNumber} for the ${req.requestedItem}. Do you have any questions regarding your application?`;
    }
    window.open(`https://wa.me/${req.customerPhone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', paddingBottom: '2rem' }}>
      
      {/* 1. Header Banner & Risk Overview */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #0b132b 0%, #1c2541 100%)', 
          borderRadius: '18px', 
          padding: '1.25rem', 
          color: '#ffffff',
          boxShadow: '0 4px 20px rgba(11, 19, 43, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div 
              style={{ 
                width: '38px', 
                height: '38px', 
                borderRadius: '12px', 
                background: 'rgba(234, 88, 12, 0.2)', 
                border: '1px solid rgba(234, 88, 12, 0.4)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#ff7a00' 
              }}
            >
              <FileCheck size={20} strokeWidth={2.4} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0, letterSpacing: '-0.02em' }}>
                {language === 'pt' ? 'Pedidos de Financiamento' : 'Finance & Installment Requests'}
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                {language === 'pt' ? 'Decisão de crédito para clientes do portal' : 'Tenant credit underwriting & approval decision desk'}
              </p>
            </div>
          </div>

          <span 
            style={{ 
              fontSize: '0.65rem', 
              fontWeight: '800', 
              padding: '3px 8px', 
              borderRadius: '9999px', 
              background: '#ea580c', 
              color: '#ffffff',
              letterSpacing: '0.04em'
            }}
          >
            UNDERWRITING
          </span>
        </div>

        {/* Top 3 KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '1rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '0.65rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '0.62rem', color: '#fbbf24', textTransform: 'uppercase', fontWeight: '700' }}>
              {language === 'pt' ? 'Para Análise' : 'Pending Review'}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#fef08a', marginTop: '2px' }}>
              {pendingCount}
            </div>
            <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: '500', marginTop: '2px' }}>
              Requires Tenant Decision
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '0.65rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '0.62rem', color: '#10b981', textTransform: 'uppercase', fontWeight: '700' }}>
              {language === 'pt' ? 'Aprovados' : 'Approved'}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#86efac', marginTop: '2px' }}>
              {approvedCount}
            </div>
            <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: '500', marginTop: '2px' }}>
              Contract Ready
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '0.65rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '0.62rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>
              {language === 'pt' ? 'Carteira Financiada' : 'Pipeline'}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#ffffff', marginTop: '2px' }}>
              £{totalPipelineValue.toLocaleString('en-GB', { minimumFractionDigits: 0 })}
            </div>
            <div style={{ fontSize: '0.62rem', color: '#38bdf8', fontWeight: '500', marginTop: '2px' }}>
              {totalRequests} Total Requests
            </div>
          </div>
        </div>
      </div>

      {/* 2. Search & Segmented Filter Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {/* Search Bar */}
        <div style={{ position: 'relative' }}>
          <Search 
            size={16} 
            color="#94a3b8" 
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} 
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'pt' ? 'Buscar aplicação #, cliente ou produto...' : 'Search application #, applicant name, or device...'}
            style={{
              width: '100%',
              padding: '0.68rem 1rem 0.68rem 2.3rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              fontSize: '0.82rem',
              color: '#0f172a',
              outline: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8'
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filter Segmented Pills */}
        <div 
          style={{ 
            display: 'flex', 
            background: '#f1f5f9', 
            borderRadius: '12px', 
            padding: '3px', 
            gap: '3px',
            overflowX: 'auto'
          }}
        >
          {filterTabs.map(tab => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                style={{
                  flex: 1,
                  minWidth: '70px',
                  padding: '6px 6px',
                  borderRadius: '9px',
                  border: 'none',
                  background: isActive ? '#ffffff' : 'transparent',
                  color: isActive ? '#0f172a' : '#64748b',
                  fontSize: '0.71rem',
                  fontWeight: isActive ? '800' : '600',
                  boxShadow: isActive ? '0 1px 4px rgba(0, 0, 0, 0.08)' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{tab.label}</span>
                <span 
                  style={{ 
                    fontSize: '0.62rem', 
                    padding: '1px 5px', 
                    borderRadius: '9999px',
                    background: isActive ? '#ea580c' : '#e2e8f0',
                    color: isActive ? '#ffffff' : '#64748b',
                    fontWeight: '800'
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Requests List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {filteredRequests.length === 0 ? (
          <div 
            style={{ 
              background: '#ffffff', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              padding: '2.5rem 1rem', 
              textAlign: 'center' 
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto', color: '#94a3b8' }}>
              <FileCheck size={22} />
            </div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.25rem 0' }}>
              {language === 'pt' ? 'Nenhuma solicitação de crédito encontrada' : 'No finance requests found'}
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
              {language === 'pt' ? 'Novas solicitações enviadas pelo portal aparecerão aqui para sua decisão' : 'Installment and RTO applications submitted by customers will appear here'}
            </p>
          </div>
        ) : (
          filteredRequests.map(req => {
            const isPending = req.status === 'pending_review';
            const isApproved = req.status === 'approved';
            const isGuarantor = req.status === 'guarantor_required';
            const isRejected = req.status === 'rejected';

            const scoreColor = req.creditScore >= 700 ? '#10b981' : req.creditScore >= 600 ? '#f59e0b' : '#ef4444';
            const scoreBg = req.creditScore >= 700 ? '#ecfdf5' : req.creditScore >= 600 ? '#fffbeb' : '#fef2f2';

            return (
              <div
                key={req.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: isPending ? '1.5px solid #fed7aa' : '1px solid #e2e8f0',
                  padding: '1.1rem',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  position: 'relative'
                }}
              >
                {/* Header: Application #, Date, Status Chip */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.86rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.01em' }}>
                        #{req.applicationNumber}
                      </span>
                      {isPending && (
                        <span 
                          style={{ 
                            fontSize: '0.6rem', 
                            fontWeight: '800', 
                            padding: '2px 6px', 
                            borderRadius: '6px', 
                            background: '#ffedd5', 
                            color: '#c2410c', 
                            border: '1px solid #fdba74' 
                          }}
                        >
                          ACTION NEEDED
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px', fontWeight: '500' }}>
                      Applied {new Date(req.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isPending && (
                      <span 
                        style={{ 
                          fontSize: '0.64rem', 
                          fontWeight: '800', 
                          padding: '3px 8px', 
                          borderRadius: '9999px', 
                          background: '#fef3c7', 
                          color: '#b45309', 
                          border: '1px solid #fde68a',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Clock size={11} strokeWidth={2.5} />
                        PENDING DECISION
                      </span>
                    )}
                    {isApproved && (
                      <span 
                        style={{ 
                          fontSize: '0.64rem', 
                          fontWeight: '800', 
                          padding: '3px 8px', 
                          borderRadius: '9999px', 
                          background: '#dcfce7', 
                          color: '#15803d', 
                          border: '1px solid #bbf7d0',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <CheckCircle2 size={11} strokeWidth={2.5} />
                        APPROVED
                      </span>
                    )}
                    {isGuarantor && (
                      <span 
                        style={{ 
                          fontSize: '0.64rem', 
                          fontWeight: '800', 
                          padding: '3px 8px', 
                          borderRadius: '9999px', 
                          background: '#e0e7ff', 
                          color: '#3730a3', 
                          border: '1px solid #c7d2fe',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <AlertTriangle size={11} strokeWidth={2.5} />
                        GUARANTOR NEEDED
                      </span>
                    )}
                    {isRejected && (
                      <span 
                        style={{ 
                          fontSize: '0.64rem', 
                          fontWeight: '800', 
                          padding: '3px 8px', 
                          borderRadius: '9999px', 
                          background: '#fee2e2', 
                          color: '#b91c1c', 
                          border: '1px solid #fecaca',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <XCircle size={11} strokeWidth={2.5} />
                        DECLINED
                      </span>
                    )}
                  </div>
                </div>

                {/* Requested Device & Financing Terms Card */}
                <div 
                  style={{ 
                    background: '#f8fafc', 
                    borderRadius: '12px', 
                    padding: '0.8rem', 
                    border: '1px solid #f1f5f9',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}>
                      <Smartphone size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>
                        {req.requestedItem}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                        Retail Cash Price: £{Number(req.itemPrice).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* 3 Terms Chips */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', marginTop: '4px' }}>
                    <div style={{ background: '#ffffff', borderRadius: '8px', padding: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.58rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Deposit</div>
                      <div style={{ fontSize: '0.84rem', fontWeight: '900', color: '#0f172a' }}>£{Number(req.downPayment).toFixed(2)}</div>
                    </div>
                    <div style={{ background: '#ffffff', borderRadius: '8px', padding: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.58rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Monthly Term</div>
                      <div style={{ fontSize: '0.84rem', fontWeight: '900', color: '#ea580c' }}>£{Number(req.installmentAmount).toFixed(2)}/mo</div>
                    </div>
                    <div style={{ background: '#ffffff', borderRadius: '8px', padding: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.58rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Duration</div>
                      <div style={{ fontSize: '0.84rem', fontWeight: '900', color: '#0f172a' }}>{req.termMonths} Mos</div>
                    </div>
                  </div>
                </div>

                {/* Underwriting / Credit Score & Applicant Profile */}
                <div 
                  style={{ 
                    borderRadius: '12px', 
                    padding: '0.75rem', 
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: '900', color: '#0f172a' }}>
                        {req.customerName}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        {req.employmentStatus}
                      </div>
                    </div>

                    {/* Credit Score Pill */}
                    <div 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        background: scoreBg, 
                        border: `1px solid ${scoreColor}`, 
                        borderRadius: '8px', 
                        padding: '4px 8px' 
                      }}
                    >
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.56rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Credit Score</div>
                        <div style={{ fontSize: '0.86rem', fontWeight: '900', color: scoreColor, lineHeight: 1 }}>{req.creditScore}</div>
                      </div>
                      <span style={{ fontSize: '0.64rem', fontWeight: '800', color: scoreColor }}>
                        {req.creditTier}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.68rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <ShieldCheck size={13} color="#10b981" />
                    <span>{req.affordabilityScore}</span>
                  </div>

                  {req.decisionNotes && (
                    <div style={{ fontSize: '0.68rem', color: '#64748b', fontStyle: 'italic', background: '#f8fafc', padding: '4px 8px', borderRadius: '6px' }}>
                      Notes: {req.decisionNotes}
                    </div>
                  )}
                </div>

                {/* Tenant Decisioning Action Bar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.2rem' }}>
                  
                  {/* Row 1: Decision Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '0.45rem' }}>
                    
                    {/* Approve Button */}
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(req.id, 'approved')}
                      disabled={isApproved}
                      style={{
                        background: isApproved ? '#ecfdf5' : '#10b981',
                        border: isApproved ? '1px solid #a7f3d0' : 'none',
                        borderRadius: '10px',
                        padding: '8px 6px',
                        color: isApproved ? '#059669' : '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        cursor: isApproved ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        boxShadow: isApproved ? 'none' : '0 2px 6px rgba(16, 185, 129, 0.3)',
                        opacity: isApproved ? 0.8 : 1
                      }}
                    >
                      <CheckCircle2 size={13} strokeWidth={2.5} />
                      <span>{isApproved ? 'Approved' : 'Approve'}</span>
                    </button>

                    {/* Request Guarantor Button */}
                    <button
                      type="button"
                      onClick={() => {
                        handleUpdateStatus(req.id, 'guarantor_required');
                        handleWhatsAppContact(req, 'guarantor');
                      }}
                      style={{
                        background: isGuarantor ? '#e0e7ff' : '#4f46e5',
                        border: isGuarantor ? '1px solid #c7d2fe' : 'none',
                        borderRadius: '10px',
                        padding: '8px 6px',
                        color: isGuarantor ? '#3730a3' : '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                      title="Request a UK Homeowner Guarantor via WhatsApp"
                    >
                      <UserCheck size={13} strokeWidth={2.4} />
                      <span>Guarantor</span>
                    </button>

                    {/* Reject Button */}
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(req.id, 'rejected')}
                      disabled={isRejected}
                      style={{
                        background: isRejected ? '#fef2f2' : '#ffffff',
                        border: isRejected ? '1px solid #fecaca' : '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '8px 6px',
                        color: isRejected ? '#b91c1c' : '#64748b',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        cursor: isRejected ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <XCircle size={13} />
                      <span>{isRejected ? 'Declined' : 'Decline'}</span>
                    </button>

                  </div>

                  {/* Row 2: WhatsApp Applicant & Dossier Link */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.45rem' }}>
                    <button
                      type="button"
                      onClick={() => handleWhatsAppContact(req, isApproved ? 'approved' : 'general')}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '7px 8px',
                        color: '#0f172a',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px'
                      }}
                    >
                      <MessageSquare size={13} color="#16a34a" />
                      <span>WhatsApp Applicant</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedApplication(req)}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '7px 8px',
                        color: '#0f172a',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px'
                      }}
                    >
                      <FileText size={13} color="#64748b" />
                      <span>Full Dossier</span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* 4. Full Dossier / Underwriting Modal */}
      {selectedApplication && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setSelectedApplication(null)}
        >
          <div 
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              maxWidth: '460px',
              width: '100%',
              padding: '1.5rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.96rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                    Credit Dossier #{selectedApplication.applicationNumber}
                  </h3>
                  <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: 0 }}>
                    Open Banking &amp; Fraud Risk Verification
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedApplication(null)}
                style={{ background: '#f8fafc', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Applicant Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.78rem' }}>
              
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '0.9rem', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.66rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                  APPLICANT INFORMATION
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <span style={{ color: '#64748b' }}>Full Name:</span>
                    <div style={{ fontWeight: '800', color: '#0f172a' }}>{selectedApplication.customerName}</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Phone:</span>
                    <div style={{ fontWeight: '800', color: '#0f172a' }}>{selectedApplication.customerPhone}</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Email:</span>
                    <div style={{ fontWeight: '800', color: '#0f172a' }}>{selectedApplication.customerEmail}</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Employment:</span>
                    <div style={{ fontWeight: '800', color: '#0f172a' }}>{selectedApplication.employmentStatus}</div>
                  </div>
                </div>
                <div style={{ marginTop: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}>
                  <span style={{ color: '#64748b' }}>Registered Address:</span>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>{selectedApplication.customerAddress}</div>
                </div>
              </div>

              {/* Credit Underwriting Bureau Info */}
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '0.9rem', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.66rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                  CREDIT BUREAU REPORT &amp; OPEN BANKING
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', textAlign: 'center' }}>
                  <div style={{ background: '#ffffff', padding: '6px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.6rem', color: '#64748b' }}>Score</div>
                    <div style={{ fontSize: '1rem', fontWeight: '900', color: '#0f172a' }}>{selectedApplication.creditScore}</div>
                  </div>
                  <div style={{ background: '#ffffff', padding: '6px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.6rem', color: '#64748b' }}>Tier</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#10b981' }}>{selectedApplication.creditTier}</div>
                  </div>
                  <div style={{ background: '#ffffff', padding: '6px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.6rem', color: '#64748b' }}>Credit Limit</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#0f172a' }}>£{Number(selectedApplication.creditLimit).toFixed(0)}</div>
                  </div>
                </div>
                <div style={{ marginTop: '8px', fontSize: '0.72rem', color: '#334155' }}>
                  <strong>Affordability Check:</strong> {selectedApplication.affordabilityScore}
                </div>
              </div>

              {/* Financed Hardware Details */}
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '0.9rem', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.66rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                  HARDWARE &amp; FINANCING BREAKDOWN
                </div>
                <div style={{ fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
                  {selectedApplication.requestedItem}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748b', padding: '2px 0' }}>
                  <span>Device Cash Retail:</span>
                  <span style={{ fontWeight: '800', color: '#0f172a' }}>£{Number(selectedApplication.itemPrice).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748b', padding: '2px 0' }}>
                  <span>Upfront Down Payment:</span>
                  <span style={{ fontWeight: '800', color: '#10b981' }}>£{Number(selectedApplication.downPayment).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748b', padding: '2px 0' }}>
                  <span>Total Financed:</span>
                  <span style={{ fontWeight: '800', color: '#0f172a' }}>£{Number(selectedApplication.financedAmount).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748b', padding: '2px 0' }}>
                  <span>Installment Plan:</span>
                  <span style={{ fontWeight: '800', color: '#ea580c' }}>£{Number(selectedApplication.installmentAmount).toFixed(2)}/mo &times; {selectedApplication.termMonths} mos</span>
                </div>
              </div>

              {/* Quick Tenant Actions inside Modal */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateStatus(selectedApplication.id, 'approved');
                    handleWhatsAppContact(selectedApplication, 'approved');
                  }}
                  style={{
                    background: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.75rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>Approve &amp; Notify</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleUpdateStatus(selectedApplication.id, 'guarantor_required');
                    handleWhatsAppContact(selectedApplication, 'guarantor');
                  }}
                  style={{
                    background: '#4f46e5',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.75rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <UserCheck size={16} />
                  <span>Request Guarantor</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
