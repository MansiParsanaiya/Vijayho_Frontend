import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
import SimpleBar from "simplebar-react";

//Import images
import avatar3 from "../../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../../assets/images/users/avatar-4.jpg";

//i18n
import { withTranslation } from "react-i18next";
import { getApi } from "helpers/ApiMiddleware";
import { apiRoutes } from "helpers/api_routes";

const NotificationDropdown = props => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);
  const [notification, setNotification] = useState([]);
  const [showAllNotifications, setShowAllNotifications] = useState(false);



  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('authUser'));
    // console.log(storedUser.username,"i m calling from notiiiiiiiiiiiiiii")
    fetchTaskNotification(storedUser.username);
  }, []);

  const fetchTaskNotification = async (user) => {
    try {

      let url = `${apiRoutes.getTasksByUserAndTime}/${user}`;

      console.log(url, "i m calling from notiiiiiiiiiiiiiii")

      await getApi(url).then((response) => {
        setNotification(response.data);

      })
        .catch(error => console.log('error', error));
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  function calculateTimeDifference(dueDate) {
    const currentTime = new Date();
    const notificationTime = new Date(dueDate);
    const timeDifference = Math.abs(currentTime - notificationTime) / 1000;

    const hours = Math.floor(timeDifference / 3600);
    const minutes = Math.floor((timeDifference % 3600) / 60);
    const seconds = Math.floor(timeDifference % 60);

    return `${hours} ${hours === 1 ? 'hour' : 'hours'}, ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}, ${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
  }


  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="dropdown d-inline-block"
        tag="li"
      >
        <DropdownToggle
          className="btn header-item noti-icon position-relative"
          tag="button"
          id="page-header-notifications-dropdown"
        >
          
          {notification.length===0?<i className="bx bx-bell" />:<i className="bx bx-bell bx-tada" />}
          <span className="badge bg-danger rounded-pill">{notification.length}</span>
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
          <div className="p-3">
            <Row className="align-items-center">
              <Col>
                <h6 className="m-0"> {props.t("Notifications")} </h6>
              </Col>
              <div className="col-auto">
                <a href="#" className="small" onClick={() => setShowAllNotifications(!showAllNotifications)}>
                  {showAllNotifications ? props.t("View Less") : props.t("View All")}
                </a>

              </div>
            </Row>
          </div>
          <SimpleBar style={{ height: showAllNotifications ? "400px" : (notification.length === 0 ? "60px" : "200px") }}>
            {notification.length === 0 ? (
              <div className="text-center p-3">
                <p className="m-0">{props.t("No notifications")}</p>
              </div>
            ) : (
              notification.map((noti, index) => (
                <Link className="text-reset notification-item" key={index}>
                  <div className="d-flex">
                    <img
                      src={avatar4}
                      className="me-3 rounded-circle avatar-xs"
                      alt="user-pic"
                    />
                    <div className="flex-grow-1">
                      <h6 className="mt-0 mb-1">{noti.projectName}</h6>
                      <div className="font-size-12 text-muted">
                        <p className="mb-1">
                          {props.t(noti.taskDescription) + "."}
                        </p>
                        <p className="mb-0">
                          <i className="mdi mdi-clock-outline" />
                          {props.t(calculateTimeDifference(noti.dueDate) + " remaining")}{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </SimpleBar>


          <div className="p-2 border-top d-grid">
            <Link className="btn btn-sm btn-link font-size-14 text-center" to="#" onClick={() => setShowAllNotifications(!showAllNotifications)}>
              <i className="mdi mdi-arrow-right-circle me-1"></i> <span key="t-view-more">{showAllNotifications ? props.t("View Less") : props.t("View More..")}</span>
            </Link>
          </div>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default withTranslation()(NotificationDropdown);

NotificationDropdown.propTypes = {
  t: PropTypes.any
};