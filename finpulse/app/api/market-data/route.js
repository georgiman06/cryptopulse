import { DBSQLClient } from "@databricks/sql";

const client = new DBSQLClient();

async function queryDatabricks(sql) {
  const connection = await client.connect({
    host: process.env.DATABRICKS_HOST,
    path: process.env.DATABRICKS_HTTP_PATH,
    token: process.env.DATABRICKS_TOKEN,
  });

  const session = await connection.openSession();
  const operation = await session.executeStatement(sql);
  const result = await operation.fetchAll();
  await operation.close();
  await session.close();
  await connection.close();
  return result;
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