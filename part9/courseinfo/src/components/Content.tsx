import { CoursePart, CoursePartBackground, CoursePartBasic, CoursePartGroup, CoursePartSpecial } from "../types"

const PartBasic = ({ part }: {part: CoursePartBasic}) => {
  return (
    <div>
      <div><b>{ part.name } { part.exerciseCount }</b></div> 
      <div><i>{ part.description }</i></div>
      <br />
    </div>
  )
}

const PartGroup = ({ part }: {part: CoursePartGroup}) => {
  return (
    <div>
      <div><b>{ part.name } { part.exerciseCount }</b></div> 
      <div>group exercises { part.groupProjectCount }</div>
      <br />
    </div>
  )
}

const PartBackground = ({ part }: {part: CoursePartBackground}) => {
  return (
    <div>
      <div><b>{ part.name } { part.exerciseCount }</b></div>
      <div><i>{ part.description }</i></div>
      <div>background material:  { part.backgroundMaterial }</div>
      <br />
    </div>
  )
}

const PartSpecial = ({ part }: {part: CoursePartSpecial}) => {
  return (
    <div>
      <div><b>{ part.name } { part.exerciseCount }</b></div> 
      <div>required skills: { part.requirements.map(p => <span key={p}> { p }, </span>) }</div>
      <br />
    </div>
  )
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Content = ({ courseParts }: {courseParts: CoursePart[]}) => {
  return (
    courseParts.map((part: CoursePart) => {
      switch(part.kind) {

        case 'basic': 
          return <PartBasic key={part.name} part={part}/>
        case 'group':
          return <PartGroup key={part.name} part={part}/>
        case 'background':
          return <PartBackground key={part.name} part={part}/>
        case 'special':
          return <PartSpecial key={part.name} part={part}/>
        default:
          return assertNever(part);
      }
    })
  )
}

export default Content