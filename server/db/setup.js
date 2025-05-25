const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const config = {
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'ecommerce_db',
    multipleStatements: true
};

const connection = mysql.createConnection(config);

// Read and execute SQL files
function executeSQLFile(filepath) {
    const sql = fs.readFileSync(filepath, 'utf8');
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
}

async function setupDatabase() {
    try {
        console.log('Setting up database...');

        // Create tables
        console.log('Creating tables...');
        await executeSQLFile(path.join(__dirname, 'migrations/create_products_tables.sql'));
        console.log('Tables created successfully!');

        // Insert sample data
        console.log('Inserting sample data...');
        await executeSQLFile(path.join(__dirname, 'seeds/sample_products.sql'));
        console.log('Sample data inserted successfully!');

        console.log('Database setup complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error setting up database:', error);
        process.exit(1);
    }
}

// Run setup
setupDatabase();
