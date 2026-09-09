'use client';

import { X, Printer, CheckCircle2, Smartphone, ShieldCheck } from 'lucide-react';
import { useStaffLanguage } from '../context/StaffLanguageContext';

export default function ReceiptModal({ 
  isOpen, 
  onClose, 
  receiptData, 
  tenantName = 'PhoneSuite UK' 
}) {
  const { t } = useStaffLanguage();
  const m = t.modals;

  if (!isOpen || !receiptData) return null;

  const handlePrint = () => {
    window.print();
  };

  const {
    receiptNumber = `REC-${Date.now().toString().slice(-6)}`,
    date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    customerName = 'Valued Customer',
    customerPhone = '',
    branch = 'London Central Branch',
    items = [],
    subtotal = 0,
    vat = 0,
    total = 0,
    paymentMethod = 'Card (Stripe Terminal)',
    isRto = false,
    rtoDetails = null
  } = receiptData;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 110,
      padding: '1rem',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div 
        style={{
          width: '100%',
          maxWidth: '440px',
          maxHeight: '92vh',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '1.5rem',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button 
          type="button" 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Printable Receipt Paper Container */}
        <div id="printable-receipt-area" style={{ textAlign: 'center', paddingTop: '0.5rem' }}>
          
          {/* Brand & Store Header */}
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #4318ff 0%, #06b6d4 100%)', color: '#fff', marginBottom: '0.5rem' }}>
            <Smartphone size={24} />
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#0f172a', margin: '0 0 2px 0' }}>
            {tenantName}
          </h2>
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
            {branch} &bull; VAT Reg: GB 942 8192 10
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#ecfdf5', color: '#059669', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: '800', marginTop: '0.6rem' }}>
            <CheckCircle2 size={13} />
            {m.statusPaid}
          </div>

          <div style={{ margin: '1rem 0', borderTop: '1px dashed #cbd5e1', borderBottom: '1px dashed #cbd5e1', padding: '0.75rem 0', textAlign: 'left', fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#64748b' }}>Receipt #:</span>
              <span style={{ fontWeight: '700', color: '#0f172a' }}>{receiptNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#64748b' }}>Date & Time:</span>
              <span style={{ fontWeight: '600', color: '#334155' }}>{date}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#64748b' }}>Customer:</span>
              <span style={{ fontWeight: '700', color: '#0f172a' }}>{customerName}</span>
            </div>
            {customerPhone && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Phone:</span>
                <span style={{ color: '#334155' }}>{customerPhone}</span>
              </div>
            )}
          </div>

          {/* Line Items */}
          <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
              Items & Services
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <div style={{ maxWidth: '70%' }}>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{item.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Qty: {item.quantity || 1} &bull; £{Number(item.price || item.unit_price || 0).toFixed(2)}
                    </div>
                  </div>
                  <div style={{ fontWeight: '800', color: '#0f172a' }}>
                    £{(Number(item.price || item.unit_price || 0) * (item.quantity || 1)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Breakdown */}
          <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '0.85rem', textAlign: 'left', fontSize: '0.8rem', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#64748b' }}>
              <span>Subtotal:</span>
              <span>£{Number(subtotal).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#64748b' }}>
              <span>VAT / Tax (20%):</span>
              <span>£{Number(vat).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '6px', fontSize: '1rem', fontWeight: '900', color: '#0f172a' }}>
              <span>Total Paid:</span>
              <span style={{ color: '#2563eb' }}>£{Number(total).toFixed(2)}</span>
            </div>
            <div style={{ marginTop: '6px', fontSize: '0.72rem', color: '#64748b' }}>
              Payment Method: <strong style={{ color: '#334155' }}>{paymentMethod}</strong>
            </div>

            {isRto && rtoDetails && (
              <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed #cbd5e1', fontSize: '0.72rem', color: '#2563eb', fontWeight: '600' }}>
                Rent-to-Own Contract #{rtoDetails.contractId} active &bull; {rtoDetails.term} Months at £{rtoDetails.monthly}/mo
              </div>
            )}
          </div>

          {/* Warranty & Guarantee footer */}
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.75rem', fontWeight: '700' }}>
            <ShieldCheck size={16} />
            <span>Includes 12-Month PhoneSuite Hardware Guarantee</span>
          </div>

          <p style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.5rem' }}>
            Thank you for choosing PhoneSuite. Keep this receipt for warranty and collection verification.
          </p>

        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button
            type="button"
            onClick={handlePrint}
            style={{
              padding: '0.75rem',
              borderRadius: '12px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              border: '1px solid #bfdbfe',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <Printer size={16} />
            {m.btnPrint}
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.75rem',
              borderRadius: '12px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {m.btnClose}
          </button>
        </div>

      </div>
    </div>
  );
}
