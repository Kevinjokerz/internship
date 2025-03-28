interface updateCourseInfoDTO {
    courseId: number,
    courseCode?: string,
    courseNo?: string,
    courseName?: string,
    creditHours?: number,
    description?: string,
    isCoreCurriculum?: boolean,
    isActive?: boolean,
    sortOrder?: number,
    courseLevel?: string,
    courseCategory?: string
}

interface createNewCourseDTO {
  courseCode: string,
  courseNo?: string,
  courseName: string,
  creditHours: number,
  description?: string | null,
  isCoreCurriculum: boolean
  courseLevel: string,
  courseCategory: string,
  sortOrder: number
}

interface batchUpdateCourseInfoDTO {
  updateCourses: updateCourseInfoDTO[];
}



export { updateCourseInfoDTO, batchUpdateCourseInfoDTO, createNewCourseDTO };