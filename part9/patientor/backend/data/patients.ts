import { PatientsEntry } from "../src/types";
import toNewPatientEntry from "../src/utils";

const data = [
  {
      "id": "d2773336-f723-11e9-8f0b-362b9e155667",
      "name": "John McClane",
      "dateOfBirth": "1986-07-09",
      "ssn": "090786-122X",
      "gender": "male",
      "entries": [],
      "occupation": "New york city cop"
  },
  {
      "id": "d2773598-f723-11e9-8f0b-362b9e155667",
      "name": "Martin Riggs",
      "dateOfBirth": "1979-01-30",
      "ssn": "300179-77A",
      "gender": "male",
      "entries": [],
      "occupation": "Cop"
  },
  {
      "id": "d27736ec-f723-11e9-8f0b-362b9e155667",
      "name": "Hans Gruber",
      "dateOfBirth": "1970-04-25",
      "ssn": "250470-555L",
      "gender": "other",
      "entries": [],
      "occupation": "Technician"
  },
  {
      "id": "d2773822-f723-11e9-8f0b-362b9e155667",
      "name": "Dana Scully",
      "dateOfBirth": "1974-01-05",
      "ssn": "050174-432N",
      "gender": "female",
      "entries": [],
      "occupation": "Forensic Pathologist"
  },
  {
      "id": "d2773c6e-f723-11e9-8f0b-362b9e155667",
      "name": "Matti Luukkainen",
      "dateOfBirth": "1971-04-09",
      "ssn": "090471-8890",
      "gender": "male",
      "entries": [],
      "occupation": "Digital evangelist"
  }
];

const patientsEntries: PatientsEntry[] = data.map(obj => {
    const object = toNewPatientEntry(obj) as PatientsEntry;
    object.id = obj.id;
    return object;
});

export default patientsEntries;