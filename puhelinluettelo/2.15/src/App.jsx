import { useEffect, useState } from 'react'
import personService from './services/persons'

const App = () => {
  	const [persons, setPersons] = useState([]) 

	useEffect(() => {
		personService
    		.getAll()
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

		const existingPerson = persons.find(p => p.name === newName)
		
		if (existingPerson) {
			const confirmReplace = window.confirm(
				`${existingPerson.name} is already added to phonebook, replace the old number with a new one?`
			)

			if (confirmReplace) {
				const updatedPerson = { ...existingPerson, number: newNumber }
				personService
					.update(existingPerson.id, updatedPerson)
					.then(response => {
						setPersons(persons.map(p => p.id === existingPerson.id ? response.data : p))
						setNewName('')
						setNewNumber('')
					})
			}
			return
		}
		const duplicate = persons.some(person => person.name === newName)

		if (duplicate) {
			alert(`${newName} is already added to phonebook`)
			return
		}

		personService
    		.create(personObj)
    		.then(response => {
      			setPersons(persons.concat(response.data))
      			setNewName('')
      			setNewNumber('')
    		})
		return
	}
	
	const deletePerson = (id, name) => {
		if (window.confirm(`Delete ${name}?`)) {
			personService.remove(id)
				.then(() => {
					setPersons(persons.filter(person => person.id !== id))
				})
				.catch(error => {
        			alert(`The person '${name}' was already removed from server`)
        			setPersons(persons.filter(p => p.id !== id))
      			})
		}
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
  				{showFiltered.map(person => (
    				<li key={person.id}>
      					{person.name} {person.number} 
      					<button onClick={() => deletePerson(person.id, person.name)}>
        					delete
      					</button>
    				</li>
  				))}
			</ul>
    	</div>
  	)

}

export default App