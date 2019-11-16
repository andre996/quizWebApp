import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";

import Grid from "@material-ui/core/Grid";
import { CreateModal } from "./CreateModal";
import { StatModal } from "./StatModal";

import { CreateQuiz } from "./CreateQuiz";

import { UpdateModal } from "./UpdateModal";
import { DeleteModal } from "./DeleteModal";

import Axios from "axios";
import BarChartIcon from "@material-ui/icons/BarChart";

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [program, setProgram] = useState({
    _id: "",
    name: "",
    description: "",
    users: [],
    quiz: []
  });
  const [students, setStudents] = useState([]);
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [openStatModal, setOpenStatModal] = React.useState(false);

  const [openCreateQuiz, setOpenCreateQuiz] = React.useState(false);
  const [openUpdateModal, setOpenUpdateModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);

  // getModalStyle is not a pure function, we roll the style only on the first render

  useEffect(() => {
    updateTable();
  }, []);
  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };
  const handleOpenStatModal = program => {
    setOpenStatModal(true);
    setProgram(program);
  };
  const handleOpenCreateQuiz = program => {
    setOpenCreateQuiz(true);
    setProgram(program);
  };
  const handleOpenUpdateModal = program => {
    setOpenUpdateModal(true);
    setProgram(program);
  };

  const handleOpenDeleteModal = program => {
    setOpenDeleteModal(true);
    setProgram(program);
  };

  const handleClose = () => {
    setOpenCreateModal(false);
    setOpenStatModal(false);

    setOpenCreateQuiz(false);
    setOpenDeleteModal(false);
    setOpenUpdateModal(false);
    updateTable();
  };

  const updateTable = () => {
    const fetchData = async () => {
      const result = await Axios(`http://localhost:3000/programs`);
      setPrograms(result.data);

      console.log(result.data);
    };
    const fetchUsers = async () => {
      const result = await Axios(`http://localhost:3000/users`);
      setStudents(result.data);

      console.log(result.data);
    };
    fetchData();
    fetchUsers();
  };

  const styles = {
    container: { margin: "auto", width: "fit-content", padding: "10px" }
  };

  return (
    <div style={styles.container}>
      <h1>Módulo de Programas</h1>
      <Grid container spacing={2}>
        <Grid item sm={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleOpenCreateModal}
          >
            Crear Programa
          </Button>
        </Grid>
      </Grid>
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Usuarios Asignados</TableCell>
            <TableCell>Nro de Pruebas</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {programs.length === 0 ? (
            <tr>
              <td>
                <p>
                  No tienes programas creados, si deseas crear programas pulsa
                  el botón "Crear Programa"
                </p>
              </td>
            </tr>
          ) : (
            programs.map(program => (
              <TableRow key={program._id}>
                <TableCell>{`${program.name}`}</TableCell>
                <TableCell>{program.description}</TableCell>
                <TableCell>{program.users.length}</TableCell>
                <TableCell>{program.quiz.length}</TableCell>
                <TableCell>
                  <Grid container spacing={10}>
                    <Grid item xs={6} sm={3}>
                      <Button
                        variant="contained"
                        onClick={() => handleOpenUpdateModal(program)}
                      >
                        <EditIcon></EditIcon>
                      </Button>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Button
                        variant="contained"
                        onClick={() => handleOpenCreateQuiz(program)}
                      >
                        <AddIcon></AddIcon>
                      </Button>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenStatModal(program)}
                      >
                        <BarChartIcon></BarChartIcon>
                      </Button>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleOpenDeleteModal(program)}
                      >
                        <DeleteOutlinedIcon></DeleteOutlinedIcon>
                      </Button>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <CreateModal
        isOpen={openCreateModal}
        handleClose={handleClose}
        students={students}
      />
      <StatModal
        isOpen={openStatModal}
        handleClose={handleClose}
        program={program}
      />
      <CreateQuiz
        isOpen={openCreateQuiz}
        handleClose={handleClose}
        program={program}
      />
      <UpdateModal
        isOpen={openUpdateModal}
        handleClose={handleClose}
        students={students}
        program={program}
      />
      <DeleteModal
        isOpen={openDeleteModal}
        handleClose={handleClose}
        students={students}
        program={program}
      />
    </div>
  );
};

export default Programs;
