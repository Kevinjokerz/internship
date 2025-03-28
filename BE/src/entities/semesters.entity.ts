import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm"
import { Planners } from './index'

@Entity('semesters')
export class Semesters {
    @PrimaryGeneratedColumn({name: 'semester_id'})
    semesterId!: number;

    @Column({name: 'semester_name', type: 'varchar', length: 30})
    semesterName!: string;

    @Column({name: 'is_active', type: 'boolean'})
    isActive: boolean;

    @OneToMany(() => Planners, (planner) => planner.semester)
    planners: Planners[];

}