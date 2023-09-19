import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Common } from "./common";
import { User } from "./User";

@Entity({ name: 'user_meta' })
export class UserMeta extends Common {
    constructor() {
        super();
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'first_name', nullable: false })
    firstName!: string;

    @Column({ name: 'last_name', nullable: false })
    lastName!: string;

    @Column({ name: 'date_of_birth', nullable: true, type: 'date' })
    dateOfBirth!: Date;

    @OneToOne(() => User ,{ onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user_id!: User;

}