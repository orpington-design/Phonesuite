'use client';

import { useState } from 'react';
import { X, Wrench, Smartphone, Laptop, Tablet, Watch, Headphones, Sparkles, User, AlertCircle } from 'lucide-react';
import { useStaffLanguage } from '../context/StaffLanguageContext';
import { STAFF_MEMBERS } from '../data/staffData';

export default function NewRepairJobModal({ 
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
  const [deviceType, setDeviceType] = useState('phone');
  const [deviceModel, setDeviceModel] = useState('');
  const [deviceSerial, setDeviceSerial] = useState('');
  const [faultDesc, setFaultDesc] = useState('');
  const [diagnosticNotes, setDiagnosticNotes] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('89.00');
  const [depositPaid, setDepositPaid] = useState('20.00');
  const [assignedTech, setAssignedTech] = useState(STAFF_MEMBERS[0]?.name || 'Alex Rivera');

  if (!isOpen) return null;

  const handleSelectCustomer = (e) => {
    const custId = e.target.value;
    if (!custId) return;
    const found = customers.find(c => c.id === custId);
    if (found) {
      setCustomerName(found.name);
      setCustomerPhone(found.phone);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName || !deviceModel || !faultDesc) {
      alert('Please fill in Customer Name, Device Model, and Fault Description.');
      return;
    }

    const estCostNum = parseFloat(estimatedCost) || 0;
    const depPaidNum = parseFloat(depositPaid) || 0;

    const newRepair = {
      id: `rep-${Date.now()}`,
      customer_name: customerName,
      customer_phone: customerPhone || '+44 7900 000000',
      device_type: deviceType,
      device_model: deviceModel,
      device_serial: deviceSerial || 'IMEI-PENDING',
      issue_description: faultDesc,
      diagnostic_notes: diagnosticNotes || 'Initial inspection logged at intake.',
      status: 'received',
      estimated_cost: estCostNum,
      deposit_paid: depPaidNum,
      balance_due: Math.max(0, estCostNum - depPaidNum),
      assigned_technician: assignedTech,
      created_at: new Date().toISOString(),
      branch: activeBranch
    };

    onSubmit(newRepair);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
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
          maxWidth: '520px',
          maxHeight: '90vh',
          backgroundColor: '#ffffff',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          padding: '1.25rem 1.25rem 2rem 1.25rem',
          overflowY: 'auto',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
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
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Wrench size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                {m.createRepairTitle}
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
          
          {/* Fast Customer Select */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
              {m.customer} (Select Existing or Type New)
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
              <option value="">-- Quick Choose Registered Customer --</option>
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
                placeholder="Phone / WhatsApp *"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
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

          {/* Device Type Pills */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#334155', marginBottom: '0.45rem' }}>
              {m.deviceType}
            </label>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {[
                { id: 'phone', label: 'Phone', icon: Smartphone },
                { id: 'tablet', label: 'Tablet', icon: Tablet },
                { id: 'laptop', label: 'Laptop', icon: Laptop },
                { id: 'smartwatch', label: 'Watch', icon: Watch },
                { id: 'audio', label: 'Audio', icon: Headphones },
                { id: 'other', label: 'Other', icon: Sparkles }
              ].map(item => {
                const Icon = item.icon;
                const isSelected = deviceType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDeviceType(item.id)}
                    style={{
                      padding: '0.45rem 0.75rem',
                      borderRadius: '8px',
                      border: isSelected ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                      backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                      color: isSelected ? '#2563eb' : '#475569',
                      fontWeight: isSelected ? '700' : '500',
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Icon size={14} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Model & Serial */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>
                {m.deviceModel} *
              </label>
              <input
                type="text"
                placeholder="e.g. iPhone 15 Pro, S24"
                value={deviceModel}
                onChange={(e) => setDeviceModel(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>
                {m.deviceSerial}
              </label>
              <input
                type="text"
                placeholder="IMEI / Serial No."
                value={deviceSerial}
                onChange={(e) => setDeviceSerial(e.target.value)}
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

          {/* Issue Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>
              {m.faultDesc} *
            </label>
            <textarea
              rows={2}
              placeholder="Broken screen, liquid damage, battery drain, no power..."
              value={faultDesc}
              onChange={(e) => setFaultDesc(e.target.value)}
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

          {/* Diagnostic Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>
              {m.diagnosticNotes}
            </label>
            <textarea
              rows={2}
              placeholder="Initial diagnostic: Passed 12-point checks, parts in stock..."
              value={diagnosticNotes}
              onChange={(e) => setDiagnosticNotes(e.target.value)}
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

          {/* Tech & Financial Estimates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>
                {m.assignedTech}
              </label>
              <select
                value={assignedTech}
                onChange={(e) => setAssignedTech(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.5rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.8rem',
                  backgroundColor: '#ffffff'
                }}
              >
                {STAFF_MEMBERS.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>
                {m.estFee}
              </label>
              <input
                type="number"
                step="0.01"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: '#0f172a'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>
                {m.depositAmount}
              </label>
              <input
                type="number"
                step="0.01"
                value={depositPaid}
                onChange={(e) => setDepositPaid(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: '#059669'
                }}
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            style={{
              marginTop: '0.75rem',
              width: '100%',
              padding: '0.9rem',
              borderRadius: '12px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.92rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <Wrench size={18} />
            {m.btnSubmitRepair}
          </button>

        </form>
      </div>
    </div>
  );
}
