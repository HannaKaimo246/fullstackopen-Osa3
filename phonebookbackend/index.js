const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
//app.use(requestLogger);
app.use(express.static('dist'))

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.error('error connecting to MongoDB:', error.message)
  })

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    if (persons) {
      response.json(persons)
    }  else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  const today = new Date()
  const options = {
    timeZone: 'Europe/Helsinki',
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }
  const currentDate = today.toLocaleString('fi-FI', options)
  Person.countDocuments({}).then(count => {
    response.send(`DATE: ${currentDate} The length of list of persons: ${count}`)
  })
    .catch(error => next(error)) // Added error handling
})


app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ error: 'name missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    if (savedPerson) {
      response.json(savedPerson)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})