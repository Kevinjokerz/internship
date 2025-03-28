import { Router } from "express";
import {
  degreePlanController,
  courseController,
  subjectCategorieController,
} from "../../controllers";
import { asyncHandler } from "../../helpers";
import {
  bacthUpdateSubjectCategoryValidator,
  batchUpdateCourseInfoValidator,
  createNewCourseValidator,
  createNewDepartmentValidator,
  deleteDepartmentParamValidator
} from "../../validation-schemas";
import { validateBody, validateParam } from "../../middlewares";

const degreePlanRouter = Router();

degreePlanRouter.get(
  "/degree-plan",
  asyncHandler(degreePlanController.getDegreePlan)
);
degreePlanRouter.put(
  "/modify-degree-plan",
  validateBody(batchUpdateCourseInfoValidator),
  asyncHandler(courseController.batchUpdateCourseInfoConttroller)
);
degreePlanRouter.get(
  "/get-all-courses",
  asyncHandler(courseController.getAllCourses)
);
degreePlanRouter.get(
  "/get-all-subject-category",
  asyncHandler(subjectCategorieController.getAllSubjectCategory)
);
degreePlanRouter.post(
  "/create-new-course",
  validateBody(createNewCourseValidator),
  asyncHandler(courseController.createNewCourseController)
)
degreePlanRouter.put(
  "/modify-department",
  validateBody(bacthUpdateSubjectCategoryValidator),
  asyncHandler(subjectCategorieController.batchUpdateSubjectCategory)
);
degreePlanRouter.post(
  "/create-new-department",
  validateBody(createNewDepartmentValidator),
  asyncHandler(subjectCategorieController.createNewDepartment)
);
degreePlanRouter.delete(
  "/delete-department/:departmentId",
  validateParam(deleteDepartmentParamValidator),
  asyncHandler(subjectCategorieController.deleteDepartmentById)
)
export default degreePlanRouter;
