import { cloneDeep, map } from 'lodash';

import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const getSheet = async (docId: string, sheetId: string, authMethod: string | JWT): Promise<Array<any>> => {
  let auth;
  if (typeof authMethod === 'string') {
    auth = { apiKey: authMethod };
  } else {
    auth = authMethod;
  }
  const doc = new GoogleSpreadsheet(docId, auth);
  await doc.loadInfo();
  const sheet = doc.sheetsById[Number(sheetId)]; // Explicitly specify the type of the index expression as 'number'
  const rows = await sheet.getRows();
  return cloneDeep(rows);
};

const getAllEntities = async (
  authMethod: string | JWT, docId: string, sheetId: string, mapFunction: Function, primaryKey: string): Promise<Array<Object>> => {
  const data = await getSheet(docId, sheetId, authMethod);
  return map(data, mapFunction);
};

// eslint-disable-next-line import/prefer-default-export
export { getAllEntities };
