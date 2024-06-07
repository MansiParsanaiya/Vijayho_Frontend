import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
} from "reactstrap";
import { Link } from "react-router-dom";

import classNames from "classnames";

//import Charts
import StackedColumnChart from "./StackedColumnChart";

//import action
import { getChartsData as onGetChartsData } from "../../store/actions";

import modalimage1 from "../../assets/images/product/img-7.png";
import modalimage2 from "../../assets/images/product/img-4.png";

// Pages Components
import WelcomeComp from "./WelcomeComp";
import MonthlyEarning from "./MonthlyEarning";
import SocialSource from "./SocialSource";
import ActivityComp from "./ActivityComp";
import TopCities from "./TopCities";
import LatestTranaction from "./UserDetails";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//i18n
import { withTranslation } from "react-i18next";

//redux
import { useSelector, useDispatch } from "react-redux";
import { getApi, postApi, putApi } from "helpers/ApiMiddleware";
import { apiRoutes } from "helpers/api_routes";
import { setIn } from "formik";
import TableContainer from "components/Common/TableContainer";

const Dashboard = props => {
  const [modal, setmodal] = useState(false);
  const [subscribemodal, setSubscribemodal] = useState(false);

  const { chartsData } = useSelector(state => ({
    chartsData: state.Dashboard.chartsData
  }));

  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);



  useEffect(() => {
    fetchIncomeData();
    fetchExpenseData();
  }, []);


  const fetchIncomeData = async () => {

    try {
      await getApi(`${apiRoutes.viewIncome}`).then((response) => {
        setIncomes(response);

      })
        .catch(error => console.log('error', error));
    } catch (error) {
      console.error('Error fetching income data:', error);
    }

  };

  const fetchExpenseData = async () => {
    try {
      await getApi(`${apiRoutes.viewExpense}`).then((response) => {
        setExpenses(response);

      })
        .catch(error => console.log('error', error));
    } catch (error) {
      console.error('Error fetching expense data:', error);
    }
  };

  const calculateTotal = (data) => {
    return data.reduce((total, item) => total + parseFloat(item.amount), 0).toFixed(2);
  };


  const calculateTotal1 = (data, modeOfPayment) => {
    const filteredData = data.filter(item => item.modeOfPayment === modeOfPayment);
    return filteredData.reduce((total, item) => total + parseFloat(item.amount), 0).toFixed(2);
  };

  console.log(calculateTotal1(incomes, "bank"), " i m cslling income in dashboard")

  const reports = [
    { title: "Income", iconClass: "bx-copy-alt", description: calculateTotal(incomes) },
    { title: "Expense", iconClass: "bx-archive-in", description: calculateTotal(expenses) },
    {
      title: "Total Net Profit",
      iconClass: "bx-purchase-tag-alt",
      description: calculateTotal(incomes) - calculateTotal(expenses),
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setSubscribemodal(true);
    }, 2000);
  }, []);

  const [periodData, setPeriodData] = useState([]);
  const [periodType, setPeriodType] = useState("yearly");

  useEffect(() => {
    setPeriodData(chartsData);
  }, [chartsData]);

  const onChangeChartPeriod = pType => {
    setPeriodType(pType);
    dispatch(onGetChartsData(pType));
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(onGetChartsData("yearly"));
  }, [dispatch]);

  document.title = "Dashboard | Skote - React Admin & Dashboard Template";

  const [userRole, setUserRole] = useState("")
  const [user, setUser] = useState({})

  useEffect(() => {
    const authUserString = localStorage.getItem('authUser');
    const authUser = JSON.parse(authUserString);
    const token = authUser.token;
    setUser(authUser);


    postApi(apiRoutes.userRole, {
      "token": token
    })
      .then((result) => {
        console.log(result.role);
        setUserRole(result.role);

      })
      .catch(error => console.log('error', error));
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("Dashboards")}
            breadcrumbItem={props.t("Dashboard")}
          />

          <Row>
            <Col xl="4">
              <WelcomeComp username={user.username} role={userRole} email={user.email} />
              <MonthlyEarning profitper={((calculateTotal(incomes) - calculateTotal(expenses)) * (100 / calculateTotal(incomes))).toFixed(2)} profit={calculateTotal(incomes) - calculateTotal(expenses)} />
            </Col>
            <Col xl="8">
              <Row>
                {/* Reports Render */}
                {reports.map((report, key) => (
                  <Col md="4" key={"_col_" + key}>
                    <Card className="mini-stats-wid">
                      <CardBody>
                        <div className="d-flex">
                          <div className="flex-grow-1">

                            <p className="text-muted fw-medium">
                              {report.title}
                            </p>

                            <h4 className="mb-0">{report.description}</h4>
                          </div>
                          <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                            <span className="avatar-title rounded-circle bg-primary">
                              <i
                                className={
                                  "bx " + report.iconClass + " font-size-24"
                                }
                              ></i>
                            </span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              </Row>

              <Card>
                <CardBody>
                  <div className="d-sm-flex flex-column" style={{ height: "365px" }}>
                    <h4 className="card-title mb-4 mt-3" >Income/Expense Details</h4>
                    <Table bordered>
                      <tbody>
                        <tr>
                          <td className="card-title-desc p-3">Total Income (<span className="text-success">Bank</span>):</td>
                          <td><span className='text-success fw-bold fs-4 p-3'>{calculateTotal1(incomes, "bank")}</span></td>
                          <td className="card-title-desc  p-3">Total Expense (<span className="text-success">Bank</span>):</td>
                          <td><span className='text-success fw-bold fs-4  p-3'>{calculateTotal1(expenses, "bank")}</span></td>
                          <td className="card-title-desc  p-3">Net Income (<span className="text-success">Bank</span>):</td>
                          <td><span className='text-success fw-bold fs-4  p-3'>{calculateTotal1(incomes, "bank") - calculateTotal1(expenses, "bank")}</span></td>
                        </tr>
                        <tr>
                          <td className="card-title-desc  p-3">Total Income (<span className="text-success">Cash</span>):</td>
                          <td><span className='text-success fw-bold fs-4  p-3'>{calculateTotal1(incomes, "cash")}</span></td>
                          <td className="card-title-desc  p-3">Total Expense (<span className="text-success">Cash</span>):</td>
                          <td><span className='text-success fw-bold fs-4  p-3'>{calculateTotal1(expenses, "cash")}</span></td>
                          <td className="card-title-desc  p-3">Net Income (<span className="text-success">Cash</span>):</td>
                          <td><span className='text-success fw-bold fs-4  p-3'>{calculateTotal1(incomes, "cash") - calculateTotal1(expenses, "cash")}</span></td>
                        </tr>
                        <tr>
                          <td className="card-title-desc p-3">Total Income:</td>
                          <td><span className='text-success fw-bold fs-4 p-3'>{calculateTotal(incomes)}</span></td>
                          <td className="card-title-desc p-3">Total Expense:</td>
                          <td><span className='text-success fw-bold fs-4 p-3'>{calculateTotal(expenses)}</span></td>
                          <td className="card-title-desc p-3">Total Net Income:</td>
                          <td><span className='text-success fw-bold fs-4 p-3'>{calculateTotal(incomes) - calculateTotal(expenses)}</span></td>
                        </tr>

                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>

            </Col>
          </Row>

          <Row>
            <Col lg="12">
              <LatestTranaction />
            </Col>
          </Row>
        </Container>
      </div>

      {/* subscribe ModalHeader */}
      <Modal
        isOpen={subscribemodal}
        role="dialog"
        autoFocus={true}
        centered
        data-toggle="modal"
        toggle={() => {
          setSubscribemodal(!subscribemodal);
        }}
      >
        <div>
          <ModalHeader
            className="border-bottom-0"
            toggle={() => {
              setSubscribemodal(!subscribemodal);
            }}
          ></ModalHeader>
        </div>
        <div className="modal-body">
          <div className="text-center mb-4">
            <div className="avatar-md mx-auto mb-4">
              <div className="avatar-title bg-light  rounded-circle text-primary h1">
                <i className="mdi mdi-email-open"></i>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-xl-10">
                <h4 className="text-primary">Subscribe !</h4>
                <p className="text-muted font-size-14 mb-4">
                  Subscribe our newletter and get notification to stay update.
                </p>

                <div
                  className="input-group rounded bg-light"
                >
                  <Input
                    type="email"
                    className="form-control bg-transparent border-0"
                    placeholder="Enter Email address"
                  />
                  <Button color="primary" type="button" id="button-addon2">
                    <i className="bx bxs-paper-plane"></i>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modal}
        role="dialog"
        autoFocus={true}
        centered={true}
        className="exampleModal"
        tabIndex="-1"
        toggle={() => {
          setmodal(!modal);
        }}
      >
        <div>
          <ModalHeader
            toggle={() => {
              setmodal(!modal);
            }}
          >
            Order Details
          </ModalHeader>
          <ModalBody>
            <p className="mb-2">
              Product id: <span className="text-primary">#SK2540</span>
            </p>
            <p className="mb-4">
              Billing Name: <span className="text-primary">Neal Matthews</span>
            </p>

            <div className="table-responsive">
              <Table className="table table-centered table-nowrap">
                <thead>
                  <tr>
                    <th scope="col">Product</th>
                    <th scope="col">Product Name</th>
                    <th scope="col">Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      <div>
                        <img src={modalimage1} alt="" className="avatar-sm" />
                      </div>
                    </th>
                    <td>
                      <div>
                        <h5 className="text-truncate font-size-14">
                          Wireless Headphone (Black)
                        </h5>
                        <p className="text-muted mb-0">$ 225 x 1</p>
                      </div>
                    </td>
                    <td>$ 255</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <div>
                        <img src={modalimage2} alt="" className="avatar-sm" />
                      </div>
                    </th>
                    <td>
                      <div>
                        <h5 className="text-truncate font-size-14">
                          Hoodie (Blue)
                        </h5>
                        <p className="text-muted mb-0">$ 145 x 1</p>
                      </div>
                    </td>
                    <td>$ 145</td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <h6 className="m-0 text-end">Sub Total:</h6>
                    </td>
                    <td>$ 400</td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <h6 className="m-0 text-end">Shipping:</h6>
                    </td>
                    <td>Free</td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <h6 className="m-0 text-end">Total:</h6>
                    </td>
                    <td>$ 400</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              color="secondary"
              onClick={() => {
                setmodal(!modal);
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </React.Fragment>
  );
};

Dashboard.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
};

export default withTranslation()(Dashboard);
