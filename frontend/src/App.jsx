import React from 'react';
import WalletConnect from './components/WalletConnect';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <nav className="glass-card navbar">
        <h1 className="logo">🥖 Le Baguette</h1>
        <div className="nav-actions">
          <WalletConnect />
        </div>
      </nav>

      <main className="hero">
        <div className="hero-content">
          <h2 className="title-gradient">Freshly Baked Stacks</h2>
          <p className="subtitle">The tastiest DeFi protocol securely built on Bitcoin.</p>
          <div className="cta-group">
            <button className="secondary-btn">Explore Menu</button>
            <button className="primary-btn">Start Baking</button>
          </div>
        </div>

        <div className="glass-card feature-card">
          <h3>Stats</h3>
          <p>TVL: $1,000,000</p>
        </div>
      </main>
    </div>
  );
}

export default App;
