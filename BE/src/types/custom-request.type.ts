import { Request } from "express";

type courseNeedModify = {
  updatedCourseId: number;
  courseCode: string;
  courseNo: string;
  courseName: string;
  creditHours: number;
  description?: string | null;
  subjectCategory: string;
  courseLevel: string;
  year: number;
  semester?: "Fall" | "Spring" | "Summer" | "Winter";
  isCoreCurriculum: boolean;
  isActive: boolean;
  sortOrder: number;
};

type listCourseNeedModify = {
    courses: courseNeedModify[];
}

interface RequestWithListCourseNeedModify extends Request {
    listOfCourseNeedModify?: listCourseNeedModify;
}


export { RequestWithListCourseNeedModify, listCourseNeedModify, courseNeedModify};