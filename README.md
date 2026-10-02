# Credit Risk Analytics and Accessible Reporting Dashboard

Portfolio starter combining a FastAPI analytics API, PySpark batch pipeline, Angular 17 dashboard, test scaffolding, and deployment recipes.

## What works locally
- FastAPI API exposes sample portfolio metrics and a `/health` endpoint.
- PySpark job reads CSV input, cleans records, computes risk bands, and writes Parquet output.
- Angular 17 UI displays summary cards and a risk-band table with accessible labels, keyboard-friendly controls, and responsive Bootstrap styling.
- Docker Compose runs the API and SQL Server container. The batch pipeline can run locally with Python/PySpark.

## Start the API
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Open `http://127.0.0.1:8000/docs`.

## Run the batch job
```bash
cd pipeline
pip install -r requirements.txt
python risk_pipeline.py --input sample_data/applications.csv --output output/risk_features
```
PySpark writes Parquet output. For a Hadoop cluster, configure `HADOOP_CONF_DIR` and change the output to an HDFS URI such as `hdfs:///warehouse/credit/risk_features`.

## Angular UI
Requires Node.js 20.19+ or 22.12+ and npm.
```bash
cd frontend
npm install
npm start
```
Dashboard dev server uses Angular CLI. The API base URL is configured in `src/environments/environment.ts`.

## Data adapters
The architecture README includes extension notes for HDFS, Cassandra, SQL Server, GCP, GoCD, Chef and RPM packaging. The included demo uses local sample data by default. Credentials and cloud resources are intentionally not hard-coded.

## Important
This is synthetic portfolio data and a demo risk segmentation tool, not a lending decision engine. Validate privacy, fairness, model governance, accessibility, and regulatory requirements before real use.
