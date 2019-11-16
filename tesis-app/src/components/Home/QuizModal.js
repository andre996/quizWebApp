import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Axios from "axios";
import { toast } from "react-toastify";
import DialogContentText from "@material-ui/core/DialogContentText";

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
    backgroundColor: theme.palette.secondary.main
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
export function QuizModal({ isOpen, handleClose, quiz }) {
  const classes = useStyles();
  const classesForm = useStyleForm();
  const [clicked, setClicked] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const handleOpenConfirm = quiz => {
    setOpenConfirm(true);
    // setQuiz(quiz);
  };
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    // setQuiz({});
  };

  // getModalStyle is not a pure function, we roll the style only on the first render
  const blankAnswer = {
    label: "Verdadero",
    bool: false
  };
  const blankQuestion = {
    value: "Pregunta de Prueba",
    answers: [{ ...blankAnswer }]
  };
  const [questions, setQuestions] = useState([{ ...blankQuestion }]);
  useEffect(() => {
    if (!!quiz.questions) updateModal(quiz);
    console.log(quiz.questions);
    console.log(quiz);
  }, [quiz]);
  const updateModal = quiz => {
    const fetchData = () => {
      console.log(quiz.questions);
      setQuestions(quiz.questions);
    };
    fetchData();
  };

  const handleSubmit = event => {
    event.preventDefault();
    setClicked(true);
    console.log("Enviando Formulario");
    const body = {
      ...quiz,
      questions
    };
    console.log(body);

    const headers = {
      "Content-Type": "application/json"
    };
    Axios.post(`http://localhost:3000/users/quiz`, body, {
      headers: headers
    })
      .then(res => {
        console.log(res);
        console.log(res.data);
        console.log(`Se ha enviado la prueba exitosamente!`);
        toast.success(`¡Se ha enviado la prueba exitosamente! 👨‍🏫`);
        cleanModal();
      })
      .catch(err => {
        console.log("No se pudo enviar el quiz...");
        toast.error(`No se pudo enviar la prueba... 🙎‍♂️`);
        console.log(err.message);
      });
  };
  const cleanModal = () => {
    setClicked(false);
    handleClose();
    setQuestions([]);
    handleCloseConfirm();
  };
  const handleBoolChange = (e, index, indey) => {
    const updatedAnswers = [...questions[index].answers];
    updatedAnswers[indey].bool = e.target.checked;
    console.log(questions);
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
            {`${quiz.title}`}
          </DialogTitle>
          <DialogContent>
            <form className={classesForm.form} onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {questions.map((quiz, idx) => {
                  const questionLabelID = `label-${idx}`;
                  return (
                    <Grid item xs={12} sm={12}>
                      <FormControl
                        component="fieldset"
                        className={classes.formControl}
                        key={questionLabelID}
                      >
                        <FormLabel component="legend">{quiz.value}</FormLabel>
                        <FormGroup>
                          {quiz.answers.map((answer, idy) => {
                            const answersID = `answers-${idx}-${idy}`;

                            return (
                              <FormControlLabel
                                key={answersID}
                                control={
                                  <Checkbox
                                    id={`bool-${idy}`}
                                    type="checkbox"
                                    name={`bool-${idy}`}
                                    onClick={e => handleBoolChange(e, idx, idy)}
                                  />
                                }
                                label={answer.label}
                              />
                            );
                          })}
                        </FormGroup>
                      </FormControl>
                    </Grid>
                  );
                })}
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
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classesForm.submit}
                      // disabled={clicked}
                      onClick={handleOpenConfirm}
                    >
                      Enviar
                    </Button>
                  </Grid>
                </Grid>
              </DialogActions>
              <Dialog
                open={openConfirm}
                // onClose={handleCloseConfirm}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Confirmación de la prueba"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    {`¿Esta usted seguro de que desea enviar esta prueba?`}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleCloseConfirm}
                    color="inherit"
                    variant="contained"
                  >
                    Volver
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    disabled={clicked}
                    onClick={handleSubmit}
                  >
                    Enviar Prueba
                  </Button>
                </DialogActions>
              </Dialog>
            </form>
          </DialogContent>
        </div>
      </div>
    </Dialog>
  );
}
