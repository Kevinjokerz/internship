import academicMapService from "../../api/services/academic-map.service";
import {modal} from "../../components/modal";
import { form } from "../../components/form";

document.addEventListener("DOMContentLoaded", async () => {
    const academicMapId = new URLSearchParams(window.location.search).get("id");
    if(!academicMapId) {
        alert("Academic Map ID is missing");
        return;
    }

    const loadingIndicator = document.getElementById("loading-indicator");

    const addCourseModal = new modal("add-course-in-academic-map-mmodal", "cancel-modal");

    const addCourseForm = new form("add-course-into-academic-map-form", async (formData) =>{
        try {
            loadingIndicator.style.display = "block";
            const [semester, season] = formData.semesterSeason.split(" ").reduce(
                (acc, part, index) => {
                    if(index === 0 || index === 1) acc[0] = acc[1] ? `${acc[0]} ${part}` : part;
                    else acc[1] = part;
                    return acc;
                },
                ["", ""]
            );

            const payload = {
                payload: {
                    academicMapId: Number(academicMapId),
                    year: Number(formData.year),
                    semester: `Semester ${semester}`,
                    season: season,
                    sortOrder: Number(formData["sort-order"]),
                    courseId: Number(formData.course),
                    isActive: formData["is-active"] === "on",
                },
            };

            await academicMapService.addCourseIntoAcademicMap(payload);
            alert("Course added successfully!");
            addCourseModal.hide();
            addCourseForm.reset();
            await loadTableData();
        } catch (error) {
            alert(`Failed to add course: ${error.message}`);
        } finally {
            loadingIndicator.style.display = "none"
        }
    })
})