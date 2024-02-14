import toNewPatientEntry from '../utils';
import express from 'express';
import patientsService from '../services/patientsService';
const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientsService.getNonSensitiveData());
});

router.get('/:id', (req, res) => {
  const patient = patientsService.findById(req.params.id);

  if (patient) {
    res.send(patient);
  } else {
    res.status(404);
  }
});

router.post('/', (req, res) => {

  try {
    const body: unknown = req.body;
    const newPatientEntry = toNewPatientEntry(body);
    const addedEntry = patientsService.addPatient(newPatientEntry);
    res.json(addedEntry);
    
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;