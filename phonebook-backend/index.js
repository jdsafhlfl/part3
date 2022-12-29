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


app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons =>{
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons =>{
        response.send('<p>Phonebook has info for ' + persons.length + ' people</p>' + Date())
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(p =>{
        if(p){
            response.json(p)
        }else{
            response.status(404).json({error: 'id not exists'})
        }
    })
})

app.delete('/api/persons/:id', (request, response)=>{
    Person.findByIdAndDelete(request.params.id)
          .then(result =>{
            response.status(204).end()
          })
          .catch(error => next(error) )

})

app.post('/api/persons', (request, response)=>{
    const new_person = request.body
    if(!new_person.name && !new_person.number){
        return response.status(400).json({error:'content missing'})
    }
    else if(!new_person.name){
        return response.status(400).json({error:'name missing'})
    }
    else if(!new_person.number){
        return response.status(400).json({error:'number missing'})
    }

    const addPerson = new Person({
        name: new_person.name,
        number: new_person.number
    })
    addPerson.save().then(p =>{
        response.json(p)
    })
})

app.get('/favicon.ico', (request, response) => {
    response.status(200)
})

const PORT = process.env.PORT || 8080
app.listen(PORT, ()=>{
    console.log("Server is running on PORT "+PORT)
})