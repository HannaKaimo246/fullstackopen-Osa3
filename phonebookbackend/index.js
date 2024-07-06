const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())


let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "050-456-784"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "040-456-7654"
  },
  
  { id: 4,
  name: "Mary Poppendick",
  number: "040-444-1209"
  },
{ id: 5,
  name: "Sami Poppendick",
  number: "050-345-19456"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const today = new Date()
  const options = {
  timeZone: 'Europe/Helsinki',
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
};
  const currentDate = today.toLocaleString('fi-FI', options);
  response.send(`DATE: ${currentDate} The length of list of persons: ${persons.length}`);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()  
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const randomId = Math.floor(Math.random() * 10000); 
  const idExists = persons.some(person => person.id === randomId); 

  if (idExists) {
    return generateId();
  }

  return randomId;
};

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  const nameExists = persons.some(person => person.name === body.name)
   if(nameExists) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, '0.0.0.0'() => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
})
