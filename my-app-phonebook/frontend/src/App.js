import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import Person from './components/Person'
import Notification from './components/Notification'
import './index.css'



const Filter = ({ handleFilter, filter}) => (
  <form>
      <div>
        filter shown with
        <input value={filter}
        onChange={handleFilter}
        />
      </div>
      </form>
)
const PersonForm = ({ handleNameChange, handleNumberChange, addName, newName, newNumber }) => (
  <form onSubmit={addName}>
    <div> 
        name:
        <input value={newName} 
        onChange={handleNameChange}
          />
    </div>
    <div>
        number: 
        <input value={newNumber}
        onChange={handleNumberChange}
        />
        <button type="submit">add</button>
        </div>
        </form>
)

const Persons = ({persons, filter, removePerson}) => {
  return (
    <div>
      {persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
      .map(person => <Person key={person.name} person={person} removePerson={removePerson}/> )}
    </div>
    )
  }



const App = (props) => {
  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  
  

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const notify = (message, type='success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }
  
  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber}
    if (persons.find(o => o.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const name=persons.find(o => o.name === newName)
        personService
          .update(name.id, nameObject)
          .then(changedPerson=>{
            setPersons(persons.map(p => p.id !== name.id ? p : changedPerson))
            notify(
              `Updated ${newName}`
            )
        })
        .catch(error => notify(`Information of ${newName} has already been removed from server`, 'error'))
  }  
  }
    else {
    personService
      .create(nameObject)
        .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        notify(
          `Added ${newName} `
        )
        setNewName('')
        setNewNumber('')
    })
    .catch(error => {
      notify(`${error.response.data.error}`, 'error')
    })
}
  }
  const removePerson = ({person}) => {
    if (window.confirm(`Delete '${person.name}'?`)) {
      personService
        .remove(person.id)
        .then(response =>{
          setPersons(persons.filter(p => p.id !== person.id))
          notify(`Deleted ${person.name} `)
        }).catch(error => {
            notify(`Information of ${person.name} has already been removed from server`, 'error')
        })
      }
    }


  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilter = (event) => {
    setFilter(event.target.value)
  }
  
  
  return (
    
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter filter={filter} handleFilter={handleFilter} />
      <h2>add a new</h2>
      <PersonForm handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} 
      newName={newName} addName={addName} newNumber={newNumber}/>
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} removePerson={removePerson}/>
    </div>
  )

}
export default App;