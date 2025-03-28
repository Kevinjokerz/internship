interface updateSubjectCategoryDTO {
    categoryId: number,
    categoryName?: string,
    isActive?: boolean,
}

interface batchUpdateSubjectCategoryDTO {
    updateDepartment: updateSubjectCategoryDTO[];
}

interface createNewDepartmentDTO {
    categoryName: string,
    isActive: boolean,
}

export {updateSubjectCategoryDTO, batchUpdateSubjectCategoryDTO, createNewDepartmentDTO}