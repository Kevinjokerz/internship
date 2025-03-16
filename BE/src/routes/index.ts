import { Router} from 'express'
import degreePlanRouter from './degree-plan';

const apiRouter = Router();

apiRouter.use('/sample', degreePlanRouter)

export default apiRouter;