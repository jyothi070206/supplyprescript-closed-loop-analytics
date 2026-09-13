# SupplyPrescript — Proof & Documentation Index

This file indexes all evidence and documentation produced during 
development, matched against the project brief's requirements.

## Live Links
- **Live Application**: [paste your Vercel URL here]
- **Live Backend API**: https://supplyprescript-api-lk2e.onrender.com
- **API Docs (Swagger)**: https://supplyprescript-api-lk2e.onrender.com/docs
- **GitHub Repository**: [paste your GitHub repo URL here]

## Requirement Coverage

| Requirement (from brief) | Proof Document | Status |
|---|---|---|
| Predictive Baseline (XGBoost) | `ml/train_model.py` | ✅ |
| Mathematical Optimization (SciPy) | `ml/prescriptive_solver.py` | ✅ |
| Optimization Audit | `ml/optimization_audit.md` | ✅ |
| Write-Back Architecture | `backend/main.py` | ✅ |
| Write-Back Check | `backend/write_back_check.md` | ✅ |
| The Closed Loop | `backend/main.py` (/record-outcome, /closed-loop-summary) | ✅ |
| Feedback UI (Decision ROI) | `app/app/page.tsx` | ✅ |
| Continuous Learning | `ml/continuous_learning.py` + `ml/continuous_learning.md` | ✅ |
| Refine & Polish | In-dashboard outcome form + mobile responsiveness | ✅ |
| Live Deployment | Vercel (frontend) + Render (backend) + Neon (database) | ✅ |

## Supporting Documents
- `README.md` — full daily progress log (Days 1–16)
- `mid_review_checklist.md` — Mid-Review readiness
- `system_test_log.md` — full pipeline verification
- `ml/optimization_audit.md` — 5-scenario budget constraint proof
- `ml/continuous_learning.md` — re-training trigger proof
- `backend/write_back_check.md` — database write verification

## Architecture Summary
Predictive Model (XGBoost) → Prescriptive Solver (SciPy) → 
Operational Dashboard (Next.js) → Write-Back (FastAPI + PostgreSQL) → 
Closed Loop (predicted vs. actual) → Continuous Learning (auto 
re-training on discrepancy).