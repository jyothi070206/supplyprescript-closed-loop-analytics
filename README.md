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
- - **Day 2**: Scaffolded Next.js dashboard frontend (TypeScript + Tailwind, 
  App Router) with a placeholder for prescription cards. Set up FastAPI 
  backend skeleton with a health-check endpoint, laying groundwork for 
  the Write-Back Architecture planned for Week 2.