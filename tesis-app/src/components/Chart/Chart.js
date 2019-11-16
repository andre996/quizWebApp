import React from "react";
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
import Title from "../Title";

export default function Chart({ stats }) {
  console.log(stats);
  return (
    <React.Fragment>
      <Title>Desempeño General</Title>
      {!!stats.programsMeanGrades && stats.programsMeanGrades.length > 0 ? (
        <ResponsiveContainer>
          <BarChart
            data={stats.programsMeanGrades}
            margin={{
              top: 16,
              right: 16,
              bottom: 0,
              left: 24
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="programName"
              allowDataOverflow={true}
              scale={"auto"}
            />
            <YAxis allowDataOverflow={true} scale={"auto"}></YAxis>
            <Tooltip />
            <Legend />
            <Bar
              name="Promedio General"
              type="Bar"
              maxBarSize={25}
              dataKey="programMeanGrade"
              fill="#8884d8"
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>No se encontraron programas para graficar...</p>
      )}
    </React.Fragment>
  );
}
