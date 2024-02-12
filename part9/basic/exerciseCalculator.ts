interface exerciseInput {
  daily_exercises: number[],
  target: number
}

const parseArg = (args: string[]): exerciseInput => {
  if (args.length < 3) throw new Error('Not enough arguments');
  args.splice(0, 2); // remove npm and run from argv
  const numArgs = args.map(arg => Number(arg));

  numArgs.forEach(arg => {
    if (isNaN(arg)) throw new Error('Provided values were not numbers!');
  });

  const target = Number(numArgs.splice(0, 1));
  const daily_exercises = numArgs;

  return {
    daily_exercises,
    target
  };
};

interface responseObj {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: 1 | 2 | 3,
  ratingDescription: string,
  target: number,
  average: number
}

const calculateExercises = (daily_exercises: number[], target: number): responseObj => {
  const periodLength = daily_exercises.length;
  const trainingDays = daily_exercises.filter(x => x !== 0).length;
  const average = daily_exercises.reduce((sum, val) => sum + val, 0) / periodLength;
  let success = false;
  let rating;
  let ratingDescription;

  if (average >= target) {
    success = true;
    rating = 3 as const;
    ratingDescription = 'well done, you did great';
  } else if (average >= target*0.8) {
    rating = 2 as const;
    ratingDescription = 'not too bad but could be better';
  } else {
    rating = 1 as const;
    ratingDescription = 'too bad, need to do much better';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

try {
  const {daily_exercises, target} = parseArg(process.argv);
  console.log(calculateExercises(daily_exercises, target));

} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}

export default calculateExercises;