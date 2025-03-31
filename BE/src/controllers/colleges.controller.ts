import { Request, Response } from "express";
import { collegesService } from "../services";

class CollegesController {
    async getAllColeges(req: Request, res: Response) {
        const colleges = await collegesService.getAllColeges();
        res.send(colleges)
    }
}

const collegeController = new CollegesController();
export {collegeController}