const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const session = require("express-session");
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoDBSession = require("connect-mongodb-session")(session);
const bcrypt = require("bcryptjs")
require('dotenv').config();

const app = express();

const url = process.env.DB_CONNECTION; // Ambil URL MongoDB dari .env
const dbName = process.env.DB_NAME; // Ambil nama database dari .env
const dbColl = process.env.DB_COLLECTION;

const client = new MongoClient(url);

async function main() {
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection(dbColl);

  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  // Create
  app.post('/users', async (req, res) => {
    const { username, email, password } = req.body;
    await collection.insertOne({ username, email, password });
    res.status(201).send('User created');
  });

  // Get all 
  app.get('/users', async (req, res) => {
    const users = await collection.find({}).toArray();
    res.json(users);
  });

  // Update
  app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { username, email } = req.body;
    try {
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { username, email } }
      );
      if (result.matchedCount === 0) {
        res.status(404).send('User not found');
      } else {
        res.send('User updated');
      }
    } catch (err) {
      res.status(400).send('Invalid ID format');
    }
  });

  // Delete
  app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        res.status(404).send('User not found');
      } else {
        res.send('User deleted');
      }
    } catch (err) {
      res.status(400).send('Invalid ID format');
    }
  });

  const port = process.env.PORT; 
  app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
}

main().catch(console.error);
