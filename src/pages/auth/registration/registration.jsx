import React, { useState, useEffect, useContext } from "react";
import { useHttp } from "../../../hooks/http.hook";
import { Toast, ToastContainer } from "react-bootstrap";
import { dateNow } from "../../../date";
import { LoginContext } from "../../../context/loginContext";
import "../style.css";

const Registration = () => {
  const { loading, request, error, clearError } = useHttp();
  const auth = useContext(LoginContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    dateReg: dateNow(),
    dateLog: dateNow(),
    status: true,
  });
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (error) {
      setShow(true);
      setErrorMessage(error);
    }
    clearError();
  }, [error, clearError]);

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const registerHandler = async () => {
    try {
      const data = await request("api/auth/register", "POST", { ...form });
      if (data) {
        const data = await request("api/auth/login", "POST", { ...form });
        auth.login(data.token, data.userId);
      }
    } catch (error) {}
  };
  return (
    <div className="Auth-form-container">
      <ToastContainer position="top-end">
        <Toast
          onClose={() => setShow(false)}
          show={show}
          delay={3000}
          autohide
          bg="danger"
        >
          <Toast.Body>{errorMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <div className="Auth-form">
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign Up</h3>
          <div className="form-group mt-3">
            <label>Name</label>
            <input
              type="text"
              name="name"
              className="form-control mt-1"
              placeholder="Enter Name"
              onChange={changeHandler}
            />
          </div>
          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email"
              name="email"
              className="form-control mt-1"
              placeholder="Enter email"
              onChange={changeHandler}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control mt-1"
              placeholder="Enter password"
              onChange={changeHandler}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={registerHandler}
              disabled={loading}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
