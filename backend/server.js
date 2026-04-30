require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const recipientRoutes = require('./routes/recipientRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Auto-migration for Recipients table
const db = require('./config/db');
if (db.query) {
    db.query(`
        CREATE TABLE IF NOT EXISTS recipients (
            id SERIAL PRIMARY KEY,
            user_id UUID REFERENCES users(id),
            name TEXT NOT NULL,
            account_number TEXT NOT NULL,
            bank_name TEXT DEFAULT 'Lumina Bank',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_code TEXT;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_expires TIMESTAMP;
    `).then(() => console.log('✅ DB tables & columns checked/updated'))
      .catch(err => console.error('❌ Error checking Recipients table:', err));
}

// Diagnostic route
app.get('/debug-db', async (req, res) => {
    const db = require('./config/db');
    const dbUrl = process.env.DATABASE_URL || 'NOT_FOUND';
    const maskedUrl = dbUrl.replace(/:([^@]+)@/, ':****@');
    
    let testResult = { success: false, error: 'DB instance not initialized' };
    if (db && db.testConnection) {
        testResult = await db.testConnection();
    }
    
    res.json({ 
        maskedUrl, 
        host: dbUrl.split('@')[1] || 'NO_HOST',
        testResult 
    });
});

// Swagger Configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Lumina Bank Online Banking API',
            version: '1.0.0',
            description: 'Professional API for Lumina Bank Banking System',
        },
        servers: [
            {
                url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${PORT}`,
                description: 'API Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Root Endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Lumina Bank API', docs: '/api-docs' });
});

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/transactions', transactionRoutes);
app.use('/admin', adminRoutes);
app.use('/recipients', recipientRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Swagger docs available on http://localhost:${PORT}/api-docs`);
    });
}

module.exports = app;

