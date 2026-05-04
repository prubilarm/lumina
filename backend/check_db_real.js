const { Pool } = require('pg');
require('dotenv').config();

async function checkSchema() {
    let rawUrl = "postgresql://postgres:Makita1234#$.,@db.gyxazovkxkoafugfbnaj.supabase.co:5432/postgres";
    
    const pool = new Pool({
        connectionString: rawUrl.replace(/#/g, '%23').replace(/\$/g, '%24').replace(/,/g, '%2C'),
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('Checking table columns for "users"...');
        const res = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users'
        `);
        console.table(res.rows);
        
        console.log('Checking if user "prubilarmorales@gmail.com" exists...');
        const userRes = await pool.query('SELECT * FROM users WHERE email = $1', ['prubilarmorales@gmail.com']);
        if (userRes.rows.length > 0) {
            console.log('User found:', userRes.rows[0]);
        } else {
            console.log('User NOT found.');
        }

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkSchema();
