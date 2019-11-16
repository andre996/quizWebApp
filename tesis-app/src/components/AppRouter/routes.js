import React from "react";
import Login from "../Login";
// import DashBoard from "../Dashboard";
import SignUp from "../SignUp";
// import { Home } from "../Home";

export const routes = [
  // {
  //   path: "/home",
  //   component: () => <Home />,
  //   exact: true
  // },
  {
    path: "/login",
    component: () => <Login />,
    exact: false
  },
  {
    path: "/signup",
    component: () => <SignUp />,
    exact: true
  }

  // {
  //   path: "/our-works/:projectID",
  //   component: DashBoard,
  //   exact: true
  // }
];
