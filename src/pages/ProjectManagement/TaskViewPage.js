import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge, Button, ButtonDropdown, Card, CardBody, CardSubtitle, CardTitle, Col, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Modal, ModalBody, ModalHeader, Nav, NavItem, NavLink, Row, Spinner, Table } from 'reactstrap';
import Breadcrumbs from "components/Common/Breadcrumb";
import { apiRoutes } from 'helpers/api_routes';
import { deleteApi, getApi, patchApi, postApi, putApi } from "helpers/ApiMiddleware";
import TableContainer from 'components/Common/TableContainer';
import { Filter } from 'components/Common/filters';
import { dateFormat } from 'common/dataFormat';
import * as Yup from "yup";
import useUserRole from 'helpers/userRoleHook';
import { isDate } from 'lodash';
import Multiselect from 'multiselect-react-dropdown';
import classnames from "classnames";
import NotificationDropdown from 'components/CommonForBoth/TopbarDropdown/NotificationDropdown';
import classNames from 'classnames';
import Swal from 'sweetalert2'

const Task = () => {
    const userRole = useUserRole();
    const isDisabled = userRole === 'user';
    console.log(userRole, "i m caliing userrroleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
    console.log(isDisabled, "i m caliing disableeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
    const val = isDisabled ? "1" : "2";
    const [activeTab, setactiveTab] = useState(val);
    console.log(activeTab, " i m calling activetabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb")
    const [tasks, setTasks] = useState([]);
    const { projectId } = useParams();
    const [pageOption, setPageOption] = useState({})
    const [pageValue, setpageValue] = useState(1)
    const [searchWord, setsearchWord] = useState("")
    const [customPageSizeValue, setcustomPageSizeValue] = useState(5)
    const [currentIndex, setcurrentIndex] = useState(null)
    const [taskModal, setTaskModal] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [userRoleUsers, setuserRoleUsers] = useState([]);
    const [selectedOption, setSelectedOptions] = useState([]);
    const [user, setUser] = useState(null);
    const [checked, setchecked] = useState(false);


    const columns = useMemo(
        () => [
            {
                Header: 'Task Description',
                accessor: 'taskDescription',
            },
            {
                Header: 'Task Assignees',
                accessor: 'taskAssignees'
            },
            {
                Header: 'Due Date',
                accessor: 'dueDate',
            },
            {
                Header: 'Remaining Time',
                accessor: 'remainingTime',
            },
            {
                Header: 'Status',
                accessor: 'status',
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

    const taskSchema = Yup.object().shape({
        projectName: Yup.string().required('Project Name is required'),
        taskDescription: Yup.string().required('Task Description is required'),
        taskAssignees: Yup.string().required('Task Assignees is required'),
        dueDate: Yup.date().required('Due Date is required')
    });

    const toggleTab = tab => {
        if (activeTab !== tab) {
            setactiveTab(tab);

            if (tab === '1') {
                console.log("active 111111111111111111111111111111111")
                fetchTaskDataByUser(projectId, user, searchWord, customPageSizeValue, pageValue);
            }
            else if (tab === "2") {
                fetchTaskData(projectId, searchWord, customPageSizeValue, pageValue);
            }
        }
        else {
            if (tab === '1') {
                console.log("active 111111111111111111111111111111111")
                fetchTaskDataByUser(projectId, user, searchWord, customPageSizeValue, pageValue);
            }
            else if (tab === "2") {
                fetchTaskData(projectId, searchWord, customPageSizeValue, pageValue);
            }
        }
    };

    const handleOpenEditModal = (task, index) => {
        setEditData({
            ...task,
        });
        setTaskModal(true);
    };

    const handleCloseEditModal = () => {
        setTaskModal(false);
        setErrors({});
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    const handleUpdateTask = async (e) => {

        setLoading(true);
        e.preventDefault();
        try {

            const newTaskData = {
                ...editData,
            };

            taskSchema.validate(newTaskData, { abortEarly: false })
                .then(response => {

                    putApi(`${apiRoutes.updateTaskById}/${tasks[currentIndex]._id}`, newTaskData).then(() => {
                        console.log("Updates Successfully")
                        fetchTaskData(projectId, searchWord, customPageSizeValue, pageValue);
                        setTaskModal(false);
                        setEditData({
                            projectId: '',
                            projectName: '',
                            taskDescription: '',
                            taskAssignees: '',
                            dueDate: ''
                        });
                        handleCloseEditModal();
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
            console.error('Error adding task:', error);
        }
        finally {
            setLoading(false);
        }
    };

    const handleDeleteFunction = (index) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger me-3"
            },
            buttonsStyling: false
        });
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

                    deleteApi(`${apiRoutes.deleteTaskById}/${tasks[index]._id}`)
                        .then(() => {
                            console.log("Delete successfully");
                            fetchTaskData(projectId, searchWord, customPageSizeValue, pageValue);

                        })
                        .catch(error => console.log('error', error));

                } catch (error) {
                    console.error('Error deleting project:', error);
                }
                setcurrentIndex(null);
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
    }

    const [dropdownStates, setDropdownStates] = useState(Array(tasks.length).fill(false));
    const toggleDropdown = (index) => {
        const newDropdownStates = [...dropdownStates];
        newDropdownStates[index] = !newDropdownStates[index];
        setDropdownStates(newDropdownStates);
    };

    const handleDropdownSelect = async (index, selectedValue) => {
        const newTasks = [...tasks];
        newTasks[index].status = selectedValue;

        setTasks(newTasks);

        patchApi(`${apiRoutes.patchUpdateTaskById}/${newTasks[index]._id}`, tasks[index]).then(() => {
            console.log("Updates Successfully")
        })
            .catch(error => console.log('error', error));
    };




    const formattedData = tasks.map((task, index) => {
        const isAdmin = userRole === 'admin';

        const date = task.dueDate?.split("T")[0];
        const startdate = task.projectStartDate?.split("T")[0];
        const assigneesArray = task.taskAssignees.split(',').map(assignee => assignee.trim());
        const dueDate = new Date(date);
        const projectStartDate = new Date(startdate);
        const currentDate = new Date();
        const timeDifference = dueDate - currentDate;

        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

        const remainingTime = `${days} days ${hours} hrs ${minutes} mins`;

        let selectedStatusColor;
        switch (task.status) {
            case "Pending":
                selectedStatusColor = "danger";
                break;
            case "In Progress":
                selectedStatusColor = "warning";
                break;
            case "Completed":
                selectedStatusColor = "success";
                break;
            case "In Review":
                selectedStatusColor = "info";
                break;
            default:
                selectedStatusColor = "secondary";
        }

        const isCompleted = task.status === "Completed";


        return {
            // completed: <input type="checkbox" className="form-check-input" onChange={(event) => handleCheckboxChange(event, index)} disabled={isAdmin} />,
            taskDescription: task.taskDescription,
            taskAssignees: task.taskAssignees,
            dueDate: dateFormat(date, "dd/MM/yyyy"),
            remainingTime: remainingTime,
            status: (
                <>
                    <div className="btn-group mb-2">
                        <ButtonDropdown
                            isOpen={dropdownStates[index]}
                            toggle={() => toggleDropdown(index)}
                            color={selectedStatusColor}
                            disabled={isCompleted}
                        >
                            <Button className={`btn btn-${selectedStatusColor} btn-sm`}>
                                <span className='h6'>{task.status ? task.status : "Select Status"}</span>
                            </Button>

                            {!isCompleted && (<DropdownToggle caret color={selectedStatusColor} className={`btn btn-${selectedStatusColor} btn-sm`}>
                                <i className="mdi mdi-chevron-down" />
                            </DropdownToggle>)}

                            {days < 0 ? <DropdownMenu>
                                <DropdownItem onClick={() => handleDropdownSelect(index, "Completed")}>Completed</DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem onClick={() => handleDropdownSelect(index, "In Progress")}>In Progress</DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem onClick={() => handleDropdownSelect(index, "In Review")}>In Review</DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem onClick={() => handleDropdownSelect(index, "Pending")}>Pending</DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem onClick={() => handleDropdownSelect(index, "Failed")}>Failed</DropdownItem>
                            </DropdownMenu> : <DropdownMenu>
                                <DropdownItem onClick={() => handleDropdownSelect(index, "Completed")}>Completed</DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem onClick={() => handleDropdownSelect(index, "In Progress")}>In Progress</DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem onClick={() => handleDropdownSelect(index, "In Review")}>In Review</DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem onClick={() => handleDropdownSelect(index, "Pending")}>Pending</DropdownItem>
                            </DropdownMenu>}

                        </ButtonDropdown>
                    </div >
                </>
            ),
            edit: <> <Button color="warning" size="sm" onClick={() => { handleOpenEditModal(task, index); setcurrentIndex(index); setSelectedOptions(assigneesArray) }} disabled={isDisabled}>Edit</Button></>,
            delete: <> <Button color="danger" size="sm" onClick={() => { handleDeleteFunction(index); }} disabled={isDisabled}>Delete</Button></>


        };
    });

    const handleSelectChange = (selectedList) => {
        setEditData({
            ...editData,
            taskAssignees: selectedList.join(', ')
        });
    };

    const filterData = (value, pageSize, page) => {
        if (activeTab === "1") {
            fetchTaskDataByUser(projectId, user, value, pageSize, page)
        }
        else {
            fetchTaskData(projectId, value, pageSize, page)
        }
    }

    const [editData, setEditData] = useState({
        projectId: '',
        projectName: '',
        taskDescription: '',
        taskAssignees: '',
        dueDate: ''
    });

    const fetchUserRole = () => {
        getApi(apiRoutes.userRoleUser).then((response) => {
            const usernames = response.map(user => user.username);
            setuserRoleUsers(usernames);
        })
            .catch(error => console.log('error', error));
    }

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('authUser'));
        setUser(storedUser.username);
        fetchTaskDataByUser(projectId, storedUser.username, searchWord, customPageSizeValue, pageValue);
        setactiveTab(isDisabled ? "1" : "2")
        toggleTab(activeTab);
        fetchUserRole();
    }, []);



    const fetchTaskData = async (projectId, searchPara, pageSize, page) => {
        try {
            let url = `${apiRoutes.getTaskByProjectId}/${projectId}`

            if (searchPara != undefined) {
                url = `${apiRoutes.getTaskByProjectId}/${projectId}?page=${page}&limit=${pageSize}&search=${searchPara}`
            }
            else {
                url = `${apiRoutes.getTaskByProjectId}/${projectId}?page=${page}&limit=${pageSize}`
            }

            await getApi(url).then((response) => {

                setTasks(response.data.docs);
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
            })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.error('Error fetching student data:', error);
        }
    };

    const fetchTaskDataByUser = async (projectId, user, searchPara, pageSize, page) => {
        try {
            let url = `${apiRoutes.getTasksByUser}/${projectId}/${user}`

            if (searchPara != undefined) {
                url = `${apiRoutes.getTasksByUser}/${projectId}/${user}?page=${page}&limit=${pageSize}&search=${searchPara}`
            }
            else {
                url = `${apiRoutes.getTasksByUser}/${projectId}/${user}?page=${page}&limit=${pageSize}`
            }

            await getApi(url).then((response) => {

                setTasks(response.data.docs);
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
                    <Breadcrumbs title="EMS" breadcrumbItem="Task Detail" />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                        <div>
                            <Link to='/project'>
                                <Button>View Projects</Button>
                            </Link>
                        </div>
                    </div>

                    <CardBody className="pt-0">
                        <Card className='mt-3'>
                            <CardBody>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                                    <CardTitle className="mb-4">Assgined Task Report</CardTitle>
                                    <div>
                                        <Nav pills >
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
                                                    <span className="d-none d-sm-block" >My Tasks</span>
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
                                                    <span className="d-none d-sm-block" >All Task</span>
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                    </div>
                                </div>

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
                        isOpen={taskModal}
                        toggle={() => {
                            setTaskModal();
                            setErrors({});
                        }}
                        id="applyJobs"
                    >
                        <div className="modal-content">
                            <ModalHeader toggle={() => {
                                setTaskModal(); setErrors({});
                            }} id="applyJobsLabel" className="modal-header">
                                Edit Task
                            </ModalHeader>
                            <ModalBody>

                                <Row>
                                    <Col lg={12}>
                                        <div className="mb-3">
                                            <Label htmlFor="projectNameInput" className="form-label">Project Name</Label>
                                            <Input
                                                type="text"
                                                name="projectName"
                                                id="projectNameInput"
                                                className="form-control"
                                                placeholder="Enter Project Name"
                                                value={editData.projectName}
                                                readOnly
                                                required
                                                disabled={true}
                                            />
                                        </div>
                                    </Col>

                                    <Col lg={12}>
                                        <div className="mb-3">
                                            <Label htmlFor="taskDescriptionInput" className="form-label">Task Description </Label>
                                            <Input
                                                type="text"
                                                name="taskDescription"
                                                id="taskDescriptionInput"
                                                className="form-control"
                                                placeholder="Enter Task Description"
                                                value={editData.taskDescription}
                                                onChange={handleEditInputChange}
                                                required
                                            />
                                            {errors.taskDescription && <div className="text-danger">{errors.taskDescription}</div>}
                                        </div>
                                    </Col>

                                    <Col lg={12}>
                                        <div className="mb-3">
                                            <Label htmlFor="optionsSelect" className="form-label">Select Options</Label>
                                            <Multiselect
                                                isObject={false}
                                                onKeyPressFn={function noRefCheck() { }}
                                                onRemove={function noRefCheck() { }}
                                                onSearch={function noRefCheck() { }}
                                                onSelect={(selectedItems) => { handleSelectChange(selectedItems); }}
                                                options={userRoleUsers}
                                                selectedValues={selectedOption}
                                            />
                                            {errors.taskAssignees && <div className="text-danger">{errors.taskAssignees}</div>}
                                        </div>
                                    </Col>

                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Label htmlFor="dueDateInput" className="form-label">Due Date</Label>
                                            <Input
                                                type="date"
                                                name="dueDate"
                                                id="dueDateInput"
                                                className="form-control"
                                                value={formatDateForInput(editData.dueDate)}
                                                onChange={handleEditInputChange}
                                                required
                                            />
                                            {errors.dueDate && <div className="text-danger">{errors.dueDate}</div>}
                                        </div>
                                    </Col>

                                    <Col lg={12}>
                                        <div className="text-end">
                                            <button className="btn btn-success me-1" onClick={handleUpdateTask} disabled={loading}>{loading ? <Spinner size="sm" color="light" /> : 'Edit Task'}<i className="bx bx-send align-middle"></i></button>


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

export default Task;
