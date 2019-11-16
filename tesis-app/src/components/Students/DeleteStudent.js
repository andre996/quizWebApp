import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import Avatar from "@material-ui/core/Avatar";
// import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
// import Modal from "@material-ui/core/Modal";
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
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export function DeleteStudent({ isOpen, handleClose, programsList, student }) {
  const classes = useStyles();
  const classesForm = useStyleForm();
  const [inputs, setInputs] = useState({});
  const [programs, setPrograms] = useState([]);
  const cleanModal = () => {
    handleClose();
  };
  useEffect(() => {
    updateModal(student);
  }, [student]);
  const updateModal = student => {
    const fetchData = () => {
      setInputs({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        password: student.password
      });
      setPrograms(student.programs);
    };

    fetchData();
  };

  const handleSubmit = event => {
    event.preventDefault();
    console.log("Enviando Formulario ");
    console.log("Borrando usuario " + student._id);

    const headers = {
      "Content-Type": "application/json"
    };
    Axios.delete(`http://localhost:3000/users/${student._id}`, {
      headers: headers
    })
      .then(res => {
        console.log(res);
        console.log(res.data);
        console.log(
          `Se ha borrado a el usuario ${student.firstName} exitosamente`
        );
        toast.success(
          `Se ha borrado a el usuario ${student.firstName} exitosamente 👋`
        );
        handleClose();
      })
      .catch(err => {
        console.log(
          `No se pudo borrar a el usuario ${student.firstName} ${student.lastName}`
        );
        toast.error(
          `No se pudo borrar a el usuario ${student.firstName} ${student.lastName} 🙄`
        );
        console.log(err.message);
        handleClose();
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
          <Avatar className={classesForm.avatar}>
            <EditIcon />
          </Avatar>
          <DialogTitle id="responsive-dialog-title">
            {`Borrar Usuario`}
          </DialogTitle>
          <DialogContent>
            <form className={classesForm.form} onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography component="p">
                    {`Nombre del Usuario:${inputs.firstName}`}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography component="p">
                    {`Apellido del Usuario:${inputs.lastName}`}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography component="p">
                    {`Email del Usuario:${inputs.email}`}
                  </Typography>
                </Grid>
                {programs.length === 0 ? (
                  <Grid item xs={12} sm={6}>
                    <Typography component="p">
                      {`Este Usuario no está asignado a ningún programa`}
                    </Typography>
                  </Grid>
                ) : (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    style={{ overflowY: "auto", height: "25vh" }}
                  >
                    <InputLabel htmlFor="student-label-placeholder">
                      Programas asignados a este Usuario
                    </InputLabel>
                    <FormControl
                      component="fieldset"
                      style={{ paddingLeft: "6%" }}
                    >
                      <FormGroup>
                        {programsList
                          .filter(
                            program => programs.indexOf(program._id) !== -1
                          )
                          .map((program, index) => {
                            const labelId = `checkbox-list-label-${program._id}-${index}`;
                            return (
                              <FormControlLabel
                                key={labelId}
                                control={
                                  <Checkbox
                                    key={`check-${index}`}
                                    style={{ visibility: "hidden" }}
                                    edge="start"
                                    checked={
                                      programs.indexOf(program._id) !== -1
                                    }
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ "aria-labelledby": labelId }}
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

                <Grid item xs={12} sm={12}>
                  <Typography component="strong">
                    {`¿Esta seguro de que desea borrar a este usuario?, esta acción no se podrá deshacer...`}
                  </Typography>
                </Grid>
              </Grid>
              <DialogActions>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      onClick={cleanModal}
                      color="primary"
                      fullWidth
                      variant="contained"
                      className={classesForm.submit}
                    >
                      No, no deseo borrar a este usuario
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="secondary"
                      className={classesForm.submit}
                    >
                      Si, si deseo borrar a este usuario
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
