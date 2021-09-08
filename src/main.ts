import { getAllEntities } from './sheets';
import DatabaseInterface from './databaseInterface';
import { ConfigInterface } from './types';

export const getSheet = async (config: ConfigInterface): Promise<boolean> => {
  const { apiKey, docId, sheetId, mapFunction, primaryKey } = config;
  const data = await getAllEntities(apiKey, docId, sheetId, mapFunction, primaryKey);
  const databaseInterface = new DatabaseInterface(config);
  await databaseInterface.createTable(data);
  await databaseInterface.seed(data);
  return true;
}
