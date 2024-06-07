import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import withRouter from "components/Common/withRouter";
import { Card, CardBody, Col, Container, Row, Table } from "reactstrap";
import { isEmpty, map } from "lodash";

import Breadcrumbs from "../../components/Common/Breadcrumb";


const InstallmentDetail = ({ installments }) => {

  document.title = "Installment Detail";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <div className="invoice-title">
                      <h4 className="float-end font-size-16">
                        Installment No # 1
                        {installments}
                      </h4>
                    </div>
                    <hr />
                    <Row>
                      <Col sm="6">
                        <address>
                          <strong>Name:</strong>
                          <br />
                        </address>
                      </Col>
                      <Col sm="6" className="text-sm-end">
                        <address>
                          <strong>Contact Number:</strong>
                          <br />
                         
                        </address>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="6" className="mt-3">
                        <address>
                          <strong>Payment Method:</strong>
                          
                        </address>
                      </Col>
                      <Col sm="6" className="mt-3 text-sm-end">
                        <address>
                          <strong>Payment Date:</strong>
                        </address>
                      </Col>
                    </Row>
                    <div className="py-2 mt-3">
                      <h3 className="font-size-15 fw-bold">Installment summary</h3>
                    </div>
                    <div className="table-responsive">
                      <Table className="table-nowrap">
                        <thead>
                          <tr>
                            <th style={{ width: "70px" }}>No.</th>
                            <th>Amount Paid</th>
                            <th className="text-end">Remaining Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td colSpan="2" className="border-0 text-end">
                              <strong>Total</strong>
                            </td>
                            <td className="border-0 text-end">
                              <h4 className="m-0">
                              </h4>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                   
                  </CardBody>
                </Card>
              </Col>
            </Row>
          
        </Container>
      </div>
    </React.Fragment>
  );
};


export default InstallmentDetail;
