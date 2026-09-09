'use client';

import { useState } from 'react';
import { X, Receipt, FileText, User, Calendar, CreditCard } from 'lucide-react';
import { useStaffLanguage } from '../context/StaffLanguageContext';

export default function NewInvoiceModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  customers = [], 
  activeBranch = 'London Central Branch' 
}) {
  const { t } = useStaffLanguage();
  const m = t.modals;

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('99.00');
  const [invoiceType, setInvoiceType] = useState('Repair Invoice');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending' or 'paid'

  if (!isOpen) return null;

  const handleSelectCustomer = (e) => {
    const custId = e.target.value;
    if (!custId) return;
    const found = customers.find(c => c.id === custId);
    if (found) {
      setCustomerName(found.name);
      setCustomerPhone(found.phone);
      setCustomerEmail(found.email || '');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName || !description || !amount) {
      alert('Please provide Customer Name, Description, and Amount.');
      return;
    }

    const numAmount = parseFloat(amount) || 0;
    const newInvoice = {
      id: `inv-${Date.now()}`,
      invoice_number: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_name: customerName,
      customer_phone: customerPhone || '+44 7900 000000',
      customer_email: customerEmail || 'customer@phonesuite.uk',
      description,
      amount: numAmount,
      due_date: dueDate,
      status: paymentStatus,
      type: invoiceType,
      branch: activeBranch,
      paid_at: paymentStatus === 'paid' ? new Date().toISOString() : null,
      created_at: new Date().toISOString()
    };

    onSubmit(newInvoice);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(11, 19, 43, 0.65)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      zIndex: 100,
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div 
        style={{
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          backgroundColor: '#ffffff',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          padding: '1.25rem 1.25rem 2rem 1.25rem',
          overflowY: 'auto',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#ffedd5',
              color: '#ea580c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Receipt size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                {m.createInvoiceTitle}
              </h2>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{activeBranch}</span>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            style={{
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
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Customer select */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
              {m.customer}
            </label>
            <select
              onChange={handleSelectCustomer}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                backgroundColor: '#f8fafc',
                color: '#0f172a',
                marginBottom: '0.5rem'
              }}
            >
              <option value="">-- Choose Existing Customer --</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} &bull; {c.phone}</option>
              ))}
            </select>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Customer Name *"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem'
                }}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          {/* Invoice Type */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>
              Invoice Category
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
              {['Repair Invoice', 'POS Store Sale', 'RTO Installment'].map((type) => {
                const isActive = invoiceType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setInvoiceType(type)}
                    style={{
                      padding: '0.55rem 0.5rem',
                      borderRadius: '10px',
                      border: isActive ? 'none' : '1px solid #e2e8f0',
                      backgroundColor: isActive ? '#0f172a' : '#ffffff',
                      color: isActive ? '#ffffff' : '#64748b',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      boxShadow: isActive ? '0 2px 6px rgba(15, 23, 42, 0.15)' : 'none'
                    }}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>
              {m.invoiceDesc} *
            </label>
            <textarea
              rows={2}
              placeholder="e.g. iPhone 15 Pro OLED screen replacement + 30W USB-C fast charger"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                fontFamily: 'inherit',
                resize: 'none'
              }}
            />
          </div>

          {/* Amount & Due Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>
                {m.invoiceAmount} *
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '1rem',
                  fontWeight: '800',
                  color: '#0f172a'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>
                {m.dueDate}
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          {/* Payment Status Switcher */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>
              Initial Settlement Status
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setPaymentStatus('pending')}
                style={{
                  padding: '0.5rem',
                  borderRadius: '10px',
                  border: paymentStatus === 'pending' ? '1.5px solid #f59e0b' : '1px solid #e2e8f0',
                  backgroundColor: paymentStatus === 'pending' ? '#fffbeb' : '#ffffff',
                  color: paymentStatus === 'pending' ? '#b45309' : '#64748b',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Pending Balance
              </button>
              <button
                type="button"
                onClick={() => setPaymentStatus('paid')}
                style={{
                  padding: '0.5rem',
                  borderRadius: '10px',
                  border: paymentStatus === 'paid' ? '1.5px solid #10b981' : '1px solid #e2e8f0',
                  backgroundColor: paymentStatus === 'paid' ? '#ecfdf5' : '#ffffff',
                  color: paymentStatus === 'paid' ? '#047857' : '#64748b',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Paid in Full (Cash/Card)
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            style={{
              marginTop: '0.5rem',
              width: '100%',
              padding: '0.9rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ff7a00 0%, #ea580c 100%)',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.92rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <Receipt size={18} />
            {m.btnSubmitInvoice}
          </button>

        </form>
      </div>
    </div>
  );
}
