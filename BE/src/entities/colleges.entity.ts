import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { AcademicMaps } from "./index";

@Entity("colleges")
export class Colleges {
  @PrimaryGeneratedColumn({ name: "college_id" })
  collegeId: number;

  @Column({
    name: "college_name",
    type: "varchar",
    length: 255,
    nullable: false,
    unique: true,
  })
  collegeName: string;

  @Column({
    name: "is_active",
    type: "boolean",
    nullable: false,
    default: true,
  })
  isActive: boolean;

  @OneToMany(() => AcademicMaps, (academicMap) => academicMap.college)
  academicMaps: AcademicMaps[];
}
