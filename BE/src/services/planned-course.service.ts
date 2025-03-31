import { AppDataSource } from "../data-source";
import { Courses, Semesters, Planners, PlannedCourses, AcademicMaps } from "../entities";
import { NotFoundError, BadRequestError } from "../types/http-error.type";
import { batchUpdatePlannedCoursesDTO } from "../dtos";
import { Not } from "typeorm";

class PlannedCoursesService {
  async batchUpdatePlannedCourse(dto: batchUpdatePlannedCoursesDTO) {
    const { updatePlannedCourses } = dto;

    await AppDataSource.transaction(async (transactionEntityManager) => {
      for (const plannedCourseUpdate of updatePlannedCourses) {
        const {
          plannedCourseId,
          year,
          semester,
          season,
          courseId,
          sortOrder,
          isActive,
          academicMapId,
        } = plannedCourseUpdate;

        const existedAcademicMap = await transactionEntityManager.findOne(AcademicMaps, {
          where: {academicMapId}
        })
        if(!existedAcademicMap) {
          throw new NotFoundError(`Academic Map with ID ${academicMapId} Not Found`)
        }

        const existedPlannedCourse = await transactionEntityManager.findOne(PlannedCourses,
          { where: { plannedCourseId, academicMap: existedAcademicMap },
            relations: ["planner", "planner.semester"] },
        );
        if(!existedPlannedCourse) {
          throw new NotFoundError(`Planned Course with ID ${plannedCourseId} Not Found in Academic Map with ID ${academicMapId}`);
        }

        if(courseId !== undefined) {
          const existedCourse = await transactionEntityManager.findOne(Courses, {
            where: {courseId}
          });
          if(!existedCourse) {
            throw new NotFoundError(`Course with ID ${courseId} Not Found`)
          }
          existedPlannedCourse.course = existedCourse;
        };


        if (sortOrder !== undefined) {
          existedPlannedCourse.sortOrder = sortOrder;
        }
        if (isActive !== undefined) {
          existedPlannedCourse.isActive = isActive;
        }

        if(year !== undefined  && semester !== undefined && season !== undefined){
          let planner = await transactionEntityManager.findOne(Planners, {
            where: {yearNumber: year,
              semester: {semesterName: semester},
              season: season
            },
            relations: ['semester']
          });

          if(!planner) {
            planner = new Planners();
            planner.yearNumber = year;
            planner.season = season;
            const existedSemester = await transactionEntityManager.findOne(Semesters, {
              where: {semesterName: semester}
            });
            if(!existedSemester) {
              throw new NotFoundError(`Semester ${semester} Not Found`);
            }
            planner.semester = existedSemester;
            await transactionEntityManager.save(Planners, planner);
          } else if (existedPlannedCourse.planner?.plannerId !== planner.plannerId) {
            existedPlannedCourse.planner = planner;
          }
        } else if (year !== undefined || semester !== undefined || season !== undefined) {
          throw new BadRequestError(`Year, semester, and season must all be provided to update the Planner`);
        }

        await transactionEntityManager.save(PlannedCourses, existedPlannedCourse)
      }
    });
  }

  async deletePlannedCourse (plannedCourseId: number) {
    console.log(plannedCourseId)
    await AppDataSource.transaction(async (transactionEntityManager) => {
      const existedPlannedCourse = await transactionEntityManager.findOne(PlannedCourses, {
        where: {plannedCourseId}
      })

      if(!existedPlannedCourse) {
        throw new NotFoundError(`Planned course with id ${plannedCourseId} Not Found`);
      }

      await transactionEntityManager.delete(PlannedCourses, existedPlannedCourse);
    })
    return true;
  }
}

const plannedCoursesService = new PlannedCoursesService();
export { plannedCoursesService };
