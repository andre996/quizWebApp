import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";

export const Answer = ({
  index,
  id,
  handleAnswerChange,
  handleBoolChange,
  deleteAnswers
}) => {
  const [answer, setAnswer] = useState([
    {
      label: "",
      bool: false
    }
  ]);

  return (
    <Grid
      container
      key={`answerKey-${index}`}
      style={{ paddingTop: "1%", paddingBottom: "1%" }}
    >
      <Grid item xs={12} sm={6}>
        <TextField
          variant="outlined"
          fullWidth
          required
          id={id}
          type="text"
          label={`Respuesta Nro ${index + 1}`}
          name={id}
          autoComplete="lname"
          value={answer.label}
          onChange={handleAnswerChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <Checkbox
          id={`bool-${index}`}
          type="checkbox"
          name={`bool-${index}`}
          checked={answer.bool}
          onClick={handleBoolChange}
        />
        <span>Marcar respuesta como verdadera</span>
      </Grid>
      {index < 2 ? (
        ""
      ) : (
        <Grid item xs={12} sm={2}>
          <Button
            type="button"
            variant="contained"
            color="secondary"
            onClick={deleteAnswers}
          >
            <DeleteOutlinedIcon></DeleteOutlinedIcon>
          </Button>
        </Grid>
      )}
    </Grid>
  );
};
