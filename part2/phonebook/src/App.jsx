import { useState, useEffect } from 'react'
import axios from 'axios'
import conn from './services/persons'
import './index.css'

const Notification = ({ errorMessage, notificationMessage }) => {
  if (errorMessage === null && notificationMessage === null) {
    return null
  }
  else if (errorMessage === null) {
    return (
      <div className='notification'>
        {notificationMessage}
      </div>
    )
  }

  return (
    <div className='error'>
      {errorMessage}
    </div>
  )
}

const Filter = ({onChange}) => {
  return (
    <div>
      filter shown with <input onChange={onChange}/>
    </div>
  )
}

const PersonForm = ({onSubmit, onChangeName, onChangeNumber, newName, newNumber}) => {
  return (
    <form onSubmit={onSubmit}>
        <div>
          name: 
          <input value={newName} onChange={onChangeName} />
          <br/>
          number:
          <input value={newNumber} onChange={onChangeNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
    </form>
  )
}

const Persons = ({persons, onDelete}) => {
  // console.log(persons, onDelete)
  return (
    persons.map((person) => 
    <div key={person.name}>
      {person.name} {person.number} 
      <button id={person.id} name={person.name} onClick={onDelete}> delete </button>
    </div>
    )
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterPersonsList, setFilterPersonsList ] = useState(persons)
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)

  const hook = () => {
    axios
        .get('http://localhost:3001/persons')
        .then(response => {
          setPersons(response.data)
          setFilterPersonsList(response.data)
        })
  }
  useEffect(hook, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const filterPerson = (event) => {
    setFilterPersonsList(persons.filter(person => {
      const name = person.name.toLowerCase();
      const search = event.target.value.toLowerCase();
      return name.includes(search);
    }))
  }

  const addPerson = (event) => {
    event.preventDefault()
    const newPersonObj = {
      name: newName,
      number: newNumber
    }
   
    if (persons.findIndex((obj) => obj.name == newName) != -1) {
      
      if(confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)) {
        const updatedPerson = persons.find((person) => person.name === newName);
        newPersonObj.id = updatedPerson.id
        conn.update(newPersonObj.id, newPersonObj)
            .then(response => {
              setNotificationMessage(`Updated information of ${newPersonObj.name}`)
              setTimeout(() => {setNotificationMessage(null)}, 5000)
              const newList = persons.map(person => person.id !== newPersonObj.id? person: response.data)
              setPersons(newList)
              setFilterPersonsList(newList)
              setNewName('')
              setNewNumber('')
            })
            .catch(() => {
              setErrorMessage(`Information of ${newPersonObj.name} was already removed from server`)
              setTimeout(() => {setErrorMessage(null)}, 5000)
              const newList = persons.filter(person => person.id !== newPersonObj.id)
              setPersons(newList)
              setFilterPersonsList(newList)
            })
      }
    }
    else {
      conn.create(newPersonObj)
          .then(response => {
            setNotificationMessage(`Added ${newPersonObj.name}`)
            setTimeout(() => {setNotificationMessage(null)}, 5000)
            const newList = persons.concat(response.data)
            setPersons(newList)
            setFilterPersonsList(newList)
            setNewName('')
            setNewNumber('')
          })
    }
  }

  const removePerson = (event) => {
    if(confirm(`Delete ${event.target.name}`)) {
      conn.remove(event.target.id)
          .then(response => {
            setNotificationMessage(`Deleted ${response.data.name}`)
            setTimeout(() => {setNotificationMessage(null)}, 5000)
            const newList = persons.filter(person => person.id !== response.data.id)
            setPersons(newList)
            setFilterPersonsList(newList)
            setNewName('')
            setNewNumber('')
          })
    }
  }

  return (
    <div>
      <Notification errorMessage={errorMessage} notificationMessage={notificationMessage}/>
      <h2>Phonebook</h2>
      <Filter onChange={filterPerson}/>

      <h2>add a new number</h2>
      <PersonForm onSubmit={addPerson} onChangeName={handleNameChange} 
        onChangeNumber={handleNumberChange} newName={newName} newNumber={newNumber} />

      <h2>Numbers</h2>
      <div className="person-list">
        <Persons persons={filterPersonsList} onDelete={removePerson}/>
      </div>
      

    </div>
  )
}

export default App