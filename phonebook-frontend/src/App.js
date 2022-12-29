import { useEffect, useState } from 'react'
import phoneServices from './services'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilter] = useState('')
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    phoneServices.getPhonenote()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const names = persons.map(p => p.name)
    const ifFind = names.includes(newName)
    if (ifFind === true) {
      const existPerson = persons.find(p => p.name === newName)
      if (existPerson.number === newNumber) {
        alert(newName + ' is already added to phonebook')
      } else {
        if (window.confirm(newName + " is already added to phonebook, replace the old number with a new one?")) {
          phoneServices.updatePhonenote(existPerson.id, { name: newName, number: newNumber })
            .then(response => {
              setPersons(persons.map(p => p.id === existPerson.id ? response.data : p))
              setMessage("Updated " + newName)
              setTimeout(() =>{
                setMessage('')
              },5000)
            })
            .catch(error =>{
              setErrorMessage("Information of "+newName+" has already been removed from server")
              setTimeout( ()=>{
                setErrorMessage('')

              },5000)
            })
        }
        // const newPerson = { name: newName, number: newNumber }
        // phoneServices.addPhonenote(newPerson)
        //   .then(response => {
        //     setPersons(persons.concat(newPerson))
        //   })
        //   .then(()=>{
        //     setMessage("Added " + newName)
        //     setTimeout(() =>{
        //       setMessage('')
        //     },5000)
        //   })
      }
    } else {
      const newPerson = { name: newName, number: newNumber }
      phoneServices.addPhonenote(newPerson)
        .then(response => {
          setPersons(persons.concat(newPerson))
        })
        .then(()=>{
          setMessage("Added " + newName)
          setTimeout(() =>{
            setMessage('')
          },5000)
        })
    }
    setNewName('')
    setNewNumber('')
  }

  const handleNewName = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }

  const filterPersons = persons.filter(p => p.name.toLowerCase().includes(filterName.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <ErrorNotification message={errorMessage} />
      <Notification message={message} />
      <Filter value={filterName} function={handleFilter} />
      <h2>Add a new</h2>
      <PersonForm name={newName} num={newNumber} nameFunc={handleNewName} numFunc={handleNewNumber} subFunc={addPerson} />
      <h2>Numbers</h2>
      <Persons filterPersons={filterPersons} allPersons={persons} setPersons={setPersons} />
    </div>
  )
}

const Filter = (props) => {
  return (
    <div>
      filter shown with
      <input value={props.value} onChange={props.function} />
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.subFunc}>
      <div>
        name: <input value={props.name} onChange={props.nameFunc} />
      </div>
      <div>
        number: <input value={props.num} onChange={props.numFunc} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = (props) => {

  const deletePerson = (name) => {
    if (window.confirm("Delete " + name + "?")) {
      // window.location.reload()
      const deletePerson = props.allPersons.find(p => p.name === name)
      const remainPerson = props.allPersons.filter(p => p.name !== name)
      phoneServices.deletePhonenote(deletePerson.id)
        .then(() => {
          props.setPersons(remainPerson)
        })
    }
  }

  return (
    props.filterPersons.map(p => <p key={p.name}>{p.name} {p.number} <button onClick={function () { deletePerson(p.name) }}>delete</button> </p>)
  )
}

const Notification = (props) => {
  const messageStyle =  {
    color: 'green',
    fontSize:25,
    backgroundColor:'#CFCECE',
    margin: '10px 2px 30px 2px',
    border: 'solid green 3px',
    padding: '10px 10px 10px 10px',
    borderRadius:8
  }

  if (props.message === '') {
    return null
  } else {
    return (
      <div style={messageStyle}>
        {props.message}
      </div>
    )
  }
}

const ErrorNotification = (props) => {
  const messageStyle =  {
    color: 'red',
    fontSize:25,
    backgroundColor:'#CFCECE',
    margin: '10px 2px 30px 2px',
    border: 'solid red 3px',
    padding: '10px 10px 10px 10px',
    borderRadius:8
  }

  if (props.message === '') {
    return null
  } else {
    return (
      <div style={messageStyle}>
        {props.message}
      </div>
    )
  }
}

export default App