const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT =  process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dataDir = path.join(__dirname, 'data');

// Helper: Get full path to a file
function getFilePath(who, type = 'bucket') {
  const suffix = type === 'message' ? '-message.json' : '.json';
  return path.join(dataDir, `${who}${suffix}`);
}

// --- Bucket List Endpoints ---

// Load bucket list
app.get('/api/bucketlist/:who', (req, res) => {
  const filePath = getFilePath(req.params.who);
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read bucket list.' });
    res.json(JSON.parse(data || '[]'));
  });
});

// Save bucket list
app.post('/api/bucketlist/:who', (req, res) => {
  const filePath = getFilePath(req.params.who);
  fs.writeFile(filePath, JSON.stringify(req.body, null, 2), err => {
    if (err) return res.status(500).json({ error: 'Failed to save bucket list.' });
    res.json({ message: 'Bucket list saved.' });
  });
});

// --- Message Endpoints ---

// Load message (e.g., she left a message for him)
app.get('/api/message/:who', (req, res) => {
  const filePath = getFilePath(req.params.who, 'message');
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read message.' });
    res.json({ message: data || '' });
  });
});

// Save message (e.g., he sends a message to her)
app.post('/api/message/:who', (req, res) => {
  const filePath = getFilePath(req.params.who, 'message');
  const message = req.body.message || '';
  fs.writeFile(filePath, message, err => {
    if (err) return res.status(500).json({ error: 'Failed to save message.' });
    res.json({ message: 'Message saved.' });
  });
});
console.log(`Saving bucket list for: ${req.params.who}`);
console.log(`Message received: ${message}`);


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
