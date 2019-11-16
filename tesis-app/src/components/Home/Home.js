import { Copyright } from "../Copyright";
import React, { useEffect, useState } from "react";
// import Button from "@material-ui/core/Button";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
// import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
// import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
// import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import Container from "@material-ui/core/Container";
// import Grid from "@material-ui/core/Grid";
// import Paper from "@material-ui/core/Paper";
// import Link from "@material-ui/core/Link";
// import MenuIcon from "@material-ui/icons/Menu";
// import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ExitToAppOutlined from "@material-ui/icons/ExitToAppOutlined";
// import { mainListItems, secondaryListItems } from "../ListItems";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
// import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import EditIcon from "@material-ui/icons/Edit";
import Axios from "axios";
import { QuizModal } from "./QuizModal.js";
const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: "none"
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9)
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto"
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column"
  },
  fixedHeight: {
    height: 240
  }
}));
export function QuizzesList({ userData }) {
  console.log(userData);

  const [quizzes, setQuizzes] = useState([]);
  const [grades, setGrades] = useState([]);

  const [quiz, setQuiz] = useState([{}]);

  const [openQuiz, setOpenQuiz] = React.useState(false);
  const handleOpenQuiz = quiz => {
    setOpenQuiz(true);
    setQuiz(quiz);
  };
  const handleClose = () => {
    setOpenQuiz(false);
    fecthQuizzes();
  };
  useEffect(() => {
    fecthQuizzes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fecthQuizzes = () => {
    const fetchData = async () => {
      const headers = {
        "Content-Type": "application/json"
      };
      Axios.get(`http://localhost:3000/users/${userData}`, {
        headers: headers
      })
        .then(res => {
          console.log(res);
          console.log(res.data);
          setQuizzes(res.data.quizzesData);
          setGrades(res.data.userData.grades);
        })
        .catch(err => {
          console.log(err);
        });
      // const result = await Axios(`http://localhost:3000/programs`);
      // setPrograms(result.data);
      // console.log(result.data);
    };
    fetchData();
  };
  // const classes = useStyles();
  // const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  console.log(quizzes);

  return (
    <React.Fragment>
      <h1>Lista de Pruebas Pendientes</h1>
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell>Nombre de la Prueba</TableCell>
            <TableCell>Nro de Preguntas</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {quizzes.length === 0 ? (
            <tr>
              <td>No tienes pruebas pendientes! Genial ;)</td>
            </tr>
          ) : (
            quizzes.map(quiz => (
              <TableRow key={quiz._id}>
                <TableCell>{`${quiz.title}`}</TableCell>
                <TableCell>{quiz.questions.length}</TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="contained"
                    size="small"
                    onClick={() => handleOpenQuiz(quiz)}
                  >
                    <EditIcon></EditIcon>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <h1>Lista de Pruebas Completadas</h1>
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell>Nombre de la Prueba</TableCell>
            <TableCell>Calificación</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {grades.length === 0 ? (
            <tr>
              <td>No tienes pruebas completadas por el momento...</td>
            </tr>
          ) : (
            grades.map((grade, index) => (
              <TableRow key={`${grade.title}-${index}`}>
                <TableCell>{grade.title}</TableCell>
                <TableCell>{`${grade.grade} Pts`}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <QuizModal isOpen={openQuiz} handleClose={handleClose} quiz={quiz} />
    </React.Fragment>
  );
}

export function Home({ auth }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  console.log(auth);

  const logout = () => {
    auth.setAuthentication(false);
    auth.setUser([]);
    localStorage.setItem("isLogged", false);
    localStorage.setItem("isAdmin", false);
    localStorage.setItem("userData", []);
  };

  return (
    <div>
      <Router>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar
            position="absolute"
            className={clsx(classes.appBar, open && classes.appBarShift)}
          >
            <Toolbar className={classes.toolbar}>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                className={classes.title}
              >
                Home
              </Typography>
              <IconButton color="inherit" onClick={logout}>
                <Badge color="secondary">
                  <ExitToAppOutlined />
                </Badge>
              </IconButton>
            </Toolbar>
          </AppBar>
          <main className={classes.content}>
            <Container maxWidth="lg" className={classes.container}>
              <div className={classes.appBarSpacer} />
              <Route
                path="/home"
                render={() => <QuizzesList userData={auth.userData} />}
              />
            </Container>
            <Copyright />
          </main>
        </div>
      </Router>
    </div>
  );
}
