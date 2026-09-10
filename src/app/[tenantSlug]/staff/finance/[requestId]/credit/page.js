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
  Sparkles,
  Zap,
  Gift,
  Info
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
  const { language, toggleLanguage } = useStaffLanguage();

  const [requests] = useState(() => getSavedFinanceRequests());
  const [customers] = useState(() => getSavedStaffCustomers());
  const [request, setRequest] = useState(null);
  const [customer, setCustomer] = useState(null);

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

  const isPt = language === 'pt';

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

  const scoreVal = request.creditScore || customer?.credit_score || 785;
  const scoreColor = scoreVal >= 700 ? '#10b981' : scoreVal >= 600 ? '#f59e0b' : '#ef4444';
  const scoreBg = scoreVal >= 700 ? '#ecfdf5' : scoreVal >= 600 ? '#fffbeb' : '#fef2f2';
  const tierName = request.creditTier || (scoreVal >= 750 ? 'Platinum VIP' : scoreVal >= 680 ? 'Gold' : 'Silver');

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
            <span>{isPt ? 'Voltar' : 'Decision Desk'}</span>
          </button>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.02em' }}>
              {isPt ? 'Perfil de Crédito Completo' : 'Full Credit Dossier'}
            </div>
            <div style={{ fontSize: '0.66rem', color: '#94a3b8', fontWeight: '600' }}>
              App #{request.applicationNumber}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              onClick={toggleLanguage}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '8px',
                padding: '4px 8px',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: '800',
                cursor: 'pointer'
              }}
              title="Toggle EN / PT"
            >
              {isPt ? 'PT 🇵🇹' : 'EN 🇬🇧'}
            </button>

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
              title="Print Dossier"
            >
              <Printer size={15} />
            </button>
          </div>
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
                {isPt ? 'SCORE DO APLICATIVO PHONESUITE' : 'PHONESUITE APP CREDIT SCORE'}
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
                {isPt ? 'MOTOR PROPRIETÁRIO' : 'PROPRIETARY ENGINE'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: '900', lineHeight: 1, letterSpacing: '-0.03em', color: '#ffffff' }}>
                    {scoreVal}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '700' }}>
                    / 1,000
                  </span>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '6px', padding: '3px 10px', borderRadius: '9999px', background: scoreBg, border: `1px solid ${scoreColor}`, color: scoreColor, fontSize: '0.72rem', fontWeight: '800' }}>
                  <CheckCircle2 size={13} strokeWidth={2.5} />
                  <span>{tierName}</span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>
                  {isPt ? 'Limite Pré-Aprovado' : 'Pre-Approved Limit'}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#10b981', marginTop: '2px' }}>
                  {formatMoney(request.creditLimit || customer?.credit_limit || 2500)}
                </div>
                <div style={{ fontSize: '0.64rem', color: '#cbd5e1', marginTop: '3px' }}>
                  {isPt ? 'Capacidade Financeira: 94%' : 'Affordability: 94%'}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '0.9rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.12)', fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="#10b981" />
              <span>
                {isPt 
                  ? 'Mesmos dados de score e vantagens disponibilizados ao cliente em seu portal PhoneSuite.'
                  : 'Identical score factors and tier perks presented to the customer on their PhoneSuite portal.'}
              </span>
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
                  {customer?.kyc_status || (isPt ? 'Verificado (Passaporte & Open Banking)' : 'Verified (Passport & Open Banking)')}
                </span>
              </div>
            </div>

            <div style={{ color: '#ea580c', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.72rem', fontWeight: '800' }}>
              <span>{isPt ? 'Ver Perfil' : 'Profile'}</span>
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
                  {isPt ? 'HISTÓRICO & REGISTROS DO LOJISTA' : 'TENANT STORE HISTORY & RECORD'}
                </span>
              </div>
              <span style={{ fontSize: '0.65rem', fontWeight: '800', padding: '2px 8px', borderRadius: '9999px', background: '#ffedd5', color: '#c2410c' }}>
                {isPt ? 'LIVRO RAZÃO DA LOJA' : 'STORE LEDGER'}
              </span>
            </div>

            <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '0 0 0.85rem 0', lineHeight: 1.4 }}>
              {isPt 
                ? 'Esta seção preserva o histórico transacional, compras anteriores, contratos de parcelamento pontuais e ordens de serviço executadas especificamente pela sua loja.'
                : 'This section preserves all transaction history, previous purchases, prompt installment records, and workshop repair tickets held specifically by your tenant store.'}
            </p>

            {/* Lifetime KPI row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '1rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.6rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>
                  {isPt ? 'Gasto Total' : 'Lifetime Spend'}
                </div>
                <div style={{ fontSize: '0.94rem', fontWeight: '900', color: '#0f172a', marginTop: '2px' }}>
                  {formatMoney(customer?.total_spent || 2450.00)}
                </div>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.6rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>
                  {isPt ? 'Pedidos Loja' : 'Tenant Orders'}
                </div>
                <div style={{ fontSize: '0.94rem', fontWeight: '900', color: '#059669', marginTop: '2px' }}>
                  {orderHistory.length} {isPt ? 'Concluídos' : 'Completed'}
                </div>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.6rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>
                  {isPt ? 'Taxa Atraso' : 'Store Default'}
                </div>
                <div style={{ fontSize: '0.94rem', fontWeight: '900', color: '#059669', marginTop: '2px' }}>
                  0% {isPt ? '(Zero Dívida)' : '(Zero Arrears)'}
                </div>
              </div>
            </div>

            {/* Past Store Purchases */}
            <div style={{ marginBottom: '0.85rem' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShoppingBag size={13} color="#ea580c" />
                <span>{isPt ? `Compras Anteriores na Loja (${orderHistory.length})` : `Previous Store Purchases (${orderHistory.length})`}</span>
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
                <span>{isPt ? 'Contratos Anteriores de Financiamento na Loja' : 'Historical Tenant Financing Agreements'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {agreementHistory.map((agr, idx) => (
                  <div key={idx} style={{ background: '#ecfdf5', padding: '0.65rem 0.75rem', borderRadius: '10px', border: '1px solid #a7f3d0', fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: '900', color: '#065f46' }}>{agr.device}</div>
                        <div style={{ fontSize: '0.65rem', color: '#047857', marginTop: '1px' }}>
                          Agreement #{agr.agreementNumber} &bull; {agr.installmentsPaid}/{agr.totalInstallments} {isPt ? 'Parcelas Pagas' : 'Installments Paid'}
                        </div>
                      </div>
                      <span style={{ fontWeight: '900', color: '#065f46' }}>{formatMoney(agr.totalFinanced)}</span>
                    </div>
                    <div style={{ marginTop: '4px', fontSize: '0.66rem', color: '#059669', fontWeight: '700' }}>
                      ✓ {agr.status} &bull; {isPt ? 'Índice de Pagamento Pontual:' : 'On-Time Payment Index:'} {agr.onTimeRate}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Previous Repairs with this store */}
            <div>
              <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Wrench size={13} color="#ea580c" />
                <span>{isPt ? 'Serviços & Reparos na Oficina' : 'Workshop Service & Repairs'}</span>
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

          {/* SECTION 2: PHONESUITE IN-APP EVALUATION (Exactly same as Customer Portal) */}
          
          {/* Card 2A: Score Composition Factors */}
          <div 
            style={{ 
              background: '#ffffff', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              padding: '1.25rem 1.15rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={18} style={{ color: '#4318ff' }} />
                <span>{isPt ? 'Fatores de Composição do Score' : 'Score Composition Factors'}</span>
              </h4>
              <span style={{ fontSize: '0.64rem', fontWeight: '800', padding: '2px 8px', borderRadius: '9999px', background: '#eff6ff', color: '#2563eb' }}>
                APP MOTOR
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              
              {/* Factor 1: On-Time Payment History */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.55rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ maxWidth: '78%' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>
                    {isPt ? 'Histórico de Pagamentos em Dia' : 'On-Time Payment History'}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                    {isPt ? 'Nenhum atraso em faturas ou parcelamentos de aparelhos' : 'Zero missed payments across all bills and installments'}
                  </div>
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: '900', color: '#059669', whiteSpace: 'nowrap' }}>
                  +280 pts
                </span>
              </div>

              {/* Factor 2: ID & DOB Verification */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.55rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ maxWidth: '78%' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>
                    {isPt ? 'Documento e Data de Nasc. Verificados' : 'Verified ID & Date of Birth'}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                    {isPt ? 'Verificação regulatória de identidade concluída' : 'Full regulatory compliance check verified'}
                  </div>
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: '900', color: '#4318ff', whiteSpace: 'nowrap' }}>
                  +180 pts
                </span>
              </div>

              {/* Factor 3: Repairs & Devices History */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.55rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ maxWidth: '78%' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>
                    {isPt ? 'Histórico de Consertos e Aparelhos' : 'Store Repairs & Hardware History'}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                    {isPt ? 'Cliente fiel com histórico positivo de ordens de serviço' : 'Loyal customer with completed repair orders'}
                  </div>
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: '900', color: '#7c3aed', whiteSpace: 'nowrap' }}>
                  +165 pts
                </span>
              </div>

              {/* Factor 4: Account Tenure & Loyalty */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.55rem 0' }}>
                <div style={{ maxWidth: '78%' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>
                    {isPt ? 'Tempo de Conta e Fidelidade' : 'Account Longevity & Repeat Business'}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                    {isPt ? 'Perfil ativo há mais de 18 meses com compras recorrentes' : 'Active customer profile for over 18 months'}
                  </div>
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: '900', color: '#d97706', whiteSpace: 'nowrap' }}>
                  +160 pts
                </span>
              </div>

            </div>
          </div>

          {/* Card 2B: Customer Tier Benefits */}
          <div 
            style={{ 
              background: '#ffffff', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              padding: '1.25rem 1.15rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Gift size={18} style={{ color: '#d97706' }} />
                <span>{isPt ? `Benefícios do Seu Nível ${tierName.split(' ')[0]}` : `Your ${tierName} Perks`}</span>
              </h4>
              <span style={{ fontSize: '0.64rem', fontWeight: '800', padding: '2px 8px', borderRadius: '9999px', background: '#fef3c7', color: '#b45309' }}>
                VIP REWARDS
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              
              {/* Perk 1 */}
              <div style={{ background: '#f8fafc', padding: '0.8rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#4318ff', marginBottom: '4px' }}><Zap size={16} /></div>
                <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a' }}>0% APR RTO</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px', lineHeight: 1.3 }}>
                  {isPt ? '0% de juros em todos os contratos de financiamento RTO' : '0% Interest on all Rent-to-Own hardware agreements'}
                </div>
              </div>

              {/* Perk 2 */}
              <div style={{ background: '#f8fafc', padding: '0.8rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#059669', marginBottom: '4px' }}><ShieldCheck size={16} /></div>
                <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a' }}>Screen Guard</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px', lineHeight: 1.3 }}>
                  {isPt ? 'Película de vidro grátis em todo reparo de celular' : 'Free tempered glass protector on every phone repair'}
                </div>
              </div>

              {/* Perk 3 */}
              <div style={{ background: '#f8fafc', padding: '0.8rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#ec4899', marginBottom: '4px' }}><Clock size={16} /></div>
                <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a' }}>Express Queue</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px', lineHeight: 1.3 }}>
                  {isPt ? 'Fila prioritária expressa com técnicos seniores' : 'Priority express queue with senior technicians'}
                </div>
              </div>

              {/* Perk 4 */}
              <div style={{ background: '#f8fafc', padding: '0.8rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#d97706', marginBottom: '4px' }}><Sparkles size={16} /></div>
                <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a' }}>15% Off</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px', lineHeight: 1.3 }}>
                  {isPt ? '15% de desconto em capas, cabos e carregadores' : '15% off all accessories and charging kits'}
                </div>
              </div>

            </div>
          </div>

          {/* Card 2C: Multi-Jurisdiction Regulatory Notice (UK, Portugal, Belgium) */}
          <div 
            style={{ 
              background: '#f8fafc', 
              borderRadius: '14px', 
              border: '1px solid #e2e8f0', 
              padding: '0.9rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe2 size={15} color="#0284c7" />
              <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase' }}>
                {isPt ? 'CONFORMIDADE REGULATÓRIA MULTI-JURISDIÇÃO' : 'MULTI-JURISDICTION REGULATORY COMPLIANCE'}
              </span>
            </div>

            <p style={{ margin: 0, fontSize: '0.68rem', color: '#64748b', lineHeight: 1.4 }}>
              {isPt 
                ? 'O motor de score do PhoneSuite opera estritamente em conformidade com o enquadramento de crédito ao consumidor do Reino Unido (FCA CONC 5 & CCA 1974), Portugal (Banco de Portugal DL 133/2009 & CNPD) e Bélgica (BNB / Code de droit économique Livre VII). São processadas exclusivamente métricas de consentimento lícito (KYC autenticado, pontualidade de pagamentos e histórico na oficina), sem qualquer retenção indevida ou perfilamento externo ilegal.'
                : 'The PhoneSuite scoring engine operates in strict alignment with consumer credit frameworks across the United Kingdom (FCA CONC 5 & CCA 1974), Portugal (Banco de Portugal DL 133/2009 & CNPD), and Belgium (NBB / Code de droit économique Livre VII). Only lawful, consent-based metrics (verified KYC identity, repayment punctuality, and store service records) are processed, eliminating unlawful external data profiling.'}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
              <span style={{ fontSize: '0.62rem', fontWeight: '800', color: '#0369a1', background: '#e0f2fe', padding: '2px 8px', borderRadius: '6px' }}>
                🇬🇧 UK &bull; FCA CONC 5.2A
              </span>
              <span style={{ fontSize: '0.62rem', fontWeight: '800', color: '#047857', background: '#d1fae5', padding: '2px 8px', borderRadius: '6px' }}>
                🇵🇹 Portugal &bull; BdP DL 133/2009
              </span>
              <span style={{ fontSize: '0.62rem', fontWeight: '800', color: '#b45309', background: '#fef3c7', padding: '2px 8px', borderRadius: '6px' }}>
                🇧🇪 Belgium &bull; BNB / Art. VII.77
              </span>
            </div>
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
              gap: '6px',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.18)'
            }}
          >
            <ArrowLeft size={16} />
            <span>{isPt ? 'Voltar para Análise da Proposta' : 'Return to Application Decision Desk'}</span>
          </button>

        </main>

      </div>
    </div>
  );
}
