export type ConfigInterface = {
  apiKey: string,
  docId: string,
  sheetId: string,
  mapFunction: Function,
  primaryKey: string,
  databaseFilename?: string,
  databaseTableName: string,
  databaseNormalizedTableName?: string // optional normalized table
  databaseNormalizedTableColumnsToSkip?: Array<string>,
};