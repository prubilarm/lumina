const { Pool } = require('pg');

async function testPooler() {
    const password = 'Makita1234#$.,';
    const host = 'aws-0-us-east-1.pooler.supabase.com';
    const user = 'postgres.gyxazovkxkoafugfbnaj';
    const database = 'postgres';
    
    console.log(`Testing connection to ${host}...`);
    
    const pool = new Pool({
        user: user,
        password: password,
        host: host,
        port: 5432,
        database: database,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const res = await pool.query('SELECT NOW()');
        console.log('✅ Connection successful!', res.rows[0]);
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
    } finally {
        await pool.end();
    }
}

testPooler();
