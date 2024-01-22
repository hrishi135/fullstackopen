const Header = ({course}) => {
    return <h2>{course}</h2>
  }
  
  const Total = ({sumOfExercises}) => {
    return <h3>Total of {sumOfExercises} exercises</h3>
  }
  
  const Part = ({name, exercises}) => {
    return (
      <p>
        {name} {exercises}
      </p>
    )
  }
  
  const Content = ({parts}) => {
    return (
      <div>
        {parts.map((part) => <Part key={part.id} name={part.name} exercises={part.exercises} />)}
      </div>
    )
  }
  
  const Course = ({course}) => {
    
    const sumOfExercises = course.parts.reduce((sum, part) => {
      return sum + part.exercises
    }, 0)
  
    return (
      <div>
         <Header course={course.name} />
         <Content parts={course.parts}/>
         <Total sumOfExercises={sumOfExercises} />
       </div>
    )
  }

export default Course