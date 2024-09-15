const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const port = process.env.PORT || 5001;

app.get('/', (req, res) => {
  res.json({ status: 'API is running' });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.options('*', cors()); // Handle preflight requests


const allowedOrigins = [
  'https://warren-six.vercel.app',
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));


app.post('/api/answer', cors(), (req, res) => {
  console.log("get_answer called");
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'No question provided' });
  }

  const pythonProcess = spawn('python', [
    path.join(__dirname, 'wiki_retriever_express.py'),
    question
  ]);

  let result = '';
  let errorOutput = '';

  pythonProcess.stdout.on('data', (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
    console.error(`Python Error: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Python script exited with code ${code}`);
      console.error(`Error output: ${errorOutput}`);
      return res.status(500).json({ error: 'Python script execution failed', details: errorOutput });
    }
    res.json({ answer: result.trim() });
  });
});

app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});