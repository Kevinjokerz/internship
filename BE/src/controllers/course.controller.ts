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

  async deleteCourseByCourseId (req: Request, res: Response) {
    const { courseId } = req.params;
    const verifiedCourseId = parseInt(courseId, 10);

    if(isNaN(verifiedCourseId)) {
      res.status(400).send({message: "Invalid course ID"});
      return;
    }

    await courseService.deleteCourseByCourseId(verifiedCourseId);
    res.status(200).send({message: `Course with ID ${verifiedCourseId} deleted successfully`})
  }
}

const courseController = new CourseController();

export { courseController };
