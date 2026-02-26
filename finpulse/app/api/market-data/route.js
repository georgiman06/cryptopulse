export const runtime = 'edge';

async function queryDatabricks(sql) {
  const response = await fetch(
    `https://${process.env.DATABRICKS_HOST}/api/2.0/sql/statements`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DATABRICKS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        statement: sql,
        warehouse_id: process.env.DATABRICKS_WAREHOUSE_ID,
        wait_timeout: '30s',
      }),
    }
  );
  const data = await response.json();
  if (data.status?.state === 'FAILED') throw new Error(data.status.error?.message);
  const columns = data.manifest?.schema?.columns?.map(c => c.name) || [];
  const rows = data.result?.data_array || [];
  return rows.map(row => {
    const obj = Object.fromEntries(columns.map((col, i) => [col, row[i]]));
    // Convert numeric strings to numbers
    return {
      ...obj,
      current_price: parseFloat(obj.current_price) || 0,
      price_change_percentage_24h: parseFloat(obj.price_change_percentage_24h) || 0,
      price_change_24h: parseFloat(obj.price_change_24h) || 0,
      market_cap: parseFloat(obj.market_cap) || 0,
      total_volume: parseFloat(obj.total_volume) || 0,
    };
  });
}

export async function GET() {
  try {
    const [crypto, stocks] = await Promise.all([
      queryDatabricks(`SELECT * FROM cryptopulse_catalog.dev.silver_crypto_prices`),
      queryDatabricks(`SELECT * FROM cryptopulse_catalog.dev.silver_stocks_prices`),
    ]);
    return Response.json({ crypto, stocks });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}