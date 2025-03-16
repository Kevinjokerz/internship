import {Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany} from "typeorm"
import {Courses} from './index'

@Entity('subject_categories')
export class SubjectCategories {
    @PrimaryGeneratedColumn({name: 'category_id'})
    categoryId!: number;

    @Column({name: 'category_name', type: 'varchar', length: 100})
    categoryName!: string;

    @Column({name: 'is_active', type: 'boolean'})
    isActive: boolean;

    @OneToMany(() => Courses, (course) => course.category)
    courses: Courses[];
}