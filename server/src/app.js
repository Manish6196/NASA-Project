const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const apiVersion1 = require('./routes/api_v1');

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
}));

app.use(morgan('tiny'));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/v1', apiVersion1);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
})

module.exports = app;
