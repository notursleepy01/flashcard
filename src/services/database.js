// src/services/database.js
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('flashcards.db');

// --- DATABASE INITIALIZATION ---
export const initDB = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS decks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          createdAt TEXT NOT NULL
        );`,
        [],
        () => {},
        (_, err) => { console.log('Failed to create decks table'); reject(err); return false; }
      );
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS cards (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          deckId INTEGER NOT NULL,
          front TEXT NOT NULL,
          back TEXT NOT NULL,
          FOREIGN KEY (deckId) REFERENCES decks (id) ON DELETE CASCADE
        );`,
        [],
        () => {},
        (_, err) => { console.log('Failed to create cards table'); reject(err); return false; }
      );
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS study_sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          deckId INTEGER NOT NULL,
          sessionDate TEXT NOT NULL,
          score REAL NOT NULL,
          FOREIGN KEY (deckId) REFERENCES decks (id) ON DELETE CASCADE
        );`,
        [],
        () => resolve(),
        (_, err) => { console.log('Failed to create sessions table'); reject(err); return false; }
      );
    });
  });
  return promise;
};

// --- DECK OPERATIONS ---
export const addDeck = (title) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO decks (title, createdAt) VALUES (?, ?);',
        [title, new Date().toISOString()],
        (_, result) => resolve(result),
        (_, err) => { reject(err); return false; }
      );
    });
  });
};

export const getDecks = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT d.*, COUNT(c.id) as cardCount
         FROM decks d
         LEFT JOIN cards c ON d.id = c.deckId
         GROUP BY d.id
         ORDER BY d.createdAt DESC;`,
        [],
        (_, result) => resolve(result.rows._array),
        (_, err) => { reject(err); return false; }
      );
    });
  });
};

export const deleteDeck = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM decks WHERE id = ?;',
        [id],
        (_, result) => resolve(result),
        (_, err) => { reject(err); return false; }
      );
    });
  });
};

// --- CARD OPERATIONS ---
export const addCardToDeck = (deckId, front, back) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO cards (deckId, front, back) VALUES (?, ?, ?);',
        [deckId, front, back],
        (_, result) => resolve(result),
        (_, err) => { reject(err); return false; }
      );
    });
  });
};

export const getCardsForDeck = (deckId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM cards WHERE deckId = ?;',
        [deckId],
        (_, result) => resolve(result.rows._array),
        (_, err) => { reject(err); return false; }
      );
    });
  });
};

// --- STATS OPERATIONS ---
export const logStudySession = (deckId, score) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO study_sessions (deckId, sessionDate, score) VALUES (?, ?, ?);',
        [deckId, new Date().toISOString(), score],
        (_, result) => resolve(result),
        (_, err) => { reject(err); return false; }
      );
    });
  });
};

export const getDeckStats = (deckId) => {
  const historyPromise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM study_sessions WHERE deckId = ? ORDER BY sessionDate DESC;',
        [deckId],
        (_, result) => resolve(result.rows._array),
        (_, err) => { reject(err); return false; }
      );
    });
  });

  const accuracyPromise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT AVG(score) as averageAccuracy FROM study_sessions WHERE deckId = ?;',
        [deckId],
        (_, result) => resolve(result.rows._array[0]?.averageAccuracy || 0),
        (_, err) => { reject(err); return false; }
      );
    });
  });

  return Promise.all([historyPromise, accuracyPromise]);
};
