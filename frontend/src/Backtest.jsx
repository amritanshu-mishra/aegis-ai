import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';

export default function Backtest() {
  const [event, setEvent] = useState('covid2020');
  const [data, setData]   = useState(null);

  useEffect(() => {
    axios.get(`/api/backtest?event=${event}`)
      .then(r => {
        const rows = r.data.months.map((m, i) => ({
          month: m,
          'Unprotected':       r.data.unprotected[i],
          'AegisAI protected': r.data.protected[i],
        }));
        setData({ rows, trigger: r.data.trigger });
      });
  }, [event]);

  const stats = data ? {
    worstUnprotected: Math.min(...data.rows.map(r => r['Unprotected'])) - 100,
    worstProtected:   Math.min(...data.rows.map(r => r['AegisAI protected'])) - 100,
    finalUnprotected: data.rows[11]['Unprotected'] - 100,
    finalProtected:   data.rows[11]['AegisAI protected'] - 100,
  } : null;

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[
          { id: 'covid2020', label: 'COVID crash 2020' },
          { id: 'gfc2008',   label: 'GFC 2008' }
        ].map(e => (
          <button key={e.id} onClick={() => setEvent(e.id)} style={{
            padding: '8px 18px', border: '1px solid #ddd',
            borderRadius: 20, cursor: 'pointer', fontSize: 13,
            background: event === e.id ? '#0C1B33' : 'transparent',
            color: event === e.id ? '#fff' : '#555'
          }}>{e.label}</button>
        ))}
      </div>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
          gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Max loss — unprotected', val: `${stats.worstUnprotected.toFixed(0)}%`, c: '#E24B4A' },
            { label: 'Max loss — AegisAI',     val: `${stats.worstProtected.toFixed(0)}%`,   c: '#1D9E75' },
            { label: 'Year end unprotected',   val: `${stats.finalUnprotected > 0 ? '+' : ''}${stats.finalUnprotected.toFixed(0)}%`, c: '#555' },
            { label: 'Year end AegisAI',       val: `${stats.finalProtected > 0 ? '+' : ''}${stats.finalProtected.toFixed(0)}%`, c: '#1D9E75' },
          ].map(m => (
            <div key={m.label} style={{ background: '#f7f7f7',
              borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: m.c }}>{m.val}</div>
            </div>
          ))}
        </div>
      )}

      {data && (
        <div style={{ background: '#fff', border: '1px solid #eee',
          borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
            Portfolio value — ₹100 invested
          </div>
          <div style={{ fontSize: 11, color: '#aaa', marginBottom: 16 }}>
            Dashed line = when AegisAI triggered protection
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.rows}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" style={{ fontSize: 11 }} />
              <YAxis domain={[50, 135]} style={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <ReferenceLine x={data.trigger} stroke="#EF9F27"
                strokeDasharray="5 5"
                label={{ value: 'AegisAI triggered',
                  fill: '#EF9F27', fontSize: 11 }} />
              <Line type="monotone" dataKey="Unprotected"
                stroke="#E24B4A" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="AegisAI protected"
                stroke="#1D9E75" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}