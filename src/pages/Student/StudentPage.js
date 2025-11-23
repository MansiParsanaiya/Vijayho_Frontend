import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, CardBody, CardSubtitle, CardTitle, Col, Container, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Nav, NavItem, NavLink, Row, Spinner, Table } from 'reactstrap';
import Breadcrumbs from "components/Common/Breadcrumb";
import { apiRoutes } from 'helpers/api_routes';
import { deleteApi, getApi, postApi, putApi } from "helpers/ApiMiddleware";
import TableContainer from 'components/Common/TableContainer';
import { Filter } from 'components/Common/filters';
import * as Yup from "yup";
import { dateFormat } from 'common/dataFormat';
import useUserRole from 'helpers/userRoleHook';
import Swal from 'sweetalert2'
import classNames from 'classnames';
import DatePicker from 'react-flatpickr';
import axios from 'axios';
import Select from 'react-select';

const Student = () => {
    const userRole = useUserRole();
    const isDisabled = userRole === 'user';

    const [studentmodal, setStudentModal] = useState(false);
    const [employeemodal, setEmployeeModal] = useState(false);
    const [installmentModal, setInstallmentModal] = useState(false);
    const [students, setStudents] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [pageOption, setPageOption] = useState({})
    const [pageValue, setpageValue] = useState(1)
    const [searchWord, setsearchWord] = useState("")
    const [customPageSizeValue, setcustomPageSizeValue] = useState(5)
    const [user, setUser] = useState(null);
    const [courses, setcourses] = useState([])
    const [errors, setErrors] = useState({});
    const [employeeErrors, setEmployeeErrors] = useState({});
    const [branches, setBranches] = useState([]);
    const branchNames = branches.map(branch => branch.name);
    const coursesNames = courses.map(course => course.name)
    const [confirmModal, setconfirmModal] = useState(false)
    const [studentIndex, setstudentIndex] = useState(null)
    const [refundModal, setrefundModal] = useState(false)
    const [refundDecision, setRefundDecision] = useState('yes');
    const [refundAmountDisabled, setRefundAmountDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const val = isDisabled ? "1" : "2";

    const [activeTab, setactiveTab] = useState("1");
    const [activeForm, setactiveForm] = useState("");

    // const columns = useMemo(
    //     () => [
    //         {
    //             Header: 'Student\'s Name',
    //             accessor: 'studentName',
    //         },
    //         {
    //             Header: 'Student\'s Number',
    //             accessor: 'studentNumber'
    //         },
    //         {
    //             Header: 'Father Name',
    //             accessor: 'fatherName',
    //         },
    //         {
    //             Header: 'Mother Number',
    //             accessor: 'motherName'
    //         },
    //         {
    //             Header: 'Parents\'s Name',
    //             accessor: 'parentNumber',
    //         },
    //         {
    //             Header: 'College Name',
    //             accessor: 'college'
    //         },
    //         {
    //             Header: 'Qualification',
    //             accessor: 'qualification',
    //         },
    //         {
    //             Header: 'Aadhar Card Number',
    //             accessor: 'aadharCard'
    //         },
    //         {
    //             Header: 'Course Name',
    //             accessor: 'courseName'
    //         },
    //         {
    //             Header: 'Fees Amount',
    //             accessor: 'feesPay',
    //         },
    //         {
    //             Header: 'Amount Paid',
    //             accessor: 'amountPay'
    //         },
    //         {
    //             Header: 'Remaining Amount',
    //             accessor: 'remainingFees',
    //         },
    //         {
    //             Header: 'Date',
    //             accessor: 'date',
    //         },
    //         {
    //             Header: 'View Payment',
    //             accessor: 'viewPayment'
    //         },
    //         {
    //             Header: 'Pay installments',
    //             accessor: 'payInstallment'
    //         },
    //         {
    //             Header: 'Edit',
    //             accessor: 'edit'
    //         },
    //         {
    //             Header: 'Delete',
    //             accessor: 'delete'
    //         }
    //     ],
    //     []
    // );

    const studentColumns = useMemo(() => [
        { Header: "Student's Name", accessor: 'studentName' },
        { Header: "Student's Number", accessor: 'studentNumber' },
        { Header: 'Father Name', accessor: 'fatherName' },
        { Header: 'Mother Name', accessor: 'motherName' },
        { Header: 'Parent\'s Number', accessor: 'parentNumber' },
        { Header: 'College Name', accessor: 'college' },
        { Header: 'Qualification', accessor: 'qualification' },
        { Header: 'Aadhar Card Number', accessor: 'aadharCard' },
        { Header: 'Course Name', accessor: 'courseName' },
        { Header: 'Fees Amount', accessor: 'feesPay' },
        { Header: 'Amount Paid', accessor: 'amountPay' },
        { Header: 'Remaining Amount', accessor: 'remainingFees' },
        { Header: 'Date', accessor: 'date' },
        { Header: 'View Payment', accessor: 'viewPayment' },
        { Header: 'Pay Installments', accessor: 'payInstallment' },
        { Header: 'Edit', accessor: 'edit' },
        { Header: 'Delete', accessor: 'delete' }
    ], []);

    const employeeColumns = useMemo(() => [
        { Header: 'Employee ID', accessor: 'employeeID' },
        { Header: 'First Name', accessor: 'firstName' },
        { Header: 'Last Name', accessor: 'lastName' },
        { Header: 'Email', accessor: 'email' },
        // { Header: 'Country', accessor: 'country' },
        // { Header: 'State', accessor: 'state' },
        // { Header: 'City', accessor: 'city' },
        // { Header: 'Pincode', accessor: 'pincode' },
        { Header: 'Address', accessor: 'address' },
        { Header: 'Gender', accessor: 'gender' },
        { Header: 'Date of Birth', accessor: 'dob' },
        { Header: 'Contact Number', accessor: 'contactNo' },
        { Header: 'Date of Joining', accessor: 'dateOfJoining' },
        { Header: 'Profile Image', accessor: 'profileImage' },
        // { Header: 'User Type', accessor: 'userType' },
        { Header: 'Edit', accessor: 'edit' },
        { Header: 'Delete', accessor: 'delete' }
    ], []);

    const toggleTab = tab => {
        if (activeTab !== tab) {
            setactiveTab(tab);

            if (tab === '1') {
                console.log("active 111111111111111111111111111111111")
                fetchStudentData(searchWord, customPageSizeValue, pageValue);
                // fetchTaskDataByUser(projectId, user, searchWord, customPageSizeValue, pageValue);
            }
            else if (tab === "2") {
                console.log("active 22222222222222222222222222222222222")
                fetchEmployeeData(searchWord, customPageSizeValue, pageValue);
                // fetchTaskData(projectId, searchWord, customPageSizeValue, pageValue);
            }
        }
        else {
            if (tab === '1') {
                console.log("active 111111111111111111111111111111111")
                fetchStudentData(searchWord, customPageSizeValue, pageValue);
                // fetchTaskDataByUser(projectId, user, searchWord, customPageSizeValue, pageValue);
            }
            else if (tab === "2") {
                console.log("active 22222222222222222222222222222222222")
                fetchEmployeeData(searchWord, customPageSizeValue, pageValue);
                // fetchTaskData(projectId, searchWord, customPageSizeValue, pageValue);
            }
        }
    };

    const toggleForm = (tab) => {
        setactiveForm(tab);
    };

    const [installmentData, setInstallmentData] = useState({
        studentName: '',
        studentNumber: '',
        feesPay: 0,
        amountPay: 0,
        amountPaid: 0,
        remainingFees: 0,
        modeOfPayment: 'None'
    });

    const [refundData, setRefundData] = useState({
        refundAmount: 0,
        modeOfPayment: 'bank'
    });

    const [formData, setFormData] = useState({
        studentName: '',
        studentNumber: '',
        fatherName: '',
        motherName: '',
        parentNumber: '',
        college: '',
        qualification: '',
        aadharCard: '',
        feesPay: 0,
        amountPay: 0,
        remainingFees: 0,
        modeOfPayment: 'None',
        address: '',
        courseName: '0',
        branch: '0',
    });

    const employeeValidationSchema = Yup.object().shape({
        // employeeID: Yup.number().required('Employee ID is required'),
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().required('Password is required'),
        // country: Yup.string().required('Country is required'),
        // state: Yup.string().required('State is required'),
        // city: Yup.string().required('City is required'),
        // pincode: Yup.number().required('Pincode is required'),
        address: Yup.string().required('Address is required'),
        gender: Yup.string().oneOf(['Male', 'Female'], 'Gender must be either Male or Female').required('Gender is required'),
        dob: Yup.date().required('Date of birth is required'),
        contactNo: Yup.number().required('Contact number is required'),
        // profileImage: Yup.string().required('Profile image is required'),
        dateOfJoining: Yup.date().default(() => new Date()).required('Joining Date is required')
    });

    const [employeeFormData, setEmployeeFormData] = useState({
        employeeID: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        country: '',
        state: '',
        city: '',
        pincode: '',
        address: '',
        gender: '',
        dob: '',
        contactNo: '',
        profileImage: '',
        dateOfJoining: '',
    });

    const validationSchema = Yup.object().shape({
        studentName: Yup.string().required("Student's Name is required"),
        studentNumber: Yup.string()
            .required("Student's Number is required")
            .matches(/^\d{10}$/, 'Student Number must be exactly 10 digits'),
        fatherName: Yup.string().required("Father's Name is required"),
        motherName: Yup.string().required("Mother's Name is required"),
        parentNumber: Yup.string()
            .required("Parent's Number is required")
            .matches(/^\d{10}$/, 'Parent Number must be exactly 10 digits'),
        college: Yup.string().required('College is required'),
        qualification: Yup.string().required('Qualification is required'),
        aadharCard: Yup.string()
            .required('Aadhar Card is required')
            .matches(/^\d{12}$/, 'Aadhar Card must be exactly 12 digits'),
        feesPay: Yup.number()
            .required('Fees Pay is required')
            .min(0, 'Fees Pay must be a positive number')
            .positive('Fees Pay must be a positive number'),
        amountPay: Yup.number()
            .required('Amount to Pay is required')
            .min(0, 'Amount pay must be a positive number'),
        remainingFees: Yup.number()
            .required('Remaining Fees is required')
            .min(0, 'Remaining Fees must be a positive number'),
        modeOfPayment: Yup.string()
            .when('amountPay', {
                is: amount => amount === 0,
                then: Yup.string().oneOf(['None'], 'Invalid mode of payment'),
                otherwise: Yup.string().oneOf(['cash', 'bank'], 'Invalid mode of payment'),
            }),
        address: Yup.string().required('Address is required'),
        courseName: Yup.string().oneOf(coursesNames, 'Invalid course'),
        branch: Yup.string().oneOf(branchNames, 'Invalid branch'),
    });

    const installmentSchema = Yup.object().shape({
        feesPay: Yup.number()
            .min(0, 'Fees pay must be a positive number')
            .required('Fees pay is required'),
        amountPay: Yup.number()
            .min(1, 'Amount pay must be a positive number')
            .required('Amount pay is required'),
        amountPaid: Yup.number()
            .min(0, 'Amount paid must be a positive number')
            .required('Amount paid is required'),
        remainingFees: Yup.number()
            .min(0, 'Remaining fees must be a positive number')
            .required('Remaining fees is required'),
        modeOfPayment: Yup.string().oneOf(['cash', 'bank'], 'Invalid mode of payment'),
    });

    const refundSchema = Yup.object().shape({
        refundAmount: Yup.number()
            .min(1, 'Refund Amount must be a positive number')
            .required('Refund Amount is required'),
    });

    const handleInputChangeInstallment = (e) => {
        const { name, value } = e.target;
        setInstallmentData({
            ...installmentData,
            [name]: value
        });
    };

    const handleInputChange = async (e, limit) => {
        const { name, value } = e.target;
        const errorsCopy = { ...errors };

        try {
            await validationSchema.validateAt(name, { [name]: value });
            errorsCopy[name] = '';
        } catch (error) {
            errorsCopy[name] = error.message;
        }

        setErrors(errorsCopy);

        if (name === 'courseName' && !value) {
            errorsCopy.courseName = 'Select one option';
        } else {
            errorsCopy.courseName = '';
        }
        if (name === 'branchName' && !value) {
            errorsCopy.branch = 'Select one option';
        } else {
            errorsCopy.branch = '';
        }
        if (name === 'modeOfPaymentSelect' && !value) {
            errorsCopy.modeOfPayment = 'Select one option';
        } else {
            errorsCopy.modeOfPayment = '';
        }
        if (name === 'studentNumber' && value.length !== 10) {
            errorsCopy.studentNumber = 'Contact number must be 10 digits long.';
        } else {
            errorsCopy.studentNumber = '';
        }
        if (name === 'parentNumber' && value.length !== 10) {
            errorsCopy.parentNumber = 'Contact number must be 10 digits long.';
        } else {
            errorsCopy.parentNumber = '';
        }
        if (name === 'aadharCard' && value.length !== 12) {
            errorsCopy.aadharCard = 'Aadhar card must be 12 digits long.';
        } else {
            errorsCopy.aadharCard = '';
        }

        setErrors(errorsCopy);

        if (limit) {
            setFormData({
                ...formData,
                [name]: value.slice(0, limit)
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleOpenInstallmentModal = (index) => {
        const student = students[index];
        setInstallmentData({
            studentName: student.studentName,
            studentNumber: student.studentNumber,
            feesPay: student.feesPay,
            amountPay: 0,
            amountPaid: 0,
            remainingFees: student.remainingFees,
            modeOfPayment: student.modeOfPayment
        });
        setInstallmentModal(true);
        setEditIndex(index);
    };

    const handleCancelInstallment = () => {
        setInstallmentModal(false);
        setInstallmentData({
            studentName: '',
            studentNumber: '',
            feesPay: 0,
            amountPay: 0,
            amountPaid: 0,
            remainingFees: 0,
            modeOfPayment: 'None'
        });
        setEditIndex(null);
        setErrors({});

    };

    const handleSaveInstallment = async (index) => {
        setLoading(true);

        try {

            const newStudentData = {
                ...installmentData,
                modeOfPayment: document.getElementById("modeOfPaymentSelect").value,
            };
            newStudentData.remainingFees = newStudentData.remainingFees - newStudentData.amountPay;
            newStudentData.amountPaid = newStudentData.feesPay - newStudentData.remainingFees;

            installmentSchema.validate(newStudentData, { abortEarly: false })
                .then(response => {

                    // postApi(apiRoutes.addFees, newStudentData).then(() => {
                    //     console.log("Added Successfully")
                    //     setInstallmentModal(false);
                    //     setInstallmentData({
                    //         studentName: '',
                    //         studentNumber: '',
                    //         feesPay: 0,
                    //         amountPay: 0,
                    //         amountPaid: 0,
                    //         remainingFees: 0,
                    //         modeOfPayment: 'None'
                    //     });


                    //     postApi(apiRoutes.addIncome, {
                    //         title: `Fees Payment by ${newStudentData.studentName}`,
                    //         description: `Fees Payment by ${newStudentData.studentName}`,
                    //         amount: newStudentData.amountPay,
                    //         user: user,
                    //         branchId: 1,
                    //         lastEdit: user,
                    //         modeOfPayment: newStudentData.modeOfPayment,
                    //     }).then((response) => {
                    //         console.log("Added Successfully")



                    //     })
                    //         .catch(error => console.log('error', error));

                    //     const updatedStudent = {
                    //         ...students[index],
                    //         amountPay: newStudentData.feesPay - newStudentData.remainingFees,
                    //         remainingFees: newStudentData.remainingFees,
                    //     };

                    //     putApi(`${apiRoutes.updateStudent}/${students[editIndex]._id}`, updatedStudent).then(() => {
                    //     }).then((response) => {
                    //         console.log("Update Successfully");
                    //         fetchStudentData(searchWord, customPageSizeValue, pageValue);

                    //     })
                    //         .catch(error => console.log('error', error));


                    // })
                    //     .catch(error => console.log('error', error));

                    // setErrors({});

                    postApi(apiRoutes.addIncome, {
                        title: `Fees Payment by ${newStudentData.studentName}`,
                        description: `Fees Payment by ${newStudentData.studentName}`,
                        amount: newStudentData.amountPay,
                        user: user,
                        branchId: 1,
                        lastEdit: user,
                        modeOfPayment: newStudentData.modeOfPayment,
                    }).then((response) => {
                        console.log("Added Successfully")
                        newStudentData.installIncomeId = response._id;

                        postApi(apiRoutes.addFees, newStudentData).then(() => {
                            console.log("Added Successfully")
                            setInstallmentModal(false);
                            setInstallmentData({
                                studentName: '',
                                studentNumber: '',
                                feesPay: 0,
                                amountPay: 0,
                                amountPaid: 0,
                                remainingFees: 0,
                                modeOfPayment: 'None'
                            });
                        })
                            .catch(error => console.log('error', error));

                        const updatedStudent = {
                            ...students[index],
                            amountPay: newStudentData.feesPay - newStudentData.remainingFees,
                            remainingFees: newStudentData.remainingFees,
                        };

                        putApi(`${apiRoutes.updateStudent}/${students[editIndex]._id}`, updatedStudent).then(() => {
                        }).then((response) => {
                            console.log("Update Successfully");
                            fetchStudentData(searchWord, customPageSizeValue, pageValue);

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


                })
                .catch(error => {
                    // Validation failed, handle errors here
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

    const formattedData = students.map((student, index) => {
        const date = student.date?.split("T")[0];
        return {
            studentName: student.studentName,
            studentNumber: student.studentNumber,
            fatherName: student.fatherName,
            motherName: student.motherName,
            parentNumber: student.parentNumber,
            college: student.college,
            qualification: student.qualification,
            aadharCard: student.aadharCard,
            courseName: student.courseName,
            feesPay: student.feesPay,
            amountPay: student.amountPay,
            remainingFees: student.remainingFees,
            date: dateFormat(date, "dd/MM/yyyy"),
            viewPayment: <> <Link to={`/installments/${student.studentNumber}`}>
                <Button color="warning" size="sm"><strong>View&nbsp;Payment</strong></Button>
            </Link></>,
            payInstallment: <> <Button color="warning" size="sm" onClick={() => handleOpenInstallmentModal(index)} disabled={isDisabled}><strong>Pay&nbsp;Installments</strong></Button></>,
            edit: <> <Button color="warning" size="sm" onClick={() => { setStudentModal(true); handleUpdateStudent(index); }} disabled={isDisabled}><strong>Edit</strong></Button></>,
            delete: <> <Button color="danger" size="sm" onClick={() => handleRefund(index)} disabled={isDisabled}><strong>Delete</strong></Button></>
        };
    });

    const formattedEmployeeData = employees.map((employee, index) => {
        const dob = employee.dob?.split("T")[0];
        const dateOfJoining = employee.dateOfJoining?.split("T")[0];
        return {
            employeeID: employee.employeeID,
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            country: employee.country,
            state: employee.state,
            city: employee.city,
            pincode: employee.pincode,
            address: employee.address,
            gender: employee.gender,
            dob: dateFormat(dob, "dd/MM/yyyy"),
            contactNo: employee.contactNo,
            dateOfJoining: dateFormat(dateOfJoining, "dd/MM/yyyy"),
            profileImage: <img src={employee.profileImage} alt="Profile" style={{ width: '50px', height: '50px' }} />,
            userType: employee.userType,
            edit: (
                <Button
                    color="warning"
                    size="sm"
                    // onClick={() => { setEmployeeModal(true); handleUpdateEmployee(index); }}
                    disabled={false} // Replace with your condition
                >
                    <strong>Edit</strong>
                </Button>
            ),
            delete: (
                <Button
                    color="danger"
                    size="sm"
                    // onClick={() => handleDeleteEmployee(index)}
                    disabled={false} // Replace with your condition
                >
                    <strong>Delete</strong>
                </Button>
            )
        };
    });

    const columns = activeTab === '1' ? studentColumns : employeeColumns;
    const data = activeTab === '1' ? formattedData : formattedEmployeeData;


    const filterData = (value, pageSize, page) => {
        fetchStudentData(value, pageSize, page)
    }

    const fetchCourse = () => {
        try {
            let url = `${apiRoutes.getCourses}`
            getApi(url).then((response) => {

                setcourses(response);
                console.log(response, "i m calling incomes data after api repsonse");

            })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.error('Error fetching student data:', error);
        }

    }

    const fetchBranches = () => {
        try {
            let url = `${apiRoutes.getBranch}`

            getApi(url).then(response =>
                setBranches(response)
            )
                .catch(error => console.log('error', error));
        } catch (error) {
            console.error('Error fetching income data:', error);
        }
    }

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('authUser'));
        setUser(storedUser.username);
        fetchStudentData(searchWord, customPageSizeValue, pageValue);
        fetchCourse();
        fetchBranches();
    }, []);

    const fetchEmployeeData = async (searchPara, pageSize, page) => {
        try {

            let url = `${apiRoutes.getEmployee}`
            if (searchPara != undefined) {
                url = `${apiRoutes.getEmployee}?page=${page}&limit=${pageSize}&search=${searchPara}`
            }
            else {
                url = `${apiRoutes.getEmployee}?page=${page}&limit=${pageSize}`
            }

            await getApi(url).then((response) => {

                setEmployees(response.docs);
                console.log(response, "i m calling incomes data in the fetch employee data function")
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
            console.error('Error fetching student data:', error);
        }
    };

    const fetchStudentData = async (searchPara, pageSize, page) => {
        try {

            let url = `${apiRoutes.getStudent}`
            if (searchPara != undefined) {
                url = `${apiRoutes.getStudent}?page=${page}&limit=${pageSize}&search=${searchPara}`
            }
            else {
                url = `${apiRoutes.getStudent}?page=${page}&limit=${pageSize}`
            }

            await getApi(url).then((response) => {

                setStudents(response.docs);
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
            console.error('Error fetching student data:', error);
        }
    };

    const handleUpdateStudent = (index) => {
        setFormData(students[index]);
        setEditIndex(index);
    };

    const handleEditStudent = async (e) => {
        setLoading(true);

        e.preventDefault();

        try {

            const newStudentData = {
                ...formData,
                modeOfPayment: document.getElementById("modeOfPaymentSelect").value,
                courseName: document.getElementById("courseName").value,
                branch: document.getElementById("branchName").value
            };
            newStudentData.remainingFees = newStudentData.feesPay - newStudentData.amountPay;


            validationSchema.validate(newStudentData, { abortEarly: false })
                .then(response => {
                    putApi(`${apiRoutes.updateStudent}/${students[editIndex]._id}`, newStudentData).then(() => {
                    }).then((response) => {
                        console.log("Update Successfully");
                        fetchStudentData(searchWord, customPageSizeValue, pageValue);
                        setEditIndex(null)
                        setStudentModal(false);
                        setFormData({
                            studentName: '',
                            studentNumber: '',
                            fatherName: '',
                            motherName: '',
                            parentNumber: '',
                            college: '',
                            qualification: '',
                            aadharCard: '',
                            feesPay: 0,
                            amountPay: 0,
                            remainingFees: 0,
                            modeOfPayment: 'None',
                            address: '',
                            courseName: '0',
                            branch: '0'
                        });
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
                    // Validation failed, handle errors here
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

    const handleAddStudent = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {

            const newStudentData = {
                ...formData,
                modeOfPayment: document.getElementById("modeOfPaymentSelect").value,
                courseName: document.getElementById("courseName").value,
                branch: document.getElementById("branchName").value
            };
            newStudentData.remainingFees = newStudentData.feesPay - newStudentData.amountPay;

            validationSchema.validate(newStudentData, { abortEarly: false })
                .then(response => {
                    postApi(apiRoutes.addStudent, newStudentData).then(() => {
                        console.log("Added Successfully")
                        setStudentModal(false);
                        setFormData({
                            studentName: '',
                            studentNumber: '',
                            fatherName: '',
                            motherName: '',
                            parentNumber: '',
                            college: '',
                            qualification: '',
                            aadharCard: '',
                            feesPay: 0,
                            amountPay: 0,
                            remainingFees: 0,
                            modeOfPayment: 'None',
                            address: '',
                            courseName: '0',
                            branch: '0'
                        });
                        fetchStudentData(searchWord, customPageSizeValue, pageValue);
                        setEditIndex(null);
                        const foundBranch = branches.find(branch => branch.name === newStudentData.branch);

                        if (newStudentData.amountPay != 0) {
                            postApi(apiRoutes.addIncome, {
                                title: `${newStudentData.studentName}(Fees Payment)`,
                                description: `Fees Payment by ${newStudentData.studentName}`,
                                amount: newStudentData.amountPay,
                                user: user,
                                branchId: foundBranch.branchId,
                                lastEdit: user,
                                modeOfPayment: newStudentData.modeOfPayment,
                            }).then(() => {
                                console.log("Added Successfully")

                            })
                                .catch(error => console.log('error', error));
                        }

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
                    // Validation failed, handle errors here
                    const validationErrors = {};
                    error.inner.forEach((e) => {
                        validationErrors[e.path] = e.message;
                    });
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

    const formatDateForInput = (dateString) => {
        if (!dateString) return dateString.substr(0, 10);
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Get Current Date
    function getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();

        // Add leading zero if month or day is less than 10
        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }

        return `${year}-${month}-${day}`;
    }


    const handleEmployeeInputChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            setEmployeeFormData({
                ...employeeFormData,
                [name]: files[0]
            });
        } else {
            setEmployeeFormData({
                ...employeeFormData,
                [name]: value
            });
        }

        // Optionally, you can also handle validation here
        validateField(name, value);
    };

    const validateField = (name, value) => {
        let error = '';
        // Add your validation logic here
        // Example:
        switch (name) {
            case 'email':
                if (!/\S+@\S+\.\S+/.test(value)) {
                    error = 'Email address is invalid';
                }
                break;
            case 'password':
                if (value.length < 6) {
                    error = 'Password must be at least 6 characters';
                }
                break;
            // Add more cases as needed
            default:
                break;
        }

        setEmployeeErrors({
            ...employeeErrors,
            [name]: error
        });
    };

    const handleAddEmployee = async (e) => {
        setLoading(true)
        try {

            const newEmployeeData = {
                ...employeeFormData,
            };
            console.log(newEmployeeData, " i am new employee data")

            employeeValidationSchema.validate(newEmployeeData, { abortEarly: false })
                .then(response => {
                    postApi(apiRoutes.addEmployee, {
                        ...newEmployeeData
                    }).then(() => {
                        console.log("Added Successfully")
                        setEmployeeModal(false);

                        // fetchProjectData(searchWord, customPageSizeValue, pageValue);
                        setEmployeeFormData({
                            employeeID: '',
                            firstName: '',
                            lastName: '',
                            email: '',
                            password: '',
                            country: '',
                            state: '',
                            city: '',
                            pincode: '',
                            address: '',
                            gender: '',
                            dob: '',
                            contactNo: '',
                            profileImage: '',
                            dateOfJoining: '',
                        });
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: "Your work has been saved",
                            showConfirmButton: false,
                            timer: 1500
                        });

                    })
                        .catch(error => console.log('error', error));

                    setEmployeeErrors({});

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

    const handleCancel = () => {
        setStudentModal(false);
        setFormData({
            studentName: '',
            studentNumber: '',
            fatherName: '',
            motherName: '',
            parentNumber: '',
            college: '',
            qualification: '',
            aadharCard: '',
            feesPay: 0,
            amountPay: 0,
            remainingFees: 0,
            modeOfPayment: 'None',
            address: '',
            courseName: '0'
        });
        setEditIndex(null);
        setErrors({});
    };

    const handleRefund = (index) => {
        setRefundDecision('yes')
        setrefundModal(true);
        setstudentIndex(index);
    };

    const handleRefundCancelled = () => {
        setrefundModal(false);
        setstudentIndex(null);
        setRefundDecision('yes');

    };

    const handleRefundDecisionChange = (event) => {
        const decision = event.target.value;
        setRefundDecision(decision);

        if (decision === 'Yes') {
            setRefundAmountDisabled(false);
        } else {
            setRefundAmountDisabled(true);
        }
    };

    const handleRefundDataChange = (e) => {
        const { name, value } = e.target;
        setRefundData({
            ...refundData,
            [name]: value
        });
    }

    const handleDeleteFunction = () => {
        try {


            deleteApi(`${apiRoutes.deleteStudent}/${students[studentIndex]._id}`)
                .then(() => {
                    console.log("Delete successfully");
                    fetchStudentData(searchWord, customPageSizeValue, pageValue);

                })
                .catch(error => console.log('error', error));

        } catch (error) {
            console.error('Error deleting student:', error);
        }
        setstudentIndex(null);
        setrefundModal(false);
        setRefundDecision('yes')
    }

    const handleRefundDeleteFunction = () => {
        const foundBranch = branches.find(branch => branch.name === students[studentIndex].branch);
        const date = new Date();
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

        refundSchema.validate(refundData, { abortEarly: false })
            .then(response => {
                postApi(apiRoutes.addExpense, {
                    title: `Refund to ${students[studentIndex].studentName} ${formattedDate}`,
                    description: `Refund to ${students[studentIndex].studentName}`,
                    amount: refundData.refundAmount,
                    user: user,
                    branchId: foundBranch.branchId,
                    lastEdit: user,
                    modeOfPayment: refundData.modeOfPayment,
                }).then(() => {
                    console.log("Added Successfully");
                    setStudentModal(false);
                    fetchExpenseData(branchId, searchWord, customPageSizeValue, pageValue);
                    fetchTotalExpense(branchId);
                    fetchTotalIncome(branchId);
                    setNewExpense({ title: '', description: '', amount: 0, modeOfPayment: 'None' });
                    setrefundModal(false);
                    setstudentIndex(null)

                })
                    .catch(error => console.log('error', error));

                handleDeleteFunction();

            })
            .catch(error => {
                // Validation failed, handle errors here
                const validationErrors = {};
                error.inner.forEach((e) => {
                    validationErrors[e.path] = e.message;
                });
                setErrors(validationErrors);
                console.error('Validation Error:', errors);
            });
    }

    return (<>
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="EMS" breadcrumbItem="User's Detail" />

                    <div className='d-flex justify-content-end align-items-center'>
                        <h5 className='m-2'><strong>Create</strong></h5>
                        <div>
                            <Nav pills style={{ display: 'flex', justifyContent: 'space-between', borderRadius: '10px', backgroundColor: '#f0f0f0', padding: '5px 10px' }}>
                                <NavItem>
                                    <NavLink
                                        className={classNames({
                                            active: activeForm === "1",
                                        })}
                                        onClick={() => {
                                            toggleForm("1");
                                            setStudentModal(true);
                                            setEmployeeModal(false);
                                        }}
                                        style={{ color: activeForm === "1" ? '#fff' : '#000', textDecoration: 'none', padding: '10px 15px', borderRadius: '5px', transition: 'all 0.2s ease-in-out' }} >
                                        <i className="bx bx-chat font-size-20 d-sm-none" />
                                        <span className="d-none d-sm-block">Student</span>
                                    </NavLink>
                                </NavItem>
                                {activeForm === "" && (
                                    <div className='d-flex align-items-center'>
                                        <span>&#124;</span>
                                    </div>
                                )}
                                <NavItem>
                                    <NavLink
                                        className={classNames({
                                            active: activeForm === "2",
                                        })}
                                        onClick={() => {
                                            toggleForm("2");
                                            setEmployeeModal(true);
                                            setStudentModal(false);
                                        }}
                                        style={{ color: activeForm === "2" ? '#fff' : '#000', textDecoration: 'none', padding: '10px 15px', borderRadius: '5px', transition: 'all 0.2s ease-in-out' }} >
                                        <i className="bx bx-group font-size-20 d-sm-none" />
                                        <span className="d-none d-sm-block">Employee</span>
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </div>
                    </div>

                    <CardBody className="pt-0">
                        <Card className='mt-3'>
                            <CardBody>
                                {/* <CardTitle className="mb-4">Student Report</CardTitle> */}
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                                    <CardTitle className="mb-4">User Report</CardTitle>
                                    <div>
                                        <Nav pills>
                                            <NavItem>
                                                <NavLink
                                                    className={classNames({
                                                        active: activeTab === "1",
                                                    })}

                                                    onClick={
                                                        () => {
                                                            toggleTab("1");
                                                        }
                                                    }
                                                >
                                                    <i className="bx bx-chat font-size-20 d-sm-none" />
                                                    <span className="d-none d-sm-block">Student</span>
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    className={classNames({
                                                        active: activeTab === "2",
                                                    })}
                                                    onClick={
                                                        () => {
                                                            toggleTab("2");
                                                        }
                                                    }
                                                >
                                                    <i className="bx bx-group font-size-20 d-sm-none" />
                                                    <span className="d-none d-sm-block">Employee</span>
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                    </div>
                                </div>

                                {/* <TableContainer
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
                                /> */}

                                <TableContainer
                                    columns={columns}
                                    data={data}
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
                        isOpen={studentmodal}
                        toggle={() => {
                            setStudentModal();
                            setErrors({});
                        }}
                        id="studentModal"
                        onClosed={() => {
                            handleCancel();
                        }}
                    >
                        <div className="modal-content">
                            <ModalHeader toggle={() => { setStudentModal(); setErrors({}); setEditIndex(null) }} id="applyJobsLabel" className="modal-header">
                                {editIndex != null ? "Edit Student" : "Add Student"}
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
                                                value={formData.studentName}
                                                onChange={(e) => handleInputChange(e)}
                                                required
                                                readOnly={editIndex != null ? true : false}
                                                disabled={editIndex !== null}
                                            />
                                            {errors.studentName && <div className="text-danger">{errors.studentName}</div>}

                                        </div>
                                    </Col>

                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Label htmlFor="studentNumberInput" className="form-label">Contact Number</Label>
                                            <Input
                                                type="number"
                                                name="studentNumber"
                                                id="studentNumberInput"
                                                className="form-control"
                                                placeholder="Enter Contact Number"
                                                value={formData.studentNumber}
                                                onChange={(e) => handleInputChange(e, 10)}
                                                required
                                                readOnly={editIndex != null ? true : false}
                                                disabled={editIndex !== null}
                                            />
                                            {errors.studentNumber && <div className="text-danger">{errors.studentNumber}</div>}
                                        </div>
                                    </Col>

                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Label htmlFor="fatherNameInput" className="form-label">Father's Name</Label>
                                            <Input
                                                type="text"
                                                name="fatherName"
                                                id="fatherNameInput"
                                                className="form-control"
                                                placeholder="Enter Father's Name"
                                                value={formData.fatherName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            {errors.fatherName && <div className="text-danger">{errors.fatherName}</div>}
                                        </div>
                                    </Col>

                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Label htmlFor="motherNameInput" className="form-label">Mother's Name</Label>
                                            <Input
                                                type="text"
                                                name="motherName"
                                                id="motherNameInput"
                                                className="form-control"
                                                placeholder="Enter Mother's Name"
                                                value={formData.motherName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            {errors.motherName && <div className="text-danger">{errors.motherName}</div>}
                                        </div>
                                    </Col>

                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Label htmlFor="parentNumberInput" className="form-label">Parent's Contact Number</Label>
                                            <Input
                                                type="number"
                                                name="parentNumber"
                                                id="parentNumberInput"
                                                className="form-control"
                                                placeholder="Enter Parent's Number"
                                                value={formData.parentNumber}
                                                onChange={(e) => handleInputChange(e, 10)}
                                                required
                                            />
                                            {errors.parentNumber && <div className="text-danger">{errors.parentNumber}</div>}
                                        </div>
                                    </Col>

                                    <Col lg={12}>
                                        <div className="mb-3">
                                            <Label htmlFor="collegeInput" className="form-label">College Name</Label>
                                            <Input
                                                type="text"
                                                name="college"
                                                id="collegeInput"
                                                className="form-control"
                                                placeholder="Enter College Name"
                                                value={formData.college}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            {errors.college && <div className="text-danger">{errors.college}</div>}
                                        </div>
                                    </Col>

                                    <Col lg={12}>
                                        <div className="mb-3">
                                            <Label htmlFor="qualificationInput" className="form-label">Qualification</Label>
                                            <Input
                                                type="text"
                                                name="qualification"
                                                id="qualificationInput"
                                                className="form-control"
                                                placeholder="Enter Qualification"
                                                value={formData.qualification}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            {errors.qualification && <div className="text-danger">{errors.qualification}</div>}
                                        </div>
                                    </Col>

                                    <Col lg={12}>
                                        <div className="mb-3">
                                            <Label htmlFor="addressInput" className="form-label">Address</Label>
                                            <Input
                                                type="text"
                                                name="address"
                                                id="addressInput"
                                                className="form-control"
                                                placeholder="Enter Address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            {errors.address && <div className="text-danger">{errors.address}</div>}

                                        </div>
                                    </Col>

                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Label htmlFor="aadharCardInput" className="form-label">Aadhar Card</Label>
                                            <Input
                                                type="number"
                                                name="aadharCard"
                                                id="aadharCardInput"
                                                className="form-control"
                                                placeholder="Enter Aadhar Card"
                                                value={formData.aadharCard}
                                                onChange={(e) => handleInputChange(e, 12)}
                                                required
                                            />
                                            {errors.aadharCard && <div className="text-danger">{errors.aadharCard}</div>}
                                        </div>
                                    </Col>

                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Label htmlFor="courseInput" className="form-label">Course</Label>

                                            <select id="courseName" className="form-select" defaultValue={editIndex !== null ? formData.courseName : "0"}  // Set the value attribute to bind the selected value
                                                onChange={handleInputChange}>
                                                <option value="0">Choose...</option>
                                                {courses.map(course => (
                                                    <option key={course.id} value={course.name}>{course.name}</option>
                                                ))}
                                            </select>
                                            {errors.courseName && <div className="text-danger">{errors.courseName}</div>}
                                        </div>
                                    </Col>

                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Label htmlFor="feesPayInput" className="form-label">Total Fees Amount</Label>
                                            <Input
                                                type="number"
                                                name="feesPay"
                                                id="feesPayInput"
                                                className="form-control"
                                                placeholder="Enter Fees Pay"
                                                value={formData.feesPay}
                                                onChange={handleInputChange}
                                                required
                                                readOnly={editIndex != null ? true : false}
                                                disabled={editIndex !== null}
                                            />
                                            {errors.feesPay && <div className="text-danger">{errors.feesPay}</div>}
                                        </div>
                                    </Col>

                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Label htmlFor="amountPayInput" className="form-label">Current Payable Amount</Label>
                                            <Input
                                                type="number"
                                                name="amountPay"
                                                id="amountPayInput"
                                                className="form-control"
                                                placeholder="Enter Amount to Pay"
                                                value={formData.amountPay}
                                                onChange={handleInputChange}
                                                required
                                                readOnly={editIndex != null ? true : false}
                                                disabled={editIndex !== null}
                                            />
                                            {errors.amountPay && <div className="text-danger">{errors.amountPay}</div>}
                                        </div>
                                    </Col>

                                    <Col lg={6}>
                                        <div className="col-sm-auto">
                                            <Label htmlFor="feesPayInput" className="form-label">Mode of Payment</Label>
                                            <select id="modeOfPaymentSelect" className="form-select" defaultValue={editIndex !== null ? formData.modeOfPayment : "None"}
                                                onChange={handleInputChange} >
                                                <option value="None">Choose...</option>
                                                <option value="bank">Bank</option>
                                                <option value="cash">Cash</option>
                                            </select>
                                            {errors.modeOfPayment && <div className="text-danger">{errors.modeOfPayment}</div>}
                                        </div>
                                    </Col>

                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Label htmlFor="branchInput" className="form-label">Branch</Label>

                                            <select id="branchName" className="form-select" defaultValue={editIndex !== null ? formData.branch : "0"}  // Set the value attribute to bind the selected value
                                                onChange={handleInputChange} disabled={editIndex !== null}>
                                                <option value="0">Choose...</option>
                                                {branches.map(branch => (
                                                    <option key={branch.branchId} value={branch.name}>{branch.name}</option>
                                                ))}
                                            </select>
                                            {errors.branch && <div className="text-danger">{errors.branch}</div>}
                                        </div>
                                    </Col>

                                </Row>
                            </ModalBody>
                            <ModalFooter>
                                <Col lg={12}>
                                    <div className="text-end">
                                        {
                                            editIndex !== null ? <><button className="btn btn-success me-1" onClick={handleEditStudent} disabled={loading}>{loading ? <Spinner size="sm" color="light" /> : 'Edit Student'} <i className="bx bx-send align-middle"></i></button></> : <><button className="btn btn-success me-1" onClick={handleAddStudent} disabled={loading}>{loading ? <Spinner size="sm" color="light" /> : 'Add Student'} <i className="bx bx-send align-middle"></i></button></>
                                        }

                                        <button className="btn btn-outline-secondary" onClick={handleCancel}>Cancel</button>
                                    </div>
                                </Col>

                            </ModalFooter>
                        </div>
                    </Modal>

                    <Modal
                        isOpen={employeemodal}
                        toggle={() => {
                            setEmployeeModal();
                            setEmployeeErrors({});
                        }}
                        id="employeeModal"
                        onClosed={() => {
                            handleCancel();
                        }}
                    >
                        <div className="modal-content">
                            <ModalHeader toggle={() => { setEmployeeModal(); setEmployeeErrors({}); setEditIndex(null) }} id="applyJobsLabel" className="modal-header">
                                {editIndex != null ? "Edit Employee" : "Add Employee"}
                            </ModalHeader>
                            <ModalBody>
                                <Row>
                                    {/* First name */}
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Label htmlFor="firstNameInput" className="form-label">First Name</Label>
                                            <Input
                                                type="text"
                                                name="firstName"
                                                id="firstNameInput"
                                                className="form-control"
                                                placeholder="Enter First Name"
                                                value={employeeFormData.firstName}
                                                onChange={(e) => handleEmployeeInputChange(e)}
                                                required
                                            />
                                            {employeeErrors.firstName && <div className="text-danger">{employeeErrors.firstName}</div>}
                                        </div>
                                    </Col>
                                    {/* last name */}
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Label htmlFor="lastNameInput" className="form-label">Last Name</Label>
                                            <Input
                                                type="text"
                                                name="lastName"
                                                id="lastNameInput"
                                                className="form-control"
                                                placeholder="Enter Last Name"
                                                value={employeeFormData.lastName}
                                                onChange={(e) => handleEmployeeInputChange(e)}
                                                required
                                            />
                                            {employeeErrors.lastName && <div className="text-danger">{employeeErrors.lastName}</div>}
                                        </div>
                                    </Col>
                                    {/* email */}
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Label htmlFor="emailInput" className="form-label">Email</Label>
                                            <Input
                                                type="email"
                                                name="email"
                                                id="emailInput"
                                                className="form-control"
                                                placeholder="Enter Email"
                                                value={employeeFormData.email}
                                                onChange={(e) => handleEmployeeInputChange(e)}
                                                required
                                            />
                                            {employeeErrors.email && <div className="text-danger">{employeeErrors.email}</div>}
                                        </div>
                                    </Col>
                                    {/* password */}
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Label htmlFor="passwordInput" className="form-label">Password</Label>
                                            <Input
                                                type="password"
                                                name="password"
                                                id="passwordInput"
                                                className="form-control"
                                                placeholder="Enter Password"
                                                value={employeeFormData.password}
                                                onChange={(e) => handleEmployeeInputChange(e)}
                                                required
                                            />
                                            {employeeErrors.password && <div className="text-danger">{employeeErrors.password}</div>}
                                        </div>
                                    </Col>
                                    {/* address */}
                                    <Col lg={12}>
                                        <div className="mb-3">
                                            <Label htmlFor="addressInput" className="form-label">Address</Label>
                                            <Input
                                                type="text"
                                                name="address"
                                                id="addressInput"
                                                className="form-control"
                                                placeholder="Enter Address"
                                                value={employeeFormData.address}
                                                onChange={(e) => handleEmployeeInputChange(e)}
                                                required
                                            />
                                            {employeeErrors.address && <div className="text-danger">{employeeErrors.address}</div>}
                                        </div>
                                    </Col>
                                    {/* gender */}
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Label className="form-label">Gender</Label>
                                            <div>
                                                <Label className="me-2">
                                                    <Input
                                                        type="radio"
                                                        name="gender"
                                                        value="Male"
                                                        checked={employeeFormData.gender === 'Male'}
                                                        onChange={(e) => handleEmployeeInputChange(e)}
                                                        required
                                                    />
                                                    Male
                                                </Label>
                                                <Label className="me-2">
                                                    <Input
                                                        type="radio"
                                                        name="gender"
                                                        value="Female"
                                                        checked={employeeFormData.gender === 'Female'}
                                                        onChange={(e) => handleEmployeeInputChange(e)}
                                                        required
                                                    />
                                                    Female
                                                </Label>
                                            </div>
                                            {employeeErrors.gender && <div className="text-danger">{employeeErrors.gender}</div>}
                                        </div>
                                    </Col>
                                    {/* date of birth */}
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Label htmlFor="dobInput" className="form-label">Date of Birth</Label>
                                            <Input
                                                type="date"
                                                name="dob"
                                                id="dobInput"
                                                className="form-control"
                                                placeholder="Enter Date of Birth"
                                                value={employeeFormData.dob}
                                                onChange={(e) => handleEmployeeInputChange(e)}
                                                required
                                            />
                                            {employeeErrors.dob && <div className="text-danger">{employeeErrors.dob}</div>}
                                        </div>
                                    </Col>
                                    {/* contact number */}
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Label htmlFor="contactNoInput" className="form-label">Contact Number</Label>
                                            <Input
                                                type="number"
                                                name="contactNo"
                                                id="contactNoInput"
                                                className="form-control"
                                                placeholder="Enter Contact Number"
                                                value={employeeFormData.contactNo}
                                                onChange={(e) => handleEmployeeInputChange(e)}
                                                required
                                            />
                                            {employeeErrors.contactNo && <div className="text-danger">{employeeErrors.contactNo}</div>}
                                        </div>
                                    </Col>
                                    {/* profile image */}
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Label htmlFor="profileImageInput" className="form-label">Profile Image</Label>
                                            <Input
                                                type="file"
                                                name="profileImage"
                                                id="profileImageInput"
                                                className="form-control"
                                                onChange={(e) => handleEmployeeInputChange(e)}
                                                required
                                            />
                                            {employeeErrors.profileImage && <div className="text-danger">{employeeErrors.profileImage}</div>}
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Label htmlFor="dateOfJoiningInput" className="form-label">Joining Date</Label>
                                            <Input
                                                type="date"
                                                name="dateOfJoining"
                                                id="dateOfJoiningInput"
                                                className="form-control"
                                                value={formatDateForInput(employeeFormData.dateOfJoining)}
                                                onChange={(e) => handleEmployeeInputChange(e)}
                                                required
                                            />
                                            {employeeErrors.dateOfJoining && <div className="text-danger">{employeeErrors.dateOfJoining}</div>}
                                        </div>
                                    </Col>
                                </Row>
                            </ModalBody>
                            <ModalFooter>
                                <div className="text-end">
                                    {
                                        // editIndex !== null ?
                                        //     <>
                                        //         <button className="btn btn-success me-1" onClick={handleEditStudent} disabled={loading}>
                                        //             {loading ?
                                        //                 <Spinner size="sm" color="light" />
                                        //                 : 'Edit Employee'}
                                        //             <i className="bx bx-send align-middle"></i>
                                        //         </button>
                                        //     </> :
                                        <>
                                            <button className="btn btn-success me-1" onClick={handleAddEmployee} disabled={loading}>
                                                {loading ?
                                                    <Spinner size="sm" color="light" />
                                                    : 'Add Employee'}
                                                <i className="bx bx-send align-middle"></i>
                                            </button>
                                        </>
                                    }

                                    <button className="btn btn-outline-secondary" onClick={handleCancel}>Cancel</button>
                                </div>
                            </ModalFooter>
                        </div>
                    </Modal>

                    <Modal
                        isOpen={installmentModal}
                        toggle={() => {
                            setInstallmentModal();
                            setErrors({});
                        }}
                        id="applyJobs"
                        onClosed={() => {
                            handleCancelInstallment();
                        }}
                    >
                        <div className="modal-content">
                            <ModalHeader toggle={() => {
                                setInstallmentModal(); setErrors({});
                            }} id="applyJobsLabel" className="modal-header">
                                Add Fee Payment
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
                                                value={installmentData.studentName}
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
                                                value={installmentData.studentNumber}
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
                                                value={installmentData.feesPay}
                                                onChange={handleInputChangeInstallment}
                                                required
                                            />
                                            {errors.feesPay && <div className="text-danger">{errors.feesPay}</div>}
                                        </div>
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
                                                value={installmentData.amountPay}
                                                onChange={handleInputChangeInstallment}
                                                required
                                            />
                                            {errors.amountPay && <div className="text-danger">{errors.amountPay}</div>}
                                        </div>
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
                                                value={installmentData.remainingFees}
                                                onChange={handleInputChangeInstallment}
                                                required
                                            />
                                            {errors.remainingFees && <div className="text-danger">{errors.remainingFees}</div>}
                                        </div>
                                    </Col>

                                    <Col lg={6}>
                                        <div className="col-sm-auto">
                                            <Label htmlFor="feesPayInput" className="form-label">Mode of Payment</Label>
                                            <select id="modeOfPaymentSelect" className="form-select" defaultValue={editIndex !== null ? installmentData.modeOfPayment : "None"}  // Set the value attribute to bind the selected value
                                                onChange={handleInputChange}>
                                                <option value="None">Choose...</option>
                                                <option value="bank">Bank</option>
                                                <option value="cash">Cash</option>
                                            </select>
                                        </div>
                                        {errors.modeOfPayment && <div className="text-danger">{errors.modeOfPayment}</div>}
                                    </Col>

                                    <Col lg={12}>
                                        <div className="text-end">
                                            <button className="btn btn-success me-1" onClick={() => handleSaveInstallment(editIndex)} disabled={loading}>{loading ? <Spinner size="sm" color="light" /> : 'Add Fees'}<i className="bx bx-send align-middle"></i></button>

                                            <button className="btn btn-outline-secondary" onClick={handleCancelInstallment}>Cancel</button>
                                        </div>
                                    </Col>

                                </Row>
                            </ModalBody>
                        </div>
                    </Modal>


                    {refundModal && (
                        <Modal isOpen={true} toggle={handleRefundCancelled}>
                            <ModalHeader toggle={handleRefundCancelled}>Confirm Refund</ModalHeader>
                            <ModalBody>
                                <Label for="refundDecision">Refund Decision</Label>
                                <Input type="select" name="refundDecision" id="refundDecision" onChange={handleRefundDecisionChange}>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </Input>

                                {refundDecision === "yes" && (
                                    <>
                                        <Label for="refundAmount">Refund Amount</Label>
                                        <Input
                                            type="number"
                                            name="refundAmount"
                                            id="refundAmount"
                                            placeholder="Enter refund amount"
                                            disabled={!refundAmountDisabled}
                                            onChange={handleRefundDataChange}
                                        />
                                        {errors.refundAmount && <div className="text-danger">{errors.refundAmount}</div>}
                                        <Label for="modeOfPayment">Mode of Payment</Label>
                                        <Input type="select" name="modeOfPayment" id="modeOfPayment" onChange={handleRefundDataChange}>
                                            <option value="bank">Bank</option>
                                            <option value="cash">Cash</option>
                                        </Input>
                                    </>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                {refundDecision === "yes" ? (
                                    <Button color="primary" onClick={handleRefundDeleteFunction} >Refund & Delete</Button>
                                ) : (
                                    <Button color="danger" onClick={handleDeleteFunction} >Delete</Button>
                                )}
                                <Button color="secondary" onClick={handleRefundCancelled}>Cancel</Button>
                            </ModalFooter>
                        </Modal>
                    )}

                </Container>
            </div>
        </React.Fragment>
    </>)
};

export default Student;
