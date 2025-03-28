import {Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany} from "typeorm"
import {PlannedCourses, Semesters} from './index'

@Entity('planners')
export class Planners {
    @PrimaryGeneratedColumn({name: 'planner_id'})
    plannerId!: number;

    @Column({name: 'year_number', type: 'int', nullable: false})
    yearNumber!: number;

    @Column({name: 'season', type: 'enum', enum: ['Fall', 'Spring', 'Summer', 'Winter']})
    season: string;

    @ManyToOne(() => Semesters, (semester) => semester.planners,{onDelete: 'CASCADE'})
    @JoinColumn({name: 'semester_id'})
    semester: Semesters;

    @OneToMany(() => PlannedCourses, (plannedCourses) => plannedCourses.planner)
    plannedCourses: PlannedCourses[];
}