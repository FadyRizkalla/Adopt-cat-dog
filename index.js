const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const session = require('express-session');  // Add this line
const path = require('path');
const app = express();
const loginFilePath='login.txt'
const petFilePath = path.join(__dirname, 'pets.txt');
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

const getNextPetId = () => {
    const data = fs.readFileSync(petFilePath, 'utf8');
    const lines = data.split('\n').filter(line => line.trim() !== '');
    return lines.length + 1;
};
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
    // if () {
    //     return res.render('create-account', { errorMessage: 'Username and password are required.' });
    // }
    

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

app.post('/addpet', (req, res) => {
    // Retrieve the form data from the request body
    console.log(req.body)
    const { animal, breed, age, gender, getsAlongDogs, getsAlongCats, suitableForChildren, comment, ownerEmail } = req.body;

    // Get the next pet ID
    const petId = getNextPetId();

    // Get the current signed-in user's username from the session
    const ownerName = req.session.username;

    // Prepare the pet entry as a single line string with colon-separated values
    const petEntry = `${petId}:${ownerName}:${animal}:${breed}:${age}:${gender}:${getsAlongDogs ? 'yes' : 'no'}:${getsAlongCats ? 'yes' : 'no'}:${suitableForChildren ? 'yes' : 'no'}:${comment}:${ownerEmail}\n`;

    // Append the pet entry to the pets.txt file
    fs.appendFile(petFilePath, petEntry, (err) => {
        if (err) {
            console.error('Error writing to the file:', err);
            return res.status(500).send('An error occurred while saving the pet information.');
        }

        // Redirect to a confirmation page or send a success response
        res.send('Pet information added successfully!');
    });
});

app.get('/search-pets', (req, res) => {
    const { animal, breed, age, gender, getsAlongDogs, getsAlongCats, suitableForChildren } = req.query;

    fs.readFile(petFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the pets file:', err);
            return res.status(500).send('An error occurred while retrieving pet information.');
        }

        const matchingPets = data.split('\n')
            .filter(line => line.trim() !== '') // Remove empty lines
            .map(line => {
                const [petId, ownerName, petAnimal, petBreed, petAge, petGender, petGetsAlongDogs, petGetsAlongCats, petSuitableForChildren, comment, ownerEmail] = line.split(':');
                return {
                    petId,
                    ownerName,
                    animal: petAnimal,
                    breed: petBreed,
                    age: petAge,
                    gender: petGender,
                    getsAlongDogs: petGetsAlongDogs,
                    getsAlongCats: petGetsAlongCats,
                    suitableForChildren: petSuitableForChildren,
                    comment,
                    ownerEmail
                };
            })
            .filter(pet =>
                (!animal || pet.animal.toLowerCase() === animal.toLowerCase()) &&
                (!breed || pet.breed.toLowerCase() === breed.toLowerCase()) &&
                (!age || pet.age === age) &&
                (!gender || pet.gender.toLowerCase() === gender.toLowerCase()) &&
                (!getsAlongDogs || pet.getsAlongDogs === (getsAlongDogs === 'true' ? 'yes' : 'no')) &&
                (!getsAlongCats || pet.getsAlongCats === (getsAlongCats === 'true' ? 'yes' : 'no')) &&
                (!suitableForChildren || pet.suitableForChildren === (suitableForChildren === 'true' ? 'yes' : 'no'))
            );

        if (matchingPets.length > 0) {
            res.render('search-results', { pets: matchingPets });
        } else {
            res.render('search-results', { pets: [], message: 'No pets found matching your criteria.' });
        }
    });
});



app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/dashboard');
        }

        res.clearCookie('connect.sid'); // Optional: Clears the cookie
        res.redirect('/login');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
