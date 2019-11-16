import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
// import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { makeStyles } from "@material-ui/core/styles";
import Axios from "axios";
// import useMediaQuery from "@material-ui/core/useMediaQuery";
// import { useTheme } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
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

export function CreateModal({ isOpen, handleClose, students }) {
  const classes = useStyles();
  const classesForm = useStyleForm();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [inputs, setInputs] = useState({});
  const [users, setUsers] = useState([]);
  const [clicked, setClicked] = useState(false);

  // const theme = useTheme();
  // const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  // const errorS = users.filter(v => v).length < 1;
  const cleanModal = () => {
    setClicked(false);
    handleClose();
    setUsers([]);
    setInputs({});
  };
  const handleToggleStudents = value => () => {
    const currentIndex = users.indexOf(value);
    const newChecked = [...users];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setUsers(newChecked);
    console.log(newChecked);
  };
  const handleSubmit = event => {
    event.preventDefault();
    setClicked(true);
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
    Axios.post(`http://localhost:3000/programs`, body, {
      headers: headers
    })
      .then(res => {
        console.log(res);
        console.log(res.data);
        console.log("Se ha creado el programa exitosamente");
        toast.success("¡Se ha creado el programa exitosamente! 📚");
        cleanModal();
      })
      .catch(err => {
        console.log("No se pudo crear el programa...");
        toast.success("¡Oops! El programa no pudo ser creado... 😢");
        console.log(err.message);
      });
  };
  const handleInputChange = event => {
    event.persist();
    setInputs(inputs => ({
      ...inputs,
      [event.target.name]: event.target.value
    }));
    console.log(event.target.value);
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
            {`Crear Programa`}
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
                      // error={errorS}
                      component="fieldset"
                      style={{ paddingLeft: "6%" }}
                    >
                      <FormGroup>
                        {students.map(program => {
                          const labelId = `checkbox-list-label-${program._id}`;
                          return (
                            <FormControlLabel
                              key={program._id}
                              control={
                                <Checkbox
                                  edge="start"
                                  color="primary"
                                  checked={users.indexOf(program._id) !== -1}
                                  tabIndex={-1}
                                  disableRipple
                                  inputProps={{ "aria-labelledby": labelId }}
                                  onClick={handleToggleStudents(program._id)}
                                />
                              }
                              label={`${program.firstName} ${program.lastName}`}
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
