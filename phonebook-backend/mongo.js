const mongoose = require('mongoose')

if (process.argv.length < 3){
    console.log("format: node mongo.js passwd")
    process.exit(1)
}

const passwd = process.argv[2]
const url = "mongodb+srv://fullstack2022:"+passwd+"@cluster0.hszknzl.mongodb.net/phonebook?retryWrites=true&w=majority"

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model("Person", personSchema)

mongoose
        .connect(url)
        .then((result)=>{
            if(process.argv.length === 5){
                const newPerson = new Person({
                    name: process.argv[3],
                    number: process.argv[4]
                })

                newPerson.save().then(result => {
                    console.log("added "+process.argv[3]+" number "+process.argv[4]+" to phonebook")
                    return mongoose.connection.close()
                })
            }
            else if(process.argv.length === 3){
                console.log("phonebook:")
                Person.find({}).then(result=>{
                    result.forEach(p=>{
                        console.log(p.name, p.number)
                    })

                    mongoose.connection.close()
                })
            }
        })

// Person.find({}).then(result =>{
//     result.forEach(p => {
//         console.log(p)
//     })
//     mongoose.connection.close()
// })