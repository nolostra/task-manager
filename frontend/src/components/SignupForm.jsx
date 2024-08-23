import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import validateManyFields from "../validations";
import Input from "./utils/Input";
import Loader from "./utils/Loader";

const SignupForm = () => {
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fetchData, { loading }] = useFetch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateManyFields("signup", formData);
    setFormErrors({});
    if (errors.length > 0) {
      setFormErrors(
        errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {})
      );
      return;
    }

    const config = {
      url: "/auth/signup",
      method: "post",
      data: {
        name: `${formData.fname} ${formData.lname}`,
        email: formData.email,
        password: formData.password,
      },
    };
    fetchData(config).then(() => {
      navigate("/login");
    });
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

  return (
    <>
      <form className="m-auto my-16 max-w-[500px]">
        {loading ? (
          <Loader />
        ) : (
          <>
            <h2 className="text-left mb-4 font-bold text-2xl text-blue-500">
              Signup
            </h2>
            <div className="p-8 bg-white border-2 shadow-md rounded-md">
              <div className="mb-4">
                <Input
                  type="text"
                  name="fname"
                  id="fname"
                  value={formData.fname}
                  placeholder="First name"
                  onChange={handleChange}
                />
                {fieldError("fname")}
              </div>
              <div className="mb-4">
                <Input
                  type="text"
                  name="lname"
                  id="lname"
                  value={formData.lname}
                  placeholder="Last name"
                  onChange={handleChange}
                />
                {fieldError("lname")}
              </div>

              <div className="mb-4">
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
              <div className="mb-4">
                <Input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  placeholder="Confirm password"
                  onChange={handleChange}
                />
                {fieldError("confirmPassword")}
              </div>

              <button
                className="bg-blue-600 text-white px-4 py-2 font-medium hover:bg-blue-800"
                onClick={handleSubmit}
              >
                Submit
              </button>

              <div className="pt-4">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-400">
                  Login here
                </Link>
              </div>
            </div>
          </>
        )}
      </form>
    </>
  );
};

export default SignupForm;
