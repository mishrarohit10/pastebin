import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import serverless from 'serverless-http';

dotenv.config();

console.log(process.env.MONGODB_USERNAME);
console.log(process.env.MONGODB_PASSWORD);

mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.muz34y3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Connection error:', error));

const pasteSchema = new mongoose.Schema({
  id: String,
  content: String,
});

const Paste = mongoose.model('Paste', pasteSchema);
const generateId = () => uuidv4();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/pastes', async (req, res) => {

  const { content } = req.body;
  if (!content) {
    res.status(400).send('Content is required');
    return;
  }
  const newPaste = new Paste({
    id: generateId(),
    content,
  })

  try {
    await newPaste.save();
    res.status(201).json(newPaste);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send('Failed to store paste');
  }
})

app.get('/pastes/:id', async (req, res) => {

  const { id } = req.params;
  try {
    const paste = await Paste.findOne({ id }).exec();
    if (!paste) {
      res.status(404).send('Paste not found');
      return;
    }
    res.json(paste);
  } catch (err) {
    console.error("An error occurred:", err);
    res.status(500).send('Failed to fetch paste');
  }
});

app.patch('/pastes/:id', (req, res) => {

  const { id } = req.params;
  const { content } = req.body;

  if (!content) {
    res.status(400).send('Content is required');
    return;
  }
  try {
    const paste = Paste.findOneAndUpdate({ id }, { content }, { new: true }).exec();
    res.status(200).json(paste);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send('Failed to update paste');
  }
});

app.get('/pastes/:id/download', async (req, res) => {

  const { id } = req.params;
  try {
    const paste = await Paste.findOne({ id }).exec();
    if (!paste) {
      res.status(404).send('Paste not found');
      return;
    }
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="snippet-${id}.txt"`);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.send(paste.content);

  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send('Failed to fetch paste');
  }
});

module.exports.handler = serverless(app);