interface updateAcademicMapDTO {
    academicMapId: number,
    degreeType?: string,
    major?: string,
    college?: string,
    sortOrder?: number,
    isActive?: boolean
}

interface addNewAcademicMapDTO {
    degreeType: string,
    major: string,
    college: string,
    sortOrder: number,
    isActive: boolean
}

interface addCourseIntoAcademicMapDTO {
  academicMapId: number;
  year: number;
  semester: string;
  season: string;
  sortOrder: number;
  courseId: number;
  isActive: boolean;
}

interface batchUpdateAcademicMapDTO {
    updateAcademicMaps: updateAcademicMapDTO[];
}

export {updateAcademicMapDTO, 
    batchUpdateAcademicMapDTO, 
    addNewAcademicMapDTO, 
    addCourseIntoAcademicMapDTO }