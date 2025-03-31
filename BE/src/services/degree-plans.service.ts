import { AppDataSource } from "../data-source";
import { Courses, PlannedCourses, Planners, AcademicMaps, Colleges, Semesters } from "../entities";
import { Not, Repository } from "typeorm";
import { batchUpdateAcademicMapDTO, addNewAcademicMapDTO, addCourseIntoAcademicMapDTO, batchUpdatePlannedCoursesDTO } from '../dtos'
import { BadRequestError, ConflictError, NotFoundError } from "../types/http-error.type";
import { notEqual } from "assert";

class DegreePlanService {
  private courseRepository: Repository<Courses>;
  private plannerRepository: Repository<Planners>;
  private plannedCoursesRepository: Repository<PlannedCourses>;
  private academicMapRepository: Repository<AcademicMaps>;

  constructor() {
    this.courseRepository = AppDataSource.getRepository(Courses);
    this.plannerRepository = AppDataSource.getRepository(Planners);
    this.plannedCoursesRepository = AppDataSource.getRepository(PlannedCourses);
    this.academicMapRepository = AppDataSource.getRepository(AcademicMaps);
  }

  async getCourseDegreePlan(academicMapId: number) {    
    const existedAcademicMap = await this.academicMapRepository.findOne({where: {academicMapId}})
    if(!existedAcademicMap) {
      throw new NotFoundError(`Academic Map with Id ${academicMapId} Not Found`)
    }
    const data = await this.plannerRepository
      .createQueryBuilder("planner")
      .leftJoinAndSelect("planner.semester", "semesters")
      .leftJoinAndSelect("planner.plannedCourses", "planned_courses")
      .leftJoinAndSelect("planned_courses.academicMap", "academicMap")
      .leftJoinAndSelect("planned_courses.course", "courses")
      .leftJoinAndSelect("courses.category", "category")
      .leftJoinAndSelect("courses.courseLevel", "courseLevel")
      .leftJoinAndSelect("courses.prerequisites", "prerequisites")
      .leftJoinAndSelect("prerequisites.prereqCourse", "prereqCourse")
      .where("courses.isActive = :active", { active: true })
      .andWhere("planned_courses.isActive = :active", {active: true})
      .andWhere("category.isActive = :active", {active: true})
      .andWhere("academicMap.academicMapId = :academicMapId", {academicMapId: academicMapId})
      .getMany();

    return data;
  }

  async getAllCourses() {
    const data = await this.courseRepository
      .createQueryBuilder("course")
      .leftJoinAndSelect("course.category", "category")
      .leftJoinAndSelect("course.courseLevel", "courseLevel")
      .getMany();
    return data;
  }

  async getAllAcademicMap() {
    const data = await this.academicMapRepository
      .createQueryBuilder("academicMap")
      .leftJoin("academicMap.college", "college")
      .select([
        "academicMap.academicMapId",
        "academicMap.degreeType",
        "academicMap.major",
        "academicMap.isActive",
        "academicMap.sortOrder",
        "college.collegeName",
      ])
      .getMany();

    return data;
  }

  async batchUpdateAcademicMap(dtos: batchUpdateAcademicMapDTO) {
    const { updateAcademicMaps } = dtos;
    if (updateAcademicMaps === undefined) {
      throw new BadRequestError("No academic map found in request");
    }

    await AppDataSource.transaction(async (transactionEntityManger) => {
      for (const academicMapUpdate of updateAcademicMaps) {
        const {
          academicMapId,
          degreeType,
          major,
          college,
          sortOrder,
          isActive,
        } = academicMapUpdate;

        const existedAcademicMap = await transactionEntityManger.findOne(
          AcademicMaps,
          {
            where: { academicMapId },
          }
        );
        if (!existedAcademicMap) {
          throw new NotFoundError(
            `Academic Map with Id ${academicMapId} Not Found`
          );
        }


        if(degreeType !== undefined || major !== undefined) {
          const duplicateAcademicMap = await transactionEntityManger.findOne(
          AcademicMaps, {
            where: { degreeType: degreeType, major: major },
          });
          if (duplicateAcademicMap && duplicateAcademicMap.academicMapId !== existedAcademicMap.academicMapId) {
            throw new ConflictError(`${degreeType} in ${major} is already existed`);
          }
        }

        const collegeEntity = await transactionEntityManger.findOne(Colleges, {
          where: { collegeName: college, isActive: true },
        });
        if (!collegeEntity) {
          throw new NotFoundError(
            `College with name ${college} Not Found or Inactive`
          );
        }

        const updateData: Partial<AcademicMaps> = {
          ...(degreeType !== undefined && { degreeType }),
          ...(major !== undefined && { major }),
          ...(collegeEntity && { college: collegeEntity }),
          ...(sortOrder !== undefined && { sortOrder }),
          ...(isActive !== undefined && { isActive }),
        };

        await transactionEntityManger.update(
          AcademicMaps,
          { academicMapId },
          updateData
        );
      }
      return true;
    });
  }

  async addNewAcademicMap(dto: addNewAcademicMapDTO) {
    console.log(dto);
    await AppDataSource.transaction(async (transactionEntityManger) => {
      const existedCollege = await transactionEntityManger.findOne(Colleges, {
        where: {collegeName: dto.college, isActive: true}
      })
      if(!existedCollege) {
        throw new NotFoundError(`College with name ${dto.college} Not Found or Inactive`)
      }

      const dupAcademicMap = await transactionEntityManger.findOne(AcademicMaps, {
        where: {degreeType: dto.degreeType, major: dto.major}
      })

      if(dupAcademicMap) {
        throw new ConflictError(`${dto.degreeType} in ${dto.major} is already existed.`)
      }

      const academicMap = transactionEntityManger.create(AcademicMaps, {
        degreeType: dto.degreeType,
        major: dto.major,
        college: existedCollege,
        sortOrder: dto.sortOrder,
        isActive: dto.isActive,
      })
      
      const savedAcademicMap = await transactionEntityManger.save(academicMap);
      return savedAcademicMap;
    })
  }

  async deleteAcademicMap (academicMapId: number) {
    await AppDataSource.transaction(async (transactionEntityManager) => {
      const existedAcademicMap = await transactionEntityManager.findOne(AcademicMaps, {
        where: {academicMapId}
      });
      if(!existedAcademicMap) {
        throw new NotFoundError(`Academic Map with id ${academicMapId} Not Found`)
      }

      const coExistedPlannedCourse = await transactionEntityManager.find(PlannedCourses, {
        where: {academicMap: existedAcademicMap}
      })

      if(coExistedPlannedCourse.length > 0) {
        await transactionEntityManager.delete(PlannedCourses, { academicMap: existedAcademicMap});
      }
      
      await transactionEntityManager.delete(AcademicMaps, {academicMapId})
    })
  }

  async getPlannedCourseByAcademicMap (academicMapId: number) {
    const plannedCourses = await this.plannedCoursesRepository
      .createQueryBuilder("pc")
      .leftJoinAndSelect("pc.course", "courses")
      .leftJoinAndSelect("courses.prerequisites", "prerequisites")
      .leftJoinAndSelect("pc.planner", "planners")
      .leftJoinAndSelect("planners.semester", "semesters")
      .where("pc.academic_map_id = :academicMapId", { academicMapId })
      .getMany();

    return plannedCourses;
  }

  async addCourseIntoAcademicMap (dto: addCourseIntoAcademicMapDTO) {
    await AppDataSource.transaction(async (transactionEntityManager) => {
      const existedAcademicMap = await transactionEntityManager.findOne(AcademicMaps, {
        where: {academicMapId: dto.academicMapId}
      })
      if(!existedAcademicMap) {
        throw new NotFoundError(`Academic Map with ID ${dto.academicMapId} Not Found`)
      }

      const existedSemester = await transactionEntityManager.findOne(Semesters, {
        where: {semesterName: dto.semester}
      })
      if(!existedSemester) {
        throw new NotFoundError(`${dto.semester} Not Found`)
      }

      let planner = await transactionEntityManager.findOne(Planners, {
        where: {yearNumber: dto.year, semester: existedSemester, season: dto.season},
        relations: ["semester"]
      });
      if(!planner) {
        planner = transactionEntityManager.create(Planners, {
          yearNumber: dto.year,
          semester: existedSemester,
          season: dto.season
        })
        await transactionEntityManager.save(Planners, planner)
      }

      const existedCourse = await transactionEntityManager.findOne(Courses, {
        where: {courseId: dto.courseId}
      })
      if(!existedCourse) {
        throw new NotFoundError(`Course with ID ${dto.courseId} Not Found`);
      }

      const checkDupPlannedCourse = await transactionEntityManager.findOne(PlannedCourses, {
        where: {course: existedCourse, academicMap: existedAcademicMap},
        relations: ["course", "academicMap"]
      })
      if(checkDupPlannedCourse) {
        throw new ConflictError(`Course with ID ${dto.courseId} already existed in this academic map`)
      }

      const newPlannedCoursee = transactionEntityManager.create(PlannedCourses, {
        academicMap: existedAcademicMap,
        planner: planner,
        course: existedCourse,
        isActive: dto.isActive,
        sortOrder: dto.sortOrder
      })

      await transactionEntityManager.save(PlannedCourses, newPlannedCoursee)
    })
  }

  async getAcademicMapInfo(academicMapId: number) {
    const data = await this.academicMapRepository.createQueryBuilder("am")
    .leftJoinAndSelect("am.college", "college")
    .where("am.academicMapId= :academicMapId", {academicMapId})
    .select([
      "am.degreeType",
      "am.major",
      "college.collegeName",
    ])
    .getOne()

    return data;
  }

}

const degreePlanService = new DegreePlanService();
export { degreePlanService };
