import { useEffect, useState } from "react";
import { Diagnosis, Entry, Patient } from "../../types";
import patientService from "../../services/patients";
import diagnoseService from "../../services/diagnoses";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryDetails = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case 'HealthCheck':
      return <div>HealthCheck</div>;
    case 'Hospital':
      return <div>Hospital</div>;
    case 'OccupationalHealthcare':
      return <div>OccupationalHealthCare</div>;
    default:
      return assertNever(entry);
  }

};


const PatientDetailModal = ({ id }: { id: string }) => {
  const [patientDetails, setPatientDetails] = useState<Patient | null>(null);
  const [diagnosesList, setDiagnosesList] = useState<Diagnosis[] | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      const patient = await patientService.getById(id);
      setPatientDetails(patient);
      const diagnoses = await diagnoseService.getAll();
      setDiagnosesList(diagnoses);
    };
    void fetchPatient();
  }, [id]);

  if (!patientDetails) return null;

  return (
    <div>
      <h2>
        {patientDetails.name}
        {patientDetails.gender === 'male' ? <MaleIcon /> : null}
        {patientDetails.gender === 'female' ? <FemaleIcon /> : null}
        {patientDetails.gender === 'other' ? <TransgenderIcon /> : null}
      </h2>
      <div>ssn: {patientDetails.ssn}</div>
      <div>occupation: {patientDetails.occupation}</div>

      <h3>entries</h3>
      <div>
        {
          patientDetails.entries.map(entry => {
            return (
              <div key={entry.id}>
                {entry.date} :   <i>{entry.description}</i>
                <ul>
                  {entry.diagnosisCodes?.map(code => (
                    <li key={code}>
                      {code}  {diagnosesList && diagnosesList.find(d => d.code === code)?.name}
                    </li>))}
                </ul>
                <EntryDetails entry={entry} />
              </div>
            );

          })
        }
      </div>
    </div>
  );
};

export default PatientDetailModal;