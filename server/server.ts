import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';

const generateId = () => uuidv4();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const pastes: Record<string, { content: string, id: string }> = {};

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/pastes', (req, res) => {
  const id = generateId();
  const content  = req.body.content;
  if (!content) {
    res.status(400).send('Content is required');
  }
  pastes[id] = { content, id };
  res.status(201).json(pastes[id]);
})

app.get('/pastes/:id', (req, res) => {
  const { id } = req.params;
  const snippet = pastes[id];
  if (!snippet) {
    res.status(404).send('Snippet not found');
  }
  res.json(snippet);
});

app.patch('/pastes/:id', (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const snippet = pastes[id];
  if (!snippet) {
    res.status(404).send('Snippet not found');
    return;
  }
  if (!content) {
    res.status(400).send('New content is required');
    return;
  }
  pastes[id].content = content;
  res.json(pastes[id]);
});

app.get('/pastes/:id/download', (req, res) => {
  const { id } = req.params;
  const snippet = pastes[id];
  if (!snippet) {
    res.status(404).send('Snippet not found');
    return;
  }
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', `attachment; filename="snippet-${id}.txt"`);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.send(snippet.content);
});