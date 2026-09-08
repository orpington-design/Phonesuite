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

export default function ScoreTab({ customer, tenant, onGoToShop }) {
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

      {/* Hero Circular Score Gauge Card */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '24px',
          padding: '1.5rem 1.25rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div style={{ position: 'absolute', top: -30, right: -30, width: '140px', height: '140px', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)', borderRadius: '50%' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#38bdf8', marginBottom: '0.5rem' }}>
          <ShieldCheck size={18} />
          <span style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            PhoneSuite Credit Ledger
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
              stroke="rgba(255, 255, 255, 0.08)"
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
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#818cf8" />
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
            <span style={{ fontSize: '2.5rem', fontWeight: '900', color: '#ffffff', lineHeight: 1 }}>
              {currentScore}
            </span>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '600' }}>
              out of 1000
            </span>
            <span 
              style={{ 
                marginTop: '4px',
                fontSize: '0.68rem', 
                fontWeight: '800', 
                padding: '2px 8px', 
                borderRadius: '9999px',
                background: 'rgba(16, 185, 129, 0.2)', 
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.4)'
              }}
            >
              EXCELLENT TIER
            </span>
          </div>
        </div>

        {/* Available Financing Limit Box */}
        <div 
          style={{ 
            background: 'rgba(15, 23, 42, 0.7)', 
            borderRadius: '16px', 
            padding: '0.85rem 1rem', 
            border: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '0.5rem'
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>
              Pre-Approved Financing Power
            </span>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#38bdf8' }}>
              £{Number(creditLimit).toLocaleString()}
            </div>
          </div>

          <button
            onClick={onGoToShop}
            style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              border: 'none',
              borderRadius: '10px',
              padding: '0.5rem 0.85rem',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            Shop with Credit <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Score Factors Breakdown */}
      <div className="mobile-card">
        <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: '#fff', margin: '0 0 0.85rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <TrendingUp size={16} style={{ color: '#38bdf8' }} /> Score Breakdown Factors
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#fff' }}>100% On-Time Payment History</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Zero missed installments or late bill fees</div>
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#34d399' }}>+280 pts</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#fff' }}>Verified E-Signature & DOB</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Legal identity compliance on record</div>
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#38bdf8' }}>+180 pts</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#fff' }}>Device Repair Loyalty</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>3 registered hardware repairs completed</div>
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#818cf8' }}>+165 pts</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#fff' }}>Account Longevity</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Registered since March 2024</div>
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#f59e0b' }}>+160 pts</span>
          </div>
        </div>
      </div>

      {/* VIP Perks Unlocked */}
      <div className="mobile-card">
        <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: '#fff', margin: '0 0 0.85rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Gift size={16} style={{ color: '#f59e0b' }} /> Unlocked Platinum Perks
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ color: '#38bdf8', marginBottom: '4px' }}><Zap size={16} /></div>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#fff' }}>0% APR RTO</div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>Zero interest finance on any shop device</div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ color: '#10b981', marginBottom: '4px' }}><ShieldCheck size={16} /></div>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#fff' }}>Free Screen Guard</div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>With every screen repair job</div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ color: '#ec4899', marginBottom: '4px' }}><Clock size={16} /></div>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#fff' }}>VIP Express Queue</div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>Under 2hr technician dispatch</div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ color: '#fbbf24', marginBottom: '4px' }}><Sparkles size={16} /></div>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#fff' }}>15% Accessory Off</div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>Chargers, cases & audio</div>
          </div>
        </div>
      </div>

      {/* Interactive Simulator */}
      <div 
        className="mobile-card"
        style={{ border: '1px dashed rgba(56, 189, 248, 0.4)', background: 'rgba(56, 189, 248, 0.04)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={16} style={{ color: '#38bdf8' }} />
            <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#fff', margin: 0 }}>Score Booster Simulator</h4>
          </div>
          <span style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: '600' }}>Try it live</span>
        </div>

        <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0 0 0.75rem 0' }}>
          See how settling pending repair invoices directly impacts your score and credit limit.
        </p>

        <button
          onClick={() => setSimulatorPaid(!simulatorPaid)}
          style={{
            width: '100%',
            background: simulatorPaid ? '#10b981' : 'rgba(56, 189, 248, 0.15)',
            border: `1px solid ${simulatorPaid ? '#10b981' : 'rgba(56, 189, 248, 0.3)'}`,
            borderRadius: '10px',
            padding: '0.6rem',
            color: simulatorPaid ? '#ffffff' : '#38bdf8',
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
              <CheckCircle2 size={15} /> Simulated Payment Active (+20 pts applied!) Click to reset
            </>
          ) : (
            <>
              Simulate Settling £149 Invoice (+20 Points & £250 Limit Bump)
            </>
          )}
        </button>
      </div>

    </div>
  );
}
