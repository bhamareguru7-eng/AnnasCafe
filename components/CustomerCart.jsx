"use client"

import React, { useState } from 'react';

const CartModal = ({ cartItems, onUpdateQuantity, onRemoveItem, isOpen, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    alert(`Order placed successfully!\nPayment: ${paymentMethod}\nTotal: ₹${totalPrice}\n\nThank you for your order!`);
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
          z-index: 50;
        }
        
        .modal-container {
          background-color: white;
          border-radius: 0.5rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 32rem;
          max-height: 90vh;
          overflow: hidden;
          animation: modalFadeIn 0.3s ease-out;
        }
        
        @keyframes modalFadeIn {
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
          border-bottom: 1px solid #e2e8f0;
        }
        
        .modal-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
        }
        
        .close-button {
          color: #64748b;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.5rem;
          line-height: 1;
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
          font-size: 3rem;
          color: #cbd5e1;
          margin-bottom: 1rem;
        }
        
        .empty-cart-text {
          color: #64748b;
        }
        
        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .cart-item {
          display: flex;
          justify-content: space-between;
          padding: 1rem 0;
          border-bottom: 1px solid #f1f5f9;
        }
        
        .item-info {
          flex: 1;
        }
        
        .item-name {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }
        
        .item-price {
          color: #64748b;
          font-size: 0.875rem;
        }
        
        .item-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .quantity-controls {
          display: flex;
          align-items: center;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
        }
        
        .quantity-button {
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8fafc;
          color: #64748b;
          border: none;
          cursor: pointer;
        }
        
        .quantity-button:hover {
          background-color: #f1f5f9;
        }
        
        .quantity-display {
          width: 2rem;
          text-align: center;
          font-weight: 500;
        }
        
        .item-total {
          width: 4rem;
          text-align: right;
          font-weight: 600;
        }
        
        .remove-button {
          color: #ef4444;
          background: none;
          border: none;
          cursor: pointer;
        }
        
        .payment-section {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
        }
        
        .payment-title {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1rem;
        }
        
        .payment-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        
        .payment-option {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .payment-option:hover {
          border-color: #c7d2fe;
        }
        
        .payment-option.active {
          border-color: #4f46e5;
          background-color: #eef2ff;
        }
        
        .payment-icon {
          font-size: 1rem;
        }
        
        .checkout-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
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
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .checkout-button:hover {
          background-color: #4338ca;
        }
        
        .checkout-button:disabled {
          background-color: #cbd5e1;
          cursor: not-allowed;
        }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">Your Order ({totalItems} items)</h3>
            <button className="close-button" onClick={onClose}>×</button>
          </div>

          <div className="modal-content">
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon">🛒</div>
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
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="payment-section">
                  <h4 className="payment-title">Payment Method</h4>
                  <div className="payment-options">
                    <div
                      className={`payment-option ${paymentMethod === 'cash' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('cash')}
                    >
                      <span className="payment-icon">💵</span>
                      <span>Cash</span>
                    </div>
                    <div
                      className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <span className="payment-icon">💳</span>
                      <span>Card</span>
                    </div>
                  </div>

                  <div className="checkout-section">
                    <span className="total-amount">Total: ₹{totalPrice}</span>
                    <button
                      className="checkout-button"
                      onClick={handleCheckout}
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartModal;