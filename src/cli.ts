#!/usr/bin/env node

import { createDatabase } from './main';

require('dotenv').config();

const mapFunction = (match: any) => ({
  fdcId: match.fdc_id,
  nutrientId: match.nutrient_id,
  amount: match.amount && parseFloat(match.amount),
  derivationId: match.derivation_id,
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
