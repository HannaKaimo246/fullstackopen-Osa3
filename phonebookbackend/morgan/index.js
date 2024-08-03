const express = require('express')
const logger = require('morgan')
const port = 3000

const app = express()
app.use(logger('dev'))

app.get('/api/persons', (req, res) => {
  // eslint-disable-next-line no-undef
  res.json(persons)
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Started at ${port}`)
})