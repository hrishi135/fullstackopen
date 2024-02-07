import { useEffect, useState } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return [reset, { type, value, onChange }]
}

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  const getAll = async () => {
    const response = await axios.get(baseUrl)
    setResources(response.data)
  }
  
  useEffect(() => {
    getAll()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const create = async newObject => {
    const response = await axios.post(baseUrl, newObject)
    setResources(resources.concat(response.data))
  }
  
  const update = async (id, newObject) => {
    const response = await axios.put(`${ baseUrl }/${id}`, newObject)
    setResources(resources.map(r => r.id !== response.data.id? r: response.data))
  }

  const service = {
    getAll, create, update
  }

  return [
    resources, service
  ]
}

const App = () => {
  const [resetContent, content] = useField('text')
  const [resetName, name] = useField('text')
  const [resetNumber, number] = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    resetContent()
    noteService.create({ content: content.value })
  }
 
  const handlePersonSubmit = (event) => {
    event.preventDefault()
    resetName()
    resetNumber()
    personService.create({ name: name.value, number: number.value})
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br/>
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}

export default App