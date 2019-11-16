/* eslint-disable no-script-url */

import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "../Title";

const useStyles = makeStyles({
  depositContext: {
    flex: 1
  }
});

export default function Deposits({ stats }) {
  console.log(stats);
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Cantidad de Pruebas Completadas</Title>
      <Typography component="p" variant="h4">
        {stats.totalQuizzesTaken !== 1
          ? `${stats.totalQuizzesTaken} Pruebas`
          : `${stats.totalQuizzesTaken} Prueba`}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        {new Date().toDateString()}
      </Typography>
      <div>
        <Link to="/programs" style={{ textDecoration: "none" }}>
          Ver Pruebas
        </Link>
      </div>
    </React.Fragment>
  );
}
