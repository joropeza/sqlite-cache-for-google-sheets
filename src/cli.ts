#!/usr/bin/env node

import { createDatabase } from './main';

require('dotenv').config();

const mapFunction = (row: any) => ({
  name: row.get("Name"),
  tags: row.get("Tags"),
});

const config = {
  serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
  serviceAccountKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/gm, '\n'),
  docId: process.env.DOC_ID || '',
  sheetId: process.env.DAYS_SHEET_ID || '',
  mapFunction,
  primaryKey: 'name',
  databaseTableName: 'names',
  databaseFilename: './cache.db',
  columnsToBreakoutIntoTheirOwnTables: [{ column: 'tags', delimiter: ',', databaseTableName: 'tags' }],
};

(async () => {
  const db = await createDatabase(config);
  const rows = db.prepare('SELECT * FROM names').all();
  console.log(db, rows.length);
})();
