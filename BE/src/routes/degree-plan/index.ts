import { Router } from "express";
import {degreePlanController} from '../../controllers'
import {asyncHandler} from '../../middlewares'

const degreePlanRouter = Router();

degreePlanRouter.get('/degree-plan', asyncHandler(degreePlanController.getDegreePlan));


export default degreePlanRouter;

