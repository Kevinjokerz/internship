import Joi from "joi";
import { batchUpdatePlannedCoursesDTO, updatePlannedCourseDTO } from "../dtos";

interface batchUpdatePlannedCoursesPayload {
  payload: batchUpdatePlannedCoursesDTO
}

const updatePlannedCourseValidator = Joi.object<updatePlannedCourseDTO>().keys({
  plannedCourseId: Joi.number().integer().positive().min(1).required(),
  courseId: Joi.number().integer().min(1).optional(),
  year: Joi.number().integer().min(1).optional(),
  semester: Joi.string().valid("Semester 1", "Semester 2").optional(),
  season: Joi.string().valid("Fall", "Spring").optional(),
  sortOrder: Joi.number().integer().positive().optional(),
  isActive: Joi.boolean().optional(),
  academicMapId: Joi.number().integer().positive().min(1).required()
});

const batchUpdatePlannedCoursesValidator = Joi.object<batchUpdatePlannedCoursesPayload>().keys({
  payload: Joi.object<batchUpdatePlannedCoursesDTO>().keys({
    updatePlannedCourses: Joi.array().items(updatePlannedCourseValidator)
  }).required()
})

const deletePlannedCourseParamValidator = Joi.object({
  plannedCourseId: Joi.number().integer().positive().required()
})

export { updatePlannedCourseValidator, batchUpdatePlannedCoursesValidator, deletePlannedCourseParamValidator };
