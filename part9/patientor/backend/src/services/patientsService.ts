import { NewPatientEntry, NonSensitivePatientEntry, PatientsEntry } from '../types';
import { v1 as uuid } from 'uuid';
import patientsData from '../../data/patients';

const getEntries = () => {
  return patientsData;
};

const getNonSensitiveData = (): NonSensitivePatientEntry[] => {
  return patientsData.map(({id, name, dateOfBirth, gender, occupation}) => ({
    id, 
    name,
    dateOfBirth,
    gender, 
    occupation
  }));
};

const findById = (id: string): PatientsEntry | undefined => {
  const entry = patientsData.find(p => p.id === id);
  return entry;
};

const addPatient = (entry: NewPatientEntry): PatientsEntry => {
  const id = uuid();
  const newPatientEntry = {
    id,
    ...entry
  };
  patientsData.push(newPatientEntry);
  return newPatientEntry;
};

export default {
  getEntries,
  getNonSensitiveData,
  findById,
  addPatient
};