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
  const [searchQuery, setSearchQuery] = useState('');

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

  const clearCart = () => {
    setCart([]);
  };

  const categories = ['All', ...new Set(menu.map(item => item.category))];
  
  const filteredItems = activeCategory === 'All' 
    ? menu 
    : menu.filter(item => item.category === activeCategory);

    const searchedItems = searchQuery 
    ? filteredItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(searchQuery.toLowerCase())
      ) 
    : filteredItems;

  if (loading) {
    return (
      <div className="dashboard-container" style={{ 
        background: 'white',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div className="loading-spinner" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div className="spinner" style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid linear-gradient(90deg, #4f46e5, #9333ea)',
            borderTopColor: '#4f46e5',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            background: 'conic-gradient(from 0deg, #4f46e5, #9333ea)',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 5px), #fff 0)',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 5px), #fff 0)'
          }}></div>
          <p style={{
            color: '#4f46e5',
            fontSize: '1.2rem',
            fontWeight: '500',
            background: 'linear-gradient(90deg, #4f46e5, #9333ea)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent'
          }}>Loading menu...</p>
          
          {/* Progress bar alternative */}
          <div style={{
            width: '200px',
            height: '6px',
            background: '#f3f3f3',
            borderRadius: '3px',
            overflow: 'hidden',
            marginTop: '10px'
          }}>
            <div style={{
              width: '60%',
              height: '100%',
              background: 'linear-gradient(90deg, #4f46e5, #9333ea)',
              animation: 'progress 2s ease-in-out infinite',
              borderRadius: '3px'
            }}></div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background-color: #f8fafc;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          position: relative;
        }
        
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          background-color: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
          z-index: 1000;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        
        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        .header-left {
          flex: 1;
          min-width: 250px;
        }
        
        .title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.25rem;
          background: linear-gradient(90deg, #4f46e5, #9333ea);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .subtitle {
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .search-container {
          flex: 1;
          min-width: 250px;
          max-width: 400px;
        }
        
        .search-bar {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          font-size: 0.9375rem;
          transition: all 0.3s ease;
          background-color: white;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          color: #475569;
        }
        
        .search-bar:focus {
          outline: none;
          border-color: #a5b4fc;
          box-shadow: 0 0 0 3px rgba(199, 210, 254, 0.5);
        }
        
        .search-bar::placeholder {
          color: #94a3b8;
        }
        
        .cart-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background-color: #4f46e5;
          color: white;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 0.9375rem;
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
          width:30%;
        }
        
        .cart-button:hover {
          background-color: #4338ca;
          transform: translateY(-1px);
          box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
        }
        
        .cart-button:active {
          transform: translateY(0);
        }
        
        .cart-badge {
          position: absolute;
          top: -0.5rem;
          right: -0.5rem;
          background-color: #ef4444;
          color: white;
          border-radius: 9999px;
          width: 1.5rem;
          height: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          animation: pulse 1.5s infinite;
        }
        
        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          margin-top: 120px; /* Add space for fixed header */
        }
        
        .category-filter {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          padding-top:30px;
        }
        
        .category-button {
          padding: 0.625rem 1.25rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
          background-color: white;
          color: #334155;
          cursor: pointer;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        
        .category-button:hover {
          background-color: #f1f5f9;
          transform: translateY(-1px);
        }
        
        .category-button.active {
          background-color: #4f46e5;
          color: white;
          border-color: #4f46e5;
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
        }
        
        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .menu-item {
          background-color: white;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
        }
        
        .menu-item:hover {
          transform: translateY(-0.5rem);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border-color: #c7d2fe;
        }
        
        .menu-item-content {
          padding: 1.75rem;
        }
        
        .menu-item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }
        
        .menu-item-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }
        
        .menu-item-category {
          display: inline-block;
          background-color: #e0e7ff;
          color: #4f46e5;
          font-size: 0.75rem;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-weight: 600;
          margin-top: 0.25rem;
        }
        
        .menu-item-price {
          font-size: 1.25rem;
          font-weight: 700;
          color: #4f46e5;
          background-color: #e0e7ff;
          padding: 0.25rem 0.75rem;
          border-radius: 0.375rem;
        }
        
        .menu-item-description {
          color: #64748b;
          font-size: 0.9375rem;
          margin: 1.25rem 0;
          line-height: 1.6;
        }
        
        .add-to-cart-button {
          width: 100%;
          padding: 0.75rem;
          background-color: #4f46e5;
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 0.9375rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .add-to-cart-button:hover {
          background-color: #4338ca;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
        }
        
        .add-to-cart-button:active {
          transform: translateY(0);
        }

        .loading-spinner {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          gap: 1.5rem;
        }
        
        .spinner {
          width: 3rem;
          height: 3rem;
          border: 4px solid #e0e7ff;
          border-top: 4px solid #4f46e5;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        .error-message {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          gap: 1rem;
          text-align: center;
          padding: 2rem;
        }
        
        .error-icon {
          width: 3rem;
          height: 3rem;
          color: #ef4444;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 0;
          color: #64748b;
        }
        
        .empty-state-icon {
          width: 5rem;
          height: 5rem;
          margin-bottom: 1.5rem;
          color: #cbd5e1;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .header {
            padding: 1rem;
          }
          
          .header-content {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
          
          .header-left {
            text-align: center;
            min-width: auto;
          }
          
          .search-container {
            min-width: auto;
            max-width: none;
          }
          
          .main-content {
            margin-top: 180px; /* Increase space for mobile */
            padding: 1rem;
          }
        }
      `}</style>

      <div className="dashboard-container">
        <header className="header">
          <div className="header-content">
            <div className="header-left">
              <h1 className="title">Annas Cafe</h1>
              <p className="subtitle">Brews, Bites & Bliss</p>
            </div>
            
           
            
            <button 
              className="cart-button"
              onClick={() => setIsCartOpen(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              Cart
              {cart.length > 0 && (
                <span className="cart-badge">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
            <div className="search-container">
              <input
                type="text"
                className="search-bar"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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
            {searchedItems.length > 0 ? (
              searchedItems.map(item => (
                <div key={item.id} className="menu-item">
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <div>
                        <h3 className="menu-item-name">{item.name}</h3>
                        <span className="menu-item-category">{item.category}</span>
                      </div>
                      <span className="menu-item-price">₹{item.price}</span>
                    </div>
                    <p className="menu-item-description">{item.description}</p>
                    <button
                      className="add-to-cart-button"
                      onClick={() => addToCart(item)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                      Add to Order
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <svg className="empty-state-icon" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12,3A9,9 0 0,0 3,12H0L4,16L8,12H5A7,7 0 0,1 12,5A7,7 0 0,1 19,12A7,7 0 0,1 12,19C10.5,19 9.09,18.5 7.94,17.7L6.5,19.14C8.04,20.3 9.94,21 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M14,12A2,2 0 0,0 12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12Z" />
                </svg>
                <h3>No items found</h3>
                <p>Try a different search or category</p>
              </div>
            )}
          </div>
        </main>

        <CustomerCart 
          cartItems={cart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      </div>
    </>
  );
};

export default CustomerDashboard;