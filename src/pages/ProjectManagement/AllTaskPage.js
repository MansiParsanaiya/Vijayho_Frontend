import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge, Button, Card, CardBody, CardSubtitle, CardTitle, Col, Container, Input, Label, Modal, ModalBody, ModalHeader, Nav, NavItem, NavLink, Row, Spinner, Table } from 'reactstrap';
import Breadcrumbs from "components/Common/Breadcrumb";
import { apiRoutes } from 'helpers/api_routes';
import { deleteApi, getApi, postApi, putApi } from "helpers/ApiMiddleware";
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
import TableContainerAll from 'components/Common/TableContainerAll';



const AllTask = () => {
    const userRole = useUserRole();
    const isDisabled = userRole === 'user';
    const [tasks, setTasks] = useState([]);
    const [pageOption, setPageOption] = useState({})
    const [pageValue, setpageValue] = useState(1)
    const [searchWord, setsearchWord] = useState("")
    const [customPageSizeValue, setcustomPageSizeValue] = useState(5)
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [checked, setchecked] = useState(false);
    const [projectNameList, setprojectNameList] = useState([]);
    const [defaultProject, setdefaultProject] = useState("Select Project");
    const [defaultStatus, setdefaultStatus] = useState("Select Status");

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
                Header: 'Project Name',
                accessor: 'projectName'
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
            }
        ],
        []
    );

    const filterData = (value, pageSize, page, projectOption, statusOption) => {

        fecthAllTask(value, pageSize, page, projectOption, statusOption)

    }

    const formattedData = tasks.map((task, index) => {
        const isAdmin = userRole === 'admin';

        const date = task.dueDate?.split("T")[0];
        const dueDate = new Date(date);
        const currentDate = new Date();
        const timeDifference = dueDate - currentDate;

        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

        const remainingTime = `${days} days ${hours} hrs ${minutes} mins`;

        return {
            taskDescription: task.taskDescription,
            taskAssignees: task.taskAssignees,
            projectName: task.projectName,
            dueDate: dateFormat(date, "dd/MM/yyyy"),
            remainingTime: remainingTime,
            status: <Badge className={"font-size-11 badge-soft-" +
                (task.status === "Completed" ? "success" : task.status === "In Progress" ? "warning" : "danger")}
            >
                {task.status}
            </Badge>
        };
    });


    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('authUser'));
        setUser(storedUser.username);
        fecthAllTask(searchWord, customPageSizeValue, pageValue, defaultProject, defaultStatus);
        fetchProjectNameList();
    }, []);

    const fetchProjectNameList = async () => {
        try {

            let url = `${apiRoutes.getAllProjectName}`

            await getApi(url).then((response) => {
                response.unshift("Select Project")
                setprojectNameList(response);
                console.log(projectNameList, " JENIIIIIIIIIIIIIIIIIIIIII")
            })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.error('Error fetching project name data:', error);
        }
    }

    const fecthAllTask = async (searchPara, pageSize, page, projectOption, statusOption) => {
        try {
            let url = `${apiRoutes.getAllTask}`

            if (searchPara != undefined ) {
                url = `${apiRoutes.getAllTask}?page=${page}&limit=${pageSize}&search=${searchPara}`
                if (statusOption != "Select Status" && projectOption=="Select Project") {
                    url = `${apiRoutes.getAllTask}?page=${page}&limit=${pageSize}&status=${statusOption}&search=${searchPara}`
                }
                else if (statusOption == "Select Status" && projectOption!="Select Project") {
                    url = `${apiRoutes.getAllTask}?page=${page}&limit=${pageSize}&projectName=${projectOption}&search=${searchPara}`
                }
                else if(statusOption != "Select Status" && projectOption!="Select Project"){
                    url = `${apiRoutes.getAllTask}?page=${page}&limit=${pageSize}&status=${statusOption}&projectName=${projectOption}&search=${searchPara}`
                }
            
            }
            else {
                url = `${apiRoutes.getAllTask}?page=${page}&limit=${pageSize}`
                if (statusOption != "Select Status" && projectOption=="Select Project") {
                    url = `${apiRoutes.getAllTask}?page=${page}&limit=${pageSize}&status=${statusOption}`
                }
                else if (statusOption == "Select Status" && projectOption!="Select Project") {
                    url = `${apiRoutes.getAllTask}?page=${page}&limit=${pageSize}&projectName=${projectOption}`
                }
                else if(statusOption != "Select Status" && projectOption!="Select Project"){
                    url = `${apiRoutes.getAllTask}?page=${page}&limit=${pageSize}&status=${statusOption}&projectName=${projectOption}`
                }
            
            }

            await getApi(url).then((response) => {

                const allTasks = [...response.data.pending, ...response.data.inProgress,...response.data.inreview, ...response.data.completed,  ...response.data.failed];

                setTasks(allTasks);
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
                                    {/* Heading */}
                                    <CardTitle className="mb-4">Assgined Task Report</CardTitle>

                                </div>

                                <TableContainerAll
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
                                    isProjectFilter={true}
                                    defaultProject={defaultProject}
                                    setdefaultProject={setdefaultProject}
                                    projectNameList={projectNameList}
                                    isStatusFilter={true}
                                    defaultStatus={defaultStatus}
                                    setdefaultStatus={setdefaultStatus}
                                />
                            </CardBody>
                        </Card>
                    </CardBody>
                </Container>
            </div>
        </React.Fragment>
    </>)
};



export default AllTask;
