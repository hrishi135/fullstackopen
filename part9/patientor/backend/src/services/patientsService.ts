import {EntryWithoutId, NewPatientEntry, NonSensitivePatientEntry, PatientsEntry } from '../types';
import { v1 as uuid } from 'uuid';
import patientsData from '../../data/patients';

let patients = patientsData;

const getEntries = () => {
  return patients;
};

const getNonSensitiveData = (): NonSensitivePatientEntry[] => {
  return patients.map(({id, name, dateOfBirth, gender, occupation}) => ({
    id, 
    name,
    dateOfBirth,
    gender, 
    occupation
  }));
};

const findById = (id: string): PatientsEntry | undefined => {
  const entry = patients.find(p => p.id === id);
  return entry;
};

const addPatient = (entry: NewPatientEntry): PatientsEntry => {
  const id = uuid();
  const newPatientEntry = {
    id,
    ...entry
  };
  patients.push(newPatientEntry);
  return newPatientEntry;
};

const addEntry = (entry: EntryWithoutId, id: string): PatientsEntry => {
  const entryId = uuid();
  const newEntry = {
    id: entryId,
    ...entry
  };

  const PatientToUpdate = patients.find(p => p.id === id);
  if (PatientToUpdate) {
    PatientToUpdate.entries.push(newEntry);
    patients = patients.map(p => p.id !== id? p: PatientToUpdate);
    return PatientToUpdate;
  }
  throw new Error('Person not found');
};

export default {
  getEntries,
  getNonSensitiveData,
  findById,
  addPatient,
  addEntry
};