interface updatePlannedCourseDTO {
  plannedCourseId: number,
  year?: number,
  semester?: string,
  season?: string,
  courseId?: number,
  sortOrder?: number,
  isActive?: boolean,
  academicMapId: number
}

interface batchUpdatePlannedCoursesDTO {
  updatePlannedCourses: updatePlannedCourseDTO[];
}

export { updatePlannedCourseDTO, batchUpdatePlannedCoursesDTO };
