const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

// Use body-parser to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set up MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'login_db'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Serve the HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/welcome', (req, res) => {
    res.sendFile(path.join(__dirname, 'welcome.html'));
});

// Handle login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Use a prepared statement to prevent SQL injection
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.execute(query, [username, password], (err, results) => {
        if (err) {
            console.error(err);
            res.send('An error occurred.');
            return;
        }

        if (results.length > 0) {
            // Redirect to welcome page
            res.redirect('/welcome');
        } else {
            res.send('Invalid username or password.');
        }
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
