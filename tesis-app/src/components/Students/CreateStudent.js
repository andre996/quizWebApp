import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
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
import { toast } from "react-toastify";

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

export function CreateStudent({ isOpen, handleClose, programsList }) {
  const classes = useStyles();
  const classesForm = useStyleForm();
  const [inputs, setInputs] = useState({});
  const [programs, setPrograms] = React.useState([]);
  const [clicked, setClicked] = useState(false);

  // const errorP = programs.filter(v => v).length < 1;
  // const theme = useTheme();
  // const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const cleanModal = () => {
    setClicked(false);
    handleClose();
    setPrograms([]);
    setInputs({});
  };
  const handleToggleProgram = program => () => {
    const currentIndex = programs.indexOf(program);
    const newChecked = [...programs];

    if (currentIndex === -1) {
      newChecked.push(program);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setPrograms(newChecked);
  };
  const handleInputChange = event => {
    event.persist();
    setInputs(inputs => ({
      ...inputs,
      [event.target.name]: event.target.value
    }));
    console.log(inputs);
  };
  const handleBoolChange = e => {
    e.persist();
    setInputs(inputs => ({
      ...inputs,
      [e.target.name]: e.target.checked
    }));
    console.log(inputs);
  };
  const handleSubmit = event => {
    event.preventDefault();
    setClicked(true);
    console.log("Enviando Formulario");
    console.log(inputs);
    let body;
    if (inputs.admin) {
      body = {
        ...inputs
      };
    } else {
      body = {
        ...inputs,
        programs
      };
    }
    console.log(body);

    const headers = {
      "Content-Type": "application/json"
    };
    Axios.post(`http://localhost:3000/users`, body, {
      headers: headers
    })
      .then(res => {
        console.log(res);
        console.log(res.data);
        console.log("Se ha creado el usuario exitosamente");
        res.data.message !== "Alcanzo el maximo numero de adminstradores 🤷‍"
          ? toast.success(res.data.message)
          : toast.warn(res.data.message);
        cleanModal();
      })
      .catch(err => {
        console.log("No se pudo crear el usuario...");
        toast.error(err.message);
        console.log(err);
        cleanModal();
      });
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
          <Avatar className={classesForm.avatar} color="primary">
            <EditIcon />
          </Avatar>
          <DialogTitle id="responsive-dialog-title">
            {`Crear Usuario`}
          </DialogTitle>
          <DialogContent>
            <form className={classesForm.form} onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="fname"
                    name="firstName"
                    variant="outlined"
                    required
                    fullWidth
                    id="firstName"
                    label="Nombre del Usuario"
                    autoFocus
                    onChange={handleInputChange}
                    value={inputs.firstName || ""}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    label="Apellido del Usuario"
                    name="lastName"
                    autoComplete="lname"
                    onChange={handleInputChange}
                    value={inputs.lastName || ""}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email del Usuario"
                    name="email"
                    type="email"
                    autoComplete="email"
                    onChange={handleInputChange}
                    value={inputs.email || ""}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="password"
                    label="Contraseña del Usuario"
                    type="password"
                    name="password"
                    autoComplete="password"
                    onChange={handleInputChange}
                    value={inputs.password || ""}
                  />
                </Grid>
                {programsList.length === 0 || inputs.admin ? (
                  ""
                ) : (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    style={{ overflowY: "auto", height: "30vh" }}
                  >
                    <InputLabel htmlFor="user-label-placeholder">
                      Asignar Programas a este Usuario
                    </InputLabel>
                    <FormControl
                      component="fieldset"
                      style={{ paddingLeft: "6%" }}
                    >
                      <FormGroup>
                        {programsList.map(program => {
                          const labelId = `checkbox-list-label-${program._id}`;
                          return (
                            <FormControlLabel
                              key={program._id}
                              control={
                                <Checkbox
                                  color="primary"
                                  edge="start"
                                  checked={
                                    programs.indexOf(program._id) !== -1 ||
                                    false
                                  }
                                  tabIndex={-1}
                                  disableRipple
                                  inputProps={{ "aria-labelledby": labelId }}
                                  onClick={handleToggleProgram(program._id)}
                                />
                              }
                              label={`${program.name}`}
                            />
                          );
                        })}
                      </FormGroup>
                    </FormControl>
                  </Grid>
                )}

                <Grid item xs={12} sm={6} align="center">
                  <FormGroup>
                    <FormControlLabel
                      key={"userType"}
                      control={
                        <Checkbox
                          edge="start"
                          id={`admin`}
                          type="checkbox"
                          name={`admin`}
                          checked={inputs.admin}
                          onClick={handleBoolChange}
                          disableRipple
                        />
                      }
                      label="¿Es Administrador este usuario?"
                    />
                  </FormGroup>
                </Grid>
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
