'use client';

import { useState } from 'react';
import { 
  Award, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  CheckCircle2, 
  Lock, 
  Gift, 
  Sparkles, 
  HelpCircle,
  Clock,
  ArrowRight,
  Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ScoreTab({ customer, tenant, onGoToShop }) {
  const { t } = useLanguage();
  const [simulatorPaid, setSimulatorPaid] = useState(false);
  const baseScore = customer?.credit_score || 785;
  const currentScore = simulatorPaid ? baseScore + 20 : baseScore;
  const creditLimit = customer?.credit_limit || 2500;

  // SVG Gauge calculation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const maxScore = 1000;
  const scorePercent = Math.min(1, currentScore / maxScore);
  const strokeDashoffset = circumference - scorePercent * (circumference * 0.75); // 270 degree arc

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* Hero Circular Score Gauge Card (Clean Light) */}
      <div 
        style={{ 
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '24px',
          padding: '1.5rem 1.25rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div style={{ position: 'absolute', top: -30, right: -30, width: '140px', height: '140px', background: 'radial-gradient(circle, rgba(67, 24, 255, 0.06) 0%, transparent 70%)', borderRadius: '50%' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#4318ff', marginBottom: '0.5rem' }}>
          <ShieldCheck size={18} />
          <span style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {t.score.scoreTitle}
          </span>
        </div>

        {/* Circular Dial SVG */}
        <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0.5rem auto' }}>
          <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: 'rotate(135deg)' }}>
            {/* Background Arc */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * 0.25}
              strokeLinecap="round"
            />
            {/* Foreground Gradient Arc */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4318ff" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Score Text */}
          <div 
            style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0f172a', lineHeight: 1 }}>
              {currentScore}
            </span>
            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>
              {t.score.outOf}
            </span>
            <span 
              style={{ 
                marginTop: '4px',
                fontSize: '0.68rem', 
                fontWeight: '800', 
                padding: '2px 8px', 
                borderRadius: '9999px',
                background: 'rgba(16, 185, 129, 0.12)', 
                color: '#059669',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}
            >
              {t.score.tierExcellent}
            </span>
          </div>
        </div>

        {/* Available Financing Limit Box */}
        <div 
          style={{ 
            background: '#f8fafc', 
            borderRadius: '16px', 
            padding: '0.85rem 1rem', 
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '0.5rem'
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>
              {t.score.preapprovedHardwareLimit}
            </span>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#4318ff' }}>
              £{Number(creditLimit).toLocaleString()}
            </div>
          </div>

          <button
            onClick={onGoToShop}
            style={{
              background: 'linear-gradient(135deg, #4318ff 0%, #06b6d4 100%)',
              border: 'none',
              borderRadius: '10px',
              padding: '0.55rem 0.85rem',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: '0 2px 8px rgba(67, 24, 255, 0.25)'
            }}
          >
            {t.score.shopWithCredit} <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Score Factors Breakdown */}
      <div className="mobile-card">
        <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.85rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <TrendingUp size={16} style={{ color: '#4318ff' }} /> {t.score.scoreFactors}
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0f172a' }}>{t.score.factorPayment}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{t.score.factorPaymentDesc}</div>
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#059669' }}>+280 pts</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0f172a' }}>{t.score.factorDob}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{t.score.factorDobDesc}</div>
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#4318ff' }}>+180 pts</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0f172a' }}>{t.score.factorRepairs}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{t.score.factorRepairsDesc}</div>
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#7c3aed' }}>+165 pts</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0f172a' }}>{t.score.factorLoyalty}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{t.score.factorLoyaltyDesc}</div>
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#d97706' }}>+160 pts</span>
          </div>
        </div>
      </div>

      {/* VIP Perks Unlocked */}
      <div className="mobile-card">
        <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.85rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Gift size={16} style={{ color: '#d97706' }} /> {t.score.tierPerks}
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ color: '#4318ff', marginBottom: '4px' }}><Zap size={16} /></div>
            <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a' }}>0% APR RTO</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>{t.score.perk1}</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ color: '#059669', marginBottom: '4px' }}><ShieldCheck size={16} /></div>
            <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a' }}>Screen Guard</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>{t.score.perk2}</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ color: '#ec4899', marginBottom: '4px' }}><Clock size={16} /></div>
            <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a' }}>Express Queue</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>{t.score.perk3}</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ color: '#d97706', marginBottom: '4px' }}><Sparkles size={16} /></div>
            <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a' }}>15% Off</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>{t.score.perk4}</div>
          </div>
        </div>
      </div>

      {/* Interactive Simulator */}
      <div 
        className="mobile-card"
        style={{ border: '1px dashed rgba(67, 24, 255, 0.4)', background: 'rgba(67, 24, 255, 0.03)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={16} style={{ color: '#4318ff' }} />
            <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>{t.score.scoreSimulator}</h4>
          </div>
          <span style={{ fontSize: '0.68rem', color: '#4318ff', fontWeight: '700' }}>Live</span>
        </div>

        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 0.75rem 0' }}>
          {t.score.simulatorPrompt}
        </p>

        <button
          onClick={() => setSimulatorPaid(!simulatorPaid)}
          style={{
            width: '100%',
            background: simulatorPaid ? '#10b981' : 'rgba(67, 24, 255, 0.08)',
            border: `1px solid ${simulatorPaid ? '#10b981' : 'rgba(67, 24, 255, 0.2)'}`,
            borderRadius: '10px',
            padding: '0.65rem',
            color: simulatorPaid ? '#ffffff' : '#4318ff',
            fontSize: '0.78rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem'
          }}
        >
          {simulatorPaid ? (
            <>
              <CheckCircle2 size={15} /> {t.score.boostMessage}
            </>
          ) : (
            <>
              {t.score.simulatorPrompt} (+20 pts)
            </>
          )}
        </button>
      </div>

    </div>
  );
}
