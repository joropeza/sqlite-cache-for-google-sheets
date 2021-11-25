import betterSqlLite from 'better-sqlite3';

const Database = require('better-sqlite3');

import { ConfigInterface } from './types';

interface CreateNormalizedTableConfig {
  databaseNormalizedTableName?: string | undefined,
  databaseNormalizedTableColumnsToSkip?: Array<string>,
  primaryKey: string | undefined,
  data: Array<any>
}

const sqliteDatatype = (value: any) => {
  if (Number.isInteger(value)) {
    return 'INTEGER';
  }
  if (Number.isFinite(value)) {
    return 'REAL';
  }
  return 'TEXT';
};

export default class DatabaseInterface {
  db: betterSqlLite.Database;

  tableName: string;

  primaryKey: string;

  constructor(config: ConfigInterface) {
    const db = new Database(config.databaseFilename || ':memory:', { verbose: console.log });
    this.tableName = config.databaseTableName;
    this.primaryKey = config.primaryKey;
    this.db = db;
  }

  createTable(data: Array<any>) {
    let columnList = '';
    Object.keys(data[0]).forEach((key) => {
      columnList += `'${key}' ${sqliteDatatype(data[1][key])},`; // TODO: primary key
    });
    // remove trailing commas
    columnList = columnList.substring(0, columnList.length - 1);

    this.db.exec(`DROP TABLE IF EXISTS ${this.tableName}; CREATE TABLE ${this.tableName} (${columnList});`);
  }

  seed(data: Array<Object>) {
    let propertyList = '';
    let columnList = '';
    Object.keys(data[0]).forEach((key) => {
      propertyList += `@${key},`;
      columnList += `${key},`;
    });
    // remove trailing commas
    propertyList = propertyList.substring(0, propertyList.length - 1);
    columnList = columnList.substring(0, columnList.length - 1);

    const insert = this.db.prepare(`INSERT INTO ${this.tableName} (${columnList}) VALUES (${propertyList})`);
    data.forEach((dataPoint: any) => {
      if (dataPoint[this.primaryKey]) {
        insert.run(dataPoint);
      }
    });
  }

  createNormalizedTable(config: CreateNormalizedTableConfig) {
    const { databaseNormalizedTableName, databaseNormalizedTableColumnsToSkip, primaryKey, data } = config;
    if (!databaseNormalizedTableName || !primaryKey) {
      return;
    }

    // create the table
    const columnList = `${primaryKey} ${sqliteDatatype(data[1][primaryKey])}, field TEXT, value TEXT`;

    this.db.exec(`DROP TABLE IF EXISTS ${databaseNormalizedTableName}; CREATE TABLE ${databaseNormalizedTableName} (${columnList});`);

    // iterate through every row in the table, creating a new entry for each column

    data.forEach(datapoint => {
      Object.keys(datapoint).forEach((key) => {
        if (datapoint[key]) {
          if (key !== primaryKey && (!databaseNormalizedTableColumnsToSkip || !databaseNormalizedTableColumnsToSkip.find(c => c === key))) {
            console.log(datapoint[primaryKey], key, datapoint[key]);
            this.db.exec(`INSERT INTO ${databaseNormalizedTableName} (${primaryKey}, field, value) VALUES ('${datapoint[primaryKey]}', '${key}', '${datapoint[key].replace(/'/g, "''")}')`);
          }
        }
      });
    });
  }

}
