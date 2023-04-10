
# sqlite-cache-for-google-sheets

Google Sheets is a rapid, albeit guardrail-less way of entering data from the browser. Using Google Forms gives it nice guardrails. This library makes hacking on a Sheet or set of Sheets locally quick and easy, loading once and providing a cache layer to issue queries against.

Example use case:

- You have a bunch of data in a Google Sheet
- You want a local development workflow that's fast and doesn't depend on querying Google Sheets at runtime
- Your schema is unresolved or otherwise may change significantly
- You plan to add data to your schema during development

This is one of those highly opinionated libraries that either works for you or it doesn't. It works for my use case which is to rapidly develop apps and data science experiments on top of data that myself or others have stored in Google Sheets. It fails the simple building blocks rule and I know it; it's a complex piece that might be too specialized to one person's uses cases. If you suspect it won't work for your use case, it probably won't.

Await the thing prior to mounting your express app or graphql server or whatever your backend layer is.

Here's a simple example of some consumer code:

```
import express from 'express';

import { createDatabase } from 'sqlite-cache-for-google-sheets';

import { mapFunction } from './mappers';

import {
  typeDefs,
  resolvers,
} from './schema';

const { ApolloServer } = require('apollo-server-express');

require('dotenv').config();

const config = {
  apiKey: process.env.SHEETS_API_KEY || '',
  docId: process.env.DOC_ID || '',
  sheetId: process.env.DAYS_SHEET_ID || '',
  mapFunction,
  primaryKey: 'date',
  databaseFilename: './cache.db',
  databaseTableName: 'days',
};

(async () => {
  await createDatabase(config);

  const PORT = process.env.PORT || 8080;
  const app = express();

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
})();

```

Returns a bettersqlite database object because that seems like the friendliest contract.

These musings should be replaced by more thorough docs at some point.
