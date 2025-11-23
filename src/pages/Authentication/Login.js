import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { put } from "redux-saga/effects";


import { Row, Col, CardBody, Card, Alert, Container, Form, Input, FormFeedback, Label } from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import withRouter from "components/Common/withRouter";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

//Social Media Imports
import { GoogleLogin } from "react-google-login";
// import TwitterLogin from "react-twitter-auth"
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

// actions
import { loginUser, socialLogin } from "../../store/actions";

// import images
import profile from "assets/images/profile-img.png";
import logo from "assets/images/logo.svg";

//Import config
import { facebook, google } from "../../config";
import { result } from "lodash";

import { apiRoutes } from "helpers/api_routes";
import { postApi, putApi } from "helpers/ApiMiddleware";
import Swal from 'sweetalert2'
import useUserRole from 'helpers/userRoleHook';


const Login = props => {

  const navigate = useNavigate();
  const [error, seterror] = useState("")
  const [loginStatus, setloginStatus] = useState('');

  const userRole = useUserRole();
  const isDisabled = userRole === 'user';

  //meta title
  document.title = "Login | EMS - React Admin & Dashboard Template";

  const dispatch = useDispatch();

  // useEffect(() => {
  //   const authUser = localStorage.getItem("authUser");

  //   if (authUser) {
  //     navigate("/dashboard");
  //   }
  // }, []);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: "abc@gmail.com" || '',
      password: "123" || '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: (values, { setErrors, resetForm }) => {
      // dispatch(loginUser(values, props.router.navigate));
      postApi(apiRoutes.login, {
        "email": values.email,
        "password": values.password
      }).then(({ token, role, username, email, message, activeMsg }) => {

        if (activeMsg) {
          setloginStatus(activeMsg);
          console.log(activeMsg);
          return;
        }

        console.log(token);
        console.log(message);
        const authUserData = { token, username, email };
        if (token) {
          navigate("/dashboard");
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
          {Toast.fire({
            icon: "success",
            title: "Login successfully 😊"
          });}
          localStorage.setItem('authUser', JSON.stringify(authUserData));

        } else {
          console.log("Login failed");
          if (message === "User with this email is not registered") {
            setErrors({
              email: "User with this email is not registered",
            });
          } else if (message === "Invalid Password") {
            setErrors({
              password: "Invalid Password",
            });
          } else {
            console.log('Unhandled error:', message);
          }

        }

      })
        .catch(error => console.log('error', error));
    }
  });

  // const { error } = useSelector(state => ({
  //   error: state.Login.error,
  // }));

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

  const signIn = (res, type) => {
    if (type === "google" && res) {
      const postData = {
        name: res.profileObj.name,
        email: res.profileObj.email,
        token: res.tokenObj.access_token,
        idToken: res.tokenId,
      };
      dispatch(socialLogin(postData, props.router.navigate, type));
    } else if (type === "facebook" && res) {
      const postData = {
        name: res.name,
        email: res.email,
        token: res.accessToken,
        idToken: res.tokenId,
      };
      dispatch(socialLogin(postData, props.router.navigate, type));
    }
  };

  //handleGoogleLoginResponse
  const googleResponse = response => {
    signIn(response, "google");
  };

  //handleTwitterLoginResponse
  // const twitterResponse = e => {}

  //handleFacebookLoginResponse
  const facebookResponse = response => {
    signIn(response, "facebook");
  };

  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
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
                    <Col xs={7}>
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Welcome Back !</h5>
                        <p>Sign in to continue to EMS.</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/" className="logo-light-element">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                            src={logo}
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

                      {loginStatus && (
                        <Alert color="info">{loginStatus}</Alert>
                      )}

                      {error ? <Alert color="danger">{error}</Alert> : null}

                      <div className="mb-3">
                        <Label className="form-label">Email</Label>
                        <Input
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
                        <Label className="form-label">Password</Label>
                        <Input
                          name="password"
                          value={validation.values.password || ""}
                          type="password"
                          placeholder="Enter Password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.password && validation.errors.password ? true : false
                          }
                        />
                        {validation.touched.password && validation.errors.password ? (
                          <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                        ) : null}
                      </div>

                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="customControlInline"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="customControlInline"
                        >
                          Remember me
                        </label>
                      </div>

                      <div className="mt-3 d-grid">
                        <button
                          className="btn btn-primary btn-block"
                          type="submit"
                        >
                          Log In
                        </button>
                      </div>

                      <div className="mt-4 text-center">
                        <h5 className="font-size-14 mb-3">Sign in with</h5>

                        <ul className="list-inline">
                          <li className="list-inline-item">
                            <FacebookLogin
                              appId={facebook.APP_ID}
                              autoLoad={false}
                              callback={facebookResponse}
                              render={renderProps => (
                                <Link
                                  to="#"
                                  className="social-list-item bg-primary text-white border-primary"
                                  onClick={renderProps.onClick}
                                >
                                  <i className="mdi mdi-facebook" />
                                </Link>
                              )}
                            />
                          </li>
                          {/*<li className="list-inline-item">*/}
                          {/*  <TwitterLogin*/}
                          {/*    loginUrl={*/}
                          {/*      "http://localhost:4000/api/v1/auth/twitter"*/}
                          {/*    }*/}
                          {/*    onSuccess={this.twitterResponse}*/}
                          {/*    onFailure={this.onFailure}*/}
                          {/*    requestTokenUrl={*/}
                          {/*      "http://localhost:4000/api/v1/auth/twitter/revers"*/}
                          {/*    }*/}
                          {/*    showIcon={false}*/}
                          {/*    tag={"div"}*/}
                          {/*  >*/}
                          {/*    <a*/}
                          {/*      href=""*/}
                          {/*      className="social-list-item bg-info text-white border-info"*/}
                          {/*    >*/}
                          {/*      <i className="mdi mdi-twitter"/>*/}
                          {/*    </a>*/}
                          {/*  </TwitterLogin>*/}
                          {/*</li>*/}
                          <li className="list-inline-item">
                            <GoogleLogin
                              clientId={google.CLIENT_ID}
                              render={renderProps => (
                                <Link
                                  to="#"
                                  className="social-list-item bg-danger text-white border-danger"
                                  onClick={renderProps.onClick}
                                >
                                  <i className="mdi mdi-google" />
                                </Link>
                              )}
                              onSuccess={googleResponse}
                              onFailure={() => { }}
                            />
                          </li>
                        </ul>
                      </div>

                      <div className="mt-4 text-center">
                        <Link to="/forgot-password" className="text-muted">
                          <i className="mdi mdi-lock me-1" />
                          Forgot your password?
                        </Link>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Don&#39;t have an account ?{" "}
                  <Link to="/register" className="fw-medium text-primary">
                    {" "}
                    Signup now{" "}
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

export default withRouter(Login);

Login.propTypes = {
  history: PropTypes.object,
};
