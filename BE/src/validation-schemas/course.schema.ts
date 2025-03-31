import Joi from "joi";
import {
  updateCourseInfoDTO,
  batchUpdateCourseInfoDTO,
  createNewCourseDTO
} from "../dtos";

interface batchUpdateCourseInfoPayload {
  payload: batchUpdateCourseInfoDTO;
}

interface createNewCoursePayload {
  payload: createNewCourseDTO;
}

const updateCourseInfoValidator = Joi.object<updateCourseInfoDTO>().keys({
  courseId: Joi.number().integer().positive().required(),
  courseNo: Joi.string().min(1).max(20).optional(),
  courseCode: Joi.string().min(1).max(30).optional(),
  courseName: Joi.string().min(1).optional(),
  creditHours: Joi.number().integer().min(0).optional(),
  description: Joi.string().min(1).max(500).allow(null).optional(),
  isCoreCurriculum: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
  sortOrder: Joi.number().integer().min(0).optional(),
  courseLevel: Joi.string().min(1).max(4).optional(),
  courseCategory: Joi.string().min(1).optional(),
});

const batchUpdateCourseInfoValidator = Joi.object<batchUpdateCourseInfoPayload>().keys({
    payload: Joi.object<batchUpdateCourseInfoDTO>()
      .keys({
        updateCourses: Joi.array().items(updateCourseInfoValidator),
      })
      .required(),
});

const createNewCourseValidator = Joi.object<createNewCoursePayload>().keys({
  payload: Joi.object<createNewCourseDTO>()
  .keys({
    courseCode: Joi.string().min(1).max(30).required(),
    courseNo: Joi.string().min(1).max(20).allow(null).optional(),
    courseName: Joi.string().min(1).required(),
    creditHours: Joi.number().integer().min(1).required(),
    description: Joi.string().min(1).max(500).allow(null).optional(),
    isCoreCurriculum: Joi.boolean().required(),
    courseLevel: Joi.string().valid('1xxx', '2xxx', '3xxx', '4xxx').required(),
    courseCategory: Joi.string().min(1).required(),
    sortOrder: Joi.number().integer().min(0).required()
  }).required()
})


const deleteCourseParamValidator = Joi.object({
  courseId: Joi.number().integer().positive().required()
})

export { updateCourseInfoValidator, batchUpdateCourseInfoValidator, createNewCourseValidator, deleteCourseParamValidator };
