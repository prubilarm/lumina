const { Pool } = require('pg');
require('dotenv').config();

let dbInstance;

if (process.env.DATABASE_URL) {
    let rawUrl = process.env.DATABASE_URL.trim();
    
    // Fix para el símbolo # antes de procesar
    if (rawUrl.includes('#')) {
        rawUrl = rawUrl.replace(/#/g, '%23');
    }

    try {
        const url = new URL(rawUrl);
        
        // Extraemos los componentes de forma manual y limpia
        const dbUser = decodeURIComponent(url.username);
        const dbPassword = decodeURIComponent(url.password);
        const dbHost = url.hostname;
        // Forzamos puerto 5432 si es el pooler de Supabase para máxima compatibilidad
        const dbPort = dbHost.includes('pooler.supabase.com') ? 5432 : (url.port || 5432);
        const dbName = url.pathname.split('/')[1] || 'postgres';

        const config = {
            user: dbUser,
            password: dbPassword,
            host: dbHost,
            port: dbPort,
            database: dbName,
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 15000,
        };

        const pool = new Pool(config);
        
        // Self-initializing logic
        const initDb = async () => {
            try {
                await pool.query(`
                    CREATE TABLE IF NOT EXISTS recipients (
                        id SERIAL PRIMARY KEY,
                        user_id UUID REFERENCES users(id),
                        name TEXT NOT NULL,
                        account_number TEXT NOT NULL,
                        bank_name TEXT DEFAULT 'Lumina Bank',
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                `);
                await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_code TEXT;');
                await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_expires TIMESTAMP;');
                await pool.query('ALTER TABLE accounts ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE;');
                console.log('✅ DB initialized successfully');
            } catch (err) {
                console.error('❌ DB Initialization Error:', err.message);
            }
        };
        initDb();

        pool.on('error', (err) => {
            console.error('❌ Database Pool Error:', err.message);
        });

        dbInstance = {
            query: (text, params) => pool.query(text, params),
            pool,
            testConnection: async () => {
                try {
                    const res = await pool.query('SELECT NOW()');
                    return { success: true, serverTime: res.rows[0].now };
                } catch (e) {
                    return { success: false, error: e.message, code: e.code };
                }
            }
        };
        console.log(`✅ DB Configurada: ${dbUser}@${dbHost}:${dbPort}/${dbName}`);
    } catch (e) {
        console.error('⚠️ Error crítico al configurar DB:', e.message);
        // Fallback básico
        const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
        dbInstance = { query: (text, params) => pool.query(text, params), pool };
    }
} else {
    // Mock mode para desarrollo local sin DB
    console.warn('⚠️ DATABASE_URL no encontrada. Iniciando modo Mock.');
    dbInstance = {
        query: async (text, params = []) => ({ rows: [] }),
        pool: { connect: async () => ({ query: async () => ({ rows: [] }), release: () => {} }) }
    };
}

module.exports = dbInstance;
