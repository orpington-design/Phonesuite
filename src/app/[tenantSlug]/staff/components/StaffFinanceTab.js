'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  const params = useParams();
  const activeSlug = tenantSlug || params?.tenantSlug || tenant?.slug || 'premiumphonex';
  const { t, language } = useStaffLanguage();

  const [requests, setRequests] = useState(() => getSavedFinanceRequests());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending_review' | 'approved' | 'guarantor_required' | 'rejected'

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', paddingBottom: '2rem' }}>
      
      {/* 1. Header Banner & Risk Overview - Orange Luxury Card */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #ff7a00 0%, #ea580c 100%)', 
          borderRadius: '18px', 
          padding: '1.25rem', 
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(234, 88, 12, 0.28)',
          border: '1px solid rgba(255, 255, 255, 0.25)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div 
              style={{ 
                width: '38px', 
                height: '38px', 
                borderRadius: '12px', 
                background: 'rgba(255, 255, 255, 0.22)', 
                border: '1px solid rgba(255, 255, 255, 0.35)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#ffffff' 
              }}
            >
              <FileCheck size={20} strokeWidth={2.4} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0, letterSpacing: '-0.02em', color: '#ffffff' }}>
                {language === 'pt' ? 'Pedidos de Financiamento' : 'Finance & Installment Requests'}
              </h2>
              <p style={{ fontSize: '0.74rem', color: '#ffedd5', margin: 0 }}>
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
              background: 'rgba(255, 255, 255, 0.25)', 
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              letterSpacing: '0.04em'
            }}
          >
            DECISION DESK
          </span>
        </div>

        {/* Top 3 KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '1rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.18)', borderRadius: '12px', padding: '0.65rem', border: '1px solid rgba(255, 255, 255, 0.25)' }}>
            <div style={{ fontSize: '0.62rem', color: '#ffedd5', textTransform: 'uppercase', fontWeight: '700' }}>
              {language === 'pt' ? 'Para Análise' : 'Pending Review'}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#ffffff', marginTop: '2px' }}>
              {pendingCount}
            </div>
            <div style={{ fontSize: '0.62rem', color: '#ffedd5', fontWeight: '500', marginTop: '2px' }}>
              Requires Decision
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.18)', borderRadius: '12px', padding: '0.65rem', border: '1px solid rgba(255, 255, 255, 0.25)' }}>
            <div style={{ fontSize: '0.62rem', color: '#ffedd5', textTransform: 'uppercase', fontWeight: '700' }}>
              {language === 'pt' ? 'Aprovados' : 'Approved'}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#ffffff', marginTop: '2px' }}>
              {approvedCount}
            </div>
            <div style={{ fontSize: '0.62rem', color: '#ffedd5', fontWeight: '500', marginTop: '2px' }}>
              Contract Ready
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.18)', borderRadius: '12px', padding: '0.65rem', border: '1px solid rgba(255, 255, 255, 0.25)' }}>
            <div style={{ fontSize: '0.62rem', color: '#ffedd5', textTransform: 'uppercase', fontWeight: '700' }}>
              {language === 'pt' ? 'Carteira Financiada' : 'Pipeline'}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#ffffff', marginTop: '2px' }}>
              £{totalPipelineValue.toLocaleString('en-GB', { minimumFractionDigits: 0 })}
            </div>
            <div style={{ fontSize: '0.62rem', color: '#ffffff', fontWeight: '700', marginTop: '2px' }}>
              {totalRequests} Total Requests
            </div>
          </div>
        </div>
      </div>

      {/* 2. Search & Segmented Filter Bar - Non-overlapping scrollable pills */}
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

        {/* Filter Segmented Pills - Horizontally scrollable without overlapping */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '6px',
            overflowX: 'auto',
            padding: '2px 0 6px 0',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
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
                  flexShrink: 0,
                  padding: '7px 13px',
                  borderRadius: '10px',
                  border: isActive ? '1.5px solid #ea580c' : '1px solid #e2e8f0',
                  background: isActive ? '#fff7ed' : '#ffffff',
                  color: isActive ? '#c2410c' : '#64748b',
                  fontSize: '0.74rem',
                  fontWeight: isActive ? '800' : '600',
                  boxShadow: isActive ? '0 1px 4px rgba(234, 88, 12, 0.15)' : '0 1px 2px rgba(0,0,0,0.03)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{tab.label}</span>
                <span 
                  style={{ 
                    fontSize: '0.64rem', 
                    padding: '2px 6px', 
                    borderRadius: '9999px',
                    background: isActive ? '#ea580c' : '#f1f5f9',
                    color: isActive ? '#ffffff' : '#475569',
                    fontWeight: '800',
                    lineHeight: 1
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Requests List - Clean Clickable Cards */}
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
                onClick={() => router.push(`/${activeSlug}/staff/finance/${req.id}`)}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: isPending ? '1.5px solid #fed7aa' : '1px solid #e2e8f0',
                  padding: '1.1rem',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  cursor: 'pointer',
                  transition: 'transform 0.12s ease, box-shadow 0.12s ease'
                }}
              >
                {/* Header: Application #, Date, Status Chip */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.01em' }}>
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
                </div>

                {/* Clickable Card Footer */}
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    paddingTop: '0.65rem', 
                    borderTop: '1px solid #f1f5f9' 
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Financed: <strong style={{ color: '#0f172a' }}>£{Number(req.financedAmount).toFixed(2)}</strong> ({req.termMonths} mos)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ea580c', fontSize: '0.74rem', fontWeight: '800' }}>
                    <span>Decision &amp; Review</span>
                    <ChevronRight size={15} strokeWidth={2.4} />
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
