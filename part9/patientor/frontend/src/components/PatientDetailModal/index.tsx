import { useEffect, useState } from "react";
import { Patient } from "../../types";
import patientService from "../../services/patients";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';

const PatientDetailModal = ({ id }: {id: string}) => {
  const [patientDetails, setPatientDetails] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      const patient = await patientService.getById(id);
      setPatientDetails(patient);
    };
    void fetchPatient();
  }, [id]);

  if (!patientDetails) return null;

  return (
    <div>
      <h3>
        { patientDetails.name }
        { patientDetails.gender === 'male'? <MaleIcon/>: null }
        { patientDetails.gender === 'female'? <FemaleIcon/>: null }
        { patientDetails.gender === 'other'? <TransgenderIcon/>: null }
      </h3>
      <div>ssn: { patientDetails.ssn }</div>
      <div>occupation: { patientDetails.occupation }</div>
    </div>
  );
};

export default PatientDetailModal;