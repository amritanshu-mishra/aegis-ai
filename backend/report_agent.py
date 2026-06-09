import requests

def generate_ai_report(action, score, signals, portfolio, api_key):
    prompt = f"""You are AegisAI, an autonomous portfolio protection agent for retail investors in India.

Live market data:
- India VIX: {signals['vix']} (normal 10-20, danger above 25)
- Nifty 50 drawdown from peak: {signals['drawdown']}%
- Yield spread (10Y minus 2Y): {signals['yield_spread']}%
- 30-day volatility: {signals['volatility']}
- Stress score: {score}/100
- Action taken: {action}
- Portfolio: {portfolio['equity_pct']}% equity | {portfolio['gold_pct']}% gold | {portfolio['bonds_pct']}% bonds

Write exactly 2 sentences for a non-finance Indian retail investor:
Sentence 1: What the market is doing and why it matters.
Sentence 2: What AegisAI just did to protect their money.
Be specific with numbers. No jargon. Be calm and reassuring."""

    try:
        resp = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": api_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
            },
            json={
                "model": "claude-sonnet-4-20250514",
                "max_tokens": 150,
                "messages": [{"role": "user", "content": prompt}]
            },
            timeout=12
        )
        data = resp.json()
        return data["content"][0]["text"].strip()
    except Exception as e:
        return f"AegisAI {action}: Stress score {score}/100. VIX={signals['vix']}, Drawdown={signals['drawdown']}%."