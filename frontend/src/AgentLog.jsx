import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BG   = { PROTECT:'#FCEBEB', RECOVER:'#EAF3DE', WARN:'#FAEEDA', MONITOR:'#f7f7f7' };
const BORD = { PROTECT:'#E24B4A', RECOVER:'#1D9E75', WARN:'#EF9F27', MONITOR:'#ddd' };
const LBL  = { PROTECT:'Protection triggered', RECOVER:'Recovery triggered', WARN:'Warning issued', MONITOR:'Monitoring' };

export default function AgentLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetch = () => axios.get('/api/agent-log').then(r => setLogs(r.data)).catch(() => {});
    fetch();
    const i = setInterval(fetch, 15000);
    return () => clearInterval(i);
  }, []);

  if (!logs.length) return (
    <div style={{ padding: 60, textAlign: 'center', color: '#aaa' }}>
      No agent decisions yet — check back in 60 seconds.
    </div>
  );

  return (
    <div>
      <div style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
        Agent decisions — refreshes every 15 seconds
      </div>
      {logs.map((log, i) => (
        <div key={i} style={{
          background: BG[log.action]  || '#f7f7f7',
          border: `1px solid ${BORD[log.action] || '#ddd'}`,
          borderRadius: 10, padding: '12px 14px', marginBottom: 10
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: BORD[log.action] }}>
                {LBL[log.action] || log.action}
              </span>
              <span style={{ fontSize: 11, color: '#aaa', marginLeft: 8 }}>{log.agent}</span>
            </div>
            <span style={{ fontSize: 11, color: '#bbb' }}>
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <div style={{ fontSize: 13, color: '#333', lineHeight: 1.6 }}>{log.reason}</div>
          <div style={{ fontSize: 11, color: '#aaa', marginTop: 6 }}>Score: {log.score}/100</div>
        </div>
      ))}
    </div>
  );
}