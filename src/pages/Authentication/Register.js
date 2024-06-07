import React, { useEffect, useState } from "react";
import { Row, Col, CardBody, Card, Alert, Container, Input, Label, Form, FormFeedback } from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

// action
import { registerUser, apiError } from "../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link, Navigate, useNavigate } from "react-router-dom";

// import images
import profileImg from "../../assets/images/profile-img.png";
import logoImg from "../../assets/images/logo.svg";
import { error } from "toastr";
import { apiRoutes } from "helpers/api_routes";
import { getApi, postApi } from "helpers/ApiMiddleware";
import Swal from 'sweetalert2'

const Register = props => {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [registrationError, setRegistrationError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState('');

  //meta title
  document.title = "Register | Skote - React Admin & Dashboard Template";

  const dispatch = useDispatch();

  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getApi(apiRoutes.totalCount);
        setUserCount(response.data);
        console.log(response.data, " I'm data");
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };
    fetchData();
  }, [userCount]);


  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      email: '',
      username: '',
      password: '',
      role: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      username: Yup.string().required("Please Enter Your Username"),
      password: Yup.string().required("Please Enter Your Password"),
      role: Yup.string().required("Please Choose Your Role "),
    }),
    onSubmit: (values, { setErrors, resetForm }) => {
      // dispatch(registerUser(values));
      postApi(apiRoutes.register, {
        "email": values.email,
        "username": values.username,
        "password": values.password,
        "userType": values.role
      })
        .then(({ token, role, username, email, message, activeMsg, isActive }) => {
          console.log(token);
          console.log(message);
          const authUserData = { token, username, email };
          setRegistrationStatus(activeMsg);
          if (token && isActive == 'pending') {
            navigate("/register");
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "success",
              title: "Registered successfully 😊"
            });
            localStorage.setItem('authUser', JSON.stringify(authUserData));
            // resetForm(); 
          } else {
            console.log("Registeration failed");
            if (message === "This email is already registered") {
              setErrors({
                email: "This email is already registered",
              });
            } else {
              console.log('Unhandled error:', message);
            }
          }

        })
        .catch(error => console.log('error', error));
    },
  });


  // useEffect(() => {
  //   dispatch(apiError(""));
  //   const authUser = localStorage.getItem("authUser");

  //   if (authUser) {
  //     navigate("/dashboard");
  //   }
  // }, []);

  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/register" className="text-dark">
          <i className="bx bx-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col className="col-7">
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Free Register</h5>
                        <p>Get your free Skote account now.</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profileImg} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                            src={logoImg}
                            alt=""
                            className="rounded-circle"
                            height="34"
                          />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >

                      {userCount === 0 ? (
                        <>
                          {registrationStatus && (
                            <Alert color="success">{registrationStatus},&nbsp;<a href="/login" className="text-dark">Login <strong><u>here</u></strong></a></Alert>
                          )}
                        </>
                      ) : (
                        <>
                          {registrationStatus && <Alert color="info">{registrationStatus}</Alert>}
                        </>
                      )}

                      {/* {registrationStatus && (
                        <Alert color="info">{registrationStatus}</Alert>
                      )} */}

                      {user && user ? (
                        <Alert color="success">
                          Register User Successfully
                        </Alert>
                      ) : null}

                      {registrationError && registrationError ? (
                        <Alert color="danger">{registrationError}</Alert>
                      ) : null}

                      <div className="mb-3">
                        <Label className="form-label">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email ? true : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Username</Label>
                        <Input
                          name="username"
                          type="text"
                          placeholder="Enter username"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.username || ""}
                          invalid={
                            validation.touched.username && validation.errors.username ? true : false
                          }
                        />
                        {validation.touched.username && validation.errors.username ? (
                          <FormFeedback type="invalid">{validation.errors.username}</FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Password</Label>
                        <Input
                          name="password"
                          type="password"
                          placeholder="Enter Password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.password || ""}
                          invalid={
                            validation.touched.password && validation.errors.password ? true : false
                          }
                        />
                        {validation.touched.password && validation.errors.password ? (
                          <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Role</Label>
                        <select
                          name="role"
                          className={`form-select ${validation.touched.role && validation.errors.role ? 'is-invalid' : ''}`}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.role || ""}
                          disabled={userCount === 0}
                        >
                          {userCount === 0 ? (
                            <>
                              <option value="admin">Admin</option>
                            </>
                          ) : (
                            <>
                              <option value="">Select Role</option>
                              <option value="student">Student</option>
                              <option value="employee">Employee</option>
                            </>
                          )}
                        </select>
                        {validation.touched.role && validation.errors.role && (
                          <div className="invalid-feedback">{validation.errors.role}</div>
                        )}
                      </div>

                      <div className="mt-4">
                        <button
                          className="btn btn-primary btn-block "
                          type="submit"
                        >
                          Register
                        </button>
                      </div>

                      <div className="mt-4 text-center">
                        <p className="mb-0">
                          By registering you agree to the Skote{" "}
                          <Link to="#" className="text-primary">
                            Terms of Use
                          </Link>
                        </p>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Already have an account ?{" "}
                  <Link to="/login" className="font-weight-medium text-primary">
                    {" "}
                    Login
                  </Link>{" "}
                </p>
                <p>
                  © {new Date().getFullYear()} Skote. Crafted with{" "}
                  <i className="mdi mdi-heart text-danger" /> by Themesbrand
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Register;
