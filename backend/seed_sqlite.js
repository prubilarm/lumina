const pool = require('./config/db');
const bcrypt = require('bcrypt');

const seed = async () => {
  try {
    console.log('Seeding SQLite database...');
    
    const { rows: userExists } = await pool.query('SELECT * FROM users WHERE email = $1', ['juan@example.com']);
    
    if (userExists.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      const { rows: result } = await pool.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)',
        ['Juan Perez', 'juan@example.com', hashedPassword]
      );
      
      const userId = result[0].id;
      
      await pool.query(
        'INSERT INTO accounts (user_id, account_number, balance) VALUES ($1, $2, $3)',
        [userId, '1000000001', 5000.00]
      );

      // Create Maria for transfers
      const { rows: result2 } = await pool.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)',
        ['Maria Gomez', 'maria@example.com', hashedPassword]
      );
      
      await pool.query(
        'INSERT INTO accounts (user_id, account_number, balance) VALUES ($1, $2, $3)',
        [result2[0].id, '1000000002', 2500.00]
      );
      
      console.log('Database seeded with default users: juan@example.com / maria@example.com (password123)');
    } else {
      console.log('Users already exist.');
    }
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
