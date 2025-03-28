import { Request, Response } from 'express';
import { degreePlanService } from '../services'

class DegreePlanController {
    async getDegreePlan (req: Request, res: Response) {
        const degreePlan = await degreePlanService.getCourseDegreePlan();
        res.send(degreePlan);
    }

}

const degreePlanController = new DegreePlanController();
export {degreePlanController}