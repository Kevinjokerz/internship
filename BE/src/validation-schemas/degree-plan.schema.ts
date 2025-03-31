import Joi from "joi";
import {
  updatePlannedCourseDTO,
  updateCourseInfoDTO,
  updateDegreePlanDTO,
} from "../dtos";
import { updateCourseInfoValidator } from "./course.schema";
import { updatePlannedCourseValidator } from "./planned-course.schema";

interface updateDegreePlanPayload {
  payload: updateDegreePlanDTO;
}

const updateDegreePlanValidator = Joi.object<updateDegreePlanPayload>().keys({
  payload: Joi.object<updateDegreePlanDTO>()
    .keys({
      updateCourses: Joi.array().items(updateCourseInfoValidator),
      updatePlannedCourses: Joi.array().items(updatePlannedCourseValidator),
    })
    .required(),
});

const getCoursesByAcademicMapIdValidator = Joi.object({
  academicMapId: Joi.number().integer().positive().required()
})

export { updateDegreePlanValidator, getCoursesByAcademicMapIdValidator };
