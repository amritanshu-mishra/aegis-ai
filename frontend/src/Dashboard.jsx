import React from 'react';
import { RadialBarChart, RadialBar, PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#378ADD', '#EF9F27', '#1D9E75'];

export default function Dashboard({ signals, portfolio }) {
  if (!signals) return (
    <div style={{ padding: 60, textAlign: 'center', color: '#aaa' }}>
      Loading live market data...
    </div>
  );

  const score = signals.score;
  const level = signals.level;
  const color = level === 'CRITICAL' ? '#E24B4A' : level === 'WARNING' ? '#EF9F27' : '#1D9E75';

  const pieData = [
    { name: 'Equity', value: portfolio?.equity_pct || 80 },
    { name: 'Gold',   value: portfolio?.gold_pct   || 10 },
    { name: 'Bonds',  value: portfolio?.bonds_pct  || 10 },
  ];

  const breakdown = [
    { label: 'VIX signal',      val: Math.min((signals.vix / 80) * 100, 100).toFixed(0) },
    { label: 'Drawdown signal', val: Math.min((Math.abs(signals.drawdown) / 40) * 100, 100).toFixed(0) },
    { label: 'Yield signal',    val: signals.yield_spread < 0 ? 100 : 0 },
    { label: 'Volatility',      val: Math.min((signals.volatility / 0.5) * 100, 100).toFixed(0) },
  ];

  const barColor = v => v > 80 ? '#E24B4A' : v > 60 ? '#EF9F27' : '#1D9E75';

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
        gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Stress score', val: `${score}/100`, c: color },
          { label: 'VIX level',    val: signals.vix,    c: '#333' },
          { label: 'Mode',         val: portfolio?.mode || 'AUTO', c: '#185FA5' },
          { label: 'Status',       val: level,          c: color },
        ].map(m => (
          <div key={m.label} style={{ background: '#f7f7f7',
            borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: m.c }}>{m.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 16, marginBottom: 20 }}>
        <div style={{ background: '#fff', border: '1px solid #eee',
          borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Stress gauge</div>
          <RadialBarChart width={200} height={160} cx={100} cy={100}
            innerRadius={55} outerRadius={85} startAngle={180} endAngle={0}
            data={[{ value: score, fill: color }]} style={{ margin: '0 auto' }}>
            <RadialBar dataKey="value" cornerRadius={4}
              background={{ fill: '#f0f0f0' }} />
          </RadialBarChart>
          <div style={{ textAlign: 'center', fontSize: 32, fontWeight: 700,
            color, marginTop: -30 }}>{score}</div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #eee',
          borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            Portfolio allocation
          </div>
          <PieChart width={200} height={160} style={{ margin: '0 auto' }}>
            <Pie data={pieData} cx={100} cy={75} outerRadius={65}
              dataKey="value"
              label={({ name, value }) => `${name} ${value}%`}
              labelLine={false} style={{ fontSize: 10 }}>
              {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #eee',
        borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>
          Signal breakdown
        </div>
        {breakdown.map(s => (
          <div key={s.label} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between',
              fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: '#555' }}>{s.label}</span>
              <span style={{ fontWeight: 600 }}>{s.val}/100</span>
            </div>
            <div style={{ height: 6, background: '#f0f0f0',
              borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${s.val}%`,
                background: barColor(s.val), borderRadius: 3,
                transition: 'width 0.3s' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}