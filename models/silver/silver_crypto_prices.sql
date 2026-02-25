{{ config(materialized='table') }}

WITH raw AS (
    SELECT
        coin_id,
        coin_name,
        ingested_at,
        raw_data
    FROM cryptopulse_catalog.bronze.crypto_raw
),

parsed AS (
    SELECT
        coin_id,
        coin_name,
        ingested_at,
        get_json_object(raw_data, '$.symbol')                        AS symbol,
        CAST(get_json_object(raw_data, '$.current_price') AS DOUBLE) AS current_price,
        CAST(get_json_object(raw_data, '$.market_cap') AS BIGINT)    AS market_cap,
        CAST(get_json_object(raw_data, '$.total_volume') AS BIGINT)  AS total_volume,
        CAST(get_json_object(raw_data, '$.price_change_24h') AS DOUBLE)            AS price_change_24h,
        CAST(get_json_object(raw_data, '$.price_change_percentage_24h') AS DOUBLE) AS price_change_percentage_24h,
        get_json_object(raw_data, '$.last_updated')                  AS last_updated
    FROM raw
)

SELECT * FROM parsed