require('dotenv').config();

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const express = require('express')

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await knex('users').where({ username }).first();

  if (user) {
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    }
  } else {
    res.status(401).send('Invalid credentials');
  }
});

function authorizeRole(role) {
  return (req, res, next) => {
      const token = req.headers['authorization'];
      if (token) {
          jwt.verify(token, JWT_SECRET, (err, user) => {
              if (err) {
                  return res.sendStatus(403);
              }
              if (user.role !== role) {
                  return res.sendStatus(403); // Forbidden
              }
              req.user = user;
              next();
          });
      } else {
          res.sendStatus(401); // Unauthorized
      }
  };
}

app.get('/admin', authorizeRole('admin'), (req, res) => {
  res.send('This is an admin-only route');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
