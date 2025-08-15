"use client"

import React, { useEffect, useState } from 'react';
import CustomerCart from './CustomerCart';
import { supabase } from '@/lib/supabase';

const CustomerDashboard = () => {
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const { data, error: supabaseError } = await supabase
          .from('menu')
          .select('*')
          .order('id', { ascending: true });

        if (supabaseError) {
          throw supabaseError;
        }

        setMenu(data || []);
      } catch (err) {
        console.error('Error fetching menu:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenu();
  }, []);

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      setCart(prevCart => prevCart.filter(item => item.id !== itemId));
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const categories = ['All', ...new Set(menu.map(item => item.category))];
  const filteredItems = activeCategory === 'All' 
    ? menu 
    : menu.filter(item => item.category === activeCategory);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">Loading menu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">Error loading menu: {error}</div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background-color: #f8fafc;
        }
        
        .header {
          background-color: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
        }
        
        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .title {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1e293b;
        }
        
        .subtitle {
          color: #64748b;
          font-size: 0.875rem;
        }
        
        .cart-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 1rem;
          background-color: #4f46e5;
          color: white;
          border-radius: 0.375rem;
          font-weight: 500;
          font-size: 0.875rem;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .cart-button:hover {
          background-color: #4338ca;
        }
        
        .cart-badge {
          position: absolute;
          top: -0.5rem;
          right: -0.5rem;
          background-color: #ef4444;
          color: white;
          border-radius: 9999px;
          width: 1.25rem;
          height: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
        }
        
        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }
        
        .category-filter {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }
        
        .category-button {
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s;
          border: 1px solid #e2e8f0;
          background-color: white;
          color: #334155;
          cursor: pointer;
        }
        
        .category-button:hover {
          background-color: #f1f5f9;
        }
        
        .category-button.active {
          background-color: #4f46e5;
          color: white;
          border-color: #4f46e5;
        }
        
        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .menu-item {
          background-color: white;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .menu-item:hover {
          transform: translateY(-0.25rem);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .menu-item-content {
          padding: 1.5rem;
        }
        
        .menu-item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }
        
        .menu-item-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
        }
        
        .menu-item-category {
          color: #64748b;
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }
        
        .menu-item-price {
          font-size: 1.125rem;
          font-weight: 700;
          color: #4f46e5;
        }
        
        .menu-item-description {
          color: #64748b;
          font-size: 0.875rem;
          margin: 1rem 0;
        }
        
        .add-to-cart-button {
          width: 100%;
          padding: 0.5rem;
          background-color: #4f46e5;
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .add-to-cart-button:hover {
          background-color: #4338ca;
        }

        .loading-spinner, .error-message {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-size: 1.2rem;
        }
        
        .error-message {
          color: #ef4444;
        }
      `}</style>

      <div className="dashboard-container">
        <header className="header">
          <div className="header-content">
            <div>
              <h1 className="title">Gourmet House</h1>
              <p className="subtitle">Premium dining experience</p>
            </div>
            <button 
              className="cart-button"
              onClick={() => setIsCartOpen(true)}
            >
              Cart
              {cart.length > 0 && (
                <span className="cart-badge">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </header>

        <main className="main-content">
          <div className="category-filter">
            {categories.map(category => (
              <button
                key={category}
                className={`category-button ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="menu-grid">
            {filteredItems.map(item => (
              <div key={item.id} className="menu-item">
                <div className="menu-item-content">
                  <div className="menu-item-header">
                    <div>
                      <h3 className="menu-item-name">{item.name}</h3>
                      <p className="menu-item-category">{item.category}</p>
                    </div>
                    <span className="menu-item-price">₹{item.price}</span>
                  </div>
                  <p className="menu-item-description">{item.description}</p>
                  <button
                    className="add-to-cart-button"
                    onClick={() => addToCart(item)}
                  >
                    Add to Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        <CustomerCart 
          cartItems={cart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      </div>
    </>
  );
};

export default CustomerDashboard;