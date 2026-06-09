from datetime import datetime
from signals import get_all_signals
from database import init_db, log_agent_action, log_signal
from report_agent import generate_ai_report
import os

API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")

portfolio_state = {
    "equity_pct": 80.0,
    "gold_pct":   10.0,
    "bonds_pct":  10.0,
    "mode":       "AUTO",
    "defensive":  False,
    "last_action": "MONITOR"
}

def sentinel_agent(signals):
    return signals["score"], signals["level"]

def risk_analyst_agent(score, level):
    if score > 80:   return "CRITICAL_BREACH"
    elif score > 65: return "WARNING_BREACH"
    elif score < 35: return "RECOVERY_SIGNAL"
    return "NORMAL"

def execution_agent(regime, portfolio):
    if regime == "CRITICAL_BREACH" and not portfolio["defensive"]:
        portfolio.update({"equity_pct":15,"gold_pct":45,"bonds_pct":40,"defensive":True})
        return "PROTECT"
    elif regime == "WARNING_BREACH" and not portfolio["defensive"]:
        return "WARN"
    return None

def recovery_monitor_agent(regime, portfolio):
    return regime == "RECOVERY_SIGNAL" and portfolio["defensive"]

def reconstruction_agent(portfolio):
    portfolio.update({"equity_pct":80,"gold_pct":10,"bonds_pct":10,"defensive":False})
    return "RECOVER"

def report_agent(action, score, signals, portfolio):
    if API_KEY:
        return generate_ai_report(action, score, signals, portfolio, API_KEY)
    return f"AegisAI {action}: Score {score}/100. VIX={signals['vix']}, Drawdown={signals['drawdown']}%."

def agent_pipeline():
    ts = datetime.now().isoformat()
    try:
        signals = get_all_signals()
        score = signals["score"]
        log_signal(ts, signals['vix'], signals['drawdown'],
                   signals['yield_spread'], signals['volatility'], score)

        score_val, level = sentinel_agent(signals)
        regime = risk_analyst_agent(score_val, level)

        action = execution_agent(regime, portfolio_state)
        if recovery_monitor_agent(regime, portfolio_state):
            action = reconstruction_agent(portfolio_state)
        if action is None:
            action = "MONITOR"

        portfolio_state["last_action"] = action
        reason = report_agent(action, score, signals, portfolio_state)

        agent_name = {
            "PROTECT":"Execution Agent",
            "RECOVER":"Reconstruction Agent",
            "WARN":   "Sentinel Agent",
            "MONITOR":"Sentinel Agent"
        }.get(action, "Sentinel Agent")

        log_agent_action(ts, agent_name, action, reason, score)
        print(f"[AegisAI] {agent_name} → {action} | Score={score}")

    except Exception as e:
        print(f"[AegisAI] Pipeline error: {e}")

if __name__ == "__main__":
    init_db()
    agent_pipeline()
    print("Agent pipeline test complete!")