import yfinance as yf
import numpy as np

def get_vix():
    hist = yf.Ticker("^VIX").history(period="5d")
    return round(hist['Close'].iloc[-1], 2)

def get_nifty_drawdown():
    hist = yf.Ticker("^NSEI").history(period="1y")
    peak = hist['Close'].max()
    current = hist['Close'].iloc[-1]
    return round(((current - peak) / peak) * 100, 2)

def get_yield_spread():
    t10 = yf.Ticker("^TNX").history(period="5d")['Close'].iloc[-1]
    t2  = yf.Ticker("^IRX").history(period="5d")['Close'].iloc[-1]
    return round(t10 - t2, 3)

def get_volatility():
    hist = yf.Ticker("^GSPC").history(period="35d")
    returns = hist['Close'].pct_change().dropna()
    return round(returns.std() * (252 ** 0.5), 4)

def compute_stress_score(vix, drawdown, spread, vol):
    vix_score  = min((vix / 80) * 100, 100)
    draw_score = min((abs(drawdown) / 40) * 100, 100)
    yld_score  = 100 if spread < 0 else 0
    vol_score  = min((vol / 0.5) * 100, 100)
    score = (vix_score*0.35 + draw_score*0.30 + yld_score*0.20 + vol_score*0.15)
    return round(score, 1)

def get_all_signals():
    vix = get_vix()
    dd  = get_nifty_drawdown()
    sp  = get_yield_spread()
    vol = get_volatility()
    score = compute_stress_score(vix, dd, sp, vol)
    level = "CRITICAL" if score > 80 else "WARNING" if score > 65 else "NORMAL"
    return {"vix": vix, "drawdown": dd, "yield_spread": sp,
            "volatility": vol, "score": score, "level": level}

if __name__ == "__main__":
    s = get_all_signals()
    print(f"VIX={s['vix']} | Drawdown={s['drawdown']}% | Spread={s['yield_spread']} | Vol={s['volatility']}")
    print(f"STRESS SCORE: {s['score']}/100 [{s['level']}]")