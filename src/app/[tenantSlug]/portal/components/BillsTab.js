'use client';

import { useState } from 'react';
import { 
  Receipt, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  FileText, 
  ArrowRight,
  Download,
  Eye,
  X
} from 'lucide-react';

export default function BillsTab({ 
  bills, 
  contracts, 
  onTriggerPayment, 
  tenant, 
  customer 
}) {
  const [filter, setFilter] = useState('unpaid'); // 'unpaid', 'all', 'contracts'
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const unpaidBills = bills.filter(b => b.status !== 'paid');
  const paidBills = bills.filter(b => b.status === 'paid');
  const totalOutstanding = unpaidBills.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* Header Summary Banner (Clean Light) */}
      <div 
        style={{ 
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '20px',
          padding: '1.25rem',
          position: 'relative',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '700' }}>
              Total Outstanding Balance
            </span>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: totalOutstanding > 0 ? '#ef4444' : '#10b981', margin: '2px 0' }}>
              £{totalOutstanding.toFixed(2)}
            </div>
            <p style={{ fontSize: '0.76rem', color: '#64748b', margin: 0 }}>
              {unpaidBills.length === 0 
                ? 'All accounts settled. No pending invoices!' 
                : `${unpaidBills.length} outstanding invoices due for payment`}
            </p>
          </div>

          <div 
            style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '50%', 
              background: 'rgba(16, 185, 129, 0.1)', 
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}
          >
            <Receipt size={22} />
          </div>
        </div>

        {totalOutstanding > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={() => onTriggerPayment(unpaidBills[0])}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
              }}
            >
              <CreditCard size={18} /> Quick Pay Next Bill (£{unpaidBills[0].amount.toFixed(2)})
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', background: '#e2e8f0', padding: '4px', borderRadius: '12px' }}>
        <button
          onClick={() => setFilter('unpaid')}
          style={{
            flex: 1,
            padding: '0.5rem',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.78rem',
            fontWeight: filter === 'unpaid' ? '700' : '600',
            background: filter === 'unpaid' ? '#ffffff' : 'transparent',
            color: filter === 'unpaid' ? '#4318ff' : '#64748b',
            cursor: 'pointer',
            boxShadow: filter === 'unpaid' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          Due & Unpaid ({unpaidBills.length})
        </button>

        <button
          onClick={() => setFilter('all')}
          style={{
            flex: 1,
            padding: '0.5rem',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.78rem',
            fontWeight: filter === 'all' ? '700' : '600',
            background: filter === 'all' ? '#ffffff' : 'transparent',
            color: filter === 'all' ? '#4318ff' : '#64748b',
            cursor: 'pointer',
            boxShadow: filter === 'all' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          Paid Archive ({paidBills.length})
        </button>

        <button
          onClick={() => setFilter('contracts')}
          style={{
            flex: 1,
            padding: '0.5rem',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.78rem',
            fontWeight: filter === 'contracts' ? '700' : '600',
            background: filter === 'contracts' ? '#ffffff' : 'transparent',
            color: filter === 'contracts' ? '#4318ff' : '#64748b',
            cursor: 'pointer',
            boxShadow: filter === 'contracts' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          RTO Schedules
        </button>
      </div>

      {/* 1. Unpaid Invoices Tab */}
      {filter === 'unpaid' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {unpaidBills.length === 0 ? (
            <div 
              className="mobile-card" 
              style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748b' }}
            >
              <div 
                style={{ 
                  width: '54px', 
                  height: '54px', 
                  borderRadius: '50%', 
                  background: 'rgba(16, 185, 129, 0.1)', 
                  color: '#059669', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 1rem auto' 
                }}
              >
                <CheckCircle2 size={32} />
              </div>
              <h4 style={{ fontSize: '1rem', color: '#0f172a', fontWeight: '800', margin: '0 0 0.35rem 0' }}>All Caught Up!</h4>
              <p style={{ fontSize: '0.8rem', margin: 0 }}>You have no pending or overdue invoices.</p>
            </div>
          ) : (
            unpaidBills.map((bill) => (
              <div 
                key={bill.id} 
                className="mobile-card"
                style={{ borderLeft: '4px solid #ef4444' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
                      {bill.type || 'Service Bill'} &bull; #{bill.invoice_number || bill.id.slice(0, 8)}
                    </span>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', margin: '3px 0' }}>
                      {bill.description || 'Hardware / Service Invoice'}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#dc2626', fontSize: '0.75rem', marginTop: '4px', fontWeight: '600' }}>
                      <Clock size={13} />
                      <span>Due date: {bill.due_date || 'Within 7 days'}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>
                      £{Number(bill.amount || 0).toFixed(2)}
                    </div>
                    <span 
                      style={{ 
                        fontSize: '0.65rem', 
                        padding: '2px 7px', 
                        borderRadius: '4px', 
                        background: 'rgba(239, 68, 68, 0.1)', 
                        color: '#dc2626',
                        fontWeight: '700',
                        textTransform: 'uppercase'
                      }}
                    >
                      Unpaid
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                  <button
                    onClick={() => onTriggerPayment(bill)}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '0.65rem',
                      color: '#ffffff',
                      fontWeight: '700',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)'
                    }}
                  >
                    <CreditCard size={15} /> Pay with Stripe / Card
                  </button>

                  <button
                    onClick={() => setSelectedReceipt(bill)}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '0.65rem 0.85rem',
                      color: '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="View Invoice Details"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. Paid Bills Archive */}
      {filter === 'all' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {paidBills.length === 0 ? (
            <div className="mobile-card" style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b' }}>
              <p>No settled receipts found yet.</p>
            </div>
          ) : (
            paidBills.map((bill) => (
              <div 
                key={bill.id} 
                className="mobile-card"
                style={{ borderLeft: '4px solid #10b981' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700' }}>
                      #{bill.invoice_number || bill.id.slice(0, 8)} &bull; {bill.type || 'Invoice'}
                    </span>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a', margin: '3px 0' }}>
                      {bill.description}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#059669', fontSize: '0.73rem', fontWeight: '600' }}>
                      <CheckCircle2 size={13} />
                      <span>Settled on {bill.paid_at ? new Date(bill.paid_at).toLocaleDateString() : bill.due_date}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#059669' }}>
                      £{Number(bill.amount || 0).toFixed(2)}
                    </div>
                    <button
                      onClick={() => setSelectedReceipt(bill)}
                      style={{
                        marginTop: '6px',
                        background: 'transparent',
                        border: 'none',
                        color: '#4318ff',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}
                    >
                      View Receipt <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 3. Rent-to-Own Financing Schedules */}
      {filter === 'contracts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {contracts && contracts.length > 0 ? (
            contracts.map((con) => (
              <div key={con.id} className="mobile-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(67, 24, 255, 0.08)', color: '#4318ff' }}>
                      <FileText size={18} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                        {con.item_name}
                      </h4>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        Agreement #{con.id.slice(0, 8)} &bull; 0% APR Fixed
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '9999px', background: 'rgba(16, 185, 129, 0.12)', color: '#059669', fontWeight: '700' }}>
                    ACTIVE
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '10px', margin: '0.75rem 0', border: '1px solid #e2e8f0' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Financed</span>
                    <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a' }}>£{Number(con.financed_amount).toFixed(2)}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Monthly Pay</span>
                    <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#4318ff' }}>£{Number(con.installment_amount).toFixed(2)}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Remaining</span>
                    <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#059669' }}>
                      £{(con.installment_amount * (con.total_installments - con.paid_installments)).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginBottom: '4px' }}>
                    <span>Installments: {con.paid_installments} of {con.total_installments} Completed</span>
                    <span style={{ color: '#0f172a', fontWeight: '700' }}>
                      {Math.round((con.paid_installments / con.total_installments) * 100)}%
                    </span>
                  </div>
                  <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${(con.paid_installments / con.total_installments) * 100}%`,
                        background: 'linear-gradient(90deg, #10b981, #06b6d4)'
                      }} 
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="mobile-card" style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b' }}>
              <p>No active Rent-to-Own contracts on file.</p>
            </div>
          )}
        </div>
      )}

      {/* Receipt Details Modal / Slip (Light Theme) */}
      {selectedReceipt && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(0, 0, 0, 0.45)', 
            backdropFilter: 'blur(8px)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 100, 
            padding: '1rem' 
          }}
        >
          <div 
            style={{ 
              maxWidth: '380px', 
              width: '100%', 
              background: '#ffffff', 
              border: '1px solid #e2e8f0', 
              borderRadius: '20px', 
              padding: '1.5rem',
              color: '#0f172a',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
            }}
          >
            <button
              onClick={() => setSelectedReceipt(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'inline-flex', padding: '8px', borderRadius: '50%', background: 'rgba(67, 24, 255, 0.1)', color: '#4318ff', marginBottom: '0.5rem' }}>
                <Receipt size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0 }}>Official Receipt</h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>
                {tenant?.name || 'PhoneSuite UK'}
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Invoice Ref:</span>
                <strong>#{selectedReceipt.invoice_number || selectedReceipt.id.slice(0, 8)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Customer:</span>
                <span>{customer?.name || 'Customer'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Status:</span>
                <span style={{ color: selectedReceipt.status === 'paid' ? '#059669' : '#dc2626', fontWeight: '700', textTransform: 'uppercase' }}>
                  {selectedReceipt.status}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Description:</span>
                <span style={{ maxWidth: '60%', textAlign: 'right' }}>{selectedReceipt.description}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                <span style={{ fontWeight: '700' }}>Total Amount:</span>
                <strong style={{ fontSize: '1.1rem', color: '#4318ff' }}>£{Number(selectedReceipt.amount).toFixed(2)}</strong>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
              {selectedReceipt.status !== 'paid' ? (
                <button
                  onClick={() => {
                    setSelectedReceipt(null);
                    onTriggerPayment(selectedReceipt);
                  }}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.65rem',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Pay £{Number(selectedReceipt.amount).toFixed(2)} Now
                </button>
              ) : (
                <button
                  onClick={() => alert('Receipt downloaded as PDF confirmation.')}
                  style={{
                    flex: 1,
                    background: '#4318ff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.65rem',
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer'
                  }}
                >
                  <Download size={16} /> Download PDF
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
