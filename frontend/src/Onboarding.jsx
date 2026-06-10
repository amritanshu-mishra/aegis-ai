import React, { useState } from 'react';
import axios from 'axios';

export default function Onboarding() {
  const [step, setSt] = useState(0);
  const [data, setData] = useState({ amount: 100000, risk: 'moderate', mode: 'AUTO' });
  const [saved, setSaved] = useState(false);

  const save = () => axios.post('/api/settings', data).then(() => setSaved(true));

  if (saved) return (
    <div style={{ textAlign: 'center', padding: 60 }}>
      <div style={{ fontSize: 52, color: '#1D9E75' }}>✓</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#1D9E75', margin: '12px 0 6px' }}>
        You are protected
      </div>
      <div style={{ fontSize: 14, color: '#888' }}>
        AegisAI is monitoring your portfolio in real time
      </div>
    </div>
  );

  const steps = [
    {
      label: 'Portfolio value',
      body: (
        <div>
          <div style={{ fontSize: 13, color: '#555', marginBottom: 14 }}>
            How much is your portfolio worth?
          </div>
          <input type="range" min="10000" max="5000000" step="10000"
            value={data.amount}
            onChange={e => setData({ ...data, amount: +e.target.value })}
            style={{ width: '100%' }} />
          <div style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, marginTop: 10 }}>
            ₹{parseInt(data.amount).toLocaleString('en-IN')}
          </div>
        </div>
      )
    },
    {
      label: 'Risk appetite',
      body: (
        <div>
          {['conservative', 'moderate', 'aggressive'].map(r => (
            <div key={r} onClick={() => setData({ ...data, risk: r })} style={{
              padding: '12px 16px',
              border: `2px solid ${data.risk === r ? '#0C1B33' : '#eee'}`,
              borderRadius: 10, marginBottom: 8, cursor: 'pointer',
              textTransform: 'capitalize',
              fontWeight: data.risk === r ? 600 : 400
            }}>{r}</div>
          ))}
        </div>
      )
    },
    {
      label: 'Protection mode',
      body: (
        <div>
          {[
            { id: 'AUTO',   label: 'Fully automatic', sub: 'Agent acts without asking you' },
            { id: 'MANUAL', label: 'Alert only',       sub: 'Agent warns you, you decide' },
          ].map(m => (
            <div key={m.id} onClick={() => setData({ ...data, mode: m.id })} style={{
              padding: '14px 16px',
              border: `2px solid ${data.mode === m.id ? '#0C1B33' : '#eee'}`,
              borderRadius: 10, marginBottom: 8, cursor: 'pointer'
            }}>
              <div style={{ fontWeight: 600, marginBottom: 3 }}>{m.label}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{m.sub}</div>
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <div style={{ maxWidth: 400, margin: '30px auto' }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {steps.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2,
            background: i <= step ? '#0C1B33' : '#eee' }} />
        ))}
      </div>
      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
        {steps[step].label}
      </div>
      {steps[step].body}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        {step > 0
          ? <button onClick={() => setSt(step - 1)} style={{
              padding: '10px 20px', border: '1px solid #ddd',
              borderRadius: 8, cursor: 'pointer', background: 'transparent'
            }}>Back</button>
          : <div />}
        {step < steps.length - 1
          ? <button onClick={() => setSt(step + 1)} style={{
              padding: '10px 24px', border: 'none', borderRadius: 8,
              cursor: 'pointer', background: '#0C1B33', color: '#fff'
            }}>Next</button>
          : <button onClick={save} style={{
              padding: '10px 24px', border: 'none', borderRadius: 8,
              cursor: 'pointer', background: '#1D9E75',
              color: '#fff', fontWeight: 600
            }}>Activate protection</button>
        }
      </div>
    </div>
  );
}