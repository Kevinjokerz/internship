import Joi from "joi";
import { updatePlannedCourseDTO } from "../dtos";

const updatePlannedCourseValidator = Joi.object<updatePlannedCourseDTO>().keys({
  courseId: Joi.number().integer().min(1).required(),
  yearNumber: Joi.number().integer().min(1).required(),
  semesterName: Joi.string().valid("Semester 1", "Semester 2").required(),
  season: Joi.string().valid("Fall", "Spring").required(),
});

export { updatePlannedCourseValidator };
