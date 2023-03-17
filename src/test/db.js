const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')
const path = require('path')

const dbDir = path.resolve(__dirname, '../databases')
const dbPath = path.resolve(dbDir, 'main.db')

fs.mkdir(dbDir, { recursive: true }, () => {})
fs.access(dbPath, fs.constants.F_OK, function (err) {
  if (err) {
    console.log('Database file does not exist. Creating one...')
    fs.writeFile(dbPath, '', () => {})
  }
})

const db = new sqlite3.Database(dbPath)

async function execute(sql, obj) {
  const entity = objToEntity(sql, obj)
  return new Promise((resolve, reject) => {
    db.run(sql, entity, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

async function query(sql, obj) {
  const entity = objToEntity(sql, obj)
  return new Promise((resolve, reject) => {
    db.all(sql, entity, (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

function objToEntity(sql, obj) {
  const entity = {}
  if (obj) {
    const columns = sql.match(/\$\w+/g)
    Object.keys(obj).forEach((key) => {
      const renamed = '$' + key
      if (columns.includes(renamed)) {
        entity[renamed] = obj[key]
      }
    })
  }
  return entity
}

async function run() {
  await execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)')
  const user = { id: 1, name: 'Alice', email: 'alice@example.com', a: 'avc' }
  await execute('INSERT INTO users (id, name, email) VALUES ($id, $name, $email)', user)
  const result = await query('SELECT name FROM users')
  console.log('query', result)
  const filter = await query('SELECT * FROM users WHERE id = $id', { id: 01 })
  console.log('filter', filter)
}

run()
