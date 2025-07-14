const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const dataDir = path.join(__dirname, 'data');

function getFilePath(who) {
  return path.join(dataDir, `${who}.json`);
}

// Load bucket list
app.get('/api/bucketlist/:who', (req, res) => {
  const who = req.params.who;
  const filePath = getFilePath(who);

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read data.' });
    res.json(JSON.parse(data));
  });
});

// Save bucket list
app.post('/api/bucketlist/:who', (req, res) => {
  const who = req.params.who;
  const filePath = getFilePath(who);

  fs.writeFile(filePath, JSON.stringify(req.body, null, 2), err => {
    if (err) return res.status(500).json({ error: 'Failed to save data.' });
    res.json({ message: 'Bucket list saved.' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
