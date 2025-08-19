"use client"

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const History = ({ isOpen, onClose }) => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchOrderHistory();
    }
  }, [isOpen]);

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      // Get user ID from localStorage
      const userId = localStorage.getItem('annas_user_id');
      
      if (!userId) {
        console.log('No user ID found');
        setOrderHistory([]);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setOrderHistory(data || []);
    } catch (err) {
      console.error('Error fetching order history:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
        .history-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(60, 42, 30, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1001;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.3s ease-out;
          padding: 1rem;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .history-container {
          background: #f5f1e6;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          width: 100%;
          max-width: 800px;
          max-height: 80vh;
          overflow: hidden;
          animation: slideUp 0.3s ease-out;
          border: 2px solid #c4ad8f;
          font-family: 'Crimson Text', serif;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(1rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 2px solid #c4ad8f;
          background: #8B4513;
          color: #f5f1e6;
        }
        
        .history-title {
          font-size: 1.25rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Playfair Display', serif;
        }
        
        .history-close {
          color: #e8dfce;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.5rem;
          line-height: 1;
          transition: all 0.2s;
          padding: 0.5rem;
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        .history-close:hover {
          background-color: rgba(245, 241, 230, 0.2);
          color: #f5f1e6;
        }
        
        .history-content {
          padding: 1.5rem;
          max-height: 60vh;
          overflow-y: auto;
          background: #f5f1e6;
        }
        
        .empty-history {
          text-align: center;
          padding: 3rem 0;
        }
        
        .empty-history-icon {
          width: 4rem;
          height: 4rem;
          margin: 0 auto 1.5rem;
          color: #c4ad8f;
        }
        
        .empty-history-text {
          color: #7d5d3b;
          font-size: 1rem;
          font-weight: 500;
        }
        
        .order-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .order-item {
          padding: 1.25rem;
          border-radius: 8px;
          border: 1px solid #c4ad8f;
          background-color: #e8dfce;
        }
        
        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          gap: 1rem;
        }
        
        .order-info {
          flex: 1;
          min-width: 0;
        }
        
        .order-table {
          font-weight: 600;
          color: #3c2a1e;
          margin-bottom: 0.25rem;
          font-size: 1rem;
        }
        
        .order-date {
          color: #8B4513;
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .order-status {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        
        .status-badge {
          padding: 0.5rem 0.75rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .status-paid {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        
        .status-unpaid {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        
        .status-completed {
          background-color: #d1ecf1;
          color: #0c5460;
          border: 1px solid #bee5eb;
        }
        
        .status-pending {
          background-color: #fff3cd;
          color: #856404;
          border: 1px solid #ffeaa7;
        }
        
        .payment-message {
          background-color: #f8d7da;
          color: #721c24;
          padding: 0.75rem;
          border-radius: 4px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
          border: 1px solid #f5c6cb;
        }
        
        .order-total {
          font-weight: 700;
          color: #8B4513;
          font-size: 1.125rem;
          text-align: right;
          min-width: fit-content;
          font-family: 'Playfair Display', serif;
        }
        
        .order-items {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #c4ad8f;
        }
        
        .order-item-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }
        
        .order-item-name {
          color: #3c2a1e;
        }
        
        .order-item-quantity {
          color: #8B4513;
          font-weight: 600;
        }
        
        .loading-spinner {
          display: flex;
          justify-content: center;
          padding: 2rem;
        }
        
        .spinner {
          width: 2rem;
          height: 2rem;
          border: 3px solid rgba(139, 69, 19, 0.3);
          border-radius: 50%;
          border-top-color: #8B4513;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="history-modal" onClick={onClose}>
        <div className="history-container" onClick={(e) => e.stopPropagation()}>
          <div className="history-header">
            <h3 className="history-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v18h18"/>
                <path d="M7 16l5-5 5 5"/>
                <path d="M12 7v8"/>
              </svg>
              Order History
            </h3>
            <button className="history-close" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div className="history-content">
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            ) : orderHistory.length === 0 ? (
              <div className="empty-history">
                <svg className="empty-history-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 3v18h18"/>
                  <path d="M7 16l5-5 5 5"/>
                  <path d="M12 7v8"/>
                </svg>
                <p className="empty-history-text">No order history found</p>
              </div>
            ) : (
              <div className="order-list">
                {orderHistory.map(order => (
                  <div key={order.id} className="order-item">
                    <div className="order-header">
                      <div className="order-info">
                        <div className="order-table">Table {order.tableno}</div>
                        <div className="order-date">
                          {new Date(order.created_at).toLocaleDateString()} at{' '}
                          {new Date(order.created_at).toLocaleTimeString()}
                        </div>
                        <div className="order-status">
                          <span className={`status-badge ${order.payment_done ? 'status-paid' : 'status-unpaid'}`}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              {order.payment_done ? (
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                              ) : (
                                <circle cx="12" cy="12" r="10"/>
                              )}
                              {order.payment_done && <polyline points="22 4 12 14.01 9 11.01"/>}
                            </svg>
                            {order.payment_done ? 'Paid' : 'Unpaid'}
                          </span>
                          
                          {!order.payment_done ? (
                            <div className="payment-message">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                              </svg>
                              Do payment first at counter
                            </div>
                          ) : (
                            <span className={`status-badge ${order.order_done ? 'status-completed' : 'status-pending'}`}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                {order.order_done ? (
                                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                ) : (
                                  <circle cx="12" cy="12" r="10"/>
                                )}
                                {order.order_done && <polyline points="22 4 12 14.01 9 11.01"/>}
                              </svg>
                              {order.order_done ? 'Completed' : 'Preparing'}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="order-total">
                        ₹{JSON.parse(order.iteminfo).reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                      </span>
                    </div>
                    
                    <div className="order-items">
                      {JSON.parse(order.iteminfo).map(item => (
                        <div key={item.id} className="order-item-row">
                          <span className="order-item-name">{item.name}</span>
                          <span className="order-item-quantity">
                            {item.quantity} × ₹{item.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default History;