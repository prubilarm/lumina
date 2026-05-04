const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.all("SELECT * FROM users WHERE email = ?", ['prubilarmorales@gmail.com'], (err, rows) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Rows found in SQLite:', rows);
    }
    db.close();
});
