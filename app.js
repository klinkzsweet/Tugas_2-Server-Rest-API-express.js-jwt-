const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = express();
const port = 5000;
const SECRET_KEY = 'secret';

app.use(bodyParser.json());

// Baca data pengguna dari users.json
function getUserData() {
    const rawData = fs.readFileSync('./data/users.json');
    return JSON.parse(rawData);
}


// Login Users
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
    return res.status(400).json({ error: 'Harus Terisi Username dan password' });
    }

    const user_data = getUserData();
    const userData = user_data.find(user => user.username === username && user.password === password);

    if (userData) {
    // Generate JWT token
    const token = jwt.sign({ username }, SECRET_KEY);
    return res.status(200).json({ token });
    } else {
    return res.status(401).json({ 
        error: 'Gagal Untuk Login' });
    }
});

// Mendapatkan data Teachers
app.get('/teachers', (req, res) => {
  // Verifikasi token JWT
    const token = req.headers.authorization;
    jwt.verify(token, SECRET_KEY, (err) => {
    if (err) {
        return res.status(401).json({ 
            error: 'Autentikasi gagal' });
    }
    // Data Teachers
    const teachersData = require("./data/teachers.json");
    return res.status(200).json(teachersData);
    });
});

app.listen(port, () => {
    console.log("Server is running on port ", port);
});
