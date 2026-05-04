const { Pool } = require('pg');

async function testPooler() {
    const password = 'Makita1234#$.,';
    const hosts = [
        'aws-0-us-east-1.pooler.supabase.com',
        'aws-0-sa-east-1.pooler.supabase.com', // Chile/South America
        'aws-0-us-west-1.pooler.supabase.com'
    ];
    const user = 'postgres.gyxazovkxkoafugfbnaj';
    
    for (const host of hosts) {
        console.log(`Testing connection to ${host}...`);
        const pool = new Pool({
            user: user,
            password: password,
            host: host,
            port: 5432,
            database: 'postgres',
            ssl: { rejectUnauthorized: false }
        });

        try {
            const res = await pool.query('SELECT NOW()');
            console.log(`✅ SUCCESS on ${host}!`, res.rows[0]);
            break;
        } catch (err) {
            console.error(`❌ FAILED on ${host}:`, err.message);
        } finally {
            await pool.end();
        }
    }
}

testPooler();
