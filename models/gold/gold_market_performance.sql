{{ config(materialized='table') }}

WITH crypto AS (
    SELECT
        coin_id       AS symbol,
        coin_name     AS name,
        'crypto'      AS asset_class,
        current_price,
        price_change_percentage_24h,
        market_cap,
        total_volume,
        'N/A'         AS sector,
        ingested_at
    FROM {{ ref('silver_crypto_prices') }}
),

stocks AS (
    SELECT
        symbol,
        name,
        asset_type    AS asset_class,
        current_price,
        price_change_percentage_24h,
        market_cap,
        total_volume,
        sector,
        ingested_at
    FROM {{ ref('silver_stocks_prices') }}
),

combined AS (
    SELECT * FROM crypto
    UNION ALL
    SELECT * FROM stocks
)

SELECT
    symbol,
    name,
    asset_class,
    current_price,
    price_change_percentage_24h,
    market_cap,
    total_volume,
    sector,
    ingested_at,
    RANK() OVER (ORDER BY price_change_percentage_24h DESC) AS performance_rank,
    CASE
        WHEN price_change_percentage_24h > 2  THEN '🚀 Strong Gain'
        WHEN price_change_percentage_24h > 0  THEN '📈 Gaining'
        WHEN price_change_percentage_24h < -2 THEN '💥 Strong Loss'
        WHEN price_change_percentage_24h < 0  THEN '📉 Losing'
        ELSE '➡️ Stable'
    END AS trend
FROM combined