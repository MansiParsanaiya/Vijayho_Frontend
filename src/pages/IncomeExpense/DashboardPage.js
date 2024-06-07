import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Container, Button } from 'reactstrap';

const DashboardPage = () => {
    return (
        <Container>
            <Card className="overflow-hidden mt-5">
                <CardBody className="pt-0">
                    <div>
                        <Link to="/">
                            <div className="avatar-md profile-user-wid mb-4">
                                <span className="avatar-title rounded-circle bg-light">
                                    {/* Use your own icon or image here */}
                                    <i className="bx bx-dollar" />
                                </span>
                            </div>
                        </Link>
                    </div>
                    <div className="p-2">
                        <div className="text-center">
                            <h3>Dashboard</h3>
                            <div className="mt-4">
                                <Link to="/income">
                                    <Button color="primary" className="mr-2">
                                        Income
                                    </Button>
                                </Link>
                                <Link to="/expense">
                                    <Button color="danger" className="mr-2">
                                        Expense
                                    </Button>
                                </Link>
                                <Link to="/listdisplay">
                                    <Button color="primary" className="mr-2">
                                        List
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </Container>
    );
};

export default DashboardPage;
