export const apiRoutes = {

    "login": "auth/login",
    "register": "auth/register",
    "totalCount": "auth/totalCount",
    "userReject": "auth/reject",
    "userApprove": "auth/approve",
    "getUserWithActive": "auth/getUserWithActive",

    "getCourses": "courses/getCourses",

    "getUsers": "user/users",
    "userRoleUser": "user/role_user",
    "userRole": "user/user_role",

    "addIncome": "account/addIncome",
    "viewIncome": "account/viewIncome",
    "updateIncome": "account/updateIncome",
    "deleteIncome": "account/deleteIncome",
    "totalIncome": "account/totalIncome",
    "getAllIncome": "account/viewIncome",

    "addExpense": "account/addExpense",
    "viewExpense": "account/viewExpense",
    "updateExpense": "account/updateExpense",
    "deleteExpense": "account/deleteExpense",
    "totalExpense": "account/totalExpense",
    "getAllExpense": "account/viewExpense",

    "addBranch": "branch/addBranch",
    "getBranch": "branch/getBranch",

    "addStudent": "student/addStudent",
    "getStudent": "student/getStudent",
    "deleteStudent": "student/deleteStudent",
    "updateStudent": "student/updateStudent",
    "getInstallmentsByStudentId": "fees/getInstallmentsByStudentId",
    "getoneStudent": "student/getoneStudent",

    "addEmployee": "employee/addEmployee",
    "getEmployee": "employee/getEmployee",
    "deleteEmployee": "employee/deleteEmployee",
    "updateEmployee": "employee/updateEmployee",

    "addFees": "fees/addFees",
    "updateInstallment": "fees/updateInstallmentById",
    "getInstallmentsByStudentIdAll": "fees/getInstallmentsByStudentIdAll",

    "addProject": "project/addProject",
    "getAllProjects": "project/getProject",
    "deleteProject": "project/deleteProject",
    "updateProject": "project/updateProject",
    "getAllProjectName": "project/getAllProjectName",
    
    "getTaskDueNotify": "task/getTaskDueNotify",
    "addTask": "task/addTask",
    "getTaskByProjectId": "task/getTaskByProjectId",
    "updateTaskById": "task/updateTaskById",
    "deleteTaskById": "task/deleteTaskById",
    "getTasksByUser": "task/getTasksByUser",
    "updateProjectDetailsInTasks": "task/updateProjectDetailsInTasks",
    "getTasksByUserAndTime": "task/getTasksByUserAndTime",
    "getAllTask": "task/getAllTask",
    "patchUpdateTaskById": "task/patchUpdateTaskById",
    "deleteTasksByProjectId": "task/deleteTasksByProjectId",


}