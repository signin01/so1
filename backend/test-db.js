const { pool } = require('./src/config/database');

async function test() {
    try {
        const [rows] = await pool.promise().query('SELECT 1');
        console.log('✅ Database connected!');
        console.log('Result:', rows);
        process.exit(0);
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
}

test();
