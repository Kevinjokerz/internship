import Joi from 'joi';
import {updateAcademicMapDTO, batchUpdateAcademicMapDTO, addNewAcademicMapDTO, addCourseIntoAcademicMapDTO} from '../dtos'


interface batchUpdateAcademicMapPayload {
    payload: batchUpdateAcademicMapDTO;
}

interface addNewAcademicMapPayload {
  payload: addNewAcademicMapDTO;
}

interface addCourseIntoAcademicMapPayload {
    payload: addCourseIntoAcademicMapDTO;
}


const updateAcademicMapValidator = Joi.object<updateAcademicMapDTO>().keys({
    academicMapId: Joi.number().integer().positive().required(),
    degreeType: Joi.string().valid('Bachelor of Science', 'Bachelor of Art').optional(),
    major: Joi.string().min(1).max(255).optional(),
    college: Joi.string().min(1).max(255).optional(),
    sortOrder: Joi.number().integer().min(0).optional(),
    isActive: Joi.boolean().optional()
})

const batchUpdateAcademicMapValidator = Joi.object<batchUpdateAcademicMapPayload>().keys({
    payload: Joi.object<batchUpdateAcademicMapDTO>().keys({
        updateAcademicMaps: Joi.array().items(updateAcademicMapValidator)
    }).required(),
})

const addNewAcademicMapValidator = Joi.object<addNewAcademicMapPayload>().keys({
    payload: Joi.object<addNewAcademicMapDTO>().keys({
        degreeType: Joi.string().valid('Bachelor of Science', 'Bachelor of Art').required(),
        major: Joi.string().min(1).max(255).required(),
        college: Joi.string().min(1).max(255).required(),
        sortOrder: Joi.number().integer().min(0).required(),
        isActive: Joi.boolean().required()
    }).required()
});


const getParamAcademicMapIdValidator = Joi.object({
    academicMapId: Joi.number().integer().positive().required()
})

const addCourseIntoAcademicMapValidator =
  Joi.object<addCourseIntoAcademicMapPayload>().keys({
    payload: Joi.object<addCourseIntoAcademicMapDTO>()
      .keys({
        academicMapId: Joi.number().integer().positive().min(1).required(),
        year: Joi.number().integer().positive().min(1).required(),
        semester: Joi.string().valid("Semester 1", "Semester 2").required(),
        season: Joi.string().valid("Fall", "Spring").required(),
        sortOrder: Joi.number().integer().min(0).required(),
        courseId: Joi.number().integer().positive().min(1).required(),
        isActive: Joi.boolean().required(),
      })
      .required(),
  });

export {updateAcademicMapValidator, batchUpdateAcademicMapValidator, addNewAcademicMapValidator, getParamAcademicMapIdValidator, addCourseIntoAcademicMapValidator };