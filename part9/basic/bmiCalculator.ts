interface data {
  height: number,
  weight: number
}

const parseArg = (args: string[]): data => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if(!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3])
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

const calculateBmi = (height: number, weight: number) => {
  const bmi = weight / (height / 100)**2;

  if (bmi > 30) {
    return {
      height,
      weight,
      bmi: `Obese (weight too high) - ${bmi}`
    };
  }
  else if (bmi > 25) {
    return {
      height,
      weight,
      bmi: `Overweight (weight is high) - ${bmi}`
    };
  } 
  else if (bmi > 18.5) {
    return {
      height,
      weight,
      bmi: `Normal (healthy weight) - ${bmi}`
    };
  }  
  else return {
    height,
    weight,
    bmi: `Underweight {weight is low} - ${bmi}`
  };
};

try {
  const {height, weight} = parseArg(process.argv);
  console.log(calculateBmi(height, weight));

} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}

export default calculateBmi;