import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import EditIcon from "@material-ui/icons/Edit";
import Axios from "axios";
import Grid from "@material-ui/core/Grid";
import BarChartIcon from "@material-ui/icons/BarChart";

import { CreateStudent } from "./CreateStudent";
import { UpdateStudent } from "./UpdateStudent";
import { DeleteStudent } from "./DeleteStudent";
import { StatStudent } from "./StatStudent";

const Students = ({ auth }) => {
  console.log(auth);
  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    programs: []
  });
  const [programsList, setPrograms] = useState([]);

  const [openCreateStudent, setOpenCreateStudent] = React.useState(false);
  const [openStatStudent, setOpenStatStudent] = React.useState(false);

  const [openUpdateStudent, setOpenUpdateStudent] = React.useState(false);
  const [openDeleteStudent, setOpenDeleteStudent] = React.useState(false);

  const handleOpenCreate = () => {
    setOpenCreateStudent(true);
  };
  const handleOpenUpdate = student => {
    setOpenUpdateStudent(true);
    setStudent(student);
  };
  const handleOpenDelete = student => {
    setOpenDeleteStudent(true);
    setStudent(student);
  };
  const handleOpenStat = student => {
    setOpenStatStudent(true);
    setStudent(student);
  };
  const handleClose = () => {
    setOpenCreateStudent(false);
    setOpenUpdateStudent(false);
    setOpenDeleteStudent(false);
    setOpenStatStudent(false);

    fecthData();
  };

  useEffect(() => {
    fecthData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fecthData = () => {
    const fetchPrograms = async () => {
      const result = await Axios(`http://localhost:3000/programs`);
      setPrograms(result.data);

      console.log(result.data);
    };
    const fetchUsers = async () => {
      const result = await Axios(`http://localhost:3000/users/all`);
      setStudents(result.data);

      console.log(result.data);
    };
    fetchPrograms();
    fetchUsers();
  };
  const styles = {
    container: { margin: "auto", width: "fit-content", padding: "10px" }
  };
  return (
    <div className={styles.container}>
      <h1>Módulo de Usuarios</h1>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={handleOpenCreate}
      >
        Crear Usuario
      </Button>
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell>Nombre Completo</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Programas Asignados</TableCell>
            <TableCell>Pruebas Realizadas</TableCell>

            <TableCell>Tipo de Usuario</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.length === 0 ? (
            <tr>
              <td>
                No tienes usuarios registrados, si deseas registrar usuarios
                pulsa el botón "Crear Usuario"
              </td>
            </tr>
          ) : (
            students.map(student => (
              <TableRow key={student._id}>
                <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  {student.admin ? "--" : student.programs.length}
                </TableCell>
                <TableCell>
                  {student.admin ? "--" : student.grades.length}
                </TableCell>
                <TableCell>{student.admin ? "Admin" : "Estudiante"}</TableCell>
                <TableCell>
                  <Grid container spacing={10}>
                    <Grid item xs={12} sm={4}>
                      <Button
                        type="submit"
                        variant="contained"
                        onClick={() => handleOpenUpdate(student)}
                      >
                        <EditIcon></EditIcon>
                      </Button>
                    </Grid>
                    {student._id === auth.userData || student.admin ? (
                      ""
                    ) : (
                      <Grid item xs={12} sm={4}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenStat(student)}
                        >
                          <BarChartIcon></BarChartIcon>
                        </Button>
                      </Grid>
                    )}
                    {student._id === auth.userData ? (
                      ""
                    ) : (
                      <Grid item xs={12} sm={4}>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleOpenDelete(student)}
                        >
                          <DeleteOutlinedIcon></DeleteOutlinedIcon>
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <CreateStudent
        isOpen={openCreateStudent}
        handleClose={handleClose}
        programsList={programsList}
      />
      <UpdateStudent
        isOpen={openUpdateStudent}
        handleClose={handleClose}
        programsList={programsList}
        student={student}
      />
      <DeleteStudent
        isOpen={openDeleteStudent}
        handleClose={handleClose}
        programsList={programsList}
        student={student}
      />
      <StatStudent
        isOpen={openStatStudent}
        handleClose={handleClose}
        programsList={programsList}
        student={student}
      />
    </div>
  );
};

export default Students;
