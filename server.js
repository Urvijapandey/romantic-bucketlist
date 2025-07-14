const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const dataDir = path.join(__dirname, 'data');

// Dynamically gets his.json or her.json
function getFilePath(who) {
  return path.join(dataDir, `${who}.json`);
}

const messagesPath = path.join(dataDir, 'messages.json');


// -----------------------
// 📌 Bucket List Endpoints
// -----------------------

// GET his.json or her.json
app.get('/api/bucketlist/:who', (req, res) => {
  const who = req.params.who.toLowerCase();
  const filePath = getFilePath(who);

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read data.' });
    res.json(JSON.parse(data));
  });
});

// POST to save his.json or her.json
app.post('/api/bucketlist/:who', (req, res) => {
  const who = req.params.who.toLowerCase();
  const filePath = getFilePath(who);

  fs.writeFile(filePath, JSON.stringify(req.body, null, 2), err => {
    if (err) return res.status(500).json({ error: 'Failed to save data.' });
    res.json({ message: 'Bucket list saved.' });
  });
});


// -----------------------
// 💌 Messages Endpoints
// -----------------------

// GET both messages
app.get('/api/messages', (req, res) => {
  fs.readFile(messagesPath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read messages.' });

    const json = JSON.parse(data || '{}');
    res.json({
      herMessage: json.herMessage || '',
      hisMessage: json.hisMessage || ''
    });
  });
});

// POST a new message from 'him' or 'her'
app.post('/api/messages', (req, res) => {
  const { from, message } = req.body;

  if (!['him', 'her'].includes(from) || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid input.' });
  }

  fs.readFile(messagesPath, 'utf-8', (err, data) => {
    const json = JSON.parse(data || '{}');

    if (from === 'him') json.hisMessage = message;
    else if (from === 'her') json.herMessage = message;

    fs.writeFile(messagesPath, JSON.stringify(json, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Failed to save message.' });
      res.json({ message: 'Message saved.' });
    });
  });
});


// -----------------------
// Start server
// -----------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
