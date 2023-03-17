const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const LIMIT = '100mb';
const compression = require('compression');

const app = express();

app.use(cors());
app.use(express.json({ limit: LIMIT }));
app.use(express.urlencoded({ limit: LIMIT, extended: true }));
app.use(compression());

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/dist/index.html'));
});

const port = process.env.PORT || 3002;

const server = http.createServer(app);
server.listen(port, () => console.log(`Running on port ${port}`));
