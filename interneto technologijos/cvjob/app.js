const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname + '/public')));
// Mock users (replace with a database in a real application)
const users = [
  { username: 'admin', password: 'password' }
];

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    // In a real application, you would generate and return a token here
    res.send('Login successful');
  } else {
    res.status(401).send('Invalid username or password');
  }
});

// Protected endpoint for modifying site content
app.post('/modify-content', (req, res) => {
  // Check authentication (e.g., verify token)
  // Modify site content
  // Return success/failure response
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
