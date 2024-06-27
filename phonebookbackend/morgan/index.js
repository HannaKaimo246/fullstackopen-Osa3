const express = require('express');
const logger = require('morgan');
const port = 3000;

const app = express();
app.use(logger('dev'));

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.listen(port, () => {
  console.log(`Started at ${port}`);
});