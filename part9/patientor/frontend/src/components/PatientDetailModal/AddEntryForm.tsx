import { SyntheticEvent } from "react";
import { EntryWithoutId } from "../../types";
import { Button } from "@mui/material";


interface Props {
  onSubmit: (values: EntryWithoutId) => void;
}

const AddEntryForm = ({ onSubmit }: Props) => {

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    onSubmit({
      date: '2019-10-20',
      specialist: 'MD House',
      type: 'HealthCheck',
      description: 'Yearly control visit. Cholesterol levels back to normal.',
      healthCheckRating: 0,
    });
  };

  return (
    <div>
      <form onSubmit={addEntry}>
        <Button
          style={{marginTop: 10}}
          type="submit"
          variant="contained">
          Add
        </Button>
      </form>
    </div>
  );
};


export default AddEntryForm;