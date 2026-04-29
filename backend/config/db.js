const { Pool } = require('pg');
require('dotenv').config();

let dbInstance;

if (process.env.DATABASE_URL) {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    dbInstance = {
        query: (text, params) => pool.query(text, params),
        pool
    };
} else {
    console.warn('⚠️ DATABASE_URL NOT FOUND. ACTIVATING IN-MEMORY MOCK MODE.');
    const storage = {
        users: [
            { id: 1, full_name: 'Administrador Lumina Bank', email: 'admin@lumina.com', password: '$2a$10$6yLT4OUbUQruVZHb0nogtus6Q2zVijbdsSDd3pQw5g77xo837ZHe2', role: 'admin', created_at: new Date() },
            { id: 2, full_name: 'Pablo Ramirez', email: 'pablo@test.com', password: '$2a$10$6yLT4OUbUQruVZHb0nogtus6Q2zVijbdsSDd3pQw5g77xo837ZHe2', role: 'user', created_at: new Date() }
        ],
        accounts: [
            { id: 1, user_id: 1, account_number: '7421-9923', balance: 10000000, currency: 'USD', created_at: new Date() },
            { id: 2, user_id: 2, account_number: '9921-4432', balance: 50000, currency: 'USD', created_at: new Date() }
        ],
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
            if (lowerText.startsWith('select t.*')) {
                return { rows: storage.transactions.sort((a,b) => b.created_at - a.created_at) };
            }
            if (lowerText.startsWith('select * from accounts where user_id')) {
                return { rows: storage.accounts.filter(a => a.user_id === parseInt(params[0])) };
            }
            return { rows: [] };
        },
        pool: {
            connect: async () => ({
                query: async (text, params = []) => {
                    const lowerText = text.toLowerCase().trim();
                    if (lowerText.startsWith('begin') || lowerText.startsWith('commit') || lowerText.startsWith('rollback')) return {};
                    if (lowerText.startsWith('select id, balance from accounts where user_id')) {
                        const acc = storage.accounts.find(a => a.user_id === params[0]);
                        return { rows: acc ? [acc] : [] };
                    }
                    if (lowerText.startsWith('select id from accounts where account_number')) {
                        const acc = storage.accounts.find(a => a.account_number === params[0]);
                        return { rows: acc ? [acc] : [] };
                    }
                    if (lowerText.startsWith('update accounts set balance = balance')) {
                        const change = parseFloat(params[0]);
                        const accId = parseInt(params[1]);
                        const acc = storage.accounts.find(a => a.id === accId);
                        if (acc) acc.balance = lowerText.includes('balance +') ? acc.balance + change : acc.balance - change;
                        return { rows: [acc] };
                    }
                    if (lowerText.startsWith('insert into transactions')) {
                        const tx = { id: storage.transactions.length + 1, sender_account_id: params[0], receiver_account_id: params[1], type: params[2], amount: params[3], description: params[4], created_at: new Date() };
                        storage.transactions.push(tx);
                        return { rows: [tx] };
                    }
                    return { rows: [] };
                },
                release: () => {}
            })
        }
    };
}

module.exports = dbInstance;
