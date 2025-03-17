import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm'
import { Courses } from './index'
import Joi from 'joi';

@Entity('prerequisites')
export class Prerequisites {
    @PrimaryGeneratedColumn({name: 'prerequisite_id'})
    prereqId: number;

    @Column({name: 'description', type: 'text', nullable: true})
    description: string;

    @Column({name: 'is_active', type: 'boolean', default: true})
    isActive: boolean;

    @ManyToOne(() => Courses, (course) => course.prerequisites, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'planned_course_id'})
    plannedCourseId: Courses;

    @ManyToOne(() => Courses, (course) => course.prereqFor, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'prerequisite_course_id'})
    prereqCourse: Courses;
}