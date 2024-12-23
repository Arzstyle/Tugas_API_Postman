const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const users = [
    { username: 'akbar', password: 'password1' },
    { username: 'user2', password: 'password2' },
];

app.use(bodyParser.json());

const loggingMiddleware = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); 
};

// Authentication Middleware
const authenticationMiddleware = (req, res, next) => {
    const { username, password } = req.body;

    console.log(`[${new Date().toISOString()}] Attempted login with username: ${username}`);

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        req.user = user;
        console.log(`[${new Date().toISOString()}] Authentication successful for ${username}`);
        next();
    } else {
        console.log(`[${new Date().toISOString()}] Authentication failed for ${username}`);
        next(new Error('Unauthorized'));
    }
};


const errorHandlerMiddleware = (err, req, res, next) => {
    console.error(err.stack);

    if (err.message === 'Unauthorized') {
        res.status(401).send('Unauthorized');
    } else {
        res.status(500).send('Internal Server Error');
    }
};

app.use(loggingMiddleware);


app.get('/', (req, res) => {
    res.send('Hello, Express with In-Memory Authentication Middleware!');
});

app.post('/login', authenticationMiddleware, (req, res) => {
    res.send(`Hello, ${req.user.username}! Login successful`);
});

app.use(errorHandlerMiddleware);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
