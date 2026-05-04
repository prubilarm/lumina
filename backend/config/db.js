const { Pool } = require('pg');
require('dotenv').config();

let dbInstance;

if (process.env.DATABASE_URL) {
    let rawUrl = process.env.DATABASE_URL.trim();
    
    // Si la URL es de Supabase y contiene caracteres especiales, la procesamos con cuidado
    let config;
    try {
        // Intentamos un regex más flexible
        // Soporta postgres:// y postgresql://
        const urlMatch = rawUrl.match(/^(?:postgres|postgresql):\/\/([^:]+):(.+)@([^:/@]+):(\d+)\/(.+)$/);
        
        if (urlMatch) {
            const [_, user, password, host, port, database] = urlMatch;
            config = {
                user: decodeURIComponent(user),
                password: decodeURIComponent(password),
                host: host,
                port: parseInt(port),
                database: database,
                ssl: { rejectUnauthorized: false },
                connectionTimeoutMillis: 15000,
            };
        } else {
            // Fallback a URL parser con escape de caracteres especiales (#, $, ,)
            let processedUrl = rawUrl
                .replace(/#/g, '%23')
                .replace(/\$/g, '%24')
                .replace(/,/g, '%2C');
                
            const url = new URL(processedUrl);
            config = {
                user: decodeURIComponent(url.username),
                password: decodeURIComponent(url.password),
                host: url.hostname,
                port: url.host.includes('pooler.supabase.com') ? 5432 : (url.port || 5432),
                database: url.pathname.split('/')[1] || 'postgres',
                ssl: { rejectUnauthorized: false },
                connectionTimeoutMillis: 15000,
            };
        }


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
        console.log(`✅ DB Configurada: ${config.user}@${config.host}:${config.port}/${config.database}`);
    } catch (e) {
        console.error('⚠️ Error crítico al configurar DB:', e.message);
        // Fallback básico
        const pool = new Pool({ connectionString: rawUrl.replace(/#/g, '%23'), ssl: { rejectUnauthorized: false } });
        dbInstance = { 
            query: (text, params) => pool.query(text, params), 
            pool,
            testConnection: async () => {
                try {
                    const res = await pool.query('SELECT NOW()');
                    return { success: true, serverTime: res.rows[0].now };
                } catch (e) {
                    return { success: false, error: e.message };
                }
            }
        };
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
