import React from "react";

import { Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import { Link } from "react-router-dom";

import ApexRadial from "./ApexRadial";

const MonthlyEarning = ({profitper,profit}) => {
  return (
    <React.Fragment>
      {" "}
      <Card>
        <CardBody>
          <CardTitle className="mb-4">Total Net Profit</CardTitle>
          <Row>
            <Col sm="6">
              <p className="text-muted">Total Earning</p>
              <h3>₹{profit}</h3>
              <p className="text-muted">
                <span className="text-success me-2">
                  {" "}
                  {profitper}% <i className="mdi mdi-arrow-up"></i>{" "}
                </span>{" "}
              </p>
              <div className="mt-4">
                <Link
                  to="#"
                  className="btn btn-primary waves-effect waves-light btn-sm"
                >
                  View More <i className="mdi mdi-arrow-right ms-1"></i>
                </Link>
              </div>
            </Col>
            <Col sm="6">
              <div className="mt-4 mt-sm-0">
                <ApexRadial dataColors='["--bs-primary"]' percentage={profitper}/>
              </div> 
            </Col>
          </Row>
          <p className="text-muted mb-0">
            We craft technology for Customer.
          </p>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default MonthlyEarning;
