import { AppDataSource } from "../data-source";
import { Colleges } from "../entities";
import { Repository } from "typeorm";


class CollegesService {
    private collegeRepository : Repository<Colleges>;

    constructor() {
        this.collegeRepository = AppDataSource.getRepository(Colleges)
    }

    async getAllColeges() {
        const data = await this.collegeRepository.createQueryBuilder("colleges")
        .select(["colleges.collegeName", "colleges.isActive"]).getMany();

        return data;
    }
}

const collegesService = new CollegesService();
export {collegesService}