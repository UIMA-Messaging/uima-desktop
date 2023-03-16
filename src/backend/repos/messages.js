import sqlite3 from 'sqlite3'
import isDev from 'electron-is-dev'

isDev && sqlite3.verbose()

const db = new sqlite3.Database(path.resolve(__dirname, '../../databases/messages.db'))

db.all('SELECT * FROM Messages', (err, rows) => {
  if (err) {
    console.error(err.message)
  } else {
    console.log(rows)
  }
})

db.close()
