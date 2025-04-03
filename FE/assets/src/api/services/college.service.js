import apiClients from "../apiClients";

class CollegeService {
    getAllColleges() {
        return apiClients.get("/get-all-colleges");
    }
}