from fastapi import FastAPI

app = FastAPI(title="SupplyPrescript API")

@app.get("/")
def health_check():
    return {"status": "SupplyPrescript backend is running"}