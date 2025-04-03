import apiClients from "../apiClients.js";

class DepartmentService {
    getAllDepartment() {
        return apiClients.get("/get-all-subject-category");
    }

    createDepartments(payload) {
        return apiClients.post("/create-new-department", payload);
    }

    updateDepartments(payload) {
        return apiClients.put("/modify-department", {payload});
    }

    deleteDepartment(departmentId) {
        return apiClients.delete(`/delete-department/${departmentId}`);
    }
}

export default new DepartmentService();