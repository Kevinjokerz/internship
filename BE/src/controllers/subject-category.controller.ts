import { Request, Response } from "express";
import { subjectCategoryService } from "../services";

class SubjectCategoryController {
  async getAllSubjectCategory(req: Request, res: Response) {
    const subjectCategories = await subjectCategoryService.getSubjectCategory();
    res.send(subjectCategories);
  }
  
  async batchUpdateSubjectCategory (req: Request, res: Response) {
    const {payload} = req.body;
    await subjectCategoryService.batchUpdateSubjectCategory(payload)
    res.status(200).send({message: "Departments updated successfully"})
  }

  async createNewDepartment(req: Request, res: Response) {
    const {payload} = req.body;
    const newDepartment = await subjectCategoryService.createNewDepartment(payload);
    res.status(201).send(newDepartment)
  }

  async deleteDepartmentById (req: Request, res: Response) {
    const {departmentId} = req.params;
    const categoryId = parseInt(departmentId, 10);

    if(isNaN(categoryId)) {
      res.status(400).send({message: "Invalid department ID"});
      return;
    }

    await subjectCategoryService.deleteDepartmentByDepartmentId(categoryId);
    res.status(200).send({message: `Department with id ${categoryId} deleted successfully`})
  }
}

const subjectCategorieController = new SubjectCategoryController();
export {subjectCategorieController}