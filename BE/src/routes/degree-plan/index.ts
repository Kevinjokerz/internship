import { Router } from "express";
import {
  degreePlanController,
  courseController,
  subjectCategorieController,
  collegeController,
} from "../../controllers";
import { asyncHandler } from "../../helpers";
import {
  bacthUpdateSubjectCategoryValidator,
  batchUpdateAcademicMapValidator,
  batchUpdateCourseInfoValidator,
  createNewCourseValidator,
  createNewDepartmentValidator,
  deleteCourseParamValidator,
  deleteDepartmentParamValidator,
  addNewAcademicMapValidator,
  addCourseIntoAcademicMapValidator,
  getCoursesByAcademicMapIdValidator,
  getParamAcademicMapIdValidator,
  batchUpdatePlannedCoursesValidator,
  deletePlannedCourseParamValidator
} from "../../validation-schemas";
import { validateBody, validateParam } from "../../middlewares";
import { degreePlanService } from "../../services";

const degreePlanRouter = Router();

degreePlanRouter.get(
  "/degree-plan/:academicMapId",
  validateParam(getParamAcademicMapIdValidator),
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
degreePlanRouter.get(
  "/get-all-academic-map",
  asyncHandler(degreePlanController.getAllAcademicMap)
)
degreePlanRouter.get(
  "/get-all-colleges",
  asyncHandler(collegeController.getAllColeges)
)
degreePlanRouter.put(
  "/modify-academic-map",
  validateBody(batchUpdateAcademicMapValidator),
  asyncHandler(degreePlanController.batchUpdateAcademicMap)
)

degreePlanRouter.delete(
  "/delete-course/:courseId",
  validateParam(deleteCourseParamValidator),
  asyncHandler(courseController.deleteCourseByCourseId)
);
degreePlanRouter.post(
  "/add-new-academic-map",
  validateBody(addNewAcademicMapValidator),
  asyncHandler(degreePlanController.addNewAcademicMap)
);
degreePlanRouter.delete(
  "/delete-academic-map/:academicMapId",
  validateParam(getParamAcademicMapIdValidator),
  asyncHandler(degreePlanController.deleteAcademicMap)
);
degreePlanRouter.get(
  "/get-course-by-academic-map-id/:academicMapId",
  validateParam(getParamAcademicMapIdValidator),
  asyncHandler(degreePlanController.getPlannedCourseByAcademicMap)
);
degreePlanRouter.post(
  "/add-course-into-academic-map",
  validateBody(addCourseIntoAcademicMapValidator),
  asyncHandler(degreePlanController.addCourseIntoAcadmicMap)
)
degreePlanRouter.get(
  "/get-academic-map-info/:academicMapId",
  validateParam(getParamAcademicMapIdValidator),
  asyncHandler(degreePlanController.getAcademicMapInfo)
);
degreePlanRouter.put(
  "/modify-planned-courses",
  validateBody(batchUpdatePlannedCoursesValidator),
  asyncHandler(degreePlanController.batchUpdatePlannedCourse)
)
degreePlanRouter.delete(
  "/delete-planned-course/:plannedCourseId",
  validateParam(deletePlannedCourseParamValidator),
  asyncHandler(degreePlanController.deletePlannedCourse)
)
export default degreePlanRouter;
