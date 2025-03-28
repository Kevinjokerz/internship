import { AppDataSource } from "../data-source";
import { Courses, PlannedCourses, Planners } from "../entities";
import { Repository } from "typeorm";

class DegreePlanService {
  private courseRepository: Repository<Courses>;
  private plannerRepository: Repository<Planners>;
  private plannedCoursesRepository: Repository<PlannedCourses>;

  constructor() {
    this.courseRepository = AppDataSource.getRepository(Courses);
    this.plannerRepository = AppDataSource.getRepository(Planners);
    this.plannedCoursesRepository = AppDataSource.getRepository(PlannedCourses);
  }

  async getCourseDegreePlan() {
    const data = await this.plannerRepository
      .createQueryBuilder("planner")
      .leftJoinAndSelect("planner.semester", "semesters")
      .leftJoinAndSelect("planner.plannedCourses", "planned_courses")
      .leftJoinAndSelect("planned_courses.course", "courses")
      .leftJoinAndSelect("courses.category", "category")
      .leftJoinAndSelect("courses.courseLevel", "courseLevel")
      .leftJoinAndSelect("courses.prerequisites", "prerequisites")
      .leftJoinAndSelect("prerequisites.prereqCourse", "prereqCourse")
      .where("courses.isActive = :active", { active: true })
      .getMany();

    return data;
  }

  async getAllCourses() {
    const data = await this.courseRepository.createQueryBuilder("course")
    .leftJoinAndSelect("course.category", "category")
    .leftJoinAndSelect("course.courseLevel", "courseLevel")
    .getMany()
    return data;
  }
}

const degreePlanService = new DegreePlanService();
export { degreePlanService };
