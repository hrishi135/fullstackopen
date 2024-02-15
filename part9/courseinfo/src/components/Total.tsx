interface TotalProps {
  label: number
}

const Total = ({ label }: TotalProps) => {
  return ( 
  <p> Number of exercises { label } </p>
  )
}

export default Total