import { useEffect, useState } from "react"
import { NonSensitiveDiaryEntry, Visibility, Weather } from "./types";
import diaryService from "./services/diaryService";
import { AxiosError } from "axios";

const Notification = ({message}: {message: string | null}) => {

  if (message === null) return null
  else {
    return (
      <div style={{color: 'red'}}>
        {message}
      </div>
    )
  }

}


function App() {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [newDate, setNewDate] = useState<string>('')
  const [newVisibility, setNewVisibility] = useState<Visibility | null>(null)
  const [newWeather, setNewWeather] = useState<Weather | null>(null)
  const [newComment, setNewComment] = useState('')
  const [notification, setNewNotification] = useState<string | null>(null)

  useEffect(() => {
    diaryService.getAll()
      .then(data => {
        setDiaries(data)
      })
      .catch(error => {
        if (error instanceof AxiosError) {
          notify(error.message);
        } else {
          console.log(error);
        }
      })

  }, [])

  const notify = (message: string) => {
    setNewNotification(message)
    setTimeout(() => {setNewNotification(null)}, 5000)
  }

  const addEntry = (event: React.SyntheticEvent) => {
    event.preventDefault()

    if ( newDate !== '' && newVisibility !== null && newWeather !== null) {
      const newEntry = {
        date: newDate,
        weather: newWeather,
        visibility: newVisibility,
        comment: newComment
      }
      diaryService.create(newEntry)
        .then(res => {
          setDiaries(diaries.concat(res))
          notify('Entry Added')
        })
        .catch(error => {
          if (error instanceof AxiosError) {
            notify(error.message);
          } else {
            console.log(error);
          }
        })
    }
    else if (newDate === '') {
      notify('error! please enter date')
    }
    else if (newVisibility === null) {
      notify('error! please enter visibility')
    }
    else if (newWeather === null) {
      notify('error! please enter weather')
    }
  }

  return (
    <div>
      <h2>Add New Entries</h2>

      <Notification message={notification} />

      <form onSubmit={addEntry}>
        <div>
          date:
          <input type="date"
            value={newDate}
            onChange={({ target }) => setNewDate(target.value)}
          />
        </div>
        <div>
          Visibility:
          great
          <input type="radio" name="visibility"
            onChange={() => setNewVisibility(Visibility.Great)} />
          good
          <input type="radio" name="visibility"
            onChange={() => setNewVisibility(Visibility.Good)} />
          ok
          <input type="radio" name="visibility"
            onChange={() => setNewVisibility(Visibility.Ok)} />
          poor
          <input type="radio" name="visibility"
            onChange={() => setNewVisibility(Visibility.Poor)} />
        </div>
        <div>
          Weather:
          sunny
          <input type="radio" name="weather"
            onChange={() => setNewWeather(Weather.Sunny)} />
          rainy
          <input type="radio" name="weather"
            onChange={() => setNewWeather(Weather.Rainy)} />
          cloudy
          <input type="radio" name="weather"
            onChange={() => setNewWeather(Weather.Cloudy)} />
          stormy
          <input type="radio" name="weather"
            onChange={() => setNewWeather(Weather.Stormy)} />
          windy
          <input type="radio" name="weather"
            onChange={() => setNewWeather(Weather.Windy)} />
        </div>
        <div>
          comment:
          <input type="text"
            value={newComment}
            onChange={({ target }) => setNewComment(target.value)}
          />
        </div>
        <button>add</button>
      </form>

      <h2>Diary Entries</h2>
      {diaries && diaries.map(diary => (
        <div key={diary.id}>
          <h3>{diary.date}</h3>
          <div>{diary.visibility}</div>
          <div>{diary.weather}</div>
        </div>
      ))}
    </div>
  )
}

export default App
