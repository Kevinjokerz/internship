import {Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany, Unique} from "typeorm"
import { PlannedCourses, Colleges } from  './index'


@Entity('academic_maps')
@Unique(['degreeType', 'major'])
export class AcademicMaps {
    @PrimaryGeneratedColumn({name: 'academic_map_id'})
    academicMapId: number;

    @Column({name: 'degree_type', type: 'enum', enum: ['Bachelor of Science', 'Bachelor of Art'], nullable: false})
    degreeType: string;

    @Column({name: 'major', type: 'varchar', length: 255, nullable: false})
    major: string;

    @Column({name: 'is_active', type: 'boolean', default: true, nullable: false})
    isActive: boolean;

    @Column({name: 'sort_order', type: 'int', default: 0, nullable: false})
    sortOrder: number;

    @OneToMany(() => PlannedCourses, (plannedCourses) => plannedCourses.academicMap)
    plannedCourses: PlannedCourses[];

    @ManyToOne(() => Colleges, (college) => college.academicMaps, {
        onDelete: "RESTRICT",
    })
    @JoinColumn({ name: "college_id" })
    college: Colleges;
}