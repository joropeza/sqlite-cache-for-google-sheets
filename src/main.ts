import { getAllEntities } from './sheets';
type ConfigInterface = {
  apiKey: string,
  docId: string,
  sheetId: string,
  mapFunction: Function,
  primaryKey: string,
}

export const getSheet = async (config: ConfigInterface): Promise<Array<Object>> => {
  const { apiKey, docId, sheetId, mapFunction, primaryKey } = config;
  return await getAllEntities(apiKey, docId, sheetId, mapFunction, primaryKey);
}
