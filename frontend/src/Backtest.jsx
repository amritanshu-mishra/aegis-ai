import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine, ResponsiveContainer, Area, AreaChart
} from 'recharts';

const Card = ({ children, style = {} }) => (
  <div style={{
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16, padding: 20,
    backdropFilter: 'blur(10px)',
    ...style
  }}>{children}</div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(10,15,30,0.97)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10, padding: '10px 14px', fontSize: 12
      }}>
        <div style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color, marginBottom: 3 }}>
            {p.name}: <strong>₹{p.value}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Backtest({ accentColor }) {
  const [event, setEvent] = useState('covid2020');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/backtest?event=${event}`).then(r => {
      const rows = r.data.months.map((m, i) => ({
        month: m,
        'Unprotected':       r.data.unprotected[i],
        'AegisAI protected': r.data.protected[i],
      }));
      setData({ rows, trigger: r.data.trigger });
      setLoading(false);
    });
  }, [event]);

  const stats = data ? {
    worstUnprotected: Math.min(...data.rows.map(r => r['Unprotected'])) - 100,
    worstProtected:   Math.min(...data.rows.map(r => r['AegisAI protected'])) - 100,
    finalUnprotected: data.rows[11]['Unprotected'] - 100,
    finalProtected:   data.rows[11]['AegisAI protected'] - 100,
  } : null;

  const events = [
    { id: 'covid2020', label: 'COVID Crash 2020', icon: '🦠', desc: 'March 2020 — Fastest crash in history' },
    { id: 'gfc2008',   label: 'GFC 2008',          icon: '🏦', desc: 'Sept 2008 — Global financial collapse' }
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
          Historical Backtest
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
          How AegisAI would have performed during the worst market crashes in history
        </div>
      </div>

      {/* Event selector */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        {events.map(e => (
          <button key={e.id} onClick={() => setEvent(e.id)} style={{
            padding: '12px 20px', borderRadius: 12, cursor: 'pointer',
            border: event === e.id ? `1px solid ${accentColor}50` : '1px solid rgba(255,255,255,0.08)',
            background: event === e.id ? `${accentColor}12` : 'rgba(255,255,255,0.02)',
            color: event === e.id ? '#fff' : 'rgba(255,255,255,0.45)',
            textAlign: 'left', transition: 'all 0.2s'
          }}>
            <div style={{ fontSize: 16, marginBottom: 3 }}>{e.icon} {e.label}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{e.desc}</div>
          </button>
        ))}
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Max loss — unprotected', val: `${stats.worstUnprotected.toFixed(0)}%`, color: '#FF4D4D',
              sub: 'Holding through crash' },
            { label: 'Max loss — AegisAI',     val: `${stats.worstProtected.toFixed(0)}%`,   color: accentColor,
              sub: 'With protection active' },
            { label: 'Year-end unprotected',   val: `${stats.finalUnprotected > 0 ? '+' : ''}${stats.finalUnprotected.toFixed(0)}%`,
              color: stats.finalUnprotected > 0 ? accentColor : '#FF4D4D', sub: 'December return' },
            { label: 'Year-end AegisAI',       val: `${stats.finalProtected > 0 ? '+' : ''}${stats.finalProtected.toFixed(0)}%`,
              color: accentColor, sub: 'December return' },
          ].map(m => (
            <Card key={m.label} style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, transparent, ${m.color}60, transparent)`
              }}/>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 8, letterSpacing: '0.5px' }}>
                {m.label.toUpperCase()}
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: m.color, letterSpacing: '-1px' }}>{m.val}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>{m.sub}</div>
            </Card>
          ))}
        </div>
      )}

      {/* Capital saved callout */}
      {stats && (
        <div style={{
          padding: '14px 20px', borderRadius: 12, marginBottom: 20,
          background: `linear-gradient(90deg, ${accentColor}15, transparent)`,
          border: `1px solid ${accentColor}30`,
          display: 'flex', alignItems: 'center', gap: 16
        }}>
          <div style={{ fontSize: 28 }}>🛡️</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 2 }}>
              AegisAI saved {(stats.worstUnprotected - stats.worstProtected).toFixed(0)}% of your capital
              during the {event === 'covid2020' ? 'COVID crash' : 'GFC'}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
              On a ₹10 lakh portfolio that's ₹{Math.abs((stats.worstUnprotected - stats.worstProtected) * 10000).toLocaleString('en-IN')} preserved
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      {loading ? (
        <Card style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: 'rgba(255,255,255,0.3)' }}>Loading chart data...</div>
        </Card>
      ) : data && (
        <Card>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
            Portfolio value — ₹100 invested at start of year
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 20 }}>
            Dashed orange line shows when AegisAI triggered protection
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.rows} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month"
                style={{ fontSize: 11 }}
                tick={{ fill: 'rgba(255,255,255,0.3)' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                tickLine={false} />
              <YAxis domain={[50, 135]}
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', paddingTop: 16 }} />
              <ReferenceLine x={data.trigger} stroke="#FFB800" strokeDasharray="5 5" strokeWidth={1.5}
                label={{ value: '⚡ AegisAI triggered', fill: '#FFB800', fontSize: 11, dy: -8 }} />
              <Line type="monotone" dataKey="Unprotected"
                stroke="#FF4D4D" strokeWidth={2} dot={false}
                strokeDasharray="0" />
              <Line type="monotone" dataKey="AegisAI protected"
                stroke={accentColor} strokeWidth={2.5} dot={false}
                filter="drop-shadow(0 0 4px rgba(0,200,150,0.4))" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
}
