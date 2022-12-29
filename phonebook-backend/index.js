require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/phonebook')

const app = express()

morgan.token('add', function(request, response){return JSON.stringify({name:request.body.name, number:request.body.number})})

app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :add'))
app.use(express.static('build'))

let data = [

]

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons =>{
        response.json(persons)
    })
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

const PORT = process.env.PORT || 8080
app.listen(PORT, ()=>{
    console.log("Server is running on PORT "+PORT)
})