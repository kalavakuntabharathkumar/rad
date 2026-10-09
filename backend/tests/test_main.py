from fastapi.testclient import TestClient
from app.main import app
client = TestClient(app)

def test_health():
    assert client.get("/health").json() == {"status": "ok"}

def test_summary_has_three_bands():
    data = client.get("/api/analytics/summary").json()
    assert data["totalApplications"] > 0
    assert len(data["riskBands"]) == 3

def test_preview_validates_and_returns_demo_band():
    response = client.post("/api/risk/preview", json={
        "application_id": "app-1", "annual_income": 80000,
        "monthly_debt": 500, "requested_amount": 10000
    })
    assert response.status_code == 200
    assert response.json()["demoRiskBand"] == "LOW"
