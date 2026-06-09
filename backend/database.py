import sqlite3, os

DB = os.path.join(os.path.dirname(__file__), "aegis.db")

def init_db():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute("""CREATE TABLE IF NOT EXISTS agent_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT, agent TEXT, action TEXT,
        reason TEXT, score REAL)""")
    c.execute("""CREATE TABLE IF NOT EXISTS signals_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT, vix REAL, drawdown REAL,
        yield_spread REAL, volatility REAL, score REAL)""")
    conn.commit()
    conn.close()

def log_agent_action(ts, agent, action, reason, score):
    conn = sqlite3.connect(DB)
    conn.execute("INSERT INTO agent_log VALUES (NULL,?,?,?,?,?)",
                 (ts, agent, action, reason, score))
    conn.commit()
    conn.close()

def log_signal(ts, vix, dd, sp, vol, score):
    conn = sqlite3.connect(DB)
    conn.execute("INSERT INTO signals_log VALUES (NULL,?,?,?,?,?,?)",
                 (ts, vix, dd, sp, vol, score))
    conn.commit()
    conn.close()

def get_recent_logs(limit=20):
    conn = sqlite3.connect(DB)
    rows = conn.execute(
        "SELECT timestamp,agent,action,reason,score FROM agent_log ORDER BY id DESC LIMIT ?",
        (limit,)).fetchall()
    conn.close()
    return [{"timestamp":r[0],"agent":r[1],"action":r[2],
             "reason":r[3],"score":r[4]} for r in rows]

if __name__ == "__main__":
    init_db()
    print("aegis.db created successfully!")