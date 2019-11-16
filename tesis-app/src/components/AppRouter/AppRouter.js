import React, { useState } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Login from "../Login";
import DashBoard from "../Dashboard";
import SignUp from "../SignUp";
import { Home } from "../Home";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Call it once in your app. At the root of your app is the best place
toast.configure({
  position: "bottom-center",
  autoClose: 3500,
  newestOnTop: true,
  closeOnClick: true,
  rtl: false,
  pauseOnVisibilityChange: true,
  draggable: true,
  pauseOnHover: false
});

////////////////////////////////////////////////////////////
// 1. Click the public page
// 2. Click the protected page
// 3. Log in
// 4. Click the back button, note the URL each time

function AppRouter() {
  const [isAuthenticated, setAuth] = useState(
    false || localStorage.getItem("isLogged")
  );

  const [isAdministrator, setAdmin] = useState(
    false || localStorage.getItem("isAdmin")
  );

  const [userData, setUserData] = useState(
    localStorage.getItem("userData") === null
      ? ""
      : localStorage.getItem("userData")
  );

  const auth = {
    isAuth: isAuthenticated,
    isAdmin: isAdministrator,
    userData: userData,
    setAuthentication: isLogged => {
      setAuth(isLogged);
    },
    setAdministrator: isAdmin => {
      setAdmin(isAdmin);
    },
    setUser: data => {
      setUserData(data);
    }
  };
  console.log(auth);

  const AdminRoute = ({ component: Component, ...rest }) => {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated === "true" && isAdministrator === "true" ? (
            <Component {...props} auth={auth} />
          ) : isAuthenticated === "true" && isAdministrator === "false" ? (
            <Redirect
              to={{
                pathname: "/home",
                state: { from: props.location }
              }}
            />
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  };
  const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated === "true" && isAdministrator === "false" ? (
            <Component {...props} auth={auth} />
          ) : isAuthenticated === "true" && isAdministrator === "true" ? (
            <Redirect
              to={{
                pathname: "/dashboard",
                state: { from: props.location }
              }}
            />
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  };
  return (
    <Router>
      <div>
        {/* <p>
            {isAuthenticated === "true"
              ? "Usuario logueado"
              : "No hay usuario logueado"}
          </p>
          <p>
            {isAdministrator === "true"
              ? "Usuario Admin"
              : "No hay usuario Admin"}
          </p>
          <ul>
            <li>
              <Link to="/login">Public Page (Login)</Link>
            </li>
            <li>
              <Link to="/dashboard">Protected Page (DashBoard)</Link>
            </li>
            <li>
              <Link to="/home">Protected Page (Home)</Link>
            </li>
            <li>
              <Link to="/signup">Public Page (Sign Up)</Link>
            </li>
          </ul> */}
        {/* <Switch>
            {routes.map(({ path, component: Component, exact }, i) => (
              <Route
                exact={exact}
                path={path}
                render={() => <Component auth={auth} />}
                key={i}
              />
            ))}
          </Switch> */}

        <Route path="/" render={props => <Redirect to="/login" />} />
        <Route path="/login" render={() => <Login auth={auth}></Login>} />
        <Route path="/signup" render={() => <SignUp auth={auth}></SignUp>} />
        <Route
          render={props =>
            isAuthenticated === "true" && isAdministrator === "true" ? (
              <Redirect to="/dashboard"></Redirect>
            ) : isAuthenticated === "true" && isAdministrator === "false" ? (
              <Redirect to="/home" />
            ) : null
          }
        ></Route>
        <AdminRoute path="/dashboard" component={DashBoard} exact={true} />
        {/* <AdminRoute path="/programs" component={Programs} exact={false} />
          <AdminRoute path="/students" component={Students} exact={false} />
          <AdminRoute path="/reports" component={Reports} exact={false} /> */}
        <PrivateRoute path="/home" component={Home} exact={true} />
      </div>
    </Router>
  );
}
export default AppRouter;
