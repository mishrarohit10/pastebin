import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const generateId = () => uuidv4();

const app = express();
const port = 3000;

const snippets: Record<string, { content: string, id: string }> = {};

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/snippets', (req, res) => {
  const id = generateId();
  const { content } = req.body;
  if (!content) {
    res.status(400).send('Content is required');
  }
  snippets[id] = { content, id };
  res.status(201).json(snippets[id]);
})

app.get('/snippets/:id', (req, res) => {
  const { id } = req.params;
  const snippet = snippets[id];
  if (!snippet) {
    res.status(404).send('Snippet not found');
  }
  res.json(snippet);
});

app.patch('/snippets/:id', (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const snippet = snippets[id];
  if (!snippet) {
    res.status(404).send('Snippet not found');
    return;
  }
  if (!content) {
    res.status(400).send('New content is required');
    return;
  }
  snippets[id].content = content;
  res.json(snippets[id]);
});

app.get('/snippets/:id/download', (req, res) => {
  const { id } = req.params;
  const snippet = snippets[id];
  if (!snippet) {
    res.status(404).send('Snippet not found');
    return;
  }
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', `attachment; filename="snippet-${id}.txt"`);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.send(snippet.content);
});