const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const port = 5001;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }));
app.use(express.json());

app.post('/api/answer', (req, res) => {
  console.log("get_answer called");
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'No question provided' });
  }

  const pythonProcess = spawn('python', [
    path.join(__dirname, '..', 'backend_express', 'wiki_retriever_express.py'),
    question
  ]);

  let result = '';
  let responseSent = false;

  pythonProcess.stdout.on('data', (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python Error: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    if (responseSent) return;
    
    if (code !== 0) {
      responseSent = true;
      return res.status(500).json({ error: 'Python script execution failed' });
    }
    responseSent = true;
    res.json({ answer: result.trim() });
  });
});

app.listen(port, () => {
  console.log(`Express server running on http://localhost:${port}`);
});