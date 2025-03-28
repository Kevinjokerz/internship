interface updatePlannedCourseDTO {
  courseId: number;
  yearNumber: number;
  semesterName: "Semester 1" | "Semester 2";
  season: "Fall" | "Spring ";
}

interface batchUpdatePlannedCoursesDTO {
  updatePlannedCourses: updatePlannedCourseDTO[];
}

export { updatePlannedCourseDTO, batchUpdatePlannedCoursesDTO };
