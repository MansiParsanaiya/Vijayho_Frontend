import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, CardBody, CardSubtitle, CardTitle, Col, Container, Input, Label, Modal, ModalBody, ModalHeader, Row, Spinner, Table } from 'reactstrap';
import Breadcrumbs from "components/Common/Breadcrumb";
import { apiRoutes } from 'helpers/api_routes';
import { deleteApi, getApi, postApi, putApi } from "helpers/ApiMiddleware";
import TableContainer from 'components/Common/TableContainer';
import { Filter } from 'components/Common/filters';
import * as Yup from "yup";
import * as XLSX from 'xlsx';
import { dateFormat } from 'common/dataFormat';
import useUserRole from 'helpers/userRoleHook';
import Swal from 'sweetalert2'
import userActive from 'helpers/userActive';




const Income = () => {
    const userRole = useUserRole();
    const isDisabled = userRole === 'user';
    const userActivestatus = userActive();

    const [incomes, setIncomes] = useState([]);
    console.log(incomes, "i am calling Income component")
    const [newIncome, setNewIncome] = useState({ title: '', description: '', amount: 0, modeOfPayment: 'None' });
    const [editIndex, setEditIndex] = useState(null);
    const [oldAmount, setOldAmount] = useState("");
    const [user, setUser] = useState(null);
    const [modal, setModal] = useState(false);
    const { branchId } = useParams();
    const [pageOption, setPageOption] = useState({})
    const [pageValue, setpageValue] = useState(1)
    const [searchWord, setsearchWord] = useState("")
    const [customPageSizeValue, setcustomPageSizeValue] = useState(5)
    const [totalCashIncome, setTotalCashIncome] = useState(0);
    const [totalBankIncome, setTotalBankIncome] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalCashExpense, setTotalCashExpense] = useState(0);
    const [totalBankExpense, setTotalBankExpense] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [allIncome, setallIncome] = useState([]);
    const [errors, setErrors] = useState({});

    const [loadingExport, setLoadingExport] = useState(false);
    const [loading, setLoading] = useState(false);



    console.log(allIncome, " i m calling allincome from income page")

    useEffect(() => {

        console.log(userActivestatus, " i  m calling mansiiiiiiiiiiiiiiiiiiiiiiii")

        if (userActivestatus == 'pending') {
            localStorage.removeItem('authUser');
        }

    }, [userActivestatus])

    const columns = useMemo(
        () => [

            {
                Header: 'Title',
                accessor: 'title',
            },
            {
                Header: 'Amount',
                accessor: 'amount'
            },
            {
                Header: 'Description',
                accessor: 'description'
            },
            {
                Header: 'Payment',
                accessor: 'payment'
            },
            {
                Header: 'Date',
                accessor: 'date',
            },
            {
                Header: 'Edit',
                accessor: 'edit'
            },
            {
                Header: 'Delete',
                accessor: 'delete'
            }
        ],
        []
    );

    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required('Title is required'),
        description: Yup.string()
            .required('Description is required'),
        amount: Yup.number()
            .required('Amount is required')
            .min(1, 'Amount pay must be a positive number'),
        modeOfPayment: Yup.string().oneOf(['cash', 'bank'], 'Invalid mode of payment'),

    });

    const formattedData = incomes.map((income, index) => {
        const date = income.date?.split("T")[0];
        return {
            title: income.title,
            amount: income.amount,
            description: income.description,
            payment: income.modeOfPayment,
            date: dateFormat(date, "dd/MM/yyyy"),
            edit: <> <Button color="warning" size="sm" onClick={() => { setModal(true); handleUpdateIncome(index); }} disabled={isDisabled}><strong>Edit</strong></Button></>,
            delete: <> <Button color="danger" size="sm" onClick={() => handleDeleteIncome(index)} disabled={isDisabled}><strong>Delete</strong></Button></>
        };
    });

    const filterData = (value, pageSize, page) => {

        fetchIncomeData(branchId, value, pageSize, page)

    }

    const fetchTotalIncome = async (branchId) => {
        let url = `${apiRoutes.totalIncome}/${branchId}`

        await getApi(url).then((response) => {

            setTotalCashIncome(response.totalCashIncome);
            setTotalBankIncome(response.totalBankIncome);
            setTotalIncome(response.totalIncome);


        })
            .catch(error => console.log('error', error));


    }

    const fetchTotalExpense = async (branchId) => {
        let url = `${apiRoutes.totalExpense}/${branchId}`

        await getApi(url).then((response) => {

            setTotalCashExpense(response.totalCashExpense);
            setTotalBankExpense(response.totalBankExpense);
            setTotalExpense(response.totalExpense);


        })
            .catch(error => console.log('error', error));


    }

    const fetchAllIncome = async () => {
        let url = `${apiRoutes.getAllIncome}`

        await getApi(url).then((response) => {
            setallIncome(response);
        })
            .catch(error => console.log('error', error));
    }

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('authUser'));
        setUser(storedUser.username);
        fetchTotalIncome(branchId);
        fetchTotalExpense(branchId);
        fetchIncomeData(branchId, searchWord, customPageSizeValue, pageValue);
        fetchAllIncome();
    }, [branchId]);

    const fetchIncomeData = async (branchId, searchPara, pageSize, page) => {
        try {
            let url = `${apiRoutes.viewIncome}/${branchId}`
            if (searchPara != undefined) {
                url = `${apiRoutes.viewIncome}/${branchId}?page=${page}&limit=${pageSize}&search=${searchPara}`
                console.log(url, "i am calling from if in fetch Income")
            }
            else {
                url = `${apiRoutes.viewIncome}/${branchId}?page=${page}&limit=${pageSize}`
                console.log(url, "i m calling from else part")
            }
            await getApi(url).then((response) => {


                

                setIncomes(response.docs);
                console.log(response, "i m calling incomes data after api repsonse")
                let obj = {
                    "totalDocs": response.totalDocs,
                    "limit": response.limit,
                    "totalPages": response.totalPages,
                    "page": response.page,
                    "pagingCounter": response.pagingCounter,
                    "hasPrevPage": response.hasPrevPage,
                    "hasNextPage": response.hasNextPage,
                    "prevPage": response.prevPage,
                    "nextPage": response.nextPage
                }
                setPageOption(obj)
                console.log(formattedData, "i m calling formatteddata")




            })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.error('Error fetching income data:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewIncome((prevIncome) => ({ ...prevIncome, [name]: value }));
    };

    const handleAddIncome = async () => {
        setLoading(true)
        try {

            const newIncomeData = {
                ...newIncome,
                modeOfPayment: document.getElementById("modeOfPaymentSelect").value,
            };



            validationSchema.validate(newIncomeData, { abortEarly: false })
                .then(response => {
                    postApi(apiRoutes.addIncome, {
                        ...newIncomeData,
                        user: user,
                        branchId: branchId,
                        lastEdit: user,
                        modeOfPayment: document.getElementById("modeOfPaymentSelect").value,
                    }).then(() => {
                        console.log("Added Successfully")
                        setModal(false);
                        fetchTotalIncome(branchId);
                        fetchTotalExpense(branchId);
                        fetchIncomeData(branchId, searchWord, customPageSizeValue, pageValue);
                        setNewIncome({ title: '', description: '', amount: 0, modeOfPayment: 'None' });
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
                    if (error.inner) {
                        error.inner.forEach((e) => {
                            validationErrors[e.path] = e.message;
                        });
                    }
                    setErrors(validationErrors);
                    console.error('Validation Error:', errors);
                });


        } catch (error) {
            console.error('Error adding income:', error);
        }
        finally {
            setLoading(false);
        }
    };

    const handleUpdateIncome = (index) => {
        setNewIncome(incomes[index]);
        setEditIndex(index);
        setOldAmount(incomes[index].amount);
    };

    const handleEditIncome = async () => {
        setLoading(true);
        try {

            const newIncomeData = {
                ...newIncome,
                modeOfPayment: document.getElementById("modeOfPaymentSelect").value,
            };

            validationSchema.validate(newIncomeData, { abortEarly: false })
                .then(response => {
                    putApi(`${apiRoutes.updateIncome}/${incomes[editIndex]._id}`, {
                        ...newIncome,
                        lastEdit: user,
                        modeOfPayment: document.getElementById("modeOfPaymentSelect").value,
                    }).then(() => {
                    }).then((response) => {
                        console.log("Update Successfully");
                        fetchTotalIncome(branchId);
                        fetchTotalExpense(branchId);
                        fetchIncomeData(branchId, searchWord, customPageSizeValue, pageValue);
                        setEditIndex(null);
                        setOldAmount(null);
                        setModal(false);
                        setNewIncome({ title: '', description: '', amount: 0, modeOfPayment: 'None' });
                        setErrors({});
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: "Your work has been saved",
                            showConfirmButton: false,
                            timer: 1500
                        });

                    })
                        .catch(error => console.log('error', error));


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
            console.error('Error updating income:', error);
        }
        finally {
            setLoading(false);
        }
    };

    const handleDeleteIncome = async (index) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger me-3"
            },
            buttonsStyling: false
        });

        if (incomes[index].description.includes("Fees Payment")) {
            swalWithBootstrapButtons.fire({
                title: "Warning!",
                text: "This income is related to fees payment. Deleting it might cause inconsistency in the data.",
                icon: "warning"
            });
            return;
        }

        swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                try {

                    deleteApi(`${apiRoutes.deleteIncome}/${incomes[index]._id}`, { user: user })
                        .then(() => {
                            console.log("Delete successfully");
                            fetchTotalIncome(branchId);
                            fetchTotalExpense(branchId);
                            fetchIncomeData(branchId, searchWord, customPageSizeValue, pageValue);

                        })
                        .catch(error => console.log('error', error));

                } catch (error) {
                    console.error('Error deleting income:', error);
                }
                swalWithBootstrapButtons.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire({
                    title: "Cancelled",
                    text: "Your imaginary file is safe :)",
                    icon: "error"
                });
            }
        });


    };

    const handleCancel = () => {
        setModal(false);
        setNewIncome({ title: '', description: '', amount: 0, modeOfPayment: 'None' });
        setEditIndex(null);
        setOldAmount(null);
        setErrors({});
    };

    const handleExport = () => {
        setLoadingExport(true);
        const data = allIncome.map(income => ({
            Title: income.title,
            Amount: income.amount,
            Description: income.description,
            User: income.user,
            BranchId: income.branchId,
            ModeOfPayment: income.modeOfPayment,
            Date: dateFormat(income.date?.split("T")[0], "dd/MM/yyyy")
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Expenses");
        const filename = `incomes-branch-${branchId}.xlsx`;
        XLSX.writeFile(wb, filename);
        setLoadingExport(false);
    };

    return (<>
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="EMS" breadcrumbItem="Income Detail" />
                    <div className='d-flex justify-content-end align-items-center'>

                        <Button onClick={() => setModal(true)}>Add Income</Button>
                    </div>
                    <CardBody className="pt-0">

                        <Card className='mt-3'>
                            <CardBody>
                                <div className='d-flex'><CardTitle className="mb-4"><span className='me-2'>Income Report</span><Button
                                    className={`btn btn-success mb-1 ${loadingExport ? 'disabled' : ''}`}
                                    onClick={handleExport}
                                    disabled={loadingExport}
                                >
                                    {loadingExport ? <Spinner size="sm" color="light" /> : 'Export'}
                                </Button></CardTitle></div>


                                <Table bordered>
                                    <tbody>
                                        <tr>
                                            <td className="card-title-desc">Total Income (<span className="text-success">Bank</span>):</td>
                                            <td><span className='text-success fw-bold fs-4'>{totalBankIncome}</span></td>
                                            <td className="card-title-desc">Total Expense (<span className="text-success">Bank</span>):</td>
                                            <td><span className='text-success fw-bold fs-4'>{totalBankExpense}</span></td>
                                            <td className="card-title-desc">Net Income (<span className="text-success">Bank</span>):</td>
                                            <td><span className='text-success fw-bold fs-4'>{totalBankIncome - totalBankExpense}</span></td>
                                        </tr>
                                        <tr>
                                            <td className="card-title-desc">Total Income (<span className="text-success">Cash</span>):</td>
                                            <td><span className='text-success fw-bold fs-4'>{totalCashIncome}</span></td>
                                            <td className="card-title-desc">Total Expense (<span className="text-success">Cash</span>):</td>
                                            <td><span className='text-success fw-bold fs-4'>{totalCashExpense}</span></td>
                                            <td className="card-title-desc">Net Income (<span className="text-success">Cash</span>):</td>
                                            <td><span className='text-success fw-bold fs-4'>{totalCashIncome - totalCashExpense}</span></td>
                                        </tr>
                                        <tr>
                                            <td className="card-title-desc">Total Income:</td>
                                            <td><span className='text-success fw-bold fs-4'>{totalIncome}</span></td>
                                            <td className="card-title-desc">Total Expense:</td>
                                            <td><span className='text-success fw-bold fs-4'>{totalExpense}</span></td>
                                            <td className="card-title-desc">Total Net Income:</td>
                                            <td><span className='text-success fw-bold fs-4'>{totalIncome - totalExpense}</span></td>
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
                            setModal();
                            setErrors({});
                        }}
                        id="applyJobs"

                        onClosed={() => {
                            handleCancel();
                        }}

                    >
                        <div className="modal-content">
                            <ModalHeader toggle={() => { setModal(); setErrors({}); }} id="applyJobsLabel" className="modal-header">
                               {editIndex != null ? "Edit Income" : " Add Income"}
                            </ModalHeader>
                            <ModalBody>
                                <Row>
                                    <Col lg={12}>
                                        <div className="mb-3">
                                            <Label htmlFor="fullnameInput" className="form-label">Title</Label>
                                            <Input
                                                type="text"
                                                name="title"
                                                id="fullnameInput"
                                                className="form-control"
                                                placeholder="Enter title"
                                                value={newIncome.title}
                                                onChange={handleInputChange}
                                            />
                                            {errors.title && <div className="text-danger">{errors.title}</div>}
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Label htmlFor="numberInput" className="form-label">Amount</Label>
                                            <Input
                                                type="text"
                                                name="amount"
                                                id="numberInput"
                                                className="form-control"
                                                placeholder="Enter amount"
                                                value={newIncome.amount}
                                                onChange={handleInputChange}
                                            />
                                            {errors.amount && <div className="text-danger">{errors.amount}</div>}
                                        </div>
                                    </Col>
                                    {
                                        editIndex !== null ? <>
                                            <Col lg={6}>
                                                <div className="mb-3">
                                                    <Label htmlFor="numberInput" className="form-label">Old Amount</Label>
                                                    <Input
                                                        type="text"
                                                        name="amount"
                                                        id="numberInput"
                                                        className="form-control"
                                                        value={oldAmount}
                                                        readOnly
                                                    />
                                                </div>
                                            </Col>
                                        </> : ""
                                    }

                                    <Col lg={12}>
                                        <div className="mb-4">
                                            <Label htmlFor="descriptionInput" className="form-label">Description</Label>
                                            <textarea name="description" className="form-control" id="descriptionInput" rows="3" placeholder="Enter description" value={newIncome.description} onChange={handleInputChange} ></textarea>
                                            {errors.description && <div className="text-danger">{errors.description}</div>}
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="col-sm-auto">
                                            <label className="visually-hidden" htmlFor="autoSizingSelect">Mode of Payment</label>
                                            <select defaultValue={editIndex !== null ? newIncome.modeOfPayment : "None"} id="modeOfPaymentSelect" className="form-select">
                                                <option value="None">Choose...</option>
                                                <option value="bank">Bank</option>
                                                <option value="cash">Cash</option>
                                            </select>
                                            {errors.modeOfPayment && <div className="text-danger">{errors.modeOfPayment}</div>}
                                        </div>
                                    </Col>
                                    <Col lg={12}>
                                        <div className="text-end">
                                            {
                                                editIndex !== null ? <><button className="btn btn-success me-1" onClick={handleEditIncome} disabled={loading}>{loading ? <Spinner size="sm" color="light" /> : 'Edit Income'} <i className="bx bx-send align-middle"></i></button></> : <><button className="btn btn-success me-1" onClick={handleAddIncome} disabled={loading}>{loading ? <Spinner size="sm" color="light" /> : 'Add Income'} <i className="bx bx-send align-middle"></i>  </button></>
                                            }

                                            <button className="btn btn-outline-secondary" onClick={handleCancel}>Cancel</button>
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

export default Income;
