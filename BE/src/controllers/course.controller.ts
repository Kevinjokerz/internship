import { Request, Response } from "express";
import {
  courseService,
  degreePlanService,
} from "../services";
import {
  batchUpdateCourseInfoDTO
} from "../dtos";

class CourseController {
  async batchUpdateCourseInfoConttroller(req: Request, res: Response) {
    const { payload } = req.body;
    const { updateCourses } = payload;

    const updateCourseInfoDTO: batchUpdateCourseInfoDTO = {
      updateCourses: updateCourses,
    };
    await courseService.batchUpdateCourseInfoService(updateCourseInfoDTO);
    res.status(200).send({ message: "Updated successfully" });
  }

  async getAllCourses(req: Request, res: Response) {
    const allCourses = await degreePlanService.getAllCourses();
    res.send(allCourses);
  }

  async createNewCourseController(req: Request, res: Response) {
    const {payload} = req.body;
    const newCourse = await courseService.createNewCourseService(payload);
    res.status(201).send({newCourse})
  }
}

const courseController = new CourseController();

export { courseController };
