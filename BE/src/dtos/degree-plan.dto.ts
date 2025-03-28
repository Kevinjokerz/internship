import { updateCourseInfoDTO, updatePlannedCourseDTO } from "./index";

interface updateDegreePlanDTO {
  updateCourses: updateCourseInfoDTO[];
  updatePlannedCourses: updatePlannedCourseDTO[];
}

export { updateDegreePlanDTO };
