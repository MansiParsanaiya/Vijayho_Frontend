import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, CardBody, CardSubtitle, CardTitle, Col, Container, Input, Label, Modal, ModalBody, ModalHeader, Row, Spinner, Table } from 'reactstrap';
import Breadcrumbs from "components/Common/Breadcrumb";
import { apiRoutes } from 'helpers/api_routes';
import { deleteApi, getApi, postApi, putApi } from "helpers/ApiMiddleware";
import TableContainer from 'components/Common/TableContainer';
import { Filter } from 'components/Common/filters';
import InstallmentDetail from './InstallmentDetails';
import { PDFDownloadLink } from '@react-pdf/renderer';
import JsPDF, { jsPDF } from 'jspdf';
import { dateFormat } from 'common/dataFormat';
import { InvoiceTable } from './invoiceTable';
import { InvoiceTable2 } from './invoiceTable2';
import { font } from './font';
import * as Yup from "yup";
import useUserRole from 'helpers/userRoleHook';
import { isDate } from 'lodash';
import Swal from 'sweetalert2'


const Installment = () => {
    const userRole = useUserRole();
    const isDisabled = userRole === 'user';

    const [installments, setInstallments] = useState([]);
    const { studentNumber } = useParams();
    console.log(studentNumber, " i m calling student params")
    const [pageOption, setPageOption] = useState({})
    const [pageValue, setpageValue] = useState(1)
    const [searchWord, setsearchWord] = useState("")
    const [customPageSizeValue, setcustomPageSizeValue] = useState(5)
    const [totalAmountPaid, settotalAmountPaid] = useState(0)
    const [modal, setmodal] = useState(false)
    const [oneinstall, setoneinstall] = useState([])
    const [currentIndex, setcurrentIndex] = useState(null)
    const [installmentModal, setInstallmentModal] = useState(false);
    const [student, setStudent] = useState({})
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingReceipt, setLoadingReceipt] = useState(false);
    const [allInstallments, setallInstallments] = useState([])


    const date = oneinstall.date?.split("T")[0];



    const columns = useMemo(
        () => [

            {
                Header: 'Student\'s Name',
                accessor: 'studentName',
            },
            {
                Header: 'Student\'s Number',
                accessor: 'studentNumber'
            },
            {
                Header: 'Date',
                accessor: 'date',
            },
            {
                Header: 'Fees Amount',
                accessor: 'feesPay',
            },
            {
                Header: 'Amount Paid',
                accessor: 'amountPay'
            },
            {
                Header: 'Remaining Amount',
                accessor: 'remainingFees',
            },
            {
                Header: 'Mode Of Payment',
                accessor: 'modeOfPayment',
            },
            {
                Header: 'Edit',
                accessor: 'edit'
            },
            {
                Header: 'Download Receipt',
                accessor: 'downloadReceipt'
            },
        ],
        []
    );



    const handleDownload = () => {
        setmodal(true);
    };

    const printInvoice = () => {


        setLoadingReceipt(true);

        var htmlNew = InvoiceTable
        var html = htmlNew
            .replace("{COMPANY_NAME}", "Vijayho IT & Multimedia")
            .replace("{COMPANY_ADDRESS}", "409, Yogi Arcade, Yogichowk, Surat")
            .replace("{COMPANY_MOBILENUMER}", "+91 82004 78318")
            .replace("{CUSTOMER_NAME}", oneinstall.studentName)
            .replace("{BOOKING_DATE}", dateFormat(date, "dd/MM/yyyy"))
            .replace("{CUSTOMER_MOBILENUM1}", oneinstall.studentNumber)
            .replace("{RE_NO}", "1")
            .replace("{PRODUCT_CODE}", dateFormat(date, "dd/MM/yyyy"))
            .replace("{RENT}", oneinstall.amountPay)
            .replace("{TOTALRENT}", oneinstall.amountPay)
            .replace("{DISCOUNT}", 0.0)
            .replace("{ADVANCE}", oneinstall.feesPay)
            .replace("{PAYBLE_AMOUNT}", oneinstall.remainingFees)
            .replace("{CUSTOMER_ADDRESS}", student.address)
            .replace("{DELIVERY}", student.courseName)




        const doc = new jsPDF({
            format: "a4",
            unit: "px",
            filters: ["ASCIIHexEncode"],
        })
        doc.addFileToVFS("NotoSansGujarati-Regular.ttf", font)
        doc.addFont(
            "NotoSansGujarati-Regular.ttf",
            "NotoSansGujarati-Regular",
            "normal"
        )
        doc.setFont("NotoSansGujarati-Regular")
        doc.html(html, {
            async callback(doc) {
                await doc.save(`${oneinstall.studentName}.pdf`)
            },
            margin: [10, 10, 10, 10],
        })

        setLoadingReceipt(false);
    };

    const printInvoiceAll = () => {


        setLoadingReceipt(true);

        let value = ``;

        let feesPay = student.feesPay;
        let amountpay;
        let remainingFees;

        allInstallments.map((installment, index) => {
            amountpay = installment.amountPaid;
            remainingFees = installment.remainingFees

            if (installment.amountPay !== 0) {

                value += `<tr style="height: 20px !important">
            <td style="border-right: 0.1px solid black !important" align="center">
                ${index + 1}
            </td>
            <td style="border-right: 0.1px solid black !important" colspan="2">${dateFormat(installment.date, "dd/MM/yyyy")}</td>
            <!-- <td style="border-right: 0.1px solid black !important">{PRODUCT_NAME}</td> -->
            <td style="border-right: 0.1px solid black !important" colspan="2">${student.courseName} <br> 
            </td>
    
            <td style="float: right;">
                <div style="float: left; font-family: NotoSansGujarati-Regular !important;">₹ </div> ${installment.amountPay} <tr style="height: 20px !important;">
            <td style="border-right: 0.1px solid black !important" align="center">
    
            </td>
            <td style="border-right: 0.1px solid black !important" colspan="2"></td>
            <!-- <td style="border-right: 0.1px solid black !important">{PRODUCT_NAME}</td> -->
            <td style="border-right: 0.1px solid black !important" colspan="2"> <br> <span
                    style="font-size: 6px;font-weight: 100; font-family: NotoSansGujarati-Regular !important;"></span>
            </td>
    
            <td style="float: right;">
                <div style="float: left; font-family: NotoSansGujarati-Regular !important;"> </div>
            </td>
            </tr>  `;
            }

        })



        var htmlNew = InvoiceTable2
        var html = htmlNew
            .replace("{COMPANY_NAME}", "Vijayho IT & Multimedia")
            .replace("{COMPANY_ADDRESS}", "409, Yogi Arcade, Yogichowk, Surat")
            .replace("{COMPANY_MOBILENUMER}", "+91 82004 78318")
            .replace("{CUSTOMER_NAME}", student.studentName)
            .replace("{BOOKING_DATE}", dateFormat(Date.now(), "dd/MM/yyyy"))
            .replace("{CUSTOMER_MOBILENUM1}", student.studentNumber)
            .replace("{DISCOUNT}", 0.0)
            .replace("{CUSTOMER_ADDRESS}", student.address)
            .replace("{INSTALLMENTS}", value)
            .replace("{TOTALRENT}", amountpay)
            .replace("{ADVANCE}", feesPay)
            .replace("{PAYBLE_AMOUNT}", remainingFees)


        const doc = new jsPDF({
            format: "a4",
            unit: "px",
            filters: ["ASCIIHexEncode"],
        })
        doc.addFileToVFS("NotoSansGujarati-Regular.ttf", font)
        doc.addFont(
            "NotoSansGujarati-Regular.ttf",
            "NotoSansGujarati-Regular",
            "normal"
        )
        doc.setFont("NotoSansGujarati-Regular")
        doc.html(html, {
            async callback(doc) {
                await doc.save(`${student.studentName}.pdf`)
            },
            margin: [10, 10, 10, 10],
        })

        setLoadingReceipt(false);
    };

    const [editData, setEditData] = useState({
        studentName: "",
        studentNumber: "",
        feesPay: 0,
        amountPay: 0,
        remainingFees: 0,
        modeOfPayment: 'None',
        date: ""
    });

    const installmentSchema = Yup.object().shape({
        feesPay: Yup.number()
            .min(0, 'Fees pay must be a positive number')
            .required('Fees pay is required'),
        amountPay: Yup.number()
            .min(0, 'Amount pay must be a positive number')
            .required('Amount pay is required'),
        amountPaid: Yup.number()
            .min(0, 'Amount paid must be a positive number')
            .required('Amount paid is required'),
        remainingFees: Yup.number()
            .min(0, 'Remaining fees must be a positive number')
            .required('Remaining fees is required'),
        modeOfPayment: Yup.string()
            .required('Mode of payment is required')
    });

    const handleOpenEditModal = (installs, index) => {
        setEditData({
            ...installs,
            remainingFees: installments[index - 1].remainingFees
        });
        setInstallmentModal(true);
    };

    const handleCloseEditModal = () => {
        setInstallmentModal(false);
        setErrors({});
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleUpdateInstallment = async (e) => {

        setLoading(true);
        e.preventDefault();
        try {

            const newStudentData = {
                ...editData,
                modeOfPayment: document.getElementById("modeOfPaymentSelect").value,
            };
            newStudentData.remainingFees = newStudentData.remainingFees - newStudentData.amountPay;
            newStudentData.amountPaid = newStudentData.feesPay - newStudentData.remainingFees;

            installmentSchema.validate(newStudentData, { abortEarly: false })
                .then(response => {



                    putApi(`${apiRoutes.updateInstallment}/${editData._id}`, newStudentData).then(() => {
                        console.log("Updates Successfully")
                        fetchTotalAmountPaid(studentNumber);
                        fetchInstallmentData(studentNumber, searchWord, customPageSizeValue, pageValue);
                        setInstallmentModal(false);
                        setEditData({
                            studentName: "",
                            studentNumber: "",
                            feesPay: 0,
                            amountPay: 0,
                            remainingFees: 0,
                            modeOfPayment: 'None',
                            date: ""
                        });
                        handleCloseEditModal();
                        const updatedStudent = {
                            ...student,
                            amountPay: newStudentData.feesPay - newStudentData.remainingFees,
                            remainingFees: newStudentData.remainingFees,
                        };
                        console.log(updatedStudent, "i m calling updated from installed page")

                        putApi(`${apiRoutes.updateStudent}/${student._id}`, updatedStudent).then(() => {
                        }).then((response) => {
                            console.log("Update Successfully");
                        })
                            .catch(error => console.log('error', error));


                        putApi(`${apiRoutes.updateIncome}/${installments[currentIndex].installIncomeId}`, {
                            title: `Fees Payment by ${newStudentData.studentName}`,
                            description: `Fees Payment by ${newStudentData.studentName}`,
                            amount: newStudentData.amountPay,
                            modeOfPayment: newStudentData.modeOfPayment,
                        }).then(() => {
                        }).then((response) => {
                            console.log("Update Successfully");
                        })
                            .catch(error => console.log('error', error));

                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: "Your work has been saved",
                            showConfirmButton: false,
                            timer: 1500
                        });


                    })
                        .catch(error => console.log('error', error));

                    setErrors({});

                })
                .catch(error => {
                    const validationErrors = {};
                    error.inner.forEach((e) => {
                        validationErrors[e.path] = e.message;
                    });
                    setErrors(validationErrors);
                    console.error('Validation Error:', errors);
                });



        } catch (error) {
            console.error('Error adding fees:', error);
        }
        finally {
            setLoading(false);
        }
    };

    const formattedData = installments.map((installs, index) => {
        const isLastEntry = index === installments.length - 1;
        const date = installs.date?.split("T")[0];

        return {
            studentName: installs.studentName,
            studentNumber: installs.studentNumber,
            date: dateFormat(date, "dd/MM/yyyy"),
            feesPay: installs.feesPay,
            amountPay: installs.amountPay,
            remainingFees: installs.remainingFees,
            modeOfPayment: installs.modeOfPayment,
            edit: isLastEntry && index != 0 ? (
                <Button color="warning" size="sm" onClick={() => { handleOpenEditModal(installs, index); setcurrentIndex(index) }} disabled={isDisabled}>
                    <strong>Edit</strong>
                </Button>
            ) : null,
            downloadReceipt: installs.amountPay !== 0 ? (
                <>
                    <i className="fas fa-download" onClick={() => { handleDownload(); setcurrentIndex(index); setoneinstall(installs) }}></i>
                </>
            ) : null,
        };
    });


    const filterData = (value, pageSize, page) => {

        fetchInstallmentData(studentNumber, value, pageSize, page)

    }

    const fetchTotalAmountPaid = async (studentNumber) => {
        let url = `${apiRoutes.getoneStudent}/${studentNumber}`

        await getApi(url).then((response) => {

            settotalAmountPaid(response.data.amountPay)


        })
            .catch(error => console.log('error', error));


    }

    const fetchData = async (studentNumber) => {
        try {
            await getApi(`${apiRoutes.getoneStudent}/${studentNumber}`).then((response) => {

                setStudent(response.data)


            })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchTotalAmountPaid(studentNumber);
        fetchInstallmentData(studentNumber, searchWord, customPageSizeValue, pageValue);
        fetchData(studentNumber);
        fetchAllInstallments(studentNumber);
    }, []);

    const fetchInstallmentData = async (studentNumber, searchPara, pageSize, page) => {
        try {

            let url = `${apiRoutes.getInstallmentsByStudentId}/${studentNumber}`
            if (searchPara != undefined) {
                url = `${apiRoutes.getInstallmentsByStudentId}/${studentNumber}?page=${page}&limit=${pageSize}&search=${searchPara}`
            }
            else {
                url = `${apiRoutes.getInstallmentsByStudentId}/${studentNumber}?page=${page}&limit=${pageSize}`
            }

            await getApi(url).then((response) => {

                fetchTotalAmountPaid(studentNumber);

                setInstallments(response.data.docs);
                console.log(response, "i m calling incomes data after api repsonse")
                let obj = {
                    "totalDocs": response.data.totalDocs,
                    "limit": response.data.limit,
                    "totalPages": response.data.totalPages,
                    "page": response.data.page,
                    "pagingCounter": response.data.pagingCounter,
                    "hasPrevPage": response.data.hasPrevPage,
                    "hasNextPage": response.data.hasNextPage,
                    "prevPage": response.data.prevPage,
                    "nextPage": response.data.nextPage
                }
                setPageOption(obj)
                console.log(formattedData, "i m calling formatteddata")




            })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.error('Error fetching student data:', error);
        }
    };


    const fetchAllInstallments = async (studentNumber) => {
        try {

            let url = `${apiRoutes.getInstallmentsByStudentIdAll}/${studentNumber}`


            await getApi(url).then((response) => {
                console.log(response, "i m calling allllllllllllllllllllllllllllllllllllllllllllllllllllllllll")
                setallInstallments(response.data);
                // printInvoiceAll();
            })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.error('Error fetching student data:', error);
        }


    };


    return (<>
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="EMS" breadcrumbItem="Installment Detail" />
                    <div className='d-flex justify-content-start align-items-center'>
                        <Link to='/student'>
                            <button type="button" className="btn btn-primary">View Student Detail's</button>
                        </Link>
                    </div>
                    <CardBody className="pt-0">
                        <Card className='mt-3'>
                            <CardBody>
                                <div className='d-flex justify-content-between'>
                                    <div><CardTitle className="mb-4">Installment Report</CardTitle></div>
                                    <div className='justify-content-end'><Button onClick={printInvoiceAll}>Download Installments</Button></div>
                                </div>

                                <Table bordered>
                                    <tbody>
                                        <tr>
                                            <td className="card-title-desc">Total Amount Paid</td>
                                            <td><span className='text-success fw-bold fs-4'>{totalAmountPaid}</span></td>
                                        </tr>
                                    </tbody>
                                </Table>
                                <TableContainer
                                    columns={columns}
                                    data={formattedData}
                                    isGlobalFilter={true}
                                    isAddOptions={false}
                                    customPageSizeValue={customPageSizeValue}
                                    setcustomPageSizeValue={setcustomPageSizeValue}
                                    className="custom-header-css"
                                    searchValue={filterData}
                                    pageOptionFromParents={pageOption}
                                    pageState={pageValue}
                                    searchWord={searchWord}
                                    setsearchWord={setsearchWord}
                                />
                            </CardBody>
                        </Card>
                    </CardBody>
                    <Modal
                        isOpen={modal}
                        toggle={() => {
                            setmodal();
                        }}
                        id="applyJobs"
                    >
                        <div className="modal-content">

                            <ModalBody>
                                <div className="page-content">
                                    <Container fluid>
                                        <Row>
                                            <Col lg="12">
                                                <Card>
                                                    <CardBody>
                                                        <div className="invoice-title">
                                                            <h4 className="float-end font-size-16">
                                                                Installment Detail
                                                            </h4>
                                                        </div>
                                                        <hr />
                                                        <Row>
                                                            <Col sm="6">
                                                                <address>
                                                                    <strong>Name:</strong>
                                                                    <br />
                                                                    {oneinstall.studentName}
                                                                </address>
                                                            </Col>
                                                            <Col sm="6" className="text-sm-end">
                                                                <address>
                                                                    <strong>Contact Number:</strong>
                                                                    <br />
                                                                    {oneinstall.studentNumber}


                                                                </address>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col sm="6" className="mt-3">
                                                                <address>
                                                                    <strong>Payment Method:</strong>
                                                                    <br />
                                                                    {oneinstall.modeOfPayment}

                                                                </address>
                                                            </Col>
                                                            <Col sm="6" className="mt-3 text-sm-end">
                                                                <address>
                                                                    <strong>Payment Date:</strong>
                                                                    <br />
                                                                    {dateFormat(date, "dd/MM/yyyy")}
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
                                                                    <tr >
                                                                        <td>{currentIndex + 1}</td>
                                                                        <td>{oneinstall.amountPay}</td>
                                                                        <td className="text-end">{oneinstall.remainingFees}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                        <div className="d-print-none">
                                                            <div className="float-end">
                                                                {loadingReceipt ? <Link
                                                                    to="#"
                                                                    disabled={loadingReceipt}
                                                                    className="btn btn-success  me-2"
                                                                >
                                                                    <Spinner size="sm" color="light" />
                                                                </Link> : <Link
                                                                    to="#"
                                                                    onClick={printInvoice}
                                                                    className="btn btn-success  me-2"
                                                                >
                                                                    <i className="fa fa-print" />
                                                                </Link>}

                                                            </div>
                                                        </div>

                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>

                                    </Container>
                                </div>
                            </ModalBody>
                        </div>
                    </Modal>

                    <Modal
                        isOpen={installmentModal}
                        toggle={() => {
                            setInstallmentModal();
                        }}
                        id="applyJobs"
                    >
                        <div className="modal-content">
                            <ModalHeader toggle={() => setModal()} id="applyJobsLabel" className="modal-header">
                                Update Fees Installment
                            </ModalHeader>
                            <ModalBody>
                                <Row>
                                    <Col lg={12}>
                                        <div className="mb-3">
                                            <Label htmlFor="studentNameInput" className="form-label">Student's Name</Label>
                                            <Input
                                                type="text"
                                                name="studentName"
                                                id="studentNameInput"
                                                className="form-control"
                                                placeholder="Enter Student's Full Name"
                                                value={editData.studentName}
                                                readOnly
                                                required
                                            />
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Label htmlFor="aadharCardInput" className="form-label">Student's Number</Label>
                                            <Input
                                                type="number"
                                                name="aadharCard"
                                                id="aadharCardInput"
                                                className="form-control"
                                                placeholder="Enter Contact Number"
                                                value={editData.studentNumber}
                                                readOnly
                                                required
                                            />
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Label htmlFor="feesPayInput" className="form-label">Fees Pay</Label>
                                            <Input
                                                type="number"
                                                name="feesPay"
                                                id="feesPayInput"
                                                className="form-control"
                                                placeholder="Enter Fees Pay"
                                                value={editData.feesPay}
                                                readOnly
                                                required
                                            />
                                        </div>
                                        {errors.feesPay && <div className="text-danger">{errors.feesPay}</div>}
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Label htmlFor="amountPayInput" className="form-label">Amount to Pay</Label>
                                            <Input
                                                type="number"
                                                name="amountPay"
                                                id="amountPayInput"
                                                className="form-control"
                                                placeholder="Enter Amount to Pay"
                                                value={editData.amountPay}
                                                onChange={handleEditInputChange}
                                                required
                                            />
                                        </div>
                                        {errors.amountPay && <div className="text-danger">{errors.amountPay}</div>}
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Label htmlFor="remainingFeesInput" className="form-label">Remaining Fees</Label>
                                            <Input
                                                type="number"
                                                name="remainingFees"
                                                id="remainingFeesInput"
                                                className="form-control"
                                                placeholder="Enter Remaining Amount"
                                                value={editData.remainingFees}
                                                required
                                            />
                                        </div>
                                        {errors.remainingFees && <div className="text-danger">{errors.remainingFees}</div>}
                                    </Col>
                                    <Col lg={6}>
                                        <div className="col-sm-auto">
                                            <Label htmlFor="feesPayInput" className="form-label">Mode of Payment</Label>
                                            <select id="modeOfPaymentSelect" className="form-select" defaultValue={currentIndex !== null ? editData.modeOfPayment : "None"}  // Set the value attribute to bind the selected value
                                            >
                                                <option value="None">Choose...</option>
                                                <option value="bank">Bank</option>
                                                <option value="cash">Cash</option>
                                            </select>
                                        </div>
                                        {errors.modeOfPayment && <div className="text-danger">{errors.modeOfPayment}</div>}
                                    </Col>
                                    <Col lg={12}>
                                        <div className="text-end">
                                            <button className="btn btn-success me-1" onClick={handleUpdateInstallment} disabled={loading}>{loading ? <Spinner size="sm" color="light" /> : 'Edit Fees Installment'}<i className="bx bx-send align-middle"></i></button>

                                            <button className="btn btn-outline-secondary" onClick={handleCloseEditModal}>Cancel</button>
                                        </div>
                                    </Col>
                                </Row>
                            </ModalBody>
                        </div>
                    </Modal>

                </Container>
            </div>
        </React.Fragment>
    </>)
};

export default Installment;
