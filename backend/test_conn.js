const { Pool } = require('pg');
require('dotenv').config();

async function checkUser() {
    const rawUrl = process.env.DATABASE_URL;
    console.log('Testing raw URL connection...');
    
    // Attempt 1: Raw
    const pool1 = new Pool({ connectionString: rawUrl, ssl: { rejectUnauthorized: false } });
    try {
        await pool1.query('SELECT NOW()');
        console.log('✅ Connection 1 (Raw) successful!');
    } catch (err) {
        console.log('❌ Connection 1 (Raw) failed:', err.message);
    } finally {
        await pool1.end();
    }

    // Attempt 2: Escaped #
    const escapedUrl = rawUrl.replace(/#/g, '%23');
    const pool2 = new Pool({ connectionString: escapedUrl, ssl: { rejectUnauthorized: false } });
    try {
        await pool2.query('SELECT NOW()');
        console.log('✅ Connection 2 (Escaped #) successful!');
    } catch (err) {
        console.log('❌ Connection 2 (Escaped #) failed:', err.message);
    } finally {
        await pool2.end();
    }
}

checkUser();
