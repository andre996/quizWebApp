import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";

import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { makeStyles } from "@material-ui/core/styles";
import Axios from "axios";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
// import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

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
    margin: theme.spacing(3, 0, 2)
  }
}));
const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  root: {
    display: "flex",
    flexWrap: "wrap"
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

export function UpdateModal({ isOpen, handleClose, students, program }) {
  // console.log(program);
  const classes = useStyles();
  const classesForm = useStyleForm();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [inputs, setInputs] = useState({});
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [quiz, setQuiz] = useState({});

  const [openConfirm, setOpenConfirm] = useState(false);

  const cleanModal = () => {
    handleClose();
    setUsers([]);
    setInputs({});
    setOpenConfirm(false);
  };
  const handleOpenConfirm = quiz => {
    setOpenConfirm(true);
    setQuiz(quiz);
  };
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setQuiz({});
  };
  const deleteQuiz = quiz => {
    const headers = {
      "Content-Type": "application/json"
    };
    Axios.delete(`http://localhost:3000/quiz/${quiz._id}`, {
      headers: headers
    })
      .then(res => {
        console.log(res);
        console.log(res.data);
        console.log("Se ha borrado la prueba exitosamente");
        toast.success(`¡Se ha borrado la prueba exitosamente! 🗑`);
        handleCloseConfirm();
        updateModal(program);
      })
      .catch(err => {
        console.log("No se pudo borrar la prueba...");
        toast.error(`No se pudo borrar la prueba... 😕`);
        console.log(err.message);
      });
  };

  // const history = useHistory();
  useEffect(() => {
    console.log(program);

    updateModal(program);
  }, [program]);
  const updateModal = program => {
    const fetchData = () => {
      setInputs({
        name: program.name,
        description: program.description
      });
      console.log(program.users);
      setUsers(program.users);
    };
    const fetchQuizzes = () => {
      const body = {
        id: program._id
      };
      const headers = {
        "Content-Type": "application/json"
      };
      Axios.post(`http://localhost:3000/quiz`, body, {
        headers: headers
      })
        .then(res => {
          console.log(res.data);
          setQuizzes(res.data);
        })
        .catch(err => {
          console.log(err);
          console.log(err.message);
        });
    };
    fetchData();
    if (program._id !== "") fetchQuizzes();
  };
  // const errorS = users.filter(v => v).length < 1;

  const handleToggleStudents = value => () => {
    const currentIndex = users.indexOf(value);
    const newChecked = [...users];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setUsers(newChecked);
    console.log(users);
  };
  const handleSubmit = event => {
    event.preventDefault();
    console.log("Enviando Formulario");
    console.log(inputs);
    const body = {
      ...inputs,
      users
    };
    console.log(body);

    const headers = {
      "Content-Type": "application/json"
    };
    Axios.put(`http://localhost:3000/programs/${program._id}`, body, {
      headers: headers
    })
      .then(res => {
        console.log(res);
        console.log(res.data);
        console.log("Se ha actualizado el programa exitosamente");
        toast.success(`¡Se ha actualizado el programa exitosamente! ✏`);
        handleClose();
      })
      .catch(err => {
        console.log("No se pudo actualizar el programa...");
        toast.error(`No se pudo actualizar el programa... 🤦‍♂️`);
        console.log(err.message);
      });
  };
  const handleInputChange = event => {
    event.persist();
    setInputs(inputs => ({
      ...inputs,
      [event.target.name]: event.target.value
    }));
    console.log(inputs);
  };
  return (
    <React.Fragment>
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
              {`Actualizar Programa ${program.name}`}
            </DialogTitle>
            <DialogContent>
              <form className={classesForm.form} onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="fname"
                      name="name"
                      variant="outlined"
                      required
                      fullWidth
                      id="name"
                      label="Nombre del programa"
                      autoFocus
                      onChange={handleInputChange}
                      value={inputs.name || ""}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="description"
                      label="Descripcion del programa"
                      name="description"
                      autoComplete="lname"
                      onChange={handleInputChange}
                      value={inputs.description || ""}
                    />
                  </Grid>
                  {students.length === 0 ? (
                    ""
                  ) : (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      style={{ overflowY: "auto", height: "25vh" }}
                    >
                      <InputLabel htmlFor="user-label-placeholder">
                        Asignar Usuarios a este Programa
                      </InputLabel>
                      <FormControl
                        component="fieldset"
                        style={{ paddingLeft: "6%" }}
                      >
                        <FormGroup>
                          {students.map(student => {
                            const labelId = `checkbox-list-label-${student._id}`;
                            return (
                              <FormControlLabel
                                key={student._id}
                                control={
                                  <Checkbox
                                    color="primary"
                                    edge="start"
                                    checked={users.indexOf(student._id) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ "aria-labelledby": labelId }}
                                    onClick={handleToggleStudents(student._id)}
                                  />
                                }
                                label={`${student.firstName} ${student.lastName}`}
                              />
                            );
                          })}
                          {/* <FormControlLabel
                            style={{ visibility: "hidden" }}
                            key={"studentsChecked"}
                            control={
                              <Checkbox
                                required
                                edge="start"
                                checked={!errorS}
                                tabIndex={-1}
                                disableRipple
                              />
                            }
                          /> */}
                        </FormGroup>
                        {/* <FormHelperText required={false}>
                          {errorS ? "Selecciona al menos 1 usuario" : null}
                        </FormHelperText> */}
                      </FormControl>
                    </Grid>
                  )}
                  {quizzes.length === 0 ? (
                    ""
                  ) : (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      style={{ overflowY: "auto", height: "25vh" }}
                    >
                      <InputLabel htmlFor="user-label-placeholder">
                        Eliminar Pruebas
                      </InputLabel>
                      <FormControl
                        // error={errorS}
                        component="fieldset"
                        style={{ paddingLeft: "6%" }}
                      >
                        <FormGroup>
                          {quizzes.map((quiz, idy) => {
                            const labelId = `list-label-${idy}`;
                            return (
                              <FormControlLabel
                                key={labelId}
                                control={
                                  <Button
                                    variant="contained"
                                    size="small"
                                    color="secondary"
                                    style={{ minWidth: "24px", margin: "2%" }}
                                    onClick={() => handleOpenConfirm(quiz)}
                                  >
                                    <DeleteOutlinedIcon></DeleteOutlinedIcon>
                                  </Button>
                                }
                                label={`${quiz.title}`}
                                // labelPlacement="start"
                              />
                            );
                          })}
                          {/* <FormControlLabel
                            style={{ visibility: "hidden" }}
                            key={"studentsChecked"}
                            control={
                              <Checkbox
                                required
                                edge="start"
                                checked={!errorS}
                                tabIndex={-1}
                                disableRipple
                              />
                            }
                          /> */}
                        </FormGroup>
                        {/* <FormHelperText required={false}>
                          {errorS ? "Selecciona al menos 1 usuario" : null}
                        </FormHelperText> */}
                      </FormControl>
                    </Grid>
                  )}
                </Grid>
                <DialogActions>
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
                      >
                        Actualizar
                      </Button>
                    </Grid>
                  </Grid>
                </DialogActions>
              </form>
            </DialogContent>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={openConfirm}
        // onClose={handleCloseConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmación de Seguridad"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`¿Esta usted seguro de que desea borrar esta prueba? : "${quiz.title}" , esta acción no se podrá deshacer...`}
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
            onClick={() => deleteQuiz(quiz)}
            color="secondary"
            variant="contained"
          >
            Borrar Prueba
          </Button>
        </DialogActions>
      </Dialog>
    
    </React.Fragment>
  );
}
