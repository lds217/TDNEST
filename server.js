const express = require('express');
const app = express();
const db = require('./firestore');

app.use(express.static('public'));

app.use(express.json());

app.get('/api/data', async (req, res) => {
  const snapshot = await db.collection('data').get();
  const data = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
  res.json(data);
});

app.post('/api/data', async (req, res) => {
  const newData = req.body;
  const docRef = await db.collection('data').add(newData);
  res.json({message: 'Data saved successfully', id: docRef.id});
});

app.delete('/api/data/:id', async (req, res) => {
  const id = req.params.id;
  await db.collection('data').doc(id).delete();
  res.json({message: 'Data deleted successfully'});
});

const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${process.env.PORT}`);
});

