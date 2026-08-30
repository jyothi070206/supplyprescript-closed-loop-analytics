# SupplyPrescript — Closed-Loop Prescriptive Analytics

## Problem Statement
Predictive analytics tell you what will happen (e.g., a 14-day supply 
delay) but not what to do about it. Standard dashboards also don't 
learn — if an operator makes a decision, the system rarely tracks 
whether it actually worked.

## Solution Approach
SupplyPrescript predicts disruptions using a trained ML model (XGBoost), 
then runs a mathematical optimization engine (SciPy Linear Programming) 
to prescribe the best alternative actions under real constraints 
(budget, time, capacity). The user executes a decision directly in the 
dashboard, the choice is written back to the database, and — after the 
fact — the system compares predicted vs. actual outcome to improve 
future recommendations (closed-loop learning).

## Architecture
- **Predictive Model (XGBoost)** — predicts probability/duration of 
  supply chain disruption from historical lead-time data
- **Prescriptive Solver (SciPy)** — linear optimization generating the 
  3 best alternative actions under budget/time/capacity constraints
- **Write-Back Architecture (FastAPI + database)** — lets the user 
  execute a decision, storing it back in the operational data
- **Operational Dashboard (Next.js/React)** — interactive UI showing 
  predictions, prescriptions, trade-offs, and a "Decision ROI" view

## Why This Matters
Moves beyond passive "what will happen" dashboards to active "what 
should we do" decision support — a genuine Operations Research use 
case, distinct from the agentic-AI focus of Project 1.

## Progress Log
### Week 1
- **Day 1**: Repo setup, architecture study, planned data model 
  (predicted delay probability, cost/time trade-offs for 3 alternative 
  actions: air freight, secondary supplier, delayed launch)
- **Day 2**: Scaffolded Next.js dashboard frontend (TypeScript + Tailwind, 
  App Router) with a placeholder for prescription cards. Set up FastAPI 
  backend skeleton with a health-check endpoint, confirmed running 
  locally. Selected PostgreSQL (via Neon, free tier) as the database 
  for the Write-Back Architecture in Week 2, per the project brief's .
- **Day 3**: Generated mock historical supply chain dataset (500 
  shipments with supplier, region, category, lead time, distance, 
  order value, and peak-season flag). Trained a baseline XGBoost 
  classifier to predict shipment delays, evaluated on a held-out 
  test set, and saved the trained model (delay_prediction_model.pkl) 
  for use in Week 2's prescriptive engine.explicit "PostgreSQL or Snowflake" allowance.
- **Day 4**: Built the Prescriptive Solver — generates 3 alternative 
  actions (Air Freight, Secondary Supplier, Delay Launch) with cost, 
  time-saved, and budget-feasibility for a predicted delay, matching 
  the project's use case exactly. Verified the hard budget constraint 
  is never violated (Optimization Audit passed). Built the Prescriptive 
  UI in Next.js — dashboard cards showing each option's cost/speed 
  trade-off with an Execute Decision button.
- **Day 5**: Set up free cloud PostgreSQL (Neon) and created the 
  decisions table. Built FastAPI write-back endpoint (/execute-decision) 
  that performs a real INSERT into the operational database, plus a 
  /decisions endpoint to read them back. Connected the dashboard's 
  Execute Decision buttons to call this API live — verified end to end 
  that clicking a card writes a real row to the cloud database, with a 
  confirmation banner showing the decision ID and timestamp in the UI.
- **Day 6**: Ran a formal Optimization Audit across 5 varied scenarios 
  (including deliberately tight budgets) — confirmed the solver never 
  silently recommends a budget-violating option. Documented in 
  optimization_audit.md. Polished the Prescriptive UI with a "Best 
  Value" indicator (lowest cost per day of delay avoided) and cleaner 
  card styling.  