import React, { useState, useEffect, useRef } from "react";
import Button from "@material-ui/core/Button";
import clsx from "clsx";
import BarChartIcon from "@material-ui/icons/BarChart";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import ReactToPrint from "react-to-print";
import PrintIcon from "@material-ui/icons/Print";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
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
  },
  fixedHeight: {
    height: 240
  }
}));

export function StatStudent({ isOpen, handleClose, programsList, student }) {
  const classes = useStyles();
  const classesForm = useStyleForm();
  const [inputs, setInputs] = useState({});
  const [programs, setPrograms] = useState([]);
  const [grades, setGrades] = useState([]);
  // const [prom, setProm] = useState(0);
  const fixedHeightPaper = clsx(classesForm.paper, classesForm.fixedHeight);
  const componentRef = useRef();

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
      if (!!student.grades) {
        const newGrades = student.grades.map(grade => ({
          title: grade.title,
          grade: parseFloat(grade.grade)
        }));
        setGrades(newGrades);
        console.log(newGrades);
      }

      // setGrades([studend]);
      console.log(student);
    };

    fetchData();
  };
  const promGrades = grades => {
    let prom = 0;
    grades.forEach(({ grade }) => {
      prom += grade;
    });
    return prom / grades.length;
  };
  const handleSubmit = event => {
    event.preventDefault();
    console.log("Enviando Formulario ");
    console.log("Borrando usuario " + student._id);
  };

  return (
    <Dialog
      fullWidth={true}
      open={isOpen}
      onClose={cleanModal}
      aria-labelledby="responsive-dialog-title"
      scroll={"body"}
      maxWidth={"lg"}
      ref={componentRef}
    >
      <div className={classes.paper}>
        <div className={classesForm.paper}>
          <Avatar className={classesForm.avatar}>
            <BarChartIcon />
          </Avatar>
          <DialogTitle id="responsive-dialog-title">
            {`Estadísticas del usuario ${student.firstName} ${student.lastName}`}
          </DialogTitle>
          <DialogContent>
            {grades.length === 0 ? (
              "El usuario no ha realizado ninguna prueba todavía"
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12} md={12} lg={12}>
                  <Paper className={fixedHeightPaper}>
                    <ResponsiveContainer>
                      <BarChart
                        data={grades}
                        margin={{
                          top: 5,
                          bottom: 5
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="title" allowDataOverflow={true} />
                        <YAxis allowDataOverflow={true} scale={"auto"}></YAxis>
                        <Tooltip />
                        <Legend />
                        <Bar
                          name="Nota"
                          type="Bar"
                          maxBarSize={50}
                          dataKey="grade"
                          fill="#8884d8"
                        />
                        {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Prueba</TableCell>
                        <TableCell>Nota</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {grades.map((grade, index) => (
                        <TableRow key={`${grade.title}-${index}`}>
                          <TableCell>{grade.title}</TableCell>
                          <TableCell>{grade.grade}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow
                        key={grades.id}
                        style={{ backgroundColor: "cornflowerblue" }}
                      >
                        <TableCell>Promedio General</TableCell>
                        <TableCell>{promGrades(grades).toFixed(2)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
            )}

            <form className={classesForm.form} onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography component="p">
                    {`Nombre del Usuario: ${inputs.firstName}`}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography component="p">
                    {`Apellido del Usuario: ${inputs.lastName}`}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography component="p">
                    {`Email del Usuario: ${inputs.email}`}
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
                          .map(program => {
                            const labelId = `checkbox-list-label-${program._id}`;
                            return (
                              <FormControlLabel
                                key={program._id}
                                control={
                                  <Checkbox
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
                    <ReactToPrint
                      trigger={() => (
                        <Button
                          color="inherit"
                          fullWidth
                          variant="contained"
                          className={classesForm.submit}
                        >
                          <PrintIcon></PrintIcon>
                        </Button>
                      )}
                      content={() => componentRef.current}
                    />
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
