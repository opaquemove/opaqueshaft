const { getPostgresClient } = require('postgres.js');

async function hoge() {
  const db = await getPostgresClient();
}

