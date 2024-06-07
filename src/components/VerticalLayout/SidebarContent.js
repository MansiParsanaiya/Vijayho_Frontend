import React, { useEffect, useRef, useCallback, useState, useContext } from "react";
import { useLocation, useParams } from "react-router-dom";
import PropTypes from "prop-types";


// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import withRouter from "components/Common/withRouter";
import { Link } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";
import { postApi, getApi } from "helpers/ApiMiddleware";
import { apiRoutes } from "helpers/api_routes";
import BranchContext from "pages/Branches/BranchContext";

// get role
import useUserRole from 'helpers/userRoleHook';

const SidebarContent = props => {
  const { pathname } = useLocation();



  const { studentNumber } = useParams();
  const installmentUrl = `/installments/${studentNumber}`
  const ref = useRef();
  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];

    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active"); // li
            parent3.childNodes[0].classList.remove("mm-active");

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove("mm-show"); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); // li
                parent5.childNodes[0].classList.remove("mm-active"); // a tag
              }
            }
          }
        }
      }
    }
  };

  const path = useLocation();
  const activeMenu = useCallback(() => {
    let pathName = path.pathname;
    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    if (pathName.includes("branch")) {
      pathName = "/branch"
    }
    if (pathName.includes("student")) {
      pathName = "/student"
    }
    if (pathName.includes("income")) {
      const branchIdMatch = pathName.match(/\/income\/(\d+)/);
      if (branchIdMatch) {
        const branchId = branchIdMatch[1];
        console.log("Branch ID:", branchId);
        pathName = `/income/${branchId}`;
        console.log(pathName, " i m calling pathname")
      }
    }

    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        console.log(items[i], " i m calling items")
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [path.pathname, activateParentDropdown]);

  useEffect(() => {
    ref.current.recalculate();
  }, []);

  useEffect(() => {
    new MetisMenu("#side-menu");
    activeMenu();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    activeMenu();
  }, [activeMenu]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  const [branches, setBranches] = useState([]);
  // const [user, setUser] = useState('');
  useEffect(() => {
    // const storedUser = JSON.parse(localStorage.getItem('authUser'));
    // setUser(storedUser.username);

    // console.log(user, " i am user from th local storage ")
    try {
      let url = `${apiRoutes.getBranch}`
      getApi(url).then(response => {
        setBranches(response);
      })
        .catch(error => console.log('error', error));
    } catch (error) {
      console.error('Error fetching income data:', error);
    }
  }, []);

  const userRole = useUserRole();
  const isUser = userRole === 'user';
  const isAdmin = userRole === 'admin';


  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{props.t("Menu")} </li>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-home-circle"></i>
                <span>{props.t("Dashboards")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/dashboard">{props.t("Default")}</Link>
                </li>

              </ul>
            </li>

            {/* {isUser ? */}
            {/* <> */}
            {/* User Management */}
            {/* <li className="menu-title">User Management</li>
            <li>
              <Link to="/#" className="has-arrow ">
                <i className="bx bx-home"></i>
                <span>{props.t("Users")}</span>
              </Link>
              <ul className="sub-menu">

                <li>
                  <Link to={studentNumber === undefined ? "/student" : installmentUrl} >
                    <i className="bx bx-home"></i>
                    <span>{props.t("Create Users")}</span>
                  </Link>
                </li>

              </ul>
            </li> */}

            {/* </> */}
            {/* : */}
            {/* <></> */}
            {/* } */}

            {/* { */}
            {/* isAdmin ? */}
            {/* <> */}
            {/* Branches */}
            <li className="menu-title">Branches</li>
            <li>
              <Link to="/#" className="has-arrow ">
                <i className="bx bx-home"></i>
                <span>{props.t("Branches")}</span>
              </Link>
              <ul className="sub-menu">

                <li>
                  <Link to="/branch" >
                    <i className="bx bx-home"></i>
                    <span>{props.t("Create Branch")}</span>
                  </Link>
                </li>

              </ul>
            </li>

            {/* Income */}
            <li className="menu-title">Incomes</li>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-rupee"></i>
                <span>{props.t("Income")}</span>
              </Link>
              <ul className="sub-menu">
                {branches.map(branch => (
                  <li key={branch.branchId}>
                    <Link to={`/income/${branch.branchId}`} className={pathname.includes(`/income/${branch.branchId}`) ? 'mm-active' : ''}>
                      <i className="bx bx-rupee"></i>
                      <span>{branch.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* Expenses */}
            <li className="menu-title">Expenses</li>
            <li>
              <Link to="/#" className="has-arrow ">
                <i className="bx bx-rupee"></i>
                <span>{props.t("Expense")}</span>
              </Link>
              <ul className="sub-menu">
                {branches.length > 0 &&
                  branches.map(branch => (
                    <li key={branch.branchId}>
                      <Link to={`/expense/${branch.branchId}`}>
                        <i className="bx bx-rupee"></i>
                        <span>{branch.name}</span>
                      </Link>
                    </li>
                  ))
                }
              </ul>
            </li>

            {/* User Management */}
            <li className="menu-title">User Management</li>
            <li>
              <Link to="/#" className="has-arrow ">
                <i className="bx bx-home"></i>
                <span>{props.t("Users")}</span>
              </Link>
              <ul className="sub-menu">

                <li>
                  <Link to={studentNumber === undefined ? "/student" : installmentUrl} >
                    <i className="bx bx-home"></i>
                    <span>{props.t("Create Users")}</span>
                  </Link>
                </li>

              </ul>
            </li>

            {/* Project Management */}
            <li className="menu-title">Project Management</li>
            <li>
              <Link to="/#" className="has-arrow ">
                <i className="bx bx-task"></i>
                <span>{props.t("Project")}</span>
              </Link>
              <ul className="sub-menu">

                <li>
                  <Link to={"/project"} >
                    <i className="bx bx-task"></i>
                    <span>{props.t("Manage Project")}</span>
                  </Link>
                </li>

              </ul>
            </li>
            {/* </> */}
            {/* : */}
            {/* <></> */}
            {/* } */}

          </ul>
        </div>
      </SimpleBar>
    </React.Fragment >
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
