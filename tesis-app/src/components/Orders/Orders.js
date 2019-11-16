/* eslint-disable no-script-url */
import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "../Title";

const useStyles = makeStyles(theme => ({
  seeMore: {
    marginTop: theme.spacing(3)
  }
}));

export default function Orders({ stats }) {
  console.log(stats);
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Promedios Generales de los Programas</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nombre del Programa</TableCell>
            <TableCell>Promedio General del Programa</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!!stats.programsMeanGrades && stats.programsMeanGrades.length > 0 ? (
            stats.programsMeanGrades.map((program, index) => (
              <TableRow key={`program-${index}`}>
                <TableCell>{program.programName}</TableCell>
                <TableCell>{program.programMeanGrade.toFixed(2)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow key={`program-${0}`}>
              <TableCell>
                Haz click en ver más para comenzar a crear programas
              </TableCell>
              <TableCell>0</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link to="/programs" style={{ textDecoration: "none" }}>
          Ver Más
        </Link>
      </div>
    </React.Fragment>
  );
}
