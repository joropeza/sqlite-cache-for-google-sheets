#!/usr/bin/env node
import { getSheet } from './main'

require('dotenv').config();

const mapFunction = (match: any) => ({
  date: match.Date,
  year: parseInt(match.Date.substring(match.Date.length - 4), 10),
  quality: match.Quality,
  tags: match.Tags, // TODO put this into an array
  summary: match.Summary,
  workout: match.Workout,
  meditation: match.Meditation,
  exuberance: match.Exuberance,
  work: match.Work,
  conversation: match.Conversation,
  annoyance: match.Annoyance,
  insomnia: match.Insomnia,
  health: match.Health,
  weight: match.Weight,
  wine: match.Wine,
  opportunity: match.Opportunity,
  writing: match.Writing,
  hacking: match.Hacking,
  reading: match.Reading,
  participation: match.Participation,
  travel: match.Travel,
})

const config = {
  apiKey: process.env.SHEETS_API_KEY || '',
  docId: process.env.DOC_ID || '',
  sheetId: process.env.DAYS_SHEET_ID || '',
  mapFunction,
  primaryKey: 'date',
  databaseTableName: 'days',
};

(async () => {
  const stuff = await getSheet(config);
  console.log(stuff);
})();

