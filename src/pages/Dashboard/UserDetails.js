import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import withRouter from "components/Common/withRouter";
import { isEmpty } from "lodash";

import {
  Badge,
  Button,
  Card,
  CardBody,
} from "reactstrap";
// import { Badge } from 'reactstrap';
// import { BootstrapSwitchButton } from 'react-bootstrap-switch-button';
// import 'react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.min.css';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import { getOrders as onGetOrders } from "store/actions";

import { latestTransaction } from "../../common/data/dashboard";

import {
  OrderId,
  BillingName,
  Date,
  Total,
  PaymentStatus,
  PaymentMethod,
} from "./LatestTranactionCol";

import TableContainer from "../../components/Common/TableContainer";
import { getApi, postApi } from "helpers/ApiMiddleware";
import { apiRoutes } from "helpers/api_routes";
import useUserRole from "helpers/userRoleHook";

const LatestTranaction = props => {
  const userRole = useUserRole();
  const isDisabled = userRole === 'user';


  const [modal1, setModal1] = useState(false);

  const toggleViewModal = () => setModal1(!modal1);
  const [users, setUsers] = useState([]);
  const [pageOption, setPageOption] = useState({})
  const [pageValue, setPageValue] = useState(1)
  const [customPageSizeValue, setcustomPageSizeValue] = useState(5)
  const [searchWord, setsearchWord] = useState("")


  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "",
      },
      {
        Header: "UserName",
        accessor: "username",

      },
      {
        Header: "Email",
        accessor: "email",

      },
      {
        Header: "Role",
        accessor: "role",

      },
      {
        Header: "Profile Active",
        accessor: "active",

      },
    ],
    []
  );

  const fetchUserData = async (searchPara, pageSize, page) => {
    try {
      let url = `${apiRoutes.getUsers}`
      if (searchPara != undefined) {
        url = `${apiRoutes.getUsers}?page=${page}&limit=${pageSize}&search=${searchPara}`
      }
      else {
        url = `${apiRoutes.getUsers}?page=${page}&limit=${pageSize}`
      }
      await getApi(url).then((response) => {
        setUsers(response.docs);

        console.log(response, " i m calling reposne doc from lastest")
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
        console.log(users, " i m calling users")

      })
        .catch(error => console.log('error', error));
    } catch (error) {
      console.error('Error fetching users data:', error);
    }
  }

  const formattedData = users.map((user, index) => {
    let roleColorClass = '';
    if (user.role === 'admin') {
      roleColorClass = 'text-success';
    } else if (user.role === 'user') {
      roleColorClass = 'text-primary';
    }
    const isAdmin = user.role === 'admin';

    const getSwitchButtonProps = (status) => {
      switch (status) {
        case 'approved':
          return {
            checked: true,
            onlabel: 'Approved',
            offlabel: 'Pending'
          };
        case 'pending':
          return {
            checked: false,
            onlabel: 'Approved',
            offlabel: 'Pending'
          };
        default:
          return {
            checked: false,
            onlabel: 'Unknown',
            offlabel: 'Unknown'
          };
      }
    };

    const { checked, onlabel, offlabel } = getSwitchButtonProps(user.isActive);

    return {
      username: user.username,
      email: user.email,
      role: <span className={roleColorClass}>{user.role}</span>,
      active: (
        <>
          {!isAdmin && (
            <div>
              <BootstrapSwitchButton
                checked={checked}
                onstyle="success"
                offstyle="danger"
                onlabel={onlabel}
                offlabel={offlabel}
                style={`w-50 mx-3 ${isDisabled ? `opacity-50 pe-none` : ''}`}
                disabled={isDisabled}
                onChange={(checked) => {
                  handleStatusChange(user.email, checked);
                }}
              />
            </div>
          )}
        </>
      ),
    };
  });

  const handleStatusChange = async (email, newState) => {
    const newStatus = newState ? 'approved' : 'pending';
    try {
      const url = newState ? `${apiRoutes.userApprove}` : `${apiRoutes.userReject}`;
      await postApi(url, { email })
        .then((response) => {
          fetchUserData(searchWord, customPageSizeValue, pageValue);
          console.log(`${newStatus} status updated`);
        })
        .catch((error) => console.log('error', error));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  useEffect(() => {
    fetchUserData(searchWord, customPageSizeValue, pageValue);
  }, [])

  const filterData = (value, pageSize, page) => {
    fetchUserData(value, pageSize, page)
  }

  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <div className="mb-4 h4 card-title">User's Detail</div>
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
    </React.Fragment>
  );
};

LatestTranaction.propTypes = {
  orders: PropTypes.array,
  onGetOrders: PropTypes.func,
};

export default withRouter(LatestTranaction);
