# Write-Back Check — Execute Decision Verification

## Purpose
Verify that clicking "Execute Decision" in the UI successfully performs 
a real INSERT statement into the operational database, closing the loop 
between AI recommendation and human decision.

## Architecture
- **Database**: Neon (cloud PostgreSQL, free tier)
- **API**: FastAPI endpoint `POST /execute-decision`
- **Frontend**: Next.js dashboard — Execute Decision button on each 
  prescription card

## Test Method
1. Started the backend (`uvicorn main:app --reload`) and confirmed 
   health check returns `200 OK`.
2. Sent a manual POST request via FastAPI's Swagger UI (`/docs`) with 
   a sample decision payload — confirmed `200 OK` response with a 
   `decision_id` and `executed_at` timestamp.
3. Queried Neon directly (`SELECT * FROM decisions;`) — confirmed the 
   row was present with correct values.
4. Clicked "Execute Decision" live in the deployed dashboard UI — 
   confirmed a second row was written, with the UI showing a real-time 
   confirmation banner (`Decision #2 recorded at 2026-08-29 16:53:25`).

## Result
Confirmed working end to end: UI click → API call → real INSERT → 
confirmation shown to user. Both automated (Swagger) and manual (UI) 
paths were tested and produced consistent results.

## Evidence
- Manual API test: 200 OK, `decision_id: 1`
- Live UI test: 200 OK, `decision_id: 2`, visible in dashboard banner
- Verified directly in Neon's table browser — 2 rows present matching 
  both tests