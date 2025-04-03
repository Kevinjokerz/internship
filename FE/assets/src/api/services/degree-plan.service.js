import apiClients from "../apiClients";

class DegreePlanService {
    getDegreePlan(academicMapId) {
        return apiClients.get(`/degree-plan/${academicMapId}`)
    }
}

export default new DegreePlanService();