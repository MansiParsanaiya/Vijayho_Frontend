import React from "react";
import { Navigate } from "react-router-dom";

// Profile
import UserProfile from "../pages/Authentication/user-profile";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";

// Dashboard
import Dashboard from "../pages/Dashboard/index";





//IncomeExpense
import Income from "../pages/IncomeExpense/Income";
import Expense from "../pages/IncomeExpense/Expense";
import DashboardPage from "../pages/IncomeExpense/DashboardPage";
import ListDisplay from "pages/IncomeExpense/ListDisplay";
import BranchPage from "pages/Branches/BranchPage";
import StudentPage from "pages/Student/StudentPage";
import Installment from "pages/Student/InstallmentsPage";
import InstallmentDetail from "pages/Student/InstallmentDetails";
import Project from "pages/ProjectManagement/ProjectPage";
import Task from "pages/ProjectManagement/TaskViewPage";
import AllTask from "pages/ProjectManagement/AllTaskPage";


const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/income/:branchId", component: <Income /> },
  { path: "/expense/:branchId", component: <Expense /> },
  { path: "/dashboardpage", component: <DashboardPage /> },
  { path: "/listdisplay", component: <ListDisplay /> },
  { path: "/branch", component: <BranchPage /> },
  { path: "/student", component: <StudentPage /> },
  { path: "/installments/:studentNumber", component: <Installment /> },
  { path: "/project", component: <Project /> },
  { path: "/task/:projectId", component: <Task /> },
  { path: "/task", component: <AllTask /> },



  // //profile
  { path: "/profile", component: <UserProfile /> },


  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: < Navigate to="/dashboard" />,
  },
];

const publicRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },


];

export { authProtectedRoutes, publicRoutes };
