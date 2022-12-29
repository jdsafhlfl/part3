const mongoose = require('mongoose')

const url = process.env.URL
// console.log(url)

mongoose.connect(url)
        .then(result =>{
            console.log("Connect to MongoDB")
        })
        .catch(error =>{
            console.log(error.message)
        })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3},
    number:  String
})

personSchema.set('toJSON',{
    transform:(document, returnObject) =>{
        returnObject.id = returnObject._id.toString()
        delete returnObject._id
        delete returnObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)