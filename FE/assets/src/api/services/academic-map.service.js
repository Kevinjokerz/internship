import apiClients from "../apiClients";

class AcademicMapService {
    getAllAcademicMaps() {
        return apiClients.get("/get-all-academic-map");
    }

    createAcademicMap(payload) {
        return apiClients.post("/add-new-academic-map", payload);
    }

    updateAcademicMap(payload) {
        return apiClients.put("modify-academic-map", { payload });
    }

    deleteAcademicMap(academicMapId) {
        return apiClients.delete(`/delete-academic-map/${academicMapId}`);
    }

    getCoursesByAcademicMapId (academicMapId) {
        return apiClients.get(`/get-course-by-academic-map-id/${academicMapId}`);
    }

    addCourseIntoAcademicMap (payload) {
        return apiClients("/add-course-into-academic-map", payload)
    }
}

export default new AcademicMapService();