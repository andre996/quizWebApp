import React, { useState, useEffect, useRef } from "react";
import ReactToPrint from "react-to-print";
import Button from "@material-ui/core/Button";
import clsx from "clsx";
import BarChartIcon from "@material-ui/icons/BarChart";
import PrintIcon from "@material-ui/icons/Print";

import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
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
import TableFooter from "@material-ui/core/TableFooter";

import TableRow from "@material-ui/core/TableRow";
import Axios from "axios";
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

export function StatModal({ isOpen, handleClose, program }) {
  const classes = useStyles();
  const componentRef = useRef();
  const classesForm = useStyleForm();
  const [stats, setStats] = useState([
    {
      listStatistics: []
    }
  ]);
  const fixedHeightPaper = clsx(classesForm.paper, classesForm.fixedHeight);

  const cleanModal = () => {
    handleClose();
  };
  useEffect(() => {
    updateModal(program);
  }, [program]);
  const updateModal = program => {
    const fetchData = async () => {
      const headers = {
        "Content-Type": "application/json"
      };
      Axios.get(`http://localhost:3000/programs/${program._id}`, {
        headers: headers
      })
        .then(res => {
          console.log(res);
          console.log(res.data);
          console.log(program);

          setStats(res.data);
        })
        .catch(err => {
          console.log(err);
        });
      console.log(program);
    };

    fetchData();
  };
  const fixNumber = numb => (numb === undefined ? 0 : numb.toFixed(2));
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
            {`Estadísticas del Programa ${program.name}`}
          </DialogTitle>
          <DialogContent>
            {stats.length === 0 ? (
              "No hay resultados en esta prueba"
            ) : (
              <Grid container spacing={2}>
                {!!stats.listStatistics
                  ? stats.listStatistics.map((quiz, indx) => {
                      return (
                        <Grid item xs={12} md={12} lg={12} key={`Quiz-${indx}`}>
                          <Paper className={fixedHeightPaper}>
                            <Typography
                              component="b"
                              align="center"
                            >{`Título de la prueba: ${quiz.title}`}</Typography>

                            <ResponsiveContainer>
                              <BarChart
                                data={quiz.studentsGrade}
                                margin={{
                                  top: 5,
                                  bottom: 5
                                }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                  dataKey="name"
                                  allowDataOverflow={true}
                                />
                                <YAxis
                                  allowDataOverflow={true}
                                  scale={"auto"}
                                ></YAxis>
                                <Tooltip />
                                <Legend />
                                <Bar
                                  name="Nota"
                                  type="Bar"
                                  maxBarSize={50}
                                  dataKey="grade"
                                  fill="#8884d8"
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </Paper>
                          <hr />
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Nombre del Usuario</TableCell>
                                <TableCell>Nota</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {quiz.studentsGrade.map((grade, index) => (
                                <TableRow key={`${grade.name}-${index}`}>
                                  <TableCell>{grade.name}</TableCell>
                                  <TableCell>{grade.grade}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            <TableFooter>
                              <TableRow
                                key={`taken-${indx}`}
                                style={{ backgroundColor: "silver" }}
                              >
                                <TableCell>
                                  Nro de Usuarios que completaron la prueba
                                </TableCell>
                                <TableCell>{`${quiz.takenBy}`}</TableCell>
                              </TableRow>
                              <TableRow
                                key={`prom-${indx}`}
                                style={{ backgroundColor: "cornflowerblue" }}
                              >
                                <TableCell>Promedio General</TableCell>
                                <TableCell>{`${quiz.meanGrade.toFixed(
                                  2
                                )} Pts`}</TableCell>
                              </TableRow>
                            </TableFooter>
                          </Table>
                          <hr />
                        </Grid>
                      );
                    })
                  : null}
              </Grid>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography component="p">
                  {`Usuarios asignados a este programa: ${stats.totalStudents}`}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography component="p">
                  {`Porcentaje General de pruebas completadas :${
                    stats.totalTestTaken === null ? 0 : stats.totalTestTaken
                  } %`}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography component="p">
                  {`Promedio General del Programa: ${
                    stats.meanGrade === null ? 0 : fixNumber(stats.meanGrade)
                  } Pts`}
                </Typography>
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
          </DialogContent>
        </div>
      </div>
    </Dialog>
  );
}
