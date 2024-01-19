import { useState } from 'react'

const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>
const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}
  
const Statistic = ({name, val}) => {
  if (val[3] === 0) {
    return (
      <div>
        no feedback given
      </div>
    )
  }
  
  return(
    <table>
      <tbody>
        <StatisticLine text={name[0]} value={val[0]} />
        <StatisticLine text={name[1]} value={val[1]} />
        <StatisticLine text={name[2]} value={val[2]} />
        <StatisticLine text={name[3]} value={val[3]} />
        <StatisticLine text={name[4]} value={val[4]} />
        <StatisticLine text={name[5]} value={val[5]} />
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)

  const addGood = () => {
    const newGood = good + 1
    setGood(newGood)
    setAll(newGood + neutral + bad)
  }

  const addNeutral = () => {
    const newNeutral = neutral + 1
    setNeutral(newNeutral)
    setAll(good + newNeutral + bad)
  }
  
  const addBad = () => {
    const newBad = bad + 1
    setBad(newBad)
    setAll(good + neutral + newBad)
  }

  const average = () => (good - bad) / all
  const positive = () => good/all*100 + '%'

  return (
    <div>
      <h2>give feedback</h2>
      <Button handleClick={addGood} text={'good'}/>
      <Button handleClick={addNeutral} text={'neutral'}/>
      <Button handleClick={addBad} text={'bad'}/>
      <h2>statistics</h2>
      <Statistic val={[good, neutral, bad, all, average(), positive()]} 
      name={['good', 'neutral', 'bad', 'all', 'average', 'positive']}/>
    </div>
  )
}

export default App