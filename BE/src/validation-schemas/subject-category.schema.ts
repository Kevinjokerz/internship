import Joi from 'joi'
import {batchUpdateSubjectCategoryDTO, updateSubjectCategoryDTO, createNewDepartmentDTO} from '../dtos'


interface bacthUpdateSubjectCategoryPayload {
    payload: batchUpdateSubjectCategoryDTO;
}

interface createNewDepartmentPayload {
    payload: createNewDepartmentDTO;
}

const updateSubjectCategoryValidator = Joi.object<updateSubjectCategoryDTO>().keys({
    categoryId: Joi.number().integer().positive().required(),
    categoryName: Joi.string().min(1).max(100).optional(),
    isActive: Joi.boolean().optional(),
})


const bacthUpdateSubjectCategoryValidator = Joi.object<bacthUpdateSubjectCategoryPayload>().keys({
    payload: Joi.object<batchUpdateSubjectCategoryDTO>()
    .keys({
        updateDepartment: Joi.array().items(updateSubjectCategoryValidator),
    }).required()
})

const createNewDepartmentValidator = Joi.object<createNewDepartmentPayload>().keys({
    payload: Joi.object<createNewDepartmentDTO>()
    .keys({
        categoryName: Joi.string().min(1).max(100).required(),
        isActive: Joi.boolean().required()
    }).required()
})

const deleteDepartmentParamValidator = Joi.object({
    departmentId: Joi.number().integer().positive().required()
});

export {updateSubjectCategoryValidator, bacthUpdateSubjectCategoryValidator, createNewDepartmentValidator, deleteDepartmentParamValidator}