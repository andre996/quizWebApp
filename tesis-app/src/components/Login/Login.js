import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox";
// import Link from "@material-ui/core/Link";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import HomeOutlined from "@material-ui/icons/HomeOutlined";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import logo from "../../images/LogoEstudioCapa8.jpg";
import axios from "axios";
// import { UserContext } from "../context";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <span>URBE</span> {new Date().getFullYear()}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    height: "100vh"
  },
  image: {
    backgroundImage: `url(${logo})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundColor: "#fefefe"
  },
  paper: {
    margin: theme.spacing(8, 4),
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
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  logo: {
    backgroundImage: "url()",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    margin: theme.spacing(1)
  }
}));

export default function Login({ auth }) {
  // console.log(auth.isAuth + " <<< auth");
  const history = useHistory();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState(false);
  // console.log(localStorage.getItem("isLogged") + " <<<< local");

  useEffect(() => {
    auth.setAuthentication(localStorage.getItem("isLogged"));
    auth.setAdministrator(localStorage.getItem("isAdmin"));
    // auth.setUser(localStorage.getItem("userData"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   localStorage.setItem("ErrorFuck", error);
  // }, [error]);
  const classes = useStyles();
  // useEffect(() => {
  //   localStorage.setItem("isLogged", auth.isAuth);
  // }, [auth.isAuth]);
  //insert programmatic navigation here with react-navi
  const handleSubmit = event => {
    console.log("Enviando Formulario");
    console.log(inputs);
    event.preventDefault();
    const headers = {
      "Content-Type": "application/json"
    };
    axios
      .post(`http://localhost:3000/users/login`, inputs, {
        headers: headers
      })
      .then(res => {
        console.log(res);
        console.log(res.data);
        auth.setAuthentication(true);
        localStorage.setItem("isLogged", true);
        auth.setUser(res.data.userData._id);
        // const newData = res.data.userData.programs.split(",");
        localStorage.setItem("userData", res.data.userData._id);
        if (res.data.userData.admin === true) {
          console.log("El usuario que ingreso es admin");
          auth.setAdministrator(true);
          localStorage.setItem("isAdmin", true);
          history.push("/dashboard");
          toast.success(
            "¡Has iniciado sesión como administrador exitosamente! 😎"
          );
        } else {
          console.log("El usuario que ingreso no es admin");
          console.log(auth.userData);
          toast.success(
            "¡Has iniciado sesión como estudiante exitosamente! 🤓"
          );
          auth.setAdministrator(false);
          localStorage.setItem("isAdmin", false);
          history.push("/home");
        }
        //Navegacion programatica a las rutas protegidas segun el usuario
      })
      .catch(err => {
        console.log(err.message);
        toast.error("¡Opps! Algo salió mal...😓");
        // localStorage.setItem("error", "true");
        setError(true);
      });
  };
  const handleInputChange = event => {
    event.persist();
    setInputs(inputs => ({
      ...inputs,
      [event.target.name]: event.target.value
    }));
    setError(false);
    console.log(inputs);
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <HomeOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Ingresa
          </Typography>

          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleInputChange}
              value={inputs.email || ""}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleInputChange}
              value={inputs.password || ""}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Ingresar
            </Button>
            <Typography component="h2" variant="h6">
              {error === true ? "Error al intentar ingresar" : null}
            </Typography>
            <Grid container>
              <Grid item xs>
                <Link
                  to="/login"
                  href="#"
                  variant="body2"
                  onClick={() => {
                    toast.info(
                      "Ponte en contacto con el personal recursos humanos 👨‍💻 "
                    );
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/signup">¿No tienes una cuenta? Regístrate</Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
