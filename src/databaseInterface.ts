import betterSqlLite from 'better-sqlite3';

const Database = require('better-sqlite3');

import { ConfigInterface } from './types';

const sqliteDatatype = (value: any) => {
  if (Number.isInteger(value)) {
    return 'INTEGER';
  }
  if (Number.isFinite(value)) {
    return 'REAL';
  }
  return 'TEXT';
}

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
      columnList += `'${key}' ${sqliteDatatype(data[1][key])},`; // TODO: replace with logic to determine the data type
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

}
