import { AppDataSource } from "../data-source";
import { Courses, Semesters, Planners, PlannedCourses } from "../entities";
import { NotFoundError, BadRequestError } from "../types/http-error.type";
import { batchUpdatePlannedCoursesDTO } from "../dtos";

class PlannedCoursesService {
  async batchUpdateDegreePlan(dto: batchUpdatePlannedCoursesDTO) {
    const { updatePlannedCourses } = dto;

    await AppDataSource.transaction(async (transactionEntityManager) => {
      const allSemesters = await transactionEntityManager.find(Semesters);
      const allPlanners = await transactionEntityManager.find(Planners, {
        relations: ["semester"],
      });
      for (const plannedCourseUpdate of updatePlannedCourses) {
        const { courseId, yearNumber, semesterName, season } =
          plannedCourseUpdate;

        if (!semesterName || !yearNumber || !season) {
          throw new BadRequestError(
            "semester name, year number, and season are required"
          );
        }

        const existedSemester = allSemesters.find(
          (semester) => semester.semesterName === semesterName
        );
        if (!existedSemester) {
          throw new NotFoundError(`${semesterName} Not Found`);
        }

        const existedPlanner = allPlanners.find(
          (planner) =>
            planner.semester.semesterId === existedSemester.semesterId &&
            planner.season === season &&
            planner.yearNumber === yearNumber
        );
        if (!existedPlanner) {
          throw new NotFoundError(
            `${yearNumber} ${semesterName} ${season} Not Found`
          );
        }

        const existedCourse = await transactionEntityManager.findOne(Courses, {
            where: {courseId}
        })
        if (!existedCourse) {
            throw new NotFoundError(`Course with course id ${courseId} Not Found`)
        }

        const updateData: Partial<PlannedCourses> = {
          ...(existedPlanner && { planner: existedPlanner }),
        };


        await transactionEntityManager.update(
          PlannedCourses,
          { course: existedCourse },
          updateData
        );
      }

      return true;
    });
  }
}

const plannedCoursesService = new PlannedCoursesService();
export { plannedCoursesService };
