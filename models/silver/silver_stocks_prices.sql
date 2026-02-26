{{ config(materialized='table') }}

WITH raw AS (
    SELECT
        symbol,
        asset_type,
        name,
        current_price,
        price_change_24h,
        price_change_percentage_24h,
        market_cap,
        total_volume,
        sector,
        industry,
        fifty_two_week_high,
        fifty_two_week_low,
        ingested_at,
        ROW_NUMBER() OVER (
            PARTITION BY symbol 
            ORDER BY ingested_at DESC
        ) AS rn
    FROM cryptopulse_catalog.bronze.stocks_raw
)

SELECT
    symbol,
    asset_type,
    name,
    current_price,
    price_change_24h,
    price_change_percentage_24h,
    market_cap,
    total_volume,
    sector,
    industry,
    fifty_two_week_high,
    fifty_two_week_low,
    ingested_at
FROM raw
WHERE rn = 1