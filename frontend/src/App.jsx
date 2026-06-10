import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard';
import Backtest from './Backtest';
import Onboarding from './Onboarding';
import AgentLog from './AgentLog';

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [signals, setSignals] = useState(null);
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      axios.get('/api/signals').then(r => setSignals(r.data)).catch(() => {});
      axios.get('/api/portfolio').then(r => setPortfolio(r.data)).catch(() => {});
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const pages = [
    { id: 'dashboard', label: 'Live' },
    { id: 'backtest',  label: 'Backtest' },
    { id: 'log',       label: 'Agent Log' },
    { id: 'setup',     label: 'Setup' },
  ];

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '0 20px',
      fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '16px 0',
        borderBottom: '1px solid #eee', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 22, color: '#0C1B33' }}>Aegis</span>
          <span style={{ fontWeight: 700, fontSize: 22, color: '#E24B4A' }}>AI</span>
          <span style={{ fontSize: 11, color: '#aaa', marginLeft: 4 }}>
            autonomous portfolio protection
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {pages.map(p => (
            <button key={p.id} onClick={() => setPage(p.id)} style={{
              padding: '6px 14px', border: '1px solid #ddd',
              borderRadius: 20, cursor: 'pointer', fontSize: 12,
              background: page === p.id ? '#0C1B33' : 'transparent',
              color: page === p.id ? '#fff' : '#555'
            }}>{p.label}</button>
          ))}
        </div>
      </div>
      {page === 'dashboard' && <Dashboard signals={signals} portfolio={portfolio} />}
      {page === 'backtest'  && <Backtest />}
      {page === 'log'       && <AgentLog />}
      {page === 'setup'     && <Onboarding />}
    </div>
  );
}