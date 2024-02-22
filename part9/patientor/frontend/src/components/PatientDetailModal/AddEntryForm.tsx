import { Ref, SyntheticEvent, forwardRef, useImperativeHandle, useState } from "react";
import { Diagnosis, EntryWithoutId, HealthCheckRating } from "../../types";
import { Button, Input, MenuItem, OutlinedInput, Select, TextField } from "@mui/material";


interface Props {
  onSubmit: (values: EntryWithoutId) => void;
  diagnosesList: Diagnosis[] | null
}

const AddEntryForm = forwardRef(({ onSubmit, diagnosesList }: Props, ref: Ref<{clearData: () => void}>) => {
  const [visible, setVisible] = useState(false);
  const [toggle, setToggle] = useState('add entry');
  const [type, setType] = useState<EntryWithoutId['type']>('HealthCheck');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [rating, setRating] = useState<HealthCheckRating>(0);
  const [dDate, setdDate] = useState('');
  const [criteria, setCriteria] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<Array<Diagnosis['code']> | Diagnosis['code']>([]);

  const clearData = () => {
    setDescription('');
    setSpecialist('');
    setDate('');
    setRating(0);
    setdDate('');
    setCriteria('');
    handleShowClick();
    setEmployerName('');
    setStartDate('');
    setEndDate('');
    setDiagnosisCodes([]);
  };

  useImperativeHandle(ref, () => {
    return {
      clearData
    };
  });

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    if (type === 'HealthCheck') {
      onSubmit({
        type,
        date,
        specialist,
        description,
        diagnosisCodes: diagnosisCodes as string[],
        healthCheckRating: rating
      });
    }
    else if (type === 'Hospital') {
      onSubmit({
        type,
        date,
        specialist,
        description,
        diagnosisCodes: diagnosisCodes as string[],
        discharge: {
          date: dDate,
          criteria
        }
      });
    }
    else {
      onSubmit({
        type,
        date,
        specialist,
        description,
        diagnosisCodes: diagnosisCodes as string[],
        employerName,
        sickLeave: {
          startDate,
          endDate
        }
      });
    }
  };

  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };
  const handleShowClick = () => {
    toggleVisibility();
    setToggle(toggle === 'add entry' ? 'cancel' : 'add entry');
  };

  return (
    <div>
      <Button onClick={handleShowClick} style={{ marginTop: 10 }} variant="contained" >{toggle}</Button>
      <div style={showWhenVisible}>
        <form onSubmit={addEntry} style={{
          border: "2px solid black",
          backgroundColor: "lightgray", padding: 10, margin: 10,
          borderRadius: 5
        }}>
          <Select
            label="Type"
            style={{ marginTop: 10, zIndex: 5 }}
            value={type}
            onChange={({ target }) => setType(target.value as EntryWithoutId['type'])}
          >
            <MenuItem value={'HealthCheck'}>Health Check</MenuItem>
            <MenuItem value={'Hospital'}>Hospital</MenuItem>
            <MenuItem value={'OccupationalHealthcare'}>Occupational Healthcare</MenuItem>
          </Select>

          <TextField
            label="Description"
            style={{ marginTop: 10 }}
            fullWidth
            value={description}
            onChange={({ target }) => setDescription(target.value)}
          />


          <span style={{ marginRight: 10 }}>Date :</span>
          <Input
            style={{ marginTop: 10 }}
            type="date"
            value={date}
            onChange={({ target }) => setDate(target.value)}
          />
          <TextField
            label="Specialist"
            style={{ marginTop: 10 }}
            fullWidth
            value={specialist}
            onChange={({ target }) => setSpecialist(target.value)}
          />

          <span style={{ marginRight: 10 }}>Diagnosis Codes :</span>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            style={{ marginTop: 10 }}
            multiple
            value={diagnosisCodes}
            onChange={({ target }) => {

              setDiagnosisCodes(target.value);
            }}
            input={<OutlinedInput label="Diagnoses Code" />}
          >
            {diagnosesList && diagnosesList.map((diagnoses) => (
              <MenuItem
                key={diagnoses.code}
                value={diagnoses.code}
              >
                {diagnoses.code}
              </MenuItem>
            ))}
          </Select>
          <br />
          {
            type === 'HealthCheck' &&
            <Select
              label="Rating"
              style={{ marginTop: 10, zIndex: 5 }}
              value={rating}
              onChange={({ target }) => setRating(target.value as HealthCheckRating)}
            >
              <MenuItem value={HealthCheckRating.Healthy}>Healthy</MenuItem>
              <MenuItem value={HealthCheckRating.LowRisk}>Low Risk</MenuItem>
              <MenuItem value={HealthCheckRating.HighRisk}>High Risk</MenuItem>
              <MenuItem value={HealthCheckRating.CriticalRisk}>Critical Risk</MenuItem>
            </Select>
          }

          {
            type === 'Hospital' &&
            <div style={{ marginTop: 10 }}>
              Discharge :
              <div style={{ paddingLeft: 20 }}>
                <span style={{ marginRight: 10 }}>Date :</span>
                <Input
                  style={{ marginTop: 10 }}
                  type="date"
                  value={dDate}
                  onChange={({ target }) => setdDate(target.value)}
                />
                <TextField
                  label="Criteria"
                  style={{ marginTop: 10 }}
                  fullWidth
                  value={criteria}
                  onChange={({ target }) => setCriteria(target.value)}
                />
              </div>
            </div>
          }

          {
            type === 'OccupationalHealthcare' &&
            <div style={{ marginTop: 10 }}>
              Sick Leave:
              <div style={{ paddingLeft: 20 }}>
                <span style={{ marginRight: 10 }}>Start Date :</span>
                <Input
                  style={{ marginTop: 10 }}
                  type="date"
                  value={startDate}
                  onChange={({ target }) => setStartDate(target.value)}
                />
                <span style={{ marginRight: 10, marginLeft: 25 }}>End Date :</span>
                <Input
                  style={{ marginTop: 10 }}
                  type="date"
                  value={endDate}
                  onChange={({ target }) => setEndDate(target.value)}
                />
                <TextField
                  label="Employer Name"
                  style={{ marginTop: 10 }}
                  fullWidth
                  value={employerName}
                  onChange={({ target }) => setEmployerName(target.value)}
                />
              </div>
            </div>
          }

          <Button
            style={{ marginTop: 10, display: "block" }}
            type="submit"
            variant="contained">
            Add
          </Button>
        </form>
      </div>
    </div>
  );
});


export default AddEntryForm;