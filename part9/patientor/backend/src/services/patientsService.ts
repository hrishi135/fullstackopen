import { NonSensitivePatientEntry } from 'types';
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

const addDiary = () => {
  return null;
};

export default {
  getEntries,
  getNonSensitiveData,
  addDiary
};