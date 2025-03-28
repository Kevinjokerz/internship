import {Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany, Unique} from "typeorm"
import { PlannedCourses } from  './index'


@Entity('academic_maps')
@Unique(['degreeType', 'major'])
export class AcademicMaps {
    @PrimaryGeneratedColumn({name: 'academic_map_id'})
    academicMapId: number;

    @Column({name: 'degree_type', type: 'enum', enum: ['Bachelor of Science', 'Bachelor of Art']})
    degreeType: string;

    @Column({name: 'major', type: 'varchar', length: 255, nullable: false})
    major: string;

    @OneToMany(() => PlannedCourses, (plannedCourses) => plannedCourses.academicMap)
    plannedCourses: PlannedCourses[];
}