"use client"

import { supabase } from '@/lib/supabase';
import React, { useState } from 'react';
import analysis from './analysis/analysis';
const CartModal = ({ cartItems, onUpdateQuantity, onRemoveItem, isOpen, onClose, onClearCart }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showTableInput, setShowTableInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableNo, setTableNo] = useState('');
  const [tableError, setTableError] = useState('');

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;
    setShowTableInput(true);
  };

  const handleTableSubmit = () => {
    if (!tableNo || tableNo.trim() === '') {
      setTableError('Please enter a table number');
      return;
    }
    setTableError('');
    setShowTableInput(false);
    setShowConfirmation(true);
  };

  const handleConfirmOrder = async() => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({ 
          iteminfo: JSON.stringify(cartItems),
          tableno: tableNo
        });
      
      if (error) throw error;
      
      onClearCart();
      setShowConfirmation(false);
      setShowReceipt(true);
    } catch (err) {
      console.error('Error placing order:', err);
    } finally {
      setIsSubmitting(false);
      analysis(totalPrice);
    }
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setTableNo('');
    onClose();
  };

  const handleModalClose = () => {
    setShowConfirmation(false);
    setShowReceipt(false);
    setShowTableInput(false);
    setTableNo('');
    setTableError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.3s ease-out;
          padding: 1rem;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .modal-container {
          background-color: white;
          border-radius: 1rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          width: 100%;
          max-width: 36rem;
          max-height: 90vh;
          overflow: hidden;
          animation: slideUp 0.3s ease-out;
          border: 1px solid #e2e8f0;
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
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #f1f5f9;
          background-color: #f8fafc;
        }
        
        .modal-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        @media (max-width: 640px) {
          .modal-title {
            font-size: 1.125rem;
          }
        }
        
        .close-button {
          color: #64748b;
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
        
        .close-button:hover {
          background-color: #f1f5f9;
          color: #4f46e5;
        }
        
        .modal-content {
          padding: 1.5rem;
          max-height: 60vh;
          overflow-y: auto;
        }
        
        @media (max-width: 640px) {
          .modal-content {
            padding: 1rem;
          }
        }
        
        .empty-cart {
          text-align: center;
          padding: 3rem 0;
        }
        
        .empty-cart-icon {
          width: 4rem;
          height: 4rem;
          margin: 0 auto 1.5rem;
          color: #cbd5e1;
        }
        
        .empty-cart-text {
          color: #64748b;
          font-size: 1rem;
          font-weight: 500;
        }
        
        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .cart-item {
          padding: 1.25rem;
          border-radius: 0.75rem;
          transition: all 0.2s;
          border: 1px solid #f1f5f9;
          background-color: #fafbfc;
        }
        
        .cart-item:hover {
          border-color: #e0e7ff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          gap: 1rem;
        }
        
        .item-info {
          flex: 1;
          min-width: 0;
        }
        
        .item-name {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
          font-size: 1rem;
          word-break: break-word;
        }
        
        .item-price {
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .remove-button {
          color: #ef4444;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.375rem;
          transition: all 0.2s;
          flex-shrink: 0;
          margin-left: 0.5rem;
        }
        
        .remove-button:hover {
          background-color: #fee2e2;
        }
        
        .item-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        
        @media (max-width: 640px) {
          .item-controls {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }
        }
        
        .quantity-controls {
          display: flex;
          align-items: center;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          overflow: hidden;
          background-color: white;
        }
        
        .quantity-button {
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8fafc;
          color: #4f46e5;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
          font-size: 1.125rem;
        }
        
        .quantity-button:hover {
          background-color: #e0e7ff;
        }
        
        .quantity-button:active {
          background-color: #c7d2fe;
        }
        
        .quantity-display {
          width: 3rem;
          text-align: center;
          font-weight: 600;
          color: #1e293b;
          background-color: white;
          padding: 0.625rem 0;
        }
        
        .item-total {
          font-weight: 700;
          color: #4f46e5;
          font-size: 1.125rem;
          text-align: right;
          min-width: fit-content;
        }
        
        @media (max-width: 640px) {
          .item-total {
            text-align: center;
            padding: 0.5rem;
            background-color: #f0f9ff;
            border-radius: 0.5rem;
            border: 1px solid #e0f2fe;
          }
        }
        
        .checkout-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
          gap: 1rem;
        }
        
        @media (max-width: 640px) {
          .checkout-section {
            flex-direction: column;
            align-items: stretch;
            gap: 1.5rem;
          }
        }
        
        .total-amount {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
        }
        
        @media (max-width: 640px) {
          .total-amount {
            text-align: center;
            font-size: 1.375rem;
            padding: 0.75rem;
            background-color: #f8fafc;
            border-radius: 0.75rem;
            border: 1px solid #e2e8f0;
          }
        }
        
        .checkout-button {
          padding: 0.75rem 1.5rem;
          background-color: #4f46e5;
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
          min-width: fit-content;
        }
        
        @media (max-width: 640px) {
          .checkout-button {
            padding: 1rem 1.5rem;
            font-size: 1rem;
          }
        }
        
        .checkout-button:hover {
          background-color: #4338ca;
          transform: translateY(-1px);
          box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
        }
        
        .checkout-button:active {
          transform: translateY(0);
        }
        
        .checkout-button:disabled {
          background-color: #cbd5e1;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        /* Confirmation Modal Styles */
        .confirmation-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1001;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.3s ease-out;
          padding: 1rem;
        }

        .confirmation-container {
          background-color: white;
          border-radius: 1rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 28rem;
          padding: 2rem;
          text-align: center;
          animation: slideUp 0.3s ease-out;
          border: 1px solid #e2e8f0;
        }
        
        @media (max-width: 640px) {
          .confirmation-container {
            padding: 1.5rem;
          }
        }

        .confirmation-icon {
          width: 4rem;
          height: 4rem;
          margin: 0 auto 1.5rem;
          color: #f59e0b;
        }

        .confirmation-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
        }
        
        @media (max-width: 640px) {
          .confirmation-title {
            font-size: 1.25rem;
          }
        }

        .confirmation-text {
          color: #64748b;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .confirmation-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
        
        @media (max-width: 640px) {
          .confirmation-buttons {
            flex-direction: column;
          }
        }

        .confirm-button {
          padding: 0.75rem 1.5rem;
          background-color: #10b981;
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);
        }

        .confirm-button:hover {
          background-color: #059669;
          transform: translateY(-1px);
          box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
        }

        .confirm-button:active {
          transform: translateY(0);
        }

        .confirm-button:disabled {
          background-color: #a7f3d0;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .cancel-button {
          padding: 0.75rem 1.5rem;
          background-color: white;
          color: #64748b;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-button:hover {
          background-color: #f1f5f9;
          border-color: #cbd5e1;
        }

        /* Receipt Modal Styles */
        .receipt-container {
          background-color: white;
          border-radius: 1rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 28rem;
          padding: 2rem;
          text-align: center;
          animation: slideUp 0.3s ease-out;
          border: 1px solid #e2e8f0;
        }
        
        @media (max-width: 640px) {
          .receipt-container {
            padding: 1.5rem;
          }
        }

        .receipt-icon {
          width: 4rem;
          height: 4rem;
          margin: 0 auto 1.5rem;
          color: #10b981;
        }

        .receipt-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #10b981;
          margin-bottom: 1rem;
        }
        
        @media (max-width: 640px) {
          .receipt-title {
            font-size: 1.25rem;
          }
        }

        .receipt-text {
          color: #64748b;
          margin-bottom: 1rem;
          line-height: 1.6;
        }

        .receipt-highlight {
          color: #1e293b;
          font-weight: 600;
          background-color: #f0fdf4;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          display: inline-block;
          margin: 0.5rem 0;
        }

        .receipt-button {
          padding: 0.75rem 1.5rem;
          background-color: #4f46e5;
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .receipt-button:hover {
          background-color: #4338ca;
          transform: translateY(-1px);
          box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
        }

        .receipt-button:active {
          transform: translateY(0);
        }

        /* Table Input Modal Styles */
        .table-input-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1001;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.3s ease-out;
          padding: 1rem;
        }

        .table-input-container {
          background-color: white;
          border-radius: 1rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 28rem;
          padding: 2rem;
          text-align: center;
          animation: slideUp 0.3s ease-out;
          border: 1px solid #e2e8f0;
        }
        
        @media (max-width: 640px) {
          .table-input-container {
            padding: 1.5rem;
          }
        }

        .table-input-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1.5rem;
        }
        
        @media (max-width: 640px) {
          .table-input-title {
            font-size: 1.25rem;
          }
        }

        .table-input-field {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          font-size: 1rem;
          margin-bottom: 1rem;
          transition: all 0.2s;
          background-color: white;
          color: #1e293b;
          box-sizing: border-box;
        }

        .table-input-field:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .table-input-error {
          color: #ef4444;
          font-size: 0.875rem;
          margin-bottom: 1rem;
          min-height: 1.25rem;
        }

        .table-input-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
        
        @media (max-width: 640px) {
          .table-input-buttons {
            flex-direction: column;
          }
        }

        .table-input-submit {
          padding: 0.75rem 1.5rem;
          background-color: #4f46e5;
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .table-input-submit:hover {
          background-color: #4338ca;
        }

        .table-input-cancel {
          padding: 0.75rem 1.5rem;
          background-color: white;
          color: #64748b;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .table-input-cancel:hover {
          background-color: #f1f5f9;
        }

        .spinner {
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="modal-overlay" onClick={handleModalClose}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              Your Order ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </h3>
            <button className="close-button" onClick={handleModalClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="modal-content">
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <svg className="empty-cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <p className="empty-cart-text">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="item-header">
                        <div className="item-info">
                          <h4 className="item-name">{item.name}</h4>
                          <p className="item-price">₹{item.price} each</p>
                        </div>
                        <button
                          className="remove-button"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                      
                      <div className="item-controls">
                        <div className="quantity-controls">
                          <button
                            className="quantity-button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          >
                            −
                          </button>
                          <span className="quantity-display">{item.quantity}</span>
                          <button
                            className="quantity-button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <span className="item-total">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="checkout-section">
                  <span className="total-amount">Total: ₹{totalPrice}</span>
                  <button
                    className="checkout-button"
                    onClick={handlePlaceOrder}
                    disabled={cartItems.length === 0}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14"></path>
                      <path d="M12 5l7 7-7 7"></path>
                    </svg>
                    Place Order
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Table Input Modal */}
      {showTableInput && (
        <div className="table-input-modal">
          <div className="table-input-container" onClick={(e) => e.stopPropagation()}>
            <h3 className="table-input-title">Enter Your Table Number</h3>
            <input
              type="number"
              className="table-input-field"
              placeholder="Table number"
              value={tableNo}
              onChange={(e) => setTableNo(e.target.value)}
              autoFocus
            />
            <div className="table-input-error">{tableError}</div>
            <div className="table-input-buttons">
              <button 
                className="table-input-submit"
                onClick={handleTableSubmit}
              >
                Continue
              </button>
              <button 
                className="table-input-cancel"
                onClick={() => {
                  setShowTableInput(false);
                  setTableNo('');
                  setTableError('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="confirmation-container" onClick={(e) => e.stopPropagation()}>
            <svg className="confirmation-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 12l3 3 5-5"></path>
            </svg>
            <h3 className="confirmation-title">Confirm Your Order</h3>
            <p className="confirmation-text">
              You're about to place an order for <strong>₹{totalPrice}</strong> with <strong>{totalItems} items</strong> to table <strong>{tableNo}</strong>.
            </p>
            <div className="confirmation-buttons">
              <button 
                className="confirm-button" 
                onClick={handleConfirmOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    Processing...
                  </>
                ) : 'Confirm Order'}
              </button>
              <button 
                className="cancel-button" 
                onClick={() => setShowConfirmation(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="confirmation-modal">
          <div className="receipt-container" onClick={(e) => e.stopPropagation()}>
            <svg className="receipt-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h3 className="receipt-title">Order Successful!</h3>
            <p className="receipt-text">
              Your order has been placed successfully for table <strong>{tableNo}</strong>. Please proceed to the counter for payment.
            </p>
         
            <button className="receipt-button" onClick={handleCloseReceipt}>
              Got it!
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CartModal;