import {Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany} from "typeorm"
import {Courses} from './index'

@Entity('course_levels')
export class CoursesLevels {
    @PrimaryGeneratedColumn({name: 'course_level_id'})
    courseLevelId!: number;

    @Column({name: 'level_name', type: 'varchar', length: 30})
    levelName!: string;

    @OneToMany(() => Courses, (course) => course.courseLevel)
    courses: Courses[];
}