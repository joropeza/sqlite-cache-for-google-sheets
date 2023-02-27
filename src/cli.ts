#!/usr/bin/env node

import { createDatabase } from './main';

require('dotenv').config();

const mapFunction = (match: any) => ({
  thing: match.id,
  test: 0,
});

const config = {
  apiKey: process.env.SHEETS_API_KEY || '',
  docId: process.env.DOC_ID || '',
  sheetId: process.env.DAYS_SHEET_ID || '',
  mapFunction,
  primaryKey: 'day',
  databaseTableName: 'days',
  databaseFilename: './cache.db',
  // columnsToBreakoutIntoTheirOwnTables:
  // [{ column: 'tags', delimiter: ',', databaseTableName: 'tags' }],
};

(async () => {
  const db = await createDatabase(config);
  console.log(db);
})();
