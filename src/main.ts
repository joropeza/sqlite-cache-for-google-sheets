/* eslint-disable import/prefer-default-export */
import betterSqlLite from 'better-sqlite3';

import { getAllEntities } from './sheets';
import DatabaseInterface from './databaseInterface';
import { ConfigInterface } from './types';

export const createDatabase = async (config: ConfigInterface): Promise<betterSqlLite.Database> => {
  const {
    apiKey, docId, sheetId, mapFunction, primaryKey,
  } = config;
  const data = await getAllEntities(apiKey, docId, sheetId, mapFunction, primaryKey);
  const databaseInterface = new DatabaseInterface(config);
  await databaseInterface.createTable(data);
  await databaseInterface.seed(data);
  await databaseInterface.createNormalizedTable({ data, ...config });
  await databaseInterface.createColumnBreakoutTables({ data, ...config });
  return databaseInterface.db;
};
