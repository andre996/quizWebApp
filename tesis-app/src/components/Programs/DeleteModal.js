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
// import { useHistory } from "react-router-dom";
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

export function DeleteModal({ isOpen, handleClose, students, program }) {
  const classes = useStyles();
  const classesForm = useStyleForm();
  const [inputs, setInputs] = useState({});
  const [users, setUsers] = useState([]);
  // const theme = useTheme();
  // const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const cleanModal = () => {
    handleClose();
  };
  // const history = useHistory();
  useEffect(() => {
    updateModal(program);
  }, [program]);
  const updateModal = program => {
    const fetchData = () => {
      setInputs({
        name: program.name,
        description: program.description
      });
      setUsers(program.users);
    };

    fetchData();
  };

  const handleSubmit = event => {
    event.preventDefault();
    console.log("Borrando prueba " + program._id);

    const headers = {
      "Content-Type": "application/json"
    };
    Axios.delete(`http://localhost:3000/programs/${program._id}`, {
      headers: headers
    })
      .then(res => {
        console.log(res);
        console.log(res.data);

        console.log("Se ha borrado el programa exitosamente");
        toast.success(`¡Se ha borrado el programa exitosamente! 🗑`);
        handleClose();
      })
      .catch(err => {
        console.log("No se pudo borrar el programa...");
        toast.error(`No se pudo borrar el programa... 🙃`);
        console.log(err.message);
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
            {`Borrar Programa`}
          </DialogTitle>
          <DialogContent>
            <form className={classesForm.form} onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <Typography component="p">
                    {`Nombre del programa: ${inputs.name}`}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <Typography component="p">
                    {`Descripción del programa: ${inputs.description}`}
                  </Typography>
                </Grid>
                {users.length === 0 ? (
                  <Grid item xs={12} sm={6}>
                    <Typography component="p">
                      {`Este programa no tiene usuario asignados`}
                    </Typography>
                  </Grid>
                ) : (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    style={{ overflowY: "auto", height: "25vh" }}
                  >
                    <InputLabel htmlFor="user-label-placeholder">
                      Usuarios asignados a este Programa
                    </InputLabel>
                    <FormControl
                      component="fieldset"
                      style={{ paddingLeft: "6%" }}
                    >
                      <FormGroup>
                        {students
                          .filter(student => users.indexOf(student._id) !== -1)
                          .map(student => {
                            const labelId = `checkbox-list-label-${student._id}`;
                            return (
                              <FormControlLabel
                                key={student._id}
                                control={
                                  <Checkbox
                                    style={{ visibility: "hidden" }}
                                    edge="start"
                                    checked={users.indexOf(student._id) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ "aria-labelledby": labelId }}
                                  />
                                }
                                label={`${student.firstName} ${student.lastName}`}
                              />
                            );
                          })}
                      </FormGroup>
                    </FormControl>
                  </Grid>
                )}

                <Grid item xs={12} sm={12}>
                  <Typography component="strong">
                    {`¿Esta seguro de que desea borrar este programa?, esta acción no se podrá deshacer...`}
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
                      No, no deseo borrar este programa
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
                      Si, si deseo borrar este programa
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
