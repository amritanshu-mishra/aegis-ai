import React, { useState } from 'react';
import axios from 'axios';

export default function Onboarding({ accentColor }) {
  const [step, setSt] = useState(0);
  const [data, setData] = useState({ amount: 100000, risk: 'moderate', mode: 'AUTO' });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = () => {
    setSaving(true);
    axios.post('/api/settings', data).then(() => {
      setSaving(false);
      setSaved(true);
    }).catch(() => setSaving(false));
  };

  if (saved) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: `${accentColor}20`, border: `2px solid ${accentColor}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 36, marginBottom: 24,
        boxShadow: `0 0 40px ${accentColor}30`
      }}>✓</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
        You are protected
      </div>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 32 }}>
        AegisAI is monitoring your portfolio in real time
      </div>
      <div style={{
        padding: '16px 24px', borderRadius: 12,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        fontSize: 13, color: 'rgba(255,255,255,0.5)',
        maxWidth: 380, textAlign: 'center', lineHeight: 1.6
      }}>
        Portfolio: <strong style={{ color: '#fff' }}>₹{parseInt(data.amount).toLocaleString('en-IN')}</strong>
        {' '}· Risk: <strong style={{ color: '#fff', textTransform: 'capitalize' }}>{data.risk}</strong>
        {' '}· Mode: <strong style={{ color: accentColor }}>{data.mode}</strong>
      </div>
    </div>
  );

  const steps = [
    {
      label: 'Portfolio value',
      sub: 'How much is your total investment worth?',
      icon: '💰',
      body: (
        <div>
          <div style={{
            textAlign: 'center', fontSize: 44, fontWeight: 800,
            color: '#fff', letterSpacing: '-2px', margin: '24px 0 8px'
          }}>
            ₹{parseInt(data.amount).toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginBottom: 24 }}>
            Drag to set your portfolio value
          </div>
          <input type="range" min="10000" max="5000000" step="10000"
            value={data.amount}
            onChange={e => setData({ ...data, amount: +e.target.value })}
            style={{ width: '100%', accentColor: accentColor, height: 4 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 8 }}>
            <span>₹10,000</span><span>₹50,00,000</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
            {[100000, 500000, 1000000, 2500000].map(amt => (
              <button key={amt} onClick={() => setData({ ...data, amount: amt })} style={{
                padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 12,
                border: data.amount === amt ? `1px solid ${accentColor}` : '1px solid rgba(255,255,255,0.1)',
                background: data.amount === amt ? `${accentColor}20` : 'transparent',
                color: data.amount === amt ? accentColor : 'rgba(255,255,255,0.4)'
              }}>₹{(amt/100000).toFixed(0)}L</button>
            ))}
          </div>
        </div>
      )
    },
    {
      label: 'Risk appetite',
      sub: 'How much risk can you tolerate?',
      icon: '⚖️',
      body: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
          {[
            { id: 'conservative', label: 'Conservative', sub: 'Protect capital above all — trigger protection early', icon: '🛡️' },
            { id: 'moderate',     label: 'Moderate',     sub: 'Balance growth and protection', icon: '⚖️' },
            { id: 'aggressive',   label: 'Aggressive',   sub: 'Higher risk tolerance — trigger only at critical levels', icon: '🚀' },
          ].map(r => (
            <div key={r.id} onClick={() => setData({ ...data, risk: r.id })} style={{
              padding: '14px 16px', borderRadius: 12, cursor: 'pointer',
              border: `1px solid ${data.risk === r.id ? accentColor + '60' : 'rgba(255,255,255,0.08)'}`,
              background: data.risk === r.id ? `${accentColor}10` : 'rgba(255,255,255,0.02)',
              display: 'flex', alignItems: 'center', gap: 14,
              transition: 'all 0.2s'
            }}>
              <span style={{ fontSize: 22 }}>{r.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: data.risk === r.id ? '#fff' : 'rgba(255,255,255,0.6)', marginBottom: 2 }}>
                  {r.label}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{r.sub}</div>
              </div>
              {data.risk === r.id && (
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>✓</div>
              )}
            </div>
          ))}
        </div>
      )
    },
    {
      label: 'Protection mode',
      sub: 'How should AegisAI respond to threats?',
      icon: '🤖',
      body: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
          {[
            { id: 'AUTO',   label: 'Fully automatic', sub: 'Agent detects, decides, and acts — no intervention needed', icon: '⚡', badge: 'Recommended' },
            { id: 'MANUAL', label: 'Alert only',       sub: 'Agent warns you — you make the final call', icon: '🔔', badge: null },
          ].map(m => (
            <div key={m.id} onClick={() => setData({ ...data, mode: m.id })} style={{
              padding: '16px 18px', borderRadius: 12, cursor: 'pointer',
              border: `1px solid ${data.mode === m.id ? accentColor + '60' : 'rgba(255,255,255,0.08)'}`,
              background: data.mode === m.id ? `${accentColor}10` : 'rgba(255,255,255,0.02)',
              display: 'flex', alignItems: 'flex-start', gap: 14,
              transition: 'all 0.2s'
            }}>
              <span style={{ fontSize: 24, marginTop: 2 }}>{m.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: data.mode === m.id ? '#fff' : 'rgba(255,255,255,0.6)' }}>
                    {m.label}
                  </span>
                  {m.badge && (
                    <span style={{
                      fontSize: 10, padding: '1px 8px', borderRadius: 10,
                      background: `${accentColor}25`, color: accentColor,
                      border: `1px solid ${accentColor}40`
                    }}>{m.badge}</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{m.sub}</div>
              </div>
              {data.mode === m.id && (
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>✓</div>
              )}
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <div style={{ maxWidth: 480, margin: '20px auto' }}>
      {/* Progress */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ flex: 1, position: 'relative' }}>
            <div style={{
              height: 3, borderRadius: 2,
              background: i <= step ? accentColor : 'rgba(255,255,255,0.08)',
              transition: 'background 0.4s ease'
            }}/>
            <div style={{
              fontSize: 10, color: i <= step ? accentColor : 'rgba(255,255,255,0.25)',
              marginTop: 6, transition: 'color 0.4s'
            }}>{i + 1}. {s.label}</div>
          </div>
        ))}
      </div>

      {/* Step card */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 20, padding: 28,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 22 }}>{steps[step].icon}</span>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{steps[step].label}</div>
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
          {steps[step].sub}
        </div>
        {steps[step].body}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        {step > 0 ? (
          <button onClick={() => setSt(step - 1)} style={{
            padding: '12px 24px', borderRadius: 10, cursor: 'pointer',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.03)',
            color: 'rgba(255,255,255,0.5)', fontSize: 14
          }}>← Back</button>
        ) : <div />}

        {step < steps.length - 1 ? (
          <button onClick={() => setSt(step + 1)} style={{
            padding: '12px 28px', borderRadius: 10, cursor: 'pointer',
            border: 'none', background: accentColor,
            color: '#000', fontSize: 14, fontWeight: 600
          }}>Next →</button>
        ) : (
          <button onClick={save} disabled={saving} style={{
            padding: '12px 28px', borderRadius: 10, cursor: 'pointer',
            border: 'none',
            background: saving ? 'rgba(255,255,255,0.1)' : accentColor,
            color: saving ? 'rgba(255,255,255,0.4)' : '#000',
            fontSize: 14, fontWeight: 600, transition: 'all 0.2s'
          }}>
            {saving ? 'Activating...' : '🛡️ Activate Protection'}
          </button>
        )}
      </div>
    </div>
  );
}
