import { Request, Response } from 'express';
import { degreePlanService, plannedCoursesService } from '../services'
import { batchUpdateAcademicMapDTO, batchUpdateCourseInfoDTO } from '../dtos';
import { mean } from 'lodash';
import { error } from 'console';

class DegreePlanController {
    async getDegreePlan (req: Request, res: Response) {
        const academicMapId = Number(req.params.academicMapId);
        const degreePlan = await degreePlanService.getCourseDegreePlan(academicMapId);
        res.send(degreePlan);
    }

    async getAllAcademicMap (req: Request, res: Response) {
        const academicMaps = await degreePlanService.getAllAcademicMap();
        res.send(academicMaps)
    }

    async batchUpdateAcademicMap (req: Request, res: Response) {
        const { payload } = req.body;
        await degreePlanService.batchUpdateAcademicMap(payload);
        res.status(200).send({message: "Updated successfully"});
    }

    async addNewAcademicMap (req: Request, res: Response) {
        const { payload } = req.body;
        const newAcademicMap = await degreePlanService.addNewAcademicMap(payload);
        res.status(200).send(newAcademicMap)
    }

    async deleteAcademicMap(req: Request, res: Response) {
        const { academicMapId } = req.params;
        const verifiedAcademicMapId = Number(academicMapId);

        if(isNaN(verifiedAcademicMapId)) {
            res.status(400).send({error: "Invalid Academic Map ID"});
            return;
        }

        await degreePlanService.deleteAcademicMap(verifiedAcademicMapId);
        res.status(200).send({message: `Academic Map with ID ${verifiedAcademicMapId} deleted successfully.`});
    }

    async getPlannedCourseByAcademicMap (req: Request, res: Response) {
        const academicMapId = Number(req.params.academicMapId);
        if(isNaN(academicMapId)) {
            res.status(400).send({error: "Invalid academic map ID"})
        }
        const coursesInfo = await degreePlanService.getPlannedCourseByAcademicMap(academicMapId);
        res.send(coursesInfo)
    }
    
    async addCourseIntoAcadmicMap (req: Request, res: Response) {
        const { payload } = req.body;
        await degreePlanService.addCourseIntoAcademicMap(payload);
        res.status(200).send({message: "Course added into Academic Map succesfully."})
    }

    async getAcademicMapInfo (req: Request, res: Response) {
        const academicMapId = Number(req.params.academicMapId);
        if(isNaN(academicMapId)) {
            res.status(400).send({error: "Invalid academic map ID"});
        }

        const academicMapData = await degreePlanService.getAcademicMapInfo(academicMapId);
        res.send(academicMapData)
    }

    async batchUpdatePlannedCourse (req: Request, res: Response) {
        const { payload } = req.body;
        await plannedCoursesService.batchUpdatePlannedCourse(payload);
        res.status(200).send({message: "Updated successfully."})
    }

    async deletePlannedCourse (req: Request, res: Response) {
        const plannedCourseId = Number(req.params.plannedCourseId);
        await plannedCoursesService.deletePlannedCourse(plannedCourseId);
        res.status(200).send({message: "Planned Course delete successfully"})
    }
}

const degreePlanController = new DegreePlanController();
export {degreePlanController}