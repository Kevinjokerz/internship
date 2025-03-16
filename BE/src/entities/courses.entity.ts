import {Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany} from "typeorm"
import {SubjectCategories, CoursesLevels, PlannedCourses} from './index'

@Entity('courses')
export class Courses {
    @PrimaryGeneratedColumn({name: 'course_id'})
    courseId!: number;

    @Column({name: 'course_code', type: 'varchar', length: 30, nullable: false})
    courseCode!: string;

    @Column({name: 'course_name', type: 'varchar', length: 255, nullable: false, unique: true})
    courseName!: string;

    @Column({name: 'credit_hours', type: 'int', default: 0, nullable: false})
    creditHours!: number;

    @Column({name: 'description', type: 'text'})
    description: string;

    @ManyToOne(() => SubjectCategories, (category) => category.courses, { onDelete: 'CASCADE'})
    @JoinColumn({name : 'subject_category_id'})
    category: SubjectCategories;

    @ManyToOne(() => CoursesLevels, (level) => level.courses, { onDelete: 'CASCADE'})
    @JoinColumn({name : 'course_level_id'})
    courseLevel: CoursesLevels;

    @Column({name: 'is_core_curriculum', type: 'boolean', default: true, nullable: false})
    isCoreCurriculum: boolean;
    
    @Column({name: 'is_active', type: 'boolean', default: true, nullable: false})
    isActive: boolean;

    @Column({name: 'sort_order', type: 'int', default: 0, nullable: false})
    sortOrder: boolean;

    @OneToMany(() => PlannedCourses, (plannedCourse) => plannedCourse.course)
    plannedCourses: PlannedCourses[];


}