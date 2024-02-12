import express from 'express';
import qs from 'qs';
import calculateBmi from './bmiCalculator';
import calculateExercises from './exerciseCalculator';
const app = express();

app.use('query parser', (str: string) => qs.parse(str));
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi?', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);
  if (!isNaN(height) && !isNaN(weight)) {
    res.send(calculateBmi(Number(req.query.height), Number(req.query.weight)));
  } else {
    res.send({error: 'malformatted parameters'});
  }
});

app.post('/exercises', (req, res) => {
  const {daily_exercises, target} = req.body as {daily_exercises: number[], target: number};

  try {
    if (isNaN(target)) {
      throw new Error('Provided target is not a number!');
    } else {
      
      for (const val of daily_exercises) {
        if (isNaN(val)) throw new Error('Provided values were not numbers!');
      } 
      res.send(calculateExercises(daily_exercises, target));
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.send({error: error.message});
    }
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});