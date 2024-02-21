import { useState, useEffect } from "react";
import { Route, Link, Routes, useMatch } from "react-router-dom";
import { Button, Divider, Container, Typography } from '@mui/material';

import { Patient } from "./types";

import patientService from "./services/patients";
import PatientListPage from "./components/PatientListPage";
import PatientDetailModal from "./components/PatientDetailModal";

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const patientMatch = useMatch('/patients/:id');

  useEffect(() => {

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };
    void fetchPatientList();
  }, []);

  if (!patients) return null;

  const singlePatient = patientMatch
    ? patients.find(p => p.id === patientMatch.params.id)
    : null;
  
  return (
    <div className="App">
        <Container>
          <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
            Patientor
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Divider hidden />
          <Routes>
            <Route path="/" element={<PatientListPage patients={patients} setPatients={setPatients} />} />
            {singlePatient && <Route path="/patients/:id" element={<PatientDetailModal id={singlePatient.id} />} />}
          </Routes>
        </Container>
    </div>
  );
};

export default App;
