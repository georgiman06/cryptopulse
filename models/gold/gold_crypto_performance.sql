{{ config(materialized='table') }}

WITH silver AS (
    SELECT * FROM {{ ref('silver_crypto_prices') }}
),

ranked AS (
    SELECT
        coin_id,
        coin_name,
        symbol,
        current_price,
        market_cap,
        total_volume,
        price_change_24h,
        price_change_percentage_24h,
        last_updated,
        RANK() OVER (ORDER BY price_change_percentage_24h DESC) AS performance_rank,
        CASE 
            WHEN price_change_percentage_24h > 0 THEN '📈 Gaining'
            WHEN price_change_percentage_24h < 0 THEN '📉 Losing'
            ELSE '➡️ Stable'
        END AS trend
    FROM silver
)

SELECT * FROM ranked