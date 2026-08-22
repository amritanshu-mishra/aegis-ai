import React, { useState, useEffect } from 'react';
import { RadialBarChart, RadialBar, PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#378ADD', '#FFB800', '#00C896'];

const Card = ({ children, style = {} }) => (
  <div style={{
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16,
    padding: 20,
    backdropFilter: 'blur(10px)',
    ...style
  }}>{children}</div>
);

const MetricCard = ({ label, value, color, sub, icon }) => (
  <Card style={{ position: 'relative', overflow: 'hidden' }}>
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 2,
      background: `linear-gradient(90deg, transparent, ${color}60, transparent)`
    }}/>
    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 8, letterSpacing: '0.5px' }}>
      {icon} {label.toUpperCase()}
    </div>
    <div style={{ fontSize: 28, fontWeight: 700, color, letterSpacing: '-1px', lineHeight: 1 }}>
      {value}
    </div>
    {sub && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>{sub}</div>}
  </Card>
);

const SignalBar = ({ label, val, color }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color }}>{val}/100</span>
    </div>
    <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${val}%`,
        background: `linear-gradient(90deg, ${color}80, ${color})`,
        borderRadius: 2,
        transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: `0 0 8px ${color}60`
      }}/>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(10,15,30,0.95)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#fff'
      }}>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.fill }}>{p.name}: {p.value}%</div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard({ signals, portfolio, accentColor }) {
  const [animScore, setAnimScore] = useState(0);

  useEffect(() => {
    if (signals?.score) {
      const target = signals.score;
      let current = 0;
      const step = target / 40;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { setAnimScore(target); clearInterval(timer); }
        else setAnimScore(Math.round(current * 10) / 10);
      }, 30);
      return () => clearInterval(timer);
    }
  }, [signals?.score]);

  if (!signals) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, gap: 16 }}>
      <div style={{
        width: 48, height: 48, border: `3px solid ${accentColor}30`,
        borderTopColor: accentColor, borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}/>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Connecting to live market data...</div>
    </div>
  );

  const score = signals.score;
  const level = signals.level;
  const color = level === 'CRITICAL' ? '#FF4D4D' : level === 'WARNING' ? '#FFB800' : accentColor;

  const pieData = [
    { name: 'Equity', value: portfolio?.equity_pct || 80 },
    { name: 'Gold',   value: portfolio?.gold_pct   || 10 },
    { name: 'Bonds',  value: portfolio?.bonds_pct  || 10 },
  ];

  const breakdown = [
    { label: 'VIX signal',      val: Math.min((signals.vix / 80) * 100, 100).toFixed(0),           color: '#FF6B6B' },
    { label: 'Drawdown signal', val: Math.min((Math.abs(signals.drawdown) / 40) * 100, 100).toFixed(0), color: '#FFB800' },
    { label: 'Yield curve',     val: signals.yield_spread < 0 ? 100 : 0,                             color: '#A78BFA' },
    { label: 'Volatility',      val: Math.min((signals.volatility / 0.5) * 100, 100).toFixed(0),    color: '#38BDF8' },
  ];

  const statusMessages = {
    NORMAL: 'Markets are calm. Portfolio fully deployed.',
    WARNING: 'Elevated stress detected. Agent on high alert.',
    CRITICAL: 'Critical threshold breached. Defensive mode active.'
  };

  return (
    <div>
      {/* Status banner */}
      <div style={{
        padding: '12px 20px', borderRadius: 12, marginBottom: 20,
        background: `linear-gradient(90deg, ${color}15, ${color}05)`,
        border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', gap: 12
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}` }}/>
        <span style={{ fontSize: 13, color, fontWeight: 500 }}>{level}</span>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>—</span>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{statusMessages[level]}</span>
        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
          Mode: <span style={{ color: accentColor, fontWeight: 600 }}>{portfolio?.mode || 'AUTO'}</span>
        </div>
      </div>

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
        <MetricCard label="Stress Score" value={`${score}/100`} color={color} icon="📡"
          sub={`${level} market conditions`} />
        <MetricCard label="VIX Level" value={signals.vix} color="#38BDF8" icon="📈"
          sub={signals.vix > 30 ? 'Extreme fear' : signals.vix > 20 ? 'Elevated fear' : 'Normal range'} />
        <MetricCard label="Nifty Drawdown" value={`${signals.drawdown}%`}
          color={signals.drawdown < -10 ? '#FF4D4D' : '#FFB800'} icon="📉"
          sub="From 52-week peak" />
        <MetricCard label="Yield Spread" value={`${signals.yield_spread}%`}
          color={signals.yield_spread < 0 ? '#FF4D4D' : accentColor} icon="🏦"
          sub={signals.yield_spread < 0 ? '⚠️ Inverted curve' : 'Normal curve'} />
      </div>

      {/* Main panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Stress Gauge */}
        <Card>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 16, letterSpacing: '0.5px' }}>
            ⚡ COMPOSITE STRESS GAUGE
          </div>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <RadialBarChart width={220} height={140} cx={110} cy={120}
              innerRadius={70} outerRadius={105} startAngle={180} endAngle={0}
              data={[{ value: animScore, fill: color }]}>
              <RadialBar dataKey="value" cornerRadius={6} background={{ fill: 'rgba(255,255,255,0.04)' }} />
            </RadialBarChart>
            <div style={{
              position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 40, fontWeight: 800, color, lineHeight: 1, letterSpacing: '-2px' }}>
                {animScore}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>out of 100</div>
            </div>
          </div>
          {/* Scale labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, padding: '0 10px' }}>
            {['0', '25', '50', '75', '100'].map(n => (
              <span key={n} style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>{n}</span>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 10px 0' }}>
            <span style={{ fontSize: 9, color: '#00C896' }}>SAFE</span>
            <span style={{ fontSize: 9, color: '#FFB800' }}>WARN</span>
            <span style={{ fontSize: 9, color: '#FF4D4D' }}>CRITICAL</span>
          </div>
        </Card>

        {/* Portfolio Allocation */}
        <Card>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 16, letterSpacing: '0.5px' }}>
            💼 PORTFOLIO ALLOCATION
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <PieChart width={140} height={140}>
              <Pie data={pieData} cx={70} cy={70} outerRadius={60} innerRadius={30}
                dataKey="value" strokeWidth={0}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
            <div style={{ flex: 1 }}>
              {pieData.map((d, i) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: COLORS[i], flexShrink: 0 }}/>
                  <div style={{ flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{d.name}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: COLORS[i] }}>{d.value}%</div>
                </div>
              ))}
              <div style={{
                marginTop: 12, padding: '6px 10px', borderRadius: 6,
                background: `${accentColor}10`, border: `1px solid ${accentColor}20`,
                fontSize: 11, color: accentColor, textAlign: 'center'
              }}>
                {portfolio?.defensive ? '🛡️ Defensive mode active' : '📈 Growth mode active'}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Signal Breakdown */}
      <Card>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 20, letterSpacing: '0.5px' }}>
          📡 SIGNAL BREAKDOWN — 4 live indicators driving the stress score
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' }}>
          {breakdown.map(s => (
            <SignalBar key={s.label} label={s.label} val={s.val} color={s.color} />
          ))}
        </div>
        <div style={{
          marginTop: 16, padding: '10px 14px', borderRadius: 8,
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
          fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6
        }}>
          <strong style={{ color: 'rgba(255,255,255,0.7)' }}>How the score is computed:</strong>{' '}
          VIX×35% + Drawdown×30% + Yield curve×20% + Volatility×15%
          {' '}— Score above 80 triggers automatic protection.
        </div>
      </Card>
    </div>
  );
}
