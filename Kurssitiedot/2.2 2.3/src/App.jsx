import React from 'react'

const App = () => {
  	const course = {
    	name: 'Half Stack application development',
    	id: 1,
    	parts: [
      	{ 
			name: 'Fundamentals of React', 
			exercises: 10, 
			id: 1 
		},
      	{ 
			name: 'Using props to pass data',
			exercises: 7, 
			id: 2 
		},
      	{ 
			name: 'State of a component', 
			exercises: 14, 
			id: 3 
		}
    	]
  	}

  	const Header = ({ name }) => <h2>{name}</h2>

  	const Part = ({ name, exercises }) => (
    <p>{name} {exercises}</p>
  	)

  	const Content = ({ parts }) => (
    	<div>
    		{parts.map(part => <Part key={part.id} name={part.name} exercises={part.exercises} />)}
    	</div>
  	)

	const Total = ({ parts }) => {
    	const total = parts.reduce((sum, part) => sum + part.exercises, 0)
    	return <p><strong>Total of {total} exercises</strong></p>
  	}

  	const Course = ({ course }) => (
    	<div>
    	  	<Header name={course.name} />
    	  	<Content parts={course.parts} />
			<Total parts={course.parts} />
		</div>
  	)

  	return (
    	<div>
    	  	<Course course={course} />
    	</div>
  	)
}

export default App