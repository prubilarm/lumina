const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function update() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootpassword',
    database: 'atm_db',
    port: 3307 // El puerto que asignamos antes
  });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('123456', salt);

  await connection.execute(
    'UPDATE users SET password_hash = ? WHERE email = ?',
    [hashedPassword, 'juan@example.com']
  );

  console.log('Contraseña actualizada con éxito para juan@example.com');
  await connection.end();
}

update().catch(console.error);
