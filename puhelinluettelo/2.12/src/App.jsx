import { useEffect, useState } from 'react'
import axios from 'axios'

const App = () => {
  	const [persons, setPersons] = useState([]) 

	useEffect(() => {
		axios
			.get('http://localhost:3001/persons')
			.then(response => {
				setPersons(response.data)
			})
	}, [])

  	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [filter, setFilter] = useState('')

  	const handleNameChange = (event) => {
    	setNewName(event.target.value)
  	}

	const handleNumberChange = (event) => {
		setNewNumber(event.target.value)
	}

	const handleFilterChange = (event) => {
		setFilter(event.target.value)
	}

	const addPerson = (event) => {
		event.preventDefault()

		const personObj = {
			name: newName,
			number: newNumber
		}

		const duplicate = persons.some(person => person.name === newName)

		if (duplicate) {
			alert(`${newName} is already added to phonebook`)
			return
		}

		axios
  			.post('http://localhost:3001/persons', personObj)
  			.then(response => {
    			setPersons(persons.concat(response.data))
    			setNewName('')
    			setNewNumber('')
  })
	}
	
	const showFiltered = persons.filter(person => 
		person.name.toLowerCase().includes(filter.toLowerCase())
	)
	


	return (
    	<div>
      		<h2>Phonebook</h2>
			<div>
				Filter shown with: <input 
					value={filter} 
					onChange={handleFilterChange}
				/>
			</div>
			<h2>add a new person</h2>
      		<form onSubmit={addPerson}>
        		<div>
          			name: <input value={newName} onChange={handleNameChange}/>
        		</div>
				<div>
					Number: <input value={newNumber} onChange={handleNumberChange}/>
				</div>
        		<div>
          			<button type="submit">add</button>
        		</div>
      		</form>
      		<h2>Numbers</h2>
      
      		<ul>
        		{showFiltered.map(person => 
          			<li key={person.name}>{person.name} {person.number}</li>  
        		)}
      		</ul>
    	</div>
  	)

}

export default App