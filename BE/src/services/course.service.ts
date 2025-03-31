import { AppDataSource } from "../data-source";
import { Courses, SubjectCategories, CoursesLevels, PlannedCourses } from "../entities";
import { Repository } from "typeorm";
import { batchUpdateCourseInfoDTO, createNewCourseDTO } from "../dtos";
import { BadRequestError, ConflictError, NotFoundError } from "../types/http-error.type";



class CourseService {
  private courseRepository: Repository<Courses>;

  constructor() {
    this.courseRepository = AppDataSource.getRepository(Courses);
  }

  async batchUpdateCourseInfoService(dto: batchUpdateCourseInfoDTO) {
    const { updateCourses } = dto;

    await AppDataSource.transaction(async (transactionEntityManager) => {
      for (const courseUpdate of updateCourses) {
        const {
          courseId,
          courseCode,
          courseNo,
          courseName,
          creditHours,
          description,
          isCoreCurriculum,
          isActive,
          sortOrder,
          courseLevel,
          courseCategory,
        } = courseUpdate;

        const existedCourse = await transactionEntityManager.findOne(Courses, {
          where: { courseId },
        });

        if (!existedCourse) {
          throw new NotFoundError(`Course with Id ${courseId} Not Found`);
        }

        if(courseName !== undefined) {
          const duplicateCourseName = await transactionEntityManager.findOne(Courses, {
          where: { courseName }
          });

          if(duplicateCourseName?.courseId !== existedCourse.courseId && duplicateCourseName !== null) {
          throw new ConflictError(`Course Name ${courseName} already existed, please choose a different name`)
        }
        }

        let subjectCategoryEntity: SubjectCategories | null = null;
        if (courseCategory) {
          subjectCategoryEntity = await transactionEntityManager.findOne(
            SubjectCategories,
            {
              where: { categoryName: courseCategory },
            }
          );
          if (!subjectCategoryEntity) {
            throw new NotFoundError(
              `Subject Category ${courseCategory} Not Found`
            );
          }
        }

        let courseLevelEntity: CoursesLevels | null = null;
        if (courseLevel) {
          courseLevelEntity = await transactionEntityManager.findOne(
            CoursesLevels,
            {
              where: { levelName: courseLevel },
            }
          );
          if (!courseLevelEntity) {
            throw new NotFoundError(`Course Level ${courseLevel} Not Found`);
          }
        }

        const updateData: Partial<Courses> = {
          ...(courseCode !== undefined && { courseCode }),
          ...(courseNo !== undefined && { courseNo }),
          ...(courseName !== undefined && { courseName }),
          ...(creditHours !== undefined && { creditHours }),
          ...(description !== undefined && { description }),
          ...(isCoreCurriculum !== undefined && { isCoreCurriculum }),
          ...(isActive !== undefined && { isActive }),
          ...(sortOrder !== undefined && { sortOrder }),
          ...(courseLevelEntity && { courseLevel: courseLevelEntity }),
          ...(subjectCategoryEntity && { category: subjectCategoryEntity }),
        };

        await transactionEntityManager.update(
          Courses,
          { courseId },
          updateData
        );
      }

      return true;
    });
  }

  async createNewCourseService (dto : createNewCourseDTO) {
    dto.courseCode = dto.courseCode.toUpperCase();
    if(dto.courseCategory !== 'Core Curriculum') {
      if(!dto.courseNo) {
        throw new BadRequestError("Course Number is required when department is not Core Curriculum")
      }
      if(!/^\d+$/.test(dto.courseNo)) {
        throw new BadRequestError("Course Number must be a number");
      }
    }

    return await AppDataSource.transaction(async(transactionEntityManager) => {
      const category = await transactionEntityManager.findOne(SubjectCategories, {where: {categoryName: dto.courseCategory, isActive: true}});
      if(!category) {
        throw new NotFoundError(`Department: '${dto.courseCategory}' Not Found or Inactive`);
      }

      const courseLevel = await transactionEntityManager.findOne(CoursesLevels, {where: {levelName: dto.courseLevel}});
      if(!courseLevel) {
        throw new NotFoundError(`Course Level '${dto.courseLevel}' not found`)
      }

      const existedCourse = await transactionEntityManager.findOne(Courses, {where: {courseName: dto.courseName}});
      if(existedCourse) {
        throw new ConflictError(`Course with name '${dto.courseName} already existed`)
      }

      const course = transactionEntityManager.create(Courses, {
        courseCode: dto.courseCode,
        courseNo: dto.courseNo,
        courseName: dto.courseName,
        creditHours: dto.creditHours,
        description: dto.description,
        isCoreCurriculum: dto.isCoreCurriculum,
        isActive: true,
        sortOrder: dto.sortOrder,
        category: category,
        courseLevel: courseLevel,
      });

      const savedCourse = await transactionEntityManager.save(Courses, course);
      return savedCourse;
    });
  }

  async deleteCourseByCourseId (courseId: number) {
    await AppDataSource.transaction(async (transactionEntityManager) => {
      const existedCourse = await transactionEntityManager.findOne(Courses, {
        where: {courseId}
      })
      
      if(!existedCourse) {
        throw new NotFoundError(`Course with ID ${courseId} Not Found`)
      }

      const coExistedPlannedCourse = await transactionEntityManager.find(PlannedCourses, {
        where: {course: existedCourse}
      })

      if(coExistedPlannedCourse.length > 0) {
        await transactionEntityManager.delete(PlannedCourses, { course: existedCourse});
      }

      await transactionEntityManager.delete(Courses, {courseId})
    });
    return true;
  }
}

const courseService = new CourseService();
export { courseService };
