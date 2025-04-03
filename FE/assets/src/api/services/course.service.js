import apiClients from "../apiClients";

class CourseService {
    getAllCourses() {
        return apiClients.get("/get-all-courses");
    }

    createCourse(payload) {
        return apiClients.post("/create-new-course", payload);
    }

    updateCourses(payload) {
        return apiClients.put("/modify-degree-plan", {payload});
    }

    deleteCourse(courseId) {
        return apiClients.delete(`/delete-course/${courseId}`);
    }
}

export default new CourseService();