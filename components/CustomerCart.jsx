"use client"

import { supabase } from '@/lib/supabase';
import React, { useState } from 'react';

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
          tableno: tableNo,
          status: 'pending'
        });
      
      if (error) throw error;
      
      onClearCart();
      setShowConfirmation(false);
      setShowReceipt(true);
    } catch (err) {
      console.error('Error placing order:', err);
    } finally {
      setIsSubmitting(false);
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
          max-width: 32rem;
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
          gap: 1.25rem;
        }
        
        .cart-item {
          display: flex;
          justify-content: space-between;
          padding: 1rem;
          border-radius: 0.75rem;
          transition: all 0.2s;
          border: 1px solid #f1f5f9;
        }
        
        .cart-item:hover {
          border-color: #e0e7ff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        
        .item-info {
          flex: 1;
        }
        
        .item-name {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
          font-size: 1rem;
        }
        
        .item-price {
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .item-controls {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        
        .quantity-controls {
          display: flex;
          align-items: center;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          overflow: hidden;
        }
        
        .quantity-button {
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8fafc;
          color: #4f46e5;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }
        
        .quantity-button:hover {
          background-color: #e0e7ff;
        }
        
        .quantity-button:active {
          background-color: #c7d2fe;
        }
        
        .quantity-display {
          width: 2rem;
          text-align: center;
          font-weight: 600;
          color: #1e293b;
        }
        
        .item-total {
          width: 5rem;
          text-align: right;
          font-weight: 700;
          color: #4f46e5;
        }
        
        .remove-button {
          color: #ef4444;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.375rem;
          transition: all 0.2s;
        }
        
        .remove-button:hover {
          background-color: #fee2e2;
        }
        
        .checkout-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
        }
        
        .total-amount {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
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
          gap: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
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
          background-color: none;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1001;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.3s ease-out;
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

        .table-input-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1.5rem;
        }

        .table-input-field {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          font-size: 1rem;
          margin-bottom: 1rem;
          transition: all 0.2s;
          background-color:white;
          color: #1e293b;
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
                      <div className="item-info">
                        <h4 className="item-name">{item.name}</h4>
                        <p className="item-price">₹{item.price} each</p>
                      </div>
                      <div className="item-controls">
                        <div className="quantity-controls">
                          <button
                            className="quantity-button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          >
                            -
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
              type="text"
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginLeft: '0.5rem'}}>
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