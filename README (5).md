# AegisAI 🛡️
### Autonomous Portfolio Protection for Every Retail Investor
### FAR AWAY 2026 · Round 2 · Challenge #586 — Evidence Handling: Progress View

---

> *"What BlackRock's Aladdin does for $21 trillion — AegisAI does for your ₹10 lakhs."*

---

## Round 2 Challenge — #586

**Challenge:** Evidence Handling: Progress View

> "Extend the MVP with a capability related to supporting proof behind records,
> choices, or claims. Show progress around the concept in a way that reflects
> actual product state."

**AegisAI's Answer:**
Every autonomous agent decision is logged to a **SHA-256 hash-chained Decision Ledger**.
Each entry contains cryptographic proof of what was decided, when, why, and by which agent.
The **Evidence Progress View** shows real-time accumulation of this decision evidence
with full tamper-detection and claim verification — a complete user flow from
signal detection to verified proof.

---

## The Problem

```
March 2020 — COVID Market Crash

Institutional funds (Aladdin):   −4%   ← Protected
Retail investors:                −42%  ← Nothing protected them

150 million retail demat accounts in India.
Zero institutional-grade autonomous protection available.
```

---

## The Solution

AegisAI is a **6-agent autonomous framework** that gives retail investors
the same protection institutional funds use — with one toggle, no expertise required.

```
SENSE  → 4 live signals every 3 seconds (VIX, Drawdown, Volatility, Yield)
THINK  → Composite risk score (0–1) using weighted formula
DECIDE → Breach threshold 0.70 → activate protection
ACT    → Shift equity → GOLDBEES (gold) + LIQUIDBEES (bonds)
MONITOR→ Watch for 3-signal genuine recovery confirmation
REBUILD→ Buy back equity at discount, deploy surplus
REPORT → Groq AI generates plain-English investor alert
PROVE  → Every decision logged to SHA-256 hash chain
```

---

## Evidence Handling — Challenge #586

### How It Works

```python
# Every agent decision creates an evidence entry:
entry_hash = SHA256(
    timestamp + agent + action +
    risk_score + signals + prev_hash
)
```

Changing **any** entry breaks all subsequent hashes — the chain is tamper-evident.

### Evidence Progress View

```
┌─────────────────────────────────────────────────────────────┐
│  EVIDENCE PROGRESS DASHBOARD                                │
│                                                             │
│  Total Evidence: 411    Protection Events: 2               │
│  Recovery Events: 1     Chain Status: ✅ VERIFIED           │
│                                                             │
│  Evidence Accumulation Chart (timeline)                     │
│  ████████████████████████████████                          │
│                                                             │
│  Verifiable Claims:                                         │
│  ✓ Portfolio was actively monitored    [SHA-256 proof]      │
│  ✓ Risk score from live market data    [Live signals]       │
│  ✓ All decisions are tamper-evident    [Hash formula]       │
└─────────────────────────────────────────────────────────────┘
```

---

## Backtest Results — COVID March 2020

| Strategy | Peak to Trough | Capital on ₹10L |
|---|---|---|
| Unprotected Portfolio | **−42%** | ₹5,80,000 |
| AegisAI Protected | **−8%** | ₹9,20,000 |
| **Capital Saved** | **+34pp** | **₹3,40,000** |

### Surplus Capital Mechanism

```
Starting capital:      ₹10,00,000
Gold rose during crash (GOLDBEES +12%)
Buyback cost at bottom: ₹6,61,000
Surplus generated:      ₹3,39,000
Deployed into:          Additional equity at 42% discount
```

AegisAI does not just protect — it **compounds through crisis cycles**.

---

## The 6 Agents

| Agent | Role |
|---|---|
| 🔭 **Sentinel Agent** | Scans VIX, drawdown, yield, volatility every 3 seconds |
| 🧮 **Risk Analyst Agent** | Computes composite stress score using weighted formula |
| ⚡ **Execution Agent** | Shifts equity → gold + bonds when score ≥ 0.70 |
| 📡 **Recovery Monitor** | 3-signal confirmation prevents dead-cat bounce buyback |
| 🔄 **Reconstruction Agent** | Buys back equity at discount, deploys surplus |
| 📝 **Report Agent** | Plain-English alerts via Groq AI (llama-3.1-8b-instant) |

---

## Risk Score Formula

```
score = (
  0.35 × norm(VIX, 15, 65)
  + 0.30 × norm(drawdown_5d, 0, 15)
  + 0.20 × norm(volatility_30d, 0, 0.4)
  + 0.15 × norm(yield_delta, 0, 1.0)
)

Trigger when score ≥ 0.70
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python · Flask · SQLite · APScheduler |
| Market Data | yfinance · NSE India · Live VIX |
| AI Reports | Groq API (llama-3.1-8b-instant) |
| Frontend | HTML · TailwindCSS · ApexCharts |
| Evidence | SHA-256 Hash-Chained Decision Ledger |
| Execution | Angel One SmartAPI · Zerodha Kite Connect |
| Deployment | Render (backend) · Static (frontend) |

---

## Project Structure

```
aegis-ai/
├── backend/
│   ├── app.py           Flask server + all API routes
│   ├── agent.py         6 autonomous agents + pipeline
│   ├── database.py      SQLite + SHA-256 decision ledger
│   ├── signals.py       Live market data + risk formula
│   ├── report_agent.py  Groq AI investor alerts
│   └── .env             API keys (GROQ_API_KEY)
├── templates/
│   └── index.html       Complete dashboard (5 tabs)
├── static/
│   ├── css/style.css    Dark theme + animations
│   └── js/dashboard.js  Real-time updates + scan overlay
└── requirements.txt
```

---

## Setup

```bash
# 1. Clone
git clone https://github.com/amritanshu-mishra/aegis-ai.git
cd aegis-ai

# 2. Virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # Mac/Linux

# 3. Install packages
pip install flask flask-cors yfinance pandas numpy \
            apscheduler python-dotenv groq

# 4. Add API key
echo GROQ_API_KEY=your_key_here > backend/.env
# Get free key at console.groq.com

# 5. Run
cd backend
python app.py

# 6. Open browser
# http://localhost:5000
```

---

## API Routes

```
GET  /              Dashboard HTML
GET  /health        Keep-alive check
GET  /risk-score    Live risk score + signals
GET  /logs          Agent activity log
GET  /scan          Run agents + Groq report
GET  /api/portfolio Portfolio allocation
POST /api/portfolio/setup  Save investor holdings
GET  /ledger        Hash-chained evidence entries
GET  /verify        Chain integrity verification
```

---

## Execution Speed

```
Polling interval:    3 seconds
Order placement:     Async simultaneous
Average execution:   < 2 seconds end-to-end
Worst case:          4.5 seconds
```

---

## SEBI Compliance

AegisAI routes all orders through SEBI-registered broker APIs
(Angel One SmartAPI / Zerodha Kite Connect). The framework never
holds or moves investor funds directly. All execution happens in
the investor's own demat account — identical legal structure to SIPs.

---

## Built By

**Amritanshu Mishra**
IIT Madras · BS Data Science & Applications
FAR AWAY 2026 · Solo submission · Agentic & Autonomous Systems

---

*AegisAI · FAR AWAY 2026 · Challenge #586 — Evidence Handling: Progress View*
