import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import validateManyFields from "../validations";
import Input from "./utils/Input";
import { useDispatch, useSelector } from "react-redux";
import {
  postLoginData,
  postGoogleLoginData,
} from "../redux/actions/authActions";
import Loader from "./utils/Loader";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
const LoginForm = ({ redirectUrl }) => {
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const authState = useSelector((state) => state.authReducer);
  const { loading, isLoggedIn } = authState;
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(redirectUrl);
    if (isLoggedIn) {
      navigate(redirectUrl || "/");
    }
  }, [authState, redirectUrl, isLoggedIn, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateManyFields("login", formData);
    setFormErrors({});
    if (errors.length > 0) {
      setFormErrors(
        errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {})
      );
      return;
    }
    dispatch(postLoginData(formData.email, formData.password));
  };

  const fieldError = (field) => (
    <p
      className={`mt-1 text-pink-600 text-sm ${
        formErrors[field] ? "block" : "hidden"
      }`}
    >
      <i className="mr-2 fa-solid fa-circle-exclamation"></i>
      {formErrors[field]}
    </p>
  );
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Decode the JWT token
      const data = jwtDecode(credentialResponse.credential);
      dispatch(postGoogleLoginData(data.sub, data.email, data.name));
    } catch (error) {
      console.error("Google login failed:", error);
      toast.error("Google login failed");
    }
  };

  const handleGoogleError = (error) => {
    console.error("Google login failed:", error);
    toast.error("Google login failed");
  };

  return (
    <>
      <form className="m-auto my-16 max-w-[500px]">
        {loading ? (
          <Loader />
        ) : (
          <>
            <h2 className="text-left mb-4 font-bold text-2xl text-blue-500">
              Login
            </h2>
            <div className="border-2 shadow-md rounded-md p-8 bg-white">
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="after:content-['*'] after:ml-0.5 after:text-red-500"
                >
                  Email
                </label>
                <Input
                  type="text"
                  name="email"
                  id="email"
                  value={formData.email}
                  placeholder="youremail@domain.com"
                  onChange={handleChange}
                />
                {fieldError("email")}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="after:content-['*'] after:ml-0.5 after:text-red-500"
                >
                  Password
                </label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  placeholder="Your password.."
                  onChange={handleChange}
                />
                {fieldError("password")}
              </div>

              <button
                className="bg-blue-600 text-white px-4 py-2 font-medium hover:bg-blue-800"
                onClick={handleSubmit}
              >
                Submit
              </button>

              <div className="pt-4">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-400">
                  {" "}
                  Signup{" "}
                </Link>
              </div>
              <div className="mt-4">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
              </div>
            </div>
          </>
        )}
      </form>
    </>
  );
};

export default LoginForm;
