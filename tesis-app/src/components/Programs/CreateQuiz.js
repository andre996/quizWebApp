import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import { Answer } from "./Answer";
import Axios from "axios";
import { toast } from "react-toastify";
import Divider from "@material-ui/core/Divider";

const useStyleForm = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(1, 0, 2)
  }
}));
const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  root: {
    display: "flex"
  },
  list: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  formControl: {
    margin: theme.spacing(1),
    width: 500
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));
export function CreateQuiz({ isOpen, handleClose, program }) {
  const classes = useStyles();
  const classesForm = useStyleForm();
  const [clicked, setClicked] = useState(false);

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [inputs, setInputs] = useState({});
  const blankAnswer = {
    label: "",
    bool: false
  };
  const blankQuestion = {
    value: "",
    answers: [{ ...blankAnswer }, { ...blankAnswer }]
  };
  const [questions, setQuestions] = useState([{ ...blankQuestion }]);

  const addQuestion = () => {
    setQuestions([...questions, { ...blankQuestion }]);
    console.log(questions);
  };

  const deleteQuestion = index => {
    console.log(questions);
    questions.splice(index, index);
    setQuestions([...questions]);
  };

  const handleSubmit = event => {
    event.preventDefault();
    console.log("Enviando Formulario");
    setClicked(true);
    const body = {
      ...inputs,
      questions,
      program: program._id
    };
    console.log(body);

    const headers = {
      "Content-Type": "application/json"
    };
    Axios.post(`http://localhost:3000/programs/quiz/${program._id}`, body, {
      headers: headers
    })
      .then(res => {
        console.log(res);
        console.log(res.data);
        console.log(
          `Se ha creado la prueba en el programa ${program._id} exitosamente!`
        );
        toast.success(
          `¡Se ha creado la prueba en el programa ${program.name} exitosamente! 📙`
        );
        cleanModal();
      })
      .catch(err => {
        console.log("No se pudo crear la prueba en el programa...");

        toast.error(
          `No se pudo crear la prueba en el programa ${program.name}... 😨`
        );
        console.log(err.message);
      });
  };
  const cleanModal = () => {
    setClicked(false);
    handleClose();
    setQuestions([{ ...blankQuestion }]);
    setInputs({});
  };
  const handleInputChange = event => {
    event.persist();
    setInputs(inputs => ({
      ...inputs,
      [event.target.name]: event.target.value
    }));
  };
  const handleQuestionChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].value = e.target.value;
    setQuestions(updatedQuestions);
  };
  const addNewAnswers = index => {
    const newQuestions = [...questions[index].answers, { ...blankAnswer }];
    questions[index].answers = newQuestions;
    setQuestions([...questions]);
  };
  const deleteAnswers = (index, indey) => {
    console.log(questions[index].answers.length);
    if (questions[index].answers.length > 2) {
      questions[index].answers.splice(indey, indey);
    }
    const newAnswers = questions[index].answers;
    console.log(newAnswers);

    questions[index].answers = newAnswers;
    setQuestions([...questions]);
  };

  const handleAnswerChange = (e, index, indey) => {
    const updatedAnswers = [...questions[index].answers];
    updatedAnswers[indey].label = e.target.value;
  };
  const handleBoolChange = (e, index, indey) => {
    const updatedAnswers = [...questions[index].answers];
    updatedAnswers[indey].bool = e.target.checked;
  };

  return (
    <Dialog
      fullWidth={true}
      open={isOpen}
      onClose={cleanModal}
      aria-labelledby="responsive-dialog-title"
      scroll={"body"}
      maxWidth={"lg"}
    >
      <div className={classes.paper}>
        <div className={classesForm.paper}>
          <Avatar className={classesForm.avatar}>
            <EditIcon />
          </Avatar>
          <DialogTitle id="responsive-dialog-title">
            {`Crear Prueba para el Programa ${program.name}`}
          </DialogTitle>
          <DialogContent>
            <form className={classesForm.form} onSubmit={handleSubmit}>
              <Grid
                container
                spacing={2}
                justify={"space-evenly"}
                style={{
                  marginBottom: "5%"
                }}
              >
                <Grid item xs={12} sm={12}>
                  <TextField
                    autoComplete="fname"
                    name="title"
                    variant="outlined"
                    required
                    fullWidth
                    id="title"
                    label="Título de la prueba"
                    autoFocus
                    onChange={handleInputChange}
                    value={inputs.title || ""}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                spacing={4}
                justify={"space-evenly"}
                style={{ border: "1px solid gray", borderRadius: "5px" }}
              >
                {questions.map((val, idx) => {
                  const questionLabelID = `label-${idx}`;
                  return (
                    <React.Fragment key={`questionKey-${idx}`}>
                      <Grid item xs={12} sm={12}>
                        <TextField
                          variant="outlined"
                          required
                          id={questionLabelID}
                          type="text"
                          label={`Pregunta Nro ${idx + 1}`}
                          name={questionLabelID}
                          fullWidth
                          autoComplete="lname"
                          value={questions[idx].value || ""}
                          onChange={e => {
                            handleQuestionChange(e, idx);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} align="center">
                        <Button
                          type="button"
                          variant="contained"
                          color="inherit"
                          className={classesForm.submit}
                          onClick={() => addNewAnswers(idx)}
                        >
                          Añadir Respuesta
                        </Button>
                      </Grid>
                      {idx !== 0 ? (
                        <Grid item xs={12} sm={6}>
                          <Button
                            type="button"
                            variant="contained"
                            color="secondary"
                            className={classesForm.submit}
                            onClick={() => deleteQuestion(idx)}
                          >
                            Borrar Pregunta
                          </Button>
                        </Grid>
                      ) : (
                        ""
                      )}

                      <Grid
                        container
                        justify={"center"}
                        style={{ padding: "3%" }}
                      >
                        {questions[idx].answers.map((val, idy) => {
                          const answersID = `answers-${idx}-${idy}`;

                          return (
                            <Answer
                              key={answersID}
                              index={idy}
                              id={answersID}
                              handleAnswerChange={e =>
                                handleAnswerChange(e, idx, idy)
                              }
                              handleBoolChange={e =>
                                handleBoolChange(e, idx, idy)
                              }
                              deleteAnswers={() => {
                                deleteAnswers(idx, idy);
                              }}
                            ></Answer>
                          );
                        })}
                      </Grid>
                    </React.Fragment>
                  );
                })}
              </Grid>
              <Divider variant="middle" />
              <Grid
                item
                xs={12}
                sm={12}
                align="center"
                style={{ marginTop: "5%" }}
              >
                <Button
                  type="button"
                  variant="contained"
                  fullWidth
                  color="inherit"
                  className={classesForm.submit}
                  onClick={addQuestion}
                >
                  Añadir pregunta
                </Button>
              </Grid>
              <DialogActions style={{ paddingTop: "5%" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      onClick={cleanModal}
                      color="inherit"
                      fullWidth
                      variant="contained"
                      className={classesForm.submit}
                    >
                      Cerrar
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classesForm.submit}
                      disabled={clicked}
                    >
                      Crear
                    </Button>
                  </Grid>
                </Grid>
              </DialogActions>
            </form>
          </DialogContent>
        </div>
      </div>
    </Dialog>
  );
}
