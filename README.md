# 🚀 CryptoPulse — Crypto Data Pipeline

A end-to-end data engineering pipeline that ingests, transforms, and visualises live cryptocurrency data using industry-standard tools.

![Architecture](https://img.shields.io/badge/Stack-Databricks%20%7C%20dbt%20%7C%20GitHub%20Actions%20%7C%20Power%20BI-blue)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-green)
![Status](https://img.shields.io/badge/Status-Live-brightgreen)

---

## 📊 Dashboard Preview

> Live Power BI dashboard tracking the top 10 cryptocurrencies by market cap, price, and 24hr performance.

![CryptoPulse Dashboard](dashboard_screenshot.png)

---

## 🏗️ Architecture

```
CoinGecko API (Free Tier)
        │
        ▼
🐍 Python Notebook (Databricks)
        │  Fetches top 10 coins every run
        ▼
🥉 Bronze Layer — Unity Catalog
   cryptopulse_catalog.bronze.crypto_raw
        │  Raw JSON stored as Delta Table
        ▼
🥈 Silver Layer — dbt Model
   cryptopulse_catalog.dev.silver_crypto_prices
        │  Flattened & typed columns
        ▼
🥇 Gold Layer — dbt Model
   cryptopulse_catalog.dev.gold_crypto_performance
        │  Price rankings, trend indicators
        ▼
📊 Power BI Dashboard
   Auto-refreshes daily via Power BI Service
```

---

## 🛠️ Tech Stack

| Layer | Tool | Purpose |
|---|---|---|
| Ingestion | Python + Databricks | API calls, Delta Table writes |
| Storage | Azure Data Lake Gen2 + Unity Catalog | Cloud storage, governance |
| Transformation | dbt Core | SQL models, data quality tests |
| CI/CD | GitHub Actions | Auto-runs dbt build on every push |
| Visualisation | Power BI | Live dashboard |

---

## 📁 Project Structure

```
cryptopulse/
├── models/
│   ├── silver/
│   │   ├── silver_crypto_prices.sql    ← Flattens raw JSON
│   │   └── schema.yml                  ← dbt tests
│   └── gold/
│       └── gold_crypto_performance.sql ← Rankings & trends
├── .github/
│   └── workflows/
│       └── dbt_ci.yml                  ← GitHub Actions CI/CD
├── dbt_project.yml
└── README.md
```

---

## 🔄 Pipeline Flow

1. **Bronze** — Python notebook calls CoinGecko API and saves raw JSON to Unity Catalog Delta table
2. **Silver** — dbt flattens JSON into typed columns: `coin_id`, `coin_name`, `symbol`, `current_price`, `market_cap`, `total_volume`, `price_change_24h`, `price_change_percentage_24h`
3. **Gold** — dbt calculates performance rankings and adds trend indicators (📈 Gaining / 📉 Losing)
4. **CI/CD** — Every GitHub push triggers `dbt build` automatically via GitHub Actions
5. **Dashboard** — Power BI refreshes daily from the Gold table

---

## ✅ dbt Tests

All models are covered by data quality tests:

- `unique` — no duplicate coin IDs
- `not_null` — price, market cap, and coin ID are always present

```bash
dbt test
# 7 tests, 7 passing ✅
```

---

## 🚀 How to Run Locally

### Prerequisites
- Python 3.11+
- Databricks workspace (Azure)
- dbt-databricks installed

### Setup

```bash
# Clone the repo
git clone https://github.com/georgiman06/cryptopulse.git
cd cryptopulse

# Create virtual environment
python -m venv dbt-env
dbt-env\Scripts\activate  # Windows

# Install dependencies
pip install dbt-databricks

# Configure credentials
# Add your profiles.yml to ~/.dbt/profiles.yml

# Test connection
dbt debug

# Run models
dbt build
```

---

## 🔐 Environment Variables

Never commit credentials. The following secrets are stored in GitHub Secrets:

| Secret | Description |
|---|---|
| `DATABRICKS_HOST` | Databricks workspace URL |
| `DATABRICKS_HTTP_PATH` | SQL Warehouse HTTP path |
| `DATABRICKS_TOKEN` | Personal access token |

---

## 📈 Key Insights from the Dashboard

- **Bitcoin** dominates market cap at over $1.3 trillion
- **Solana** led 24hr gains at +4.36%
- All top 10 coins showed positive momentum on launch day

---

## 🎓 What I Learned

- Building medallion architecture (Bronze → Silver → Gold) on Databricks
- Writing modular SQL with dbt and testing data quality
- Connecting Unity Catalog to Power BI for live dashboards
- Automating deployments with GitHub Actions CI/CD
- Managing Azure cloud storage (ADLS Gen2) and Unity Catalog permissions

---

*Built with ❤️ by Georgi Manianchira*
