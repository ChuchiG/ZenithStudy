import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("zenith.db");

export const initDb = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS errors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      problem TEXT NOT NULL,
      diagnosis TEXT NOT NULL,
      solution TEXT NOT NULL,
      status TEXT DEFAULT "active",
      stage INTEGER DEFAULT 0,
      nextReviewDate TEXT,
      createdAt TEXT
    );
    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      audioUri TEXT,
      nextReviewDate TEXT,
      stage INTEGER DEFAULT 0,
      status TEXT DEFAULT "active",
      createdAt TEXT
    );
    CREATE TABLE IF NOT EXISTS study_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      duration INTEGER,
      type TEXT,
      date TEXT
    );
  `);
};
