import { useEffect, useState, useRef } from "react";
import { Diagnosis, Entry, EntryWithoutId, HealthCheckRating, Patient } from "../../types";
import patientService from "../../services/patients";
import diagnoseService from "../../services/diagnoses";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import WorkIcon from '@mui/icons-material/Work';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import { green, orange, red, yellow } from "@mui/material/colors";
import AddEntryForm from "./AddEntryForm";
import axios from "axios";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryDetails = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case 'HealthCheck':
      return (
        <div>
          {entry.date}
          <MedicalInformationIcon color="action" />
          <div>
            Health Check Rating :
            {entry.healthCheckRating === HealthCheckRating.CriticalRisk ? <FavoriteIcon sx={{ color: red[500] }} /> : null}
            {entry.healthCheckRating === HealthCheckRating.HighRisk ? <FavoriteIcon sx={{ color: orange[500] }} /> : null}
            {entry.healthCheckRating === HealthCheckRating.LowRisk ? <FavoriteIcon sx={{ color: yellow[500] }} /> : null}
            {entry.healthCheckRating === HealthCheckRating.Healthy ? <FavoriteIcon sx={{ color: green[500] }} /> : null}
          </div>
        </div>);

    case 'Hospital':
      return (
        <div>
          {entry.date}
          <MedicalInformationIcon color="action" />
          <div>
            Discharge :
            <ul style={{ marginTop: 0 }}>
              <li> date : {entry.discharge.date} </li>
              <li> criteria : {entry.discharge.criteria} </li>
            </ul>
          </div>
        </div>);
    case 'OccupationalHealthcare':
      return (
        <div>
          {entry.date}
          <WorkIcon color="action" />
          <i>{entry.employerName}</i>
          <div>
            {entry.sickLeave &&
              <div>
                Sick leave :
                <ul style={{ marginTop: 0 }}>
                  <li> start : {entry.sickLeave.startDate} </li>
                  <li> end : {entry.sickLeave.endDate} </li>
                </ul>
              </div>}
          </div>
        </div>);

    default:
      return assertNever(entry);
  }

};

const Notification = ({ errorMessage }: { errorMessage: string | null }) => {
  if (!errorMessage) return null;
  else {
    return (
      <div style={{
        display: 'block', padding: 10, backgroundColor: 'lightpink',
        border: "2px solid red", marginTop: 10, color: 'darkred'
      }}>
        {errorMessage}
      </div>
    );
  }
};


const PatientDetailModal = ({ id }: { id: string }) => {
  const [patientDetails, setPatientDetails] = useState<Patient | null>(null);
  const [diagnosesList, setDiagnosesList] = useState<Diagnosis[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const entryFormRef = useRef<{clearData: () => void}>(null);

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

  const Notify = (msg: string) => {
    setError(msg);
    setTimeout(() => {setError(null);}, 5000);
  };

  const submitNewEntry = async (entry: EntryWithoutId) => {
    try {
      const patient = await patientService.addEntry(entry, patientDetails.id);
      setPatientDetails(patient);
      if (entryFormRef.current) {entryFormRef.current.clearData();}
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace('Something went wrong. Error: ', '');
          Notify(message);
        } else {
          Notify("Unrecognized axios error");
        }
      } else {
        Notify("Unknown error" + e);
      }
    }
  };

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

      <Notification errorMessage={error} />
      <AddEntryForm onSubmit={submitNewEntry} diagnosesList={diagnosesList} ref={entryFormRef} />

      <h3>entries</h3>
      <div>
        {
          patientDetails.entries.map(entry => {
            return (
              <div key={entry.id} style={{
                border: "2px solid black",
                backgroundColor: "lightgray", padding: 10, margin: 10,
                borderRadius: 5
              }}>

                <div><EntryDetails entry={entry} /></div>
                <div><i>{entry.description}</i></div>

                <ul>
                  {entry.diagnosisCodes?.map(code => (
                    <li key={code}>
                      {code}  {diagnosesList && diagnosesList.find(d => d.code === code)?.name}
                    </li>))}
                </ul>

                <div>diagnosed by {entry.specialist}</div>

              </div>
            );

          })
        }
      </div>
    </div>
  );
};

export default PatientDetailModal;