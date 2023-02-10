#!/usr/bin/env node

import { createDatabase } from './main';

require('dotenv').config();

const mapFunction = (match: any) => ({
  date: match.Date,
  tags: match.Tags,
});

const config = {
  apiKey: process.env.SHEETS_API_KEY || '',
  docId: process.env.DOC_ID || '',
  sheetId: process.env.DAYS_SHEET_ID || '',
  mapFunction,
  primaryKey: 'date',
  databaseTableName: 'days',
  databaseFilename: './cache.db',
  columnsToBreakoutIntoTheirOwnTables: [{ column: 'tags', delimiter: ',', databaseTableName: 'tags' }],
};

(async () => {
  const db = await createDatabase(config);
  console.log(db);
})();
