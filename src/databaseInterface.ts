/* eslint-disable no-plusplus */
import betterSqlLite from 'better-sqlite3';

import { BreakoutColumn, ConfigInterface } from './types';

const Database = require('better-sqlite3');

interface CreateNormalizedTableConfig {
  databaseNormalizedTableName?: string | undefined,
  databaseNormalizedTableColumnsToSkip?: Array<string>,
  primaryKey: string | undefined,
  columnsToBreakoutIntoTheirOwnTables?: Array<BreakoutColumn>
  data: Array<any>
}

function isNumeric(str: any) {
  if (typeof str !== 'string') return false;
  return !Number.isNaN(str)
    && !Number.isNaN(parseFloat(str));
}

function isPositiveInteger(n: any) {
  // eslint-disable-next-line no-bitwise
  return n >>> 0 === parseFloat(n);
}

const sqliteDatatype = (value: any) => {
  if (!value) { return value; }
  if (Number.isInteger(value) || isPositiveInteger(value)) {
    return 'INTEGER';
  }
  if (Number.isFinite(value) || isNumeric(value)) {
    return 'REAL';
  }
  return 'TEXT';
};

interface IHash {
  [field: string]: string;
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
    const columnTypes = {} as IHash;

    data.forEach((dataPoint: any) => {
      Object.keys(data[0]).forEach((key) => {
        const dataType = sqliteDatatype(dataPoint[key]);
        // if any of the datapoints is text, make the whole column text
        if (dataType === 'TEXT') {
          columnTypes[key] = 'TEXT';
        }
        // if any of the datapoints is float, and the type is not text, make it a real
        if (dataType === 'REAL') {
          if (columnTypes[key] !== 'TEXT') {
            columnTypes[key] = 'REAL';
          }
        }
        if (dataType === 'INTEGER') {
          if (!columnTypes[key]) {
            columnTypes[key] = 'INTEGER';
          }
        }
      });
    });

    Object.keys(data[0]).forEach((key) => {
      columnList += `'${key}' ${columnTypes[key] || 'TEXT'},`; // TODO: primary key
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

  createColumnBreakoutTables(config: CreateNormalizedTableConfig) {
    if (config.columnsToBreakoutIntoTheirOwnTables
      && config.columnsToBreakoutIntoTheirOwnTables.length > 0) {
      const { columnsToBreakoutIntoTheirOwnTables, data, primaryKey } = config;
      if (!primaryKey) { throw new Error('Breakout columns require using a primary key'); }

      for (let i = 0; i < columnsToBreakoutIntoTheirOwnTables.length; i++) {
        const { column, delimiter, databaseTableName } = columnsToBreakoutIntoTheirOwnTables[i];

        // create the table
        this.db.exec(`DROP TABLE IF EXISTS ${databaseTableName}; CREATE TABLE ${databaseTableName} ('${primaryKey}', 'value');`);

        data.forEach((datapoint) => {
          const theColumnWithData = datapoint[column] as string;
          console.log(datapoint, column, datapoint[column]);
          if (theColumnWithData) {
            const theCollectionOfData = theColumnWithData.split(delimiter);
            theCollectionOfData.forEach((item) => {
              this.db.exec(`INSERT INTO ${databaseTableName} ('${primaryKey}', 'value') VALUES ('${datapoint[primaryKey]}', '${item.trim()}')`);
            });
          }
        });
      }
    }
  }

  createNormalizedTable(config: CreateNormalizedTableConfig) {
    const {
      databaseNormalizedTableName, databaseNormalizedTableColumnsToSkip, primaryKey, data,
    } = config;
    if (!databaseNormalizedTableName || !primaryKey) {
      return;
    }

    // create the table
    const columnList = `${primaryKey} ${sqliteDatatype(data[1][primaryKey])}, field TEXT, value TEXT`;

    this.db.exec(`DROP TABLE IF EXISTS ${databaseNormalizedTableName}; CREATE TABLE ${databaseNormalizedTableName} (${columnList});`);

    // iterate through every row in the table, creating a new entry for each column

    data.forEach((datapoint) => {
      Object.keys(datapoint).forEach((key) => {
        if (datapoint[key]) {
          if (key !== primaryKey
            && (
              !databaseNormalizedTableColumnsToSkip || !databaseNormalizedTableColumnsToSkip.find(
                (c) => c === key,
              ))) {
            console.log(datapoint[primaryKey], key, datapoint[key]);
            this.db.exec(`INSERT INTO ${databaseNormalizedTableName} (${primaryKey}, field, value) VALUES ('${datapoint[primaryKey]}', '${key}', '${datapoint[key].replace(/'/g, "''")}')`);
          }
        }
      });
    });
  }
}
