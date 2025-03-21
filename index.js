import express from 'express';
import mysql from 'mysql2';
import fs from 'fs';
import YAML from 'yaml';
import swaggerUi from 'swagger-ui-express';

const swaggerDocument = YAML.parse(fs.readFileSync('./open_api.yml', 'utf8'));

const db = mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'openapi' });
const app = express();
app.use(express.json());

app.use('/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/v1/users', (req, res) => {
  db.query('SELECT * FROM user', (err, result) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(result);
  });
});

app.get('/v1/user/:id', (req, res) => {
  db.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, result) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(result);
  });
});

app.put('/v1/user/:id', (req, res) => {
  db.query('UPDATE user SET name = ?, email = ?, age = ? WHERE id = ?', [req.body.name, req.body.email, req.body.age, req.params.id], (err, result) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(result);
  });
});

app.delete('/v1/user/:id', (req, res) => {
  db.query('DELETE FROM user WHERE id = ?', [req.params.id], (err, result) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(result);
  });
});

app.post('/v1/user', (req, res) => {
  const { name, email, age } = req.body;
  db.query('INSERT INTO user (name, email, age) VALUES (?, ?, ?)', [name, email, age], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(result);
  });
});

app.listen(3000, () => console.log('server berjalan di port 3000!'));