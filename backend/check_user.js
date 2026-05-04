const { Pool } = require('pg');

async function checkUser() {
    const config = {
        user: 'postgres',
        password: 'Makita1234#$.,',
        host: 'db.gyxazovkxkoafugfbnaj.supabase.co',
        port: 5432,
        database: 'postgres',
        ssl: { rejectUnauthorized: false },
    };

    const pool = new Pool(config);

    try {
        const email = 'prubilarmorales@gmail.com';
        console.log(`Checking for user: ${email}`);
        const res = await pool.query('SELECT id, full_name, email FROM users WHERE email = $1', [email]);
        
        if (res.rows.length > 0) {
            console.log('User found:', res.rows[0]);
        } else {
            console.log('User NOT found in database.');
        }
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkUser();
