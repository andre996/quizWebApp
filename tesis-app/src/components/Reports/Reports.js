import Button from "@material-ui/core/Button";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
// import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  formControl: {
    margin: theme.spacing(3)
  }
}));

function Reports() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    ans1: false,
    ans2: false,
    ans3: false,
    ans4: false
  });

  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.checked });
  };

  const { ans1, ans2, ans3, ans4 } = state;
  const error = [ans1, ans2, ans3, ans4].filter(v => v).length !== 3;
  return (
    <div>
      <h1>Prueba de Unity</h1>
      <div>
        <FormLabel component="legend">
          Pregunta 1: ¿Que paradigma de programación usa Unity?
        </FormLabel>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={ans1}
                  onChange={handleChange("ans1")}
                  value="ans1"
                />
              }
              label="Programación Orientada a Objetos"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={ans2}
                  onChange={handleChange("ans2")}
                  value="ans2"
                />
              }
              label="Programación Orientada a Datos"
            />
          </FormGroup>
        </FormControl>
        <FormControl
          required
          error={error}
          component="fieldset"
          className={classes.formControl}
        >
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={ans3}
                  onChange={handleChange("ans3")}
                  value="ans3"
                />
              }
              label="Programación Funcional"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={ans4}
                  onChange={handleChange("ans4")}
                  value="ans4"
                />
              }
              label="Programación Estructurada"
            />
          </FormGroup>
        </FormControl>
      </div>
      <div>
        <FormLabel component="legend">
          Pregunta 2: ¿Que es MonoBehavior?
        </FormLabel>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={ans1}
                  onChange={handleChange("ans1")}
                  value="ans1"
                />
              }
              label="Es una clase base para todos los GameObjects en Unity"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={ans2}
                  onChange={handleChange("ans2")}
                  value="ans2"
                />
              }
              label="Es una interfaz que se inyecta como dependecia de la clase"
            />
          </FormGroup>
        </FormControl>
        <FormControl
          required
          error={error}
          component="fieldset"
          className={classes.formControl}
        >
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={ans3}
                  onChange={handleChange("ans3")}
                  value="ans3"
                />
              }
              label="Es una estructura de datos que facilita comportamientos"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={ans4}
                  onChange={handleChange("ans4")}
                  value="ans4"
                />
              }
              label="Es un tipo de dato estandar de Unity"
            />
          </FormGroup>
        </FormControl>
      </div>
      <div>
        <FormLabel component="legend">
          Pregunta 3: ¿Que lenguaje de Programación usa Unity para el Scripting?
        </FormLabel>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={ans1}
                  onChange={handleChange("ans1")}
                  value="ans1"
                />
              }
              label="C#"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={ans2}
                  onChange={handleChange("ans2")}
                  value="ans2"
                />
              }
              label="Javascript"
            />
          </FormGroup>
        </FormControl>
        <FormControl
          required
          error={error}
          component="fieldset"
          className={classes.formControl}
        >
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={ans3}
                  onChange={handleChange("ans3")}
                  value="ans3"
                />
              }
              label="Python"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={ans4}
                  onChange={handleChange("ans4")}
                  value="ans4"
                />
              }
              label="C++"
            />
          </FormGroup>
        </FormControl>
      </div>
      <div>
        <FormLabel component="legend">
          Pregunta 4: ¿Que es un GameObject?
        </FormLabel>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={ans1}
                  onChange={handleChange("ans1")}
                  value="ans1"
                />
              }
              label="Es un objecto que contiene metodos MonoBehavior fundamentales "
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={ans2}
                  onChange={handleChange("ans2")}
                  value="ans2"
                />
              }
              label="Es una Clase con funciones personalizadas"
            />
          </FormGroup>
        </FormControl>
        <FormControl
          required
          error={error}
          component="fieldset"
          className={classes.formControl}
        >
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={ans3}
                  onChange={handleChange("ans3")}
                  value="ans3"
                />
              }
              label="Es una interfaz que permite usar callbacks de Unity"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={ans4}
                  onChange={handleChange("ans4")}
                  value="ans4"
                />
              }
              label="Es una librería para crear objetos del juego"
            />
          </FormGroup>
        </FormControl>
      </div>

      <Button type="submit" variant="contained" color="primary">
        Terminar Prueba
      </Button>
    </div>
  );
}

export default Reports;
