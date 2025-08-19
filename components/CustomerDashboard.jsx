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
        <div className="dashboard-container loading-state">
          <div className="loading-overlay">
            <div className="loading-content">
              <div className="wooden-logo">
                <div className="cutlery-icon">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#8B4513" strokeWidth="1.5">
                    <path d="M5 21v-16h2v8h2V5h2v8h2V3h2v10a5 5 0 0 1-5 5v3H5z"/>
                    <path d="M15 21v-6a3 3 0 0 1 3-3h1v12h-4z" fill="#8B4513" opacity="0.7"/>
                  </svg>
                </div>
                <div className="wood-texture">
                  <div className="wood-grain"></div>
                  <div className="wood-grain"></div>
                  <div className="wood-grain"></div>
                </div>
              </div>
              <h2 className="loading-title">Anna's Café</h2>
              <p className="loading-subtitle">Crafting your dining experience</p>
              <div className="wooden-spinner">
                <div className="spinner-plank"></div>
                <div className="spinner-plank"></div>
                <div className="spinner-plank"></div>
              </div>
            </div>
          </div>
          
          <style jsx>{`
            .loading-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #f5f1e6;
              z-index: 1000;
            }
            
            .loading-content {
              text-align: center;
              color: #3c2a1e;
              padding: 3rem;
              background: #e8dfce;
              border-radius: 8px;
              border: 1px solid #c4ad8f;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
              max-width: 500px;
              width: 90%;
            }
            
            .wooden-logo {
              position: relative;
              margin: 0 auto 2rem;
              width: 120px;
              height: 120px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            
            .cutlery-icon {
              z-index: 2;
              position: relative;
            }
            
            .wood-texture {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(to bottom, #8B4513 0%, #6b3107 100%);
              border-radius: 50%;
              overflow: hidden;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
              border: 3px solid #c4ad8f;
            }
            
            .wood-grain {
              position: absolute;
              height: 2px;
              background: rgba(193, 154, 107, 0.6);
              transform-origin: center;
              animation: woodGrain 3s infinite;
            }
            
            .wood-grain:nth-child(1) {
              top: 30%;
              left: 10%;
              right: 10%;
              animation-delay: 0s;
            }
            
            .wood-grain:nth-child(2) {
              top: 50%;
              left: 15%;
              right: 15%;
              animation-delay: 0.5s;
            }
            
            .wood-grain:nth-child(3) {
              top: 70%;
              left: 5%;
              right: 5%;
              animation-delay: 1s;
            }
            
            .loading-title {
              font-size: 2.5rem;
              font-weight: 700;
              margin-bottom: 0.5rem;
              color: #5d4037;
              font-family: 'Playfair Display', serif;
            }
            
            .loading-subtitle {
              font-size: 1.1rem;
              color: #7d5d3b;
              margin-bottom: 2rem;
              font-style: italic;
            }
            
            .wooden-spinner {
              display: flex;
              justify-content: center;
              gap: 0.5rem;
              height: 12px;
            }
            
            .spinner-plank {
              width: 12px;
              height: 100%;
              background: linear-gradient(to bottom, #8B4513 0%, #6b3107 100%);
              border-radius: 2px;
              position: relative;
              overflow: hidden;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
              animation: plankBounce 1.4s ease-in-out infinite both;
            }
            
            .spinner-plank:nth-child(1) { 
              animation-delay: -0.32s; 
            }
            
            .spinner-plank:nth-child(2) { 
              animation-delay: -0.16s; 
            }
            
            .spinner-plank:nth-child(3) { 
              animation-delay: 0s; 
            }
            
            .spinner-plank::before {
              content: '';
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
              animation: woodShine 2s infinite;
            }
            
            @keyframes woodGrain {
              0%, 100% { opacity: 0.6; transform: translateX(0) scaleY(1); }
              50% { opacity: 0.8; transform: translateX(5px) scaleY(1.2); }
            }
            
            @keyframes plankBounce {
              0%, 80%, 100% { 
                transform: scaleY(0.3);
                opacity: 0.5;
              } 
              40% { 
                transform: scaleY(1);
                opacity: 1;
              }
            }
            
            @keyframes woodShine {
              0% { left: -100%; }
              100% { left: 100%; }
            }
          `}</style>
        </div>
      );
    }

  if (error) {
    return (
      <div className="dashboard-container error-state">
        <div className="error-overlay">
          <div className="error-content">
            <div className="error-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <h3>Service Temporarily Unavailable</h3>
            <p>We're experiencing technical difficulties. Please try again in a moment.</p>
            <button 
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                <path d="M21 3v5h-5"/>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                <path d="M3 21v-5h5"/>
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        * {
          box-sizing: border-box;
        }
        
        .dashboard-container {
          min-height: 100vh;
          background: #f5f1e6 url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23855e42' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
          font-family: 'Crimson Text', 'Times New Roman', serif;
          position: relative;
          color: #3c2a1e;
        }
        
        .loading-state, .error-state {
          background: #f5f1e6;
        }
        
        .loading-overlay, .error-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(5px);
          z-index: 1000;
          background: rgba(245, 241, 230, 0.95);
        }
        
        .loading-content, .error-content {
          text-align: center;
          color: #3c2a1e;
          padding: 3rem;
          background: #e8dfce;
          border-radius: 8px;
          border: 1px solid #c4ad8f;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          width: 90%;
        }
        
        .loading-logo {
          margin-bottom: 2rem;
        }
        
        .logo-circle {
          width: 100px;
          height: 100px;
          background: #8B4513;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          color: #f5f1e6;
          animation: logoFloat 3s ease-in-out infinite;
          border: 3px solid #c4ad8f;
        }
        
        .loading-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #5d4037;
          font-family: 'Playfair Display', serif;
        }
        
        .loading-subtitle {
          font-size: 1.1rem;
          color: #7d5d3b;
          margin-bottom: 2rem;
        }
        
        .loading-spinner {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .spinner-ring {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #8B4513;
          animation: bounce 1.4s ease-in-out infinite both;
        }
        
        .spinner-ring:nth-child(1) { animation-delay: -0.32s; }
        .spinner-ring:nth-child(2) { animation-delay: -0.16s; }
        .spinner-ring:nth-child(3) { animation-delay: 0s; }
        
        .error-icon {
          color: #8B4513;
          margin-bottom: 1.5rem;
        }
        
        .error-content h3 {
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #5d4037;
          font-family: 'Playfair Display', serif;
        }
        
        .error-content p {
          color: #7d5d3b;
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }
        
        .retry-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #8B4513;
          color: #f5f1e6;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Crimson Text', serif;
          border: 1px solid #6b3107;
        }
        
        .retry-button:hover {
          background: #6b3107;
          transform: translateY(-2px);
        }
        
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          background: rgba(139, 69, 19, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #6b3107;
          padding: 1rem 2rem;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 2rem;
        }
        
        .header-left {
          display: flex;
          flex-direction: column;
        }
        
        .title {
          font-size: 2rem;
          font-weight: 700;
          color: #f5f1e6;
          margin-bottom: 0.25rem;
          font-family: 'Playfair Display', serif;
          letter-spacing: 1px;
        }
        
        .subtitle {
          color: #e8dfce;
          font-size: 0.95rem;
          font-weight: 500;
          font-style: italic;
        }
        
        .search-container {
          position: relative;
          max-width: 400px;
          width: 100%;
        }
        .search-cart-wrapper {
          display: flex;
          align-items: center;
          gap: 1rem; /* space between search and cart */
          justify-content: flex-end;
          flex: 1;
}
        .search-bar {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 3rem;
          border-radius: 4px;
          border: 1px solid #c4ad8f;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: rgba(245, 241, 230, 0.9);
          color: #3c2a1e;
          font-family: 'Crimson Text', serif;
        }
        
        .search-bar:focus {
          outline: none;
          border-color: #8B4513;
          box-shadow: 0 0 0 2px rgba(139, 69, 19, 0.2);
          background: #f5f1e6;
        }
        
        .search-bar::placeholder {
          color: #8a735a;
        }
        
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #8a735a;
          pointer-events: none;
        }
        
        .cart-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background: #f5f1e6;
          color: #3c2a1e;
          border-radius: 4px;
          font-weight: 600;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Crimson Text', serif;
          border: 1px solid #c4ad8f;
        }
        
        .cart-button:hover {
          background: #e8dfce;
          transform: translateY(-2px);
        }
        
        .cart-badge {
          position: absolute;
          top: -0.5rem;
          right: -0.5rem;
          background: #8B4513;
          color: #f5f1e6;
          border-radius: 50%;
          width: 1.5rem;
          height: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          border: 2px solid #f5f1e6;
        }
        
        .main-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          margin-top: 100px;
          position: relative;
          z-index: 2;
        }
        
        .category-filter {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 2rem;
          padding: 1.25rem;
          background: #e8dfce;
          border-radius: 8px;
          border: 1px solid #c4ad8f;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .category-button {
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          font-size: 0.95rem;
          font-weight: 600;
          transition: all 0.3s ease;
          border: 1px solid #c4ad8f;
          background: #f5f1e6;
          color: #5d4037;
          cursor: pointer;
          font-family: 'Crimson Text', serif;
        }
        
        .category-button:hover {
          background: #d6c9b1;
          border-color: #8a735a;
        }
        
        .category-button.active {
          background: #8B4513;
          color: #f5f1e6;
          border-color: #6b3107;
        }
        
        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }
        
        .menu-item {
          background: #f5f1e6;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid #c4ad8f;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
          position: relative;
        }
        
        .menu-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: #8B4513;
        }
        
        .menu-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
        }
        
        .menu-item-content {
          padding: 1.75rem;
          position: relative;
        }
        
        .menu-item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          gap: 1rem;
        }
        
        .menu-item-info {
          flex: 1;
        }
        
        .menu-item-name {
          font-size: 1.4rem;
          font-weight: 700;
          color: #3c2a1e;
          margin-bottom: 0.5rem;
          line-height: 1.3;
          font-family: 'Playfair Display', serif;
        }
        
        .menu-item-category {
          display: inline-block;
          background: #8B4513;
          color: #f5f1e6;
          font-size: 0.8rem;
          padding: 0.375rem 0.875rem;
          border-radius: 4px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .menu-item-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #8B4513;
          padding: 0.5rem 0;
          display: flex;
          align-items: center;
          white-space: nowrap;
          font-family: 'Playfair Display', serif;
        }
        
        .menu-item-description {
          color: #5d4037;
          font-size: 1rem;
          margin: 1.5rem 0;
          line-height: 1.6;
          font-weight: 400;
        }
        
        .add-to-cart-button {
          width: 100%;
          padding: 1rem;
          background: #8B4513;
          color: #f5f1e6;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-family: 'Crimson Text', serif;
          border: 1px solid #6b3107;
        }
        
        .add-to-cart-button:hover {
          background: #6b3107;
          transform: translateY(-2px);
        }
        
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 2rem;
          background: #e8dfce;
          border-radius: 8px;
          border: 2px dashed #c4ad8f;
        }
        .price-button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #d6c9b1;
}

/* Remove the price from the header since we're showing it in the container */
.menu-item-header .menu-item-price {
  display: none;
}

/* Adjust the button width to be smaller */
.price-button-container .add-to-cart-button {
  width: auto;
  padding: 0.75rem 1.25rem;
}

/* Make the price in the container more prominent */
.price-button-container .menu-item-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #8B4513;
  font-family: 'Playfair Display', serif;
}
        .empty-state-icon {
          width: 5rem;
          height: 5rem;
          margin-bottom: 1.5rem;
          color: #8a735a;
          margin: 0 auto 1.5rem auto;
        }
        
        .empty-state h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #5d4037;
          margin-bottom: 0.5rem;
          font-family: 'Playfair Display', serif;
        }
        
        .empty-state p {
          color: #7d5d3b;
          font-size: 1rem;
        }
        
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0);
            opacity: 0.5;
          } 
          40% { 
            transform: scale(1);
            opacity: 1;
          }
        }
        
        /* Responsive Design */
        @media (max-width: 1024px) {
          .header-content {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            text-align: center;
          }
          
          .main-content {
            margin-top: 160px;
          }
          
          .menu-grid {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          }
        }
        
        @media (max-width: 768px) {
          .header {
            padding: 1rem;
          }
          
          .main-content {
            padding: 1rem;
            margin-top: 180px;
          }
          
          .title {
            font-size: 1.75rem;
          }
          
          .category-filter {
            gap: 0.75rem;
            padding: 1rem;
          }
          
          .category-button {
            font-size: 0.9rem;
            padding: 0.625rem 1.25rem;
          }
          
          .menu-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
        
        @media (max-width: 480px) {
          .menu-item-content {
            padding: 1.5rem;
          }
          
          .menu-item-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          
          .menu-item-price {
            align-self: flex-end;
          }
        }
      `}</style>

      <div className="dashboard-container">
        <header className="header">
          <div className="header-content">
            <div className="header-left">
              <h1 className="title">Anna's Café</h1>
              <p className="subtitle">Exceptional cuisine, unforgettable moments</p>
            </div>
            
            <div className="search-cart-wrapper">
  <div className="search-container">
    <div className="search-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
    </div>
    <input
      type="text"
      className="search-bar"
      placeholder="Search"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>

  <button 
    className="cart-button"
    onClick={() => setIsCartOpen(true)}
  >
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
    Your Order
    {cart.length > 0 && (
      <span className="cart-badge">
        {cart.reduce((sum, item) => sum + item.quantity, 0)}
      </span>
    )}
  </button>
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
    <div className="menu-item-info">
      <h3 className="menu-item-name">{item.name}</h3>
      <span className="menu-item-category">{item.category}</span>
    </div>
    <span className="menu-item-price">₹{item.price}</span>
  </div>
  <p className="menu-item-description">{item.description}</p>
  
  {/* Add this container to put price and button on same line */}
  <div className="price-button-container">
    <span className="menu-item-price">₹{item.price}</span>
    <button
      className="add-to-cart-button"
      onClick={() => addToCart(item)}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
      Add to Order
    </button>
  </div>
</div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
                  <line x1="9" y1="9" x2="9.01" y2="9"/>
                  <line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
                <h3>No dishes found</h3>
                <p>Try adjusting your search or browse different categories</p>
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