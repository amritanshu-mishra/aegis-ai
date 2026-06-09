from flask import Flask, jsonify, request
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
from database import init_db, get_recent_logs
from agent import agent_pipeline, portfolio_state
from signals import get_all_signals
import json, os

app = Flask(__name__)
CORS(app)
init_db()

SETTINGS_FILE = os.path.join(os.path.dirname(__file__), "settings.json")

@app.route("/api/signals")
def signals():
    return jsonify(get_all_signals())

@app.route("/api/portfolio")
def portfolio():
    return jsonify(portfolio_state)

@app.route("/api/settings", methods=["POST"])
def save_settings():
    data = request.get_json()
    portfolio_state["mode"] = data.get("mode", "AUTO")
    with open(SETTINGS_FILE, "w") as f:
        json.dump(data, f)
    return jsonify({"status": "saved"})

@app.route("/api/agent-log")
def agent_log():
    return jsonify(get_recent_logs(20))

@app.route("/api/backtest")
def backtest():
    event = request.args.get("event", "covid2020")
    if event == "covid2020":
        months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
        unprotected = [100,101,100,58,62,72,80,90,97,103,105,115]
        protected   = [100,101,99,92,94,98,103,108,113,116,119,124]
        trigger     = "Mar"
    else:
        months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
        unprotected = [100,96,88,72,65,62,60,58,54,55,57,60]
        protected   = [100,97,91,85,83,84,86,88,87,89,91,93]
        trigger     = "Feb"
    return jsonify({"months":months,"unprotected":unprotected,
                    "protected":protected,"trigger":trigger,"event":event})

if __name__ == "__main__":
    scheduler = BackgroundScheduler()
    scheduler.add_job(agent_pipeline, "interval", seconds=60)
    scheduler.start()
    agent_pipeline()
    print("AegisAI running → http://localhost:5000")
    app.run(debug=False, port=5000)