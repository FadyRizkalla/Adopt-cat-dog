const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const session = require('express-session');  // Add this line
const path = require('path');
const 
const app = express();

// Middleware to parse JSON body
app.use(express.json());

// Middleware to parse URL-encoded body (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Set view engine to EJS
app.set('view engine', 'ejs');

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Setup express-session middleware
app.use(session({
    secret: 'your-secret-key',  // Replace with a secure secret key
    resave: false,
    saveUninitialized: true,
}));

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session && req.session.username) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// Routes to render different pages
app.get('/', (req, res) => {
    res.render("home"); // Home page
});

app.get('/browse', (req, res) => {
    res.render("browse"); // Browse Available Pets page
});

app.get('/cat-care', (req, res) => {
    res.render("cat-care"); // Cat Care page
});

app.get('/dog-care', (req, res) => {
    res.render("dog-care"); // Dog Care page
});

app.get('/find', (req, res) => {
    res.render("find"); // Find a Pet page
});

app.get('/give-away', isAuthenticated, (req, res) => { // Add isAuthenticated middleware
    res.render("give-away"); // Have a Pet to Give Away page
});

app.get('/contact', (req, res) => {
    res.render("contact"); // Contact Us page
});

app.get('/create-account', (req, res) => {
    res.render("create-account"); // Create Account page
});

// Login routes
app.get('/login', (req, res) => {
    res.render('login', { errorMessage: '' });
});
// Handle form submission for account creation
app.post('/create-account', (req, res) => {
    const { username, password } = req.body;

    // Check if username or password is empty
    if (!username || !password) {
        return res.render('create-account', { errorMessage: 'Username and password are required.' });
    }

    // Check if username already exists
    fs.readFile(loginFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.render('create-account', { errorMessage: 'Error reading the login file.' });
        }

        const users = data.split('\n').map(line => line.split(':'));
        const userExists = users.some(u => u[0] === username);

        if (userExists) {
            return res.render('create-account', { errorMessage: 'Username already exists. Please choose another one.' });
        }

        // Append new user to login.txt file
        fs.appendFile(loginFilePath, `${username}:${password}\n`, (err) => {
            if (err) {
                return res.render('create-account', { errorMessage: 'Error saving the account.' });
            }

            // Redirect to login page after successful account creation
            res.redirect('/login');
        });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    fs.readFile('login.txt', 'utf8', (err, data) => {
        if (err) {
            res.render('login', { errorMessage: 'Error reading the login file.' });
        } else {
            const users = data.split('\n').map(line => line.split(':'));
            const user = users.find(u => u[0] === username && u[1] === password);
            if (user) {
                req.session.username = username;  // Save username in session
                res.redirect('/give-away');  // Redirect to Give Away page
            } else {
                res.render('login', { errorMessage: 'Invalid username or password.' });
            }
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
