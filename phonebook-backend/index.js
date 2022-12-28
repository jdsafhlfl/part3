const { response, request } = require('express')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

morgan.token('add', function(request, response){return JSON.stringify({name:request.body.name, number:request.body.number})})

app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :add'))

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
    // console.log(new_person)
    if(!new_person.name && !new_person.number){
        return response.status(400).json({
            error:'content missing'
        })
    }
    if(!new_person.name){
        return response.status(400).json({
            error:'name missing'
        })
    }
    if(!new_person.number){
        return response.status(400).json({
            error:'number missing'
        })
    }
    if(data.find(p => p.name === new_person.name)){
        return response.status(400).json({
            error:'name must be unique'
        })
    }
    new_person.id = random_id
    data = data.concat(new_person)
    response.json(data)
})

app.get('/favicon.ico', (request, response) => {
    response.status(200)
})

const PORT = 5001
app.listen(PORT, ()=>{
    console.log("Server is running on PORT "+PORT)
})