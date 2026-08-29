import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import psycopg2

load_dotenv()

app = FastAPI(title="SupplyPrescript API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_connection():
    return psycopg2.connect(os.getenv("DATABASE_URL"))

class DecisionRequest(BaseModel):
    shipment_id: int
    predicted_delay_days: int
    chosen_option: str
    chosen_action: str
    cost_usd: float
    time_saved_days: int

@app.get("/")
def health_check():
    return {"status": "SupplyPrescript backend is running"}

@app.post("/execute-decision")
def execute_decision(decision: DecisionRequest):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO decisions
        (shipment_id, predicted_delay_days, chosen_option, chosen_action, cost_usd, time_saved_days)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id, executed_at;
        """,
        (
            decision.shipment_id,
            decision.predicted_delay_days,
            decision.chosen_option,
            decision.chosen_action,
            decision.cost_usd,
            decision.time_saved_days,
        ),
    )
    new_id, executed_at = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return {
        "message": "Decision written back to database",
        "decision_id": new_id,
        "executed_at": str(executed_at),
    }

@app.get("/decisions")
def get_all_decisions():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, shipment_id, chosen_option, chosen_action, cost_usd, executed_at FROM decisions ORDER BY executed_at DESC;")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    return [
        {
            "id": r[0], "shipment_id": r[1], "chosen_option": r[2],
            "chosen_action": r[3], "cost_usd": float(r[4]), "executed_at": str(r[5]),
        }
        for r in rows
    ]