require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

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
    const { name, email } = req.body;
    await collection.insertOne({ name, email });
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
    const { name, email } = req.body;
    try {
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { name, email } }
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
