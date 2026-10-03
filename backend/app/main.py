from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import Literal

app = FastAPI(title="Credit Risk Analytics API", version="1.0.0",
              description="Synthetic portfolio analytics demo. Not for lending decisions.")

class ApplicationRecord(BaseModel):
    application_id: str
    annual_income: float = Field(gt=0)
    monthly_debt: float = Field(ge=0)
    requested_amount: float = Field(gt=0)

def risk_band(record: ApplicationRecord) -> Literal["LOW", "MEDIUM", "HIGH"]:
    debt_ratio = (record.monthly_debt * 12) / record.annual_income
    if debt_ratio < 0.20 and record.requested_amount <= record.annual_income * 0.20:
        return "LOW"
    if debt_ratio < 0.40 and record.requested_amount <= record.annual_income * 0.35:
        return "MEDIUM"
    return "HIGH"

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/api/analytics/summary")
def summary():
    return {
        "totalApplications": 40000000,
        "processedToday": 124800,
        "accuracy": 0.999,
        "batchDurationMinutes": 52,
        "riskBands": [
            {"band": "LOW", "count": 18400000},
            {"band": "MEDIUM", "count": 13200000},
            {"band": "HIGH", "count": 8400000},
        ],
    }

@app.post("/api/risk/preview")
def preview(record: ApplicationRecord):
    ratio = (record.monthly_debt * 12) / record.annual_income
    return {
        "applicationId": record.application_id,
        "demoRiskBand": risk_band(record),
        "annualDebtToIncomeRatio": round(ratio, 4),
        "notice": "Synthetic demonstration only; not a credit decision."
    }
