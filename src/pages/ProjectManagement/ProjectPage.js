import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, CardBody, CardSubtitle, CardTitle, Col, Container, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner, Table, DatePic } from 'reactstrap';
import Breadcrumbs from "components/Common/Breadcrumb";
import { apiRoutes } from 'helpers/api_routes';
import { deleteApi, getApi, patchApi, postApi, putApi } from "helpers/ApiMiddleware";
import TableContainer from 'components/Common/TableContainer';
import { Filter } from 'components/Common/filters';
import * as Yup from "yup";
import { dateFormat } from 'common/dataFormat';
import useUserRole from 'helpers/userRoleHook';
import Multiselect from 'multiselect-react-dropdown';
import Swal from 'sweetalert2'




const Project = () => {
    const userRole = useUserRole();
    const isDisabled = userRole === 'user';

    const [modal, setModal] = useState(false);
    const [taskModal, setTaskModal] = useState(false);
    const [projects, setProjects] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [pageOption, setPageOption] = useState({})
    const [pageValue, setpageValue] = useState(1)
    const [searchWord, setsearchWord] = useState("")
    const [customPageSizeValue, setcustomPageSizeValue] = useState(5)
    const [user, setUser] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [userRoleUsers, setuserRoleUsers] = useState([]);


    const columns = useMemo(
        () => [

            {
                Header: 'Project\'s Name',
                accessor: 'projectName',
            },
            {
                Header: 'Project\'s Description',
                accessor: 'projectDescription'
            },
            {
                Header: 'Project Reference',
                accessor: 'projectReference',
            },
            {
                Header: 'Project Amount',
                accessor: 'projectAmount'
            },
            {
                Header: 'Project Assignee',
                accessor: 'projectAssignee',
            },
            {
                Header: 'Start Date',
                accessor: 'startDate'
            },
            {
                Header: 'End Date',
                accessor: 'endDate',
            },
            {
                Header: 'View Tasks',
                accessor: 'viewTask'
            },
            {
                Header: 'Add Task',
                accessor: 'addTask'
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

    const [formData, setFormData] = useState({
        projectName: '',
        projectDescription: '',
        projectReference: '',
        projectAmount: '',
        projectAssignee: '',
        startDate: '',
        endDate: '',
    });

    const [taskData, setTaskData] = useState({
        projectId: '',
        projectName: '',
        taskDescription: '',
        taskAssignees: '',
        dueDate: '',
        projectStartDate: '',
        projectDueDate: '',
        status: ''
    });

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const validationSchema = Yup.object().shape({
        projectName: Yup.string().required('Project Name is required'),
        projectDescription: Yup.string().required('Project Description is required'),
        projectReference: Yup.string().required('Project Reference is required'),
        projectAmount: Yup.number()
            .required('Project Amount is required')
            .min(0, 'Project Amount must be a positive number')
            .positive('Project Amount must be a positive number'),
        projectAssignee: Yup.string().required('Project Assignee is required'),
        startDate: Yup.date().required('Start Date is required'),
        endDate: Yup.date()
            .required('End Date is required')
            .min(Yup.ref('startDate'), 'End Date must be later than Start Date'),
    });

    const taskSchema = Yup.object().shape({
        projectName: Yup.string().required('Project Name is required'),
        taskDescription: Yup.string().required('Task Description is required'),
        taskAssignees: Yup.string().required('Task Assignees is required'),
        dueDate: Yup.date().required('Due Date is required')
    });

    const handleInputChangeTask = (e) => {
        const { name, value } = e.target;
        setTaskData({
            ...taskData,
            [name]: value
        });

        try {
            Yup.reach(taskSchema, name).validate(value);
            setErrors({
                ...errors,
                [name]: undefined
            });
        } catch (error) {
            setErrors({
                ...errors,
                [name]: error.message
            });
        }
    };

    const handleSelectChange = (selectedList) => {
        setTaskData({
            ...taskData,
            taskAssignees: selectedList.join(', ')
        });
    };

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        try {
            if (name === "endDate") {
                const startDate = formData.startDate;
                if (startDate && new Date(value) < new Date(startDate)) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        [name]: "Due date cannot be earlier than the start date."
                    }));
                } else {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        [name]: undefined
                    }));
                }
            } else {
                await Yup.reach(validationSchema, name).validate(value);
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [name]: undefined
                }));
            }
        } catch (error) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: error.message
            }));
        }
    };

    const handleOpenTaskModal = (index) => {
        const project = projects[index];
        setTaskData({
            projectId: project._id,
            projectName: project.projectName,
            taskDescription: '',
            taskAssignees: '',
            dueDate: '',
            projectStartDate: project.startDate,
            projectDueDate: project.endDate,
            status: ''
        });
        setTaskModal(true);
        setEditIndex(index);
    };

    const handleCancelTask = () => {
        setTaskModal(false);
        setTaskData({
            projectId: '',
            projectName: '',
            taskDescription: '',
            taskAssignees: '',
            dueDate: '',
            projectStartDate: '',
            projectDueDate: '',
            status: ''
        });
        setEditIndex(null);
        setErrors({});

    };

    const handleAddTask = () => {
        setLoading(true);

        try {

            const newTaskData = {
                ...taskData,
            };

            taskSchema.validate(newTaskData, { abortEarly: false })
                .then(response => {

                    postApi(apiRoutes.addTask, newTaskData).then((response) => {
                        console.log("Added Successfully")
                        setTaskData({
                            projectId: '',
                            projectName: '',
                            taskDescription: '',
                            taskAssignees: '',
                            dueDate: '',
                            projectStartDate: '',
                            projectDueDate: '',
                            status: ''
                        });
                        setTaskModal(false);
                        setEditIndex(null);
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
            console.error('Error adding task:', error);
        }
        finally {
            setLoading(false);
        }
    }

    const formattedData = projects.map((project, index) => {
        const startDate = project.startDate?.split("T")[0];
        const endDate = project.endDate?.split("T")[0];
        return {
            projectName: project.projectName,
            projectDescription: project.projectDescription,
            projectReference: project.projectReference,
            projectAmount: project.projectAmount,
            projectAssignee: project.projectAssignee,
            startDate: dateFormat(startDate, "dd/MM/yyyy"),
            endDate: dateFormat(endDate, "dd/MM/yyyy"),
            viewTask: <> <Link to={`/task/${project._id}`} >
                <Button color="warning" size="sm"><strong>View&nbsp;Tasks</strong></Button>
            </Link></>,
            addTask: <> <Button color="warning" size="sm" onClick={() => { handleOpenTaskModal(index); }}><strong>Add&nbsp;Task</strong></Button></>,
            edit: <> <Button color="warning" size="sm" onClick={() => { setModal(true); handleUpdateStudent(index); }} disabled={isDisabled}><strong>Edit</strong></Button></>,
            delete: <> <Button color="danger" size="sm" onClick={() => { handleDeleteFunction(index); }} disabled={isDisabled}><strong>Delete</strong></Button></>

        };
    });

    const filterData = (value, pageSize, page) => {
        fetchProjectData(value, pageSize, page)
    }

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('authUser'));
        setUser(storedUser.username);
        fetchProjectData(searchWord, customPageSizeValue, pageValue);
        fetchUserRole();
    }, []);

    const fetchProjectData = async (searchPara, pageSize, page) => {
        try {

            let url = `${apiRoutes.getAllProjects}`
            if (searchPara != undefined) {
                url = `${apiRoutes.getAllProjects}?page=${page}&limit=${pageSize}&search=${searchPara}`
            }
            else {
                url = `${apiRoutes.getAllProjects}?page=${page}&limit=${pageSize}`
            }
            await getApi(url).then((response) => {

                setProjects(response.docs);
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

            })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.error('Error fetching income data:', error);
        }
    };

    const fetchUserRole = () => {
        getApi(apiRoutes.userRoleUser).then((response) => {
            const usernames = response.map(user => user.username);
            setuserRoleUsers(usernames);
        })
            .catch(error => console.log('error', error));
    }

    const handleAddProject = async () => {
        setLoading(true)
        try {

            const newProjectData = {
                ...formData,
            };

            validationSchema.validate(newProjectData, { abortEarly: false })
                .then(response => {
                    postApi(apiRoutes.addProject, {
                        ...newProjectData
                    }).then(() => {
                        console.log("Added Successfully")
                        setModal(false);

                        fetchProjectData(searchWord, customPageSizeValue, pageValue);
                        setFormData({
                            projectName: '',
                            projectDescription: '',
                            projectReference: '',
                            projectAmount: '',
                            projectAssignee: '',
                            startDate: '',
                            endDate: '',
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

                    console.log(projects[editIndex], "sgdvcifshdcnjdsjbcxvjibxnjxcnv ")
                    deleteApi(`${apiRoutes.deleteProject}/${projects[index]._id}`)
                        .then(() => {
                            console.log("Delete successfully");
                            fetchProjectData(searchWord, customPageSizeValue, pageValue);

                        })
                        .catch(error => console.log('error', error));

                } catch (error) {
                    console.error('Error deleting project:', error);
                }
                setEditIndex(null);
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

    const handleUpdateStudent = (index) => {
        setFormData(projects[index]);
        setEditIndex(index);
    };

    const handleEditProject = (e) => {
        setLoading(true);

        e.preventDefault();

        try {

            const newProjectData = {
                ...formData,
            };

            validationSchema.validate(newProjectData, { abortEarly: false })
                .then(response => {
                    putApi(`${apiRoutes.updateProject}/${projects[editIndex]._id}`, newProjectData).then(() => {
                    }).then((response) => {
                        console.log("Update Successfully");
                        fetchProjectData(searchWord, customPageSizeValue, pageValue);
                        setEditIndex(null);
                        setModal(false);
                        setFormData({
                            projectName: '',
                            projectDescription: '',
                            projectReference: '',
                            projectAmount: '',
                            projectAssignee: '',
                            startDate: '',
                            endDate: '',
                        });
                        setErrors({});
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: "Your work has been saved",
                            showConfirmButton: false,
                            timer: 1500
                        });

                        const updatedDataTask = {
                            projectName: newProjectData.projectName,
                            projectStartDate: newProjectData.startDate,
                            projectDueDate: newProjectData.endDate
                        };

                        patchApi(`${apiRoutes.updateProjectDetailsInTasks}/${projects[editIndex]._id}`, updatedDataTask).then(() => {
                        }).then((response) => {
                            console.log("Update Successfully");

                        })
                            .catch(error => console.log('error', error));

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
            console.error('Error updating project:', error);
        }
        finally {
            setLoading(false);
        }
    }

    const handleCancel = () => {
        setModal(false);
        setFormData({
            projectName: '',
            projectDescription: '',
            projectReference: '',
            projectAmount: '',
            projectAssignee: '',
            startDate: '',
            endDate: '',
        });
        setEditIndex(null);
        setErrors({});
    };


    return (<>
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="EMS" breadcrumbItem="Project's Detail" />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                        <div>
                            <Link to='/task'>
                                <Button>View All Task</Button>
                            </Link>
                        </div>
                        <div className='d-flex justify-content-end align-items-center'>

                            <Button onClick={() => setModal(true)}>Add Project</Button>
                        </div>
                    </div>

                    <CardBody className="pt-0">
                        <Card className='mt-3'>
                            <CardBody>
                                <CardTitle className="mb-4">Project Report</CardTitle>
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
                            <ModalHeader toggle={() => { setModal(); setErrors({}); setEditIndex(null) }} id="applyJobsLabel" className="modal-header">
                                {editIndex != null ? "Edit Project" : "Add Project"}
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
                                                value={formData.projectName}
                                                onChange={(e) => handleInputChange(e)}
                                                required
                                            />
                                            {errors.projectName && <div className="text-danger">{errors.projectName}</div>}

                                        </div>
                                    </Col>
                                    <Col lg={12}>
                                        <div className="mb-3">
                                            <Label htmlFor="projectDescriptionInput" className="form-label">Project Description</Label>
                                            <Input
                                                type="text"
                                                name="projectDescription"
                                                id="projectDescriptionInput"
                                                className="form-control"
                                                placeholder="Enter Project Description"
                                                value={formData.projectDescription}
                                                onChange={(e) => handleInputChange(e)}
                                                required
                                            />
                                            {errors.projectDescription && <div className="text-danger">{errors.projectDescription}</div>}

                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Label htmlFor="projectReferenceInput" className="form-label">Project Reference Name</Label>
                                            <Input
                                                type="text"
                                                name="projectReference"
                                                id="projectReferenceInput"
                                                className="form-control"
                                                placeholder="Enter Project Reference Name"
                                                value={formData.projectReference}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            {errors.projectReference && <div className="text-danger">{errors.projectReference}</div>}
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Label htmlFor="projectAmountInput" className="form-label">Project Amount</Label>
                                            <Input
                                                type="number"
                                                name="projectAmount"
                                                id="projectAmountInput"
                                                className="form-control"
                                                placeholder="Enter Project Amount"
                                                value={formData.projectAmount}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            {errors.projectAmount && <div className="text-danger">{errors.projectAmount}</div>}
                                        </div>
                                    </Col>
                                    <Col lg={12}>
                                        <div className="mb-3">
                                            <Label htmlFor="projectLeaderInput" className="form-label">Project Leader</Label>
                                            <Input
                                                type="text"
                                                name="projectAssignee"
                                                id="projectAssignee"
                                                className="form-control"
                                                placeholder="Enter Project Reference Name"
                                                value={formData.projectAssignee}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            {/* Display error message if validation fails */}
                                            {errors.projectAssignee && <div className="text-danger">{errors.projectAssignee}</div>}
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Label htmlFor="startDateInput" className="form-label">Start Date</Label>
                                            <Input
                                                type="date"
                                                name="startDate"
                                                id="startDateInput"
                                                className="form-control"
                                                value={formatDateForInput(formData.startDate)}
                                                onChange={(e) => handleInputChange(e)}
                                                required
                                            />
                                            {errors.startDate && <div className="text-danger">{errors.startDate}</div>}
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Label htmlFor="endDateInput" className="form-label">End Date</Label>
                                            <Input
                                                type="date"
                                                name="endDate"
                                                id="endDateInput"
                                                className="form-control"
                                                value={formatDateForInput(formData.endDate)}
                                                onChange={(e) => handleInputChange(e)}
                                                required
                                            />
                                            {errors.endDate && <div className="text-danger">{errors.endDate}</div>}
                                        </div>
                                    </Col>
                                    <Col lg={12}>
                                        <div className="text-end">
                                            {
                                                editIndex !== null ? <><button className="btn btn-success me-1" onClick={handleEditProject} disabled={loading}>{loading ? <Spinner size="sm" color="light" /> : 'Edit Project'} <i className="bx bx-send align-middle"></i></button></> : <><button className="btn btn-success me-1" onClick={handleAddProject} disabled={loading}>{loading ? <Spinner size="sm" color="light" /> : 'Add Project'} <i className="bx bx-send align-middle"></i></button></>
                                            }

                                            <button className="btn btn-outline-secondary" onClick={handleCancel}>Cancel</button>
                                        </div>
                                    </Col>
                                </Row>
                            </ModalBody>
                        </div>
                    </Modal>

                    <Modal
                        isOpen={taskModal}
                        toggle={() => {
                            setTaskModal();
                            setErrors({});
                        }}
                        id="applyJobs"
                        onClosed={() => {
                            handleCancelTask();
                        }}
                    >
                        <div className="modal-content">
                            <ModalHeader toggle={() => {
                                setTaskModal(); setErrors({});
                            }} id="applyJobsLabel" className="modal-header">
                                Add Task
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
                                                value={taskData.projectName}
                                                readOnly
                                                required
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
                                                value={taskData.taskDescription}
                                                onChange={handleInputChangeTask}
                                                required
                                            />
                                            {errors.taskDescription && <div className="text-danger">{errors.taskDescription}</div>}
                                        </div>
                                    </Col>

                                    <Col lg={12}>
                                        <div className="mb-3">
                                            <Label htmlFor="optionsSelect" className="form-label">Task Assignees</Label>
                                            <Multiselect
                                                isObject={false}
                                                onKeyPressFn={function noRefCheck() { }}
                                                onRemove={function noRefCheck() { }}
                                                onSearch={function noRefCheck() { }}
                                                onSelect={(selectedItems) => { handleSelectChange(selectedItems); }}
                                                options={userRoleUsers}
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
                                                value={formData.dueDate}
                                                onChange={handleInputChangeTask}
                                                required
                                            />
                                            {errors.dueDate && <div className="text-danger">{errors.dueDate}</div>}
                                        </div>
                                    </Col>

                                    <Col lg={12}>
                                        <div className="text-end">
                                            <button className="btn btn-success me-1" onClick={() => handleAddTask(editIndex)} disabled={loading}>{loading ? <Spinner size="sm" color="light" /> : 'Add Task'}<i className="bx bx-send align-middle"></i></button>


                                            <button className="btn btn-outline-secondary" onClick={handleCancelTask}>Cancel</button>
                                        </div>
                                    </Col>
                                </Row>
                            </ModalBody>
                        </div>
                    </Modal>

                </Container >
            </div >
        </React.Fragment >
    </>)
};

export default Project;
