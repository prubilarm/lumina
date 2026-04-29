const { Pool } = require('pg');
require('dotenv').config();

let dbInstance;

if (process.env.DATABASE_URL) {
    // Limpieza profunda y forzada de caracteres especiales
    let dbUrl = process.env.DATABASE_URL.trim();
    
    // El símbolo # es el principal culpable del error "Invalid URL"
    if (dbUrl.includes('#')) {
        dbUrl = dbUrl.replace(/#/g, '%23');
    }
    
    try {
        // Intentamos extraer los datos de la URL para usarlos en el objeto Pool
        // Formato: postgresql://user:pass@host:port/db
        const url = new URL(dbUrl);
        
        const config = {
            user: decodeURIComponent(url.username),
            password: decodeURIComponent(url.password),
            host: url.hostname,
            port: url.port || 5432,
            database: url.pathname.split('/')[1] || 'postgres',
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 10000,
        };

        const pool = new Pool(config);
        
        // Test connection immediately to catch errors
        pool.on('error', (err) => {
            console.error('❌ Error inesperado en el pool de BD:', err.message);
        });

        dbInstance = {
            query: (text, params) => pool.query(text, params),
            pool,
            testConnection: async () => {
                const client = await pool.connect();
                try {
                    const res = await client.query('SELECT NOW()');
                    return { success: true, time: res.rows[0].now };
                } catch (e) {
                    return { success: false, error: e.message };
                } finally {
                    client.release();
                }
            }
        };
        console.log('✅ Conexión a base de datos configurada.');
    } catch (e) {
        console.warn('⚠️ Error crítico de configuración de BD:', e.message);
        const pool = new Pool({
            connectionString: dbUrl,
            ssl: { rejectUnauthorized: false }
        });
        dbInstance = {
            query: (text, params) => pool.query(text, params),
            pool
        };
    }
} else {
    // ... (Mock mode remains the same)
    console.warn('⚠️ DATABASE_URL NOT FOUND. ACTIVATING IN-MEMORY MOCK MODE.');
    const storage = {
        users: [
            { id: 1, full_name: 'Administrador Lumina Bank', email: 'admin@lumina.com', password: '$2a$10$6yLT4OUbUQruVZHb0nogtus6Q2zVijbdsSDd3pQw5g77xo837ZHe2', role: 'admin', created_at: new Date() }
        ],
        accounts: [],
        transactions: []
    };

    dbInstance = {
        query: async (text, params = []) => {
            const lowerText = text.toLowerCase().trim();
            if (lowerText.startsWith('insert into users')) {
                const user = { id: storage.users.length + 1, full_name: params[0], email: params[1], password: params[2], role: params[3] || 'user', created_at: new Date() };
                storage.users.push(user);
                return { rows: [user] };
            }
            if (lowerText.startsWith('select * from users where email')) {
                const user = storage.users.find(u => u.email === params[0]);
                return { rows: user ? [user] : [] };
            }
            if (lowerText.startsWith('select count(*) from users')) {
                return { rows: [{ count: storage.users.length }] };
            }
            if (lowerText.startsWith('insert into accounts')) {
                const acc = { id: storage.accounts.length + 1, user_id: params[0], account_number: params[1], balance: parseFloat(params[2] || 0), currency: 'USD', created_at: new Date() };
                storage.accounts.push(acc);
                return { rows: [acc] };
            }
            if (lowerText.startsWith('select account_number, balance, currency from accounts where user_id')) {
                return { rows: storage.accounts.filter(a => a.user_id === params[0]) };
            }
            if (lowerText.includes('sum(a.balance)')) {
                return { rows: storage.users.map(u => ({ ...u, balance: storage.accounts.filter(a => a.user_id === u.id).reduce((s, a) => s + parseFloat(a.balance), 0) })) };
            }
            return { rows: [] };
        },
        pool: {
            connect: async () => ({
                query: async () => ({ rows: [] }),
                release: () => {}
            })
        }
    };
}

module.exports = dbInstance;
