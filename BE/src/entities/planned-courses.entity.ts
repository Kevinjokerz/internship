import {Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany, Unique} from "typeorm"
import {Courses, Planners, AcademicMaps} from './index'

@Entity('planned_courses')
@Unique(['planner', 'course', 'academicMap'])
export class PlannedCourses {
    @PrimaryGeneratedColumn({name: 'planned_course_id'})
    plannedCourseId!: number;

    @ManyToOne(() => Courses, (course) => course.plannedCourses, { onDelete: 'CASCADE', nullable: false})
    @JoinColumn({name : 'course_id'})
    course: Courses;

    @ManyToOne(() => Planners, (planner) => planner.plannedCourses, { onDelete: 'CASCADE', nullable: false})
    @JoinColumn({name : 'planner_id'})
    planner: Planners;

    @ManyToOne(() => AcademicMaps, (academicMaps) => academicMaps.plannedCourses, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'academic_map_id'})
    academicMap: AcademicMaps;
}