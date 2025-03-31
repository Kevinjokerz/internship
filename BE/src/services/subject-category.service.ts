import { AppDataSource } from "../data-source";
import { Courses, SubjectCategories } from "../entities";
import { Equal, Not, Repository } from "typeorm";
import { BadRequestError, ConflictError, NotFoundError } from "../types/http-error.type";
import { batchUpdateSubjectCategoryDTO,createNewDepartmentDTO } from "../dtos";


class SubjectCategoryService {
  subjectCategoryRepository: Repository<SubjectCategories> =
    AppDataSource.getRepository(SubjectCategories);

  async getSubjectCategory() {
    const data = await this.subjectCategoryRepository.find();

    return data;
  }

  async batchUpdateSubjectCategory(dto: batchUpdateSubjectCategoryDTO) {
    const { updateDepartment } = dto;

    await AppDataSource.transaction(async (transactionEntityManager) => {
      for (const departmentUpdate of updateDepartment) {
        const { categoryId, categoryName, isActive } = departmentUpdate;

        const existedDepartment = await transactionEntityManager.findOne(
          SubjectCategories,
          {
            where: { categoryId },
          }
        );

        if (!existedDepartment) {
          throw new NotFoundError(`Department with Id ${categoryId} Not Found`);
        }

        if(categoryName !== undefined) {
          const duplicatedDepartment = await transactionEntityManager.findOne(
          SubjectCategories,
          {
            where: { categoryName },
          });
          if (duplicatedDepartment?.categoryId !== existedDepartment.categoryId && duplicatedDepartment !== null) {
          throw new ConflictError(
            `Department Name ${categoryName} is already existed, please pick a different name`
          )};
        }

        const updateData: Partial<SubjectCategories> = {
          ...(categoryName !== undefined && { categoryName }),
          ...(isActive !== undefined && { isActive }),
        };

        await transactionEntityManager.update(
          SubjectCategories,
          { categoryId },
          updateData
        );
      }
      return true;
    });
  }


  async createNewDepartment(dto: createNewDepartmentDTO) {
    return await AppDataSource.transaction(async (transactionEntityManager) => {
      const existedDepartment = await transactionEntityManager.findOne(SubjectCategories, {
        where: {categoryName: dto.categoryName}
      })

      if(existedDepartment) {
        throw new ConflictError(`Department ${dto.categoryName} already existed`)
      }

      const department = await transactionEntityManager.create(SubjectCategories, {
        categoryName: dto.categoryName,
        isActive: dto.isActive
      });

      const savedDepartment = await transactionEntityManager.save(SubjectCategories, department);
      return savedDepartment;
    })
  }


  async deleteDepartmentByDepartmentId (departmentId: number) {

    await AppDataSource.transaction(async (transactionEntityManager) => {
      const existedDepartment = await transactionEntityManager.findOne(SubjectCategories, {where: {categoryId: departmentId}})
      if(!existedDepartment) {
      throw new NotFoundError(`Department with ID ${departmentId} Not Found`)
      };

      
      const existedCourseInDepartment = await transactionEntityManager.find(Courses, {
        where: {category: existedDepartment}
      })

      if(existedCourseInDepartment.length > 0) {
        throw new BadRequestError(`Cannot delete Department with ID ${departmentId} because there are ${existedCourseInDepartment.length} course(s) associated with it`)
      }

      await transactionEntityManager.delete(SubjectCategories, {
        categoryId: departmentId})
    })

    return true;
  }
}

const subjectCategoryService = new SubjectCategoryService();
export {subjectCategoryService}