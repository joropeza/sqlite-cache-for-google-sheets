import { cloneDeep, map } from 'lodash';

const { GoogleSpreadsheet } = require('google-spreadsheet');

const getSheet = async (docId: string, sheetId: string, apiKey?: string): Promise<Array<any>> => {
  const doc = new GoogleSpreadsheet(docId);
  doc.useApiKey(apiKey);
  await doc.loadInfo();
  const sheet = doc.sheetsById[sheetId];
  const rows = await sheet.getRows();
  return cloneDeep(rows);
};

const getAllEntities = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  apiKey: string, docId: string, sheetId: string, mapFunction: Function, primaryKey: string,
): Promise<Array<Object>> => {
  const data = await getSheet(docId, sheetId, apiKey);
  return map(data, mapFunction);
};

// eslint-disable-next-line import/prefer-default-export
export { getAllEntities };
