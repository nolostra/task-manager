import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Task from "./pages/Task";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { saveProfile } from "./redux/actions/authActions";
import NotFound from "./pages/NotFound";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const authState = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    dispatch(saveProfile(token));
  }, [authState.isLoggedIn, dispatch]);

  return (
    <>
      <GoogleOAuthProvider clientId="783231031192-nuju5mrncc6fh5skh3i97v63m4a3a8n8.apps.googleusercontent.com">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/signup"
              element={authState.isLoggedIn ? <Navigate to="/" /> : <Signup />}
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="/tasks/add"
              element={
                authState.isLoggedIn ? (
                  <Task />
                ) : (
                  <Navigate to="/login" state={{ redirectUrl: "/tasks/add" }} />
                )
              }
            />
            <Route
              path="/tasks/:taskId"
              element={
                authState.isLoggedIn ? (
                  <Task />
                ) : (
                  <Navigate
                    to="/login"
                    state={{ redirectUrl: window.location.pathname }}
                  />
                )
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
