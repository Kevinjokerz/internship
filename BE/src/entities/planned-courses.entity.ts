import {Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany} from "typeorm"
import {Courses, Planners} from './index'

@Entity('planned_courses')
export class PlannedCourses {
    @PrimaryGeneratedColumn({name: 'planned_course_id'})
    plannedCourseId!: number;

    @ManyToOne(() => Courses, (course) => course.plannedCourses, { onDelete: 'CASCADE'})
    @JoinColumn({name : 'course_id'})
    course: Courses;

    @ManyToOne(() => Planners, (planner) => planner.plannedCourses, { onDelete: 'CASCADE'})
    @JoinColumn({name : 'planner_id'})
    planner: Planners;
}