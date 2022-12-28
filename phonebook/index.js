const { response, request } = require('express')
const express = require('express')
const app = express()

app.use(express.json())

let data = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(data)
})

app.get('/info', (request, response) => {
    const str = 'Phonebook has info for ' + data.length + ' people \n' + Date()
    console.log(str)
    response.send('<p>Phonebook has info for ' + data.length + ' people</p>' + Date())
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const singlePerson = data.find(p => p.id === Number(id))
    if (singlePerson) {
        response.json(singlePerson)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response)=>{
    const id = request.params.id
    data = data.filter(p => p.id !== Number(id))

    response.status(204).end()
})

app.post('/api/persons', (request, response)=>{
    const random_id = Math.floor(Math.random()*100)+10
    const new_person = request.body
    new_person.id = random_id
    data = data.concat(new_person)
    response.json(data)
})

app.get('/favicon.ico', (request, response) => {
    response.status(200)
})

const PORT = 5001
app.listen(PORT)