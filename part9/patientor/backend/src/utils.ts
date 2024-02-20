import { DiagnosisEntry, Entry, EntryWithoutId, Gender, HealthCheckEntry, HospitalEntry, NewPatientEntry, OccupationalHealthcareEntry } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseName = (name: unknown): string => {
  if (!isString(name)) {
    throw new Error('Incorrect or missing name: ' + name);
  }
  return name;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
      throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

const parseSSN = (ssn: unknown): string => {
  if (!isString(ssn)) {
    throw new Error('Incorrect or missing ssn: ' + ssn);
  }
  return ssn;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender).map(v => v.toString()).includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if(!isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!isString(occupation)) {
    throw new Error('Incorrect or missing name: ' + occupation);
  }
  return occupation;
};

const parseEntries = (entry: unknown): Entry[] => {
  if(!entry) {
    return [] as Entry[];
  }
  return entry as Entry[]; 
};

const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if ('name' in object && 'dateOfBirth' in object && 'ssn' in object && 'gender' in object && 'occupation' in object && 'entries' in object) {
    const newEntry: NewPatientEntry = {
      name: parseName(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseSSN(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      entries: parseEntries(object.entries)
    };   
    return newEntry;
  }
  throw new Error('Incorrect data: some fields are missing');
};



const parseId = (id: unknown): string => {
  if (!isString(id)) { throw new Error('Incorrect or missing id: ' + id); }
  return id;
};

const parseDescription = (desc: unknown): string => {
  if (!isString(desc)) { throw new Error('Incorrect or missing description: ' + desc); }
  return desc;
};

const parseSpecialist = (spec: unknown): string => {
  if (!isString(spec)) { throw new Error('Incorrect or missing specialist: ' + spec); }
  return spec;
};

const parseCriteria = (crit: unknown): string => {
  if (!isString(crit)) { throw new Error('Incorrect or missing criteria: ' + crit); }
  return crit;
};

const parseEmployerName = (name: unknown): string => {
  if (!isString(name)) { throw new Error('Incorrect or missing employer name: ' + name); }
  return name;
};

const parseDiagnosisCodes = (codes: unknown): Array<DiagnosisEntry['code']> =>  {
  if (!codes || typeof codes !== 'object') {
    // we will just trust the data to be in correct form
    return [] as Array<DiagnosisEntry['code']>;
  }
  return codes as Array<DiagnosisEntry['code']>;
};

export const toNewEntry = (object: unknown): EntryWithoutId => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if ('type' in object && isString(object.type) ) {
    if (object.type === 'HealthCheck') {
      if ('healthCheckRating' in object && 'id' in object && 'description' in object && 'date' in object && 'specialist' in object) {
        const newEntry: HealthCheckEntry = {
          type: "HealthCheck",
          healthCheckRating: 1,
          id: parseId(object.id),
          description: parseDescription(object.description),
          date: parseDate(object.date),
          specialist: parseSpecialist(object.specialist)
        };
        if ('diagnosisCodes' in object) {
          newEntry.diagnosisCodes = parseDiagnosisCodes(object.diagnosisCodes);
        }
        return newEntry;
      }
    }
    else if (object.type === 'Hospital') {
      if ( 'id' in object && 'description' in object && 'date' in object && 'specialist' in object && 'discharge' in object
      && typeof object.discharge === 'object' && object.discharge && 'date' in object.discharge && 'criteria' in object.discharge) {
        const newEntry: HospitalEntry = {
          type: "Hospital",
          discharge: {
            date: parseDate(object.discharge.date),
            criteria: parseCriteria(object.discharge.criteria)
          },
          id: parseId(object.id),
          description: parseDescription(object.description),
          date: parseDate(object.date),
          specialist: parseSpecialist(object.specialist)
        };
        if ('diagnosisCodes' in object) {
          newEntry.diagnosisCodes = parseDiagnosisCodes(object);
        }
        return newEntry;
      } 
    }
    else if (object.type === 'OccupationalHealthcare') {

      if ( 'id' in object && 'description' in object && 'date' in object && 'specialist' in object && 'employerName' in object && 'sickLeave' in object && typeof object.sickLeave === 'object' && object.sickLeave && 'startDate' in object.sickLeave &&
      'endDate' in object.sickLeave) {
        const newEntry: OccupationalHealthcareEntry = {
          type: "OccupationalHealthcare",
          sickLeave: {
            startDate: parseDate(object.sickLeave.startDate),
            endDate: parseDate(object.sickLeave.endDate)
          },
          employerName: parseEmployerName(object.employerName),
          id: parseId(object.id),
          description: parseDescription(object.description),
          date: parseDate(object.date),
          specialist: parseSpecialist(object.specialist)
        };
        if ('diagnosisCodes' in object) {
          newEntry.diagnosisCodes = parseDiagnosisCodes(object.diagnosisCodes);
        }
        return newEntry;
      }
      else if ( 'id' in object && 'description' in object && 'date' in object && 'specialist' in object && 'employerName' in object) {
        const newEntry: OccupationalHealthcareEntry = {
          type: "OccupationalHealthcare",
          employerName: parseEmployerName(object.employerName),
          id: parseId(object.id),
          description: parseDescription(object.description),
          date: parseDate(object.date),
          specialist: parseSpecialist(object.specialist)
        };
        if ('diagnosisCodes' in object) {
          newEntry.diagnosisCodes = parseDiagnosisCodes(object.diagnosisCodes);
        }
        return newEntry;
      }
    }
  }

  throw new Error('Incorrect data: some fields are missing');
};

export default toNewPatientEntry;