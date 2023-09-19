import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Common } from "./common";

export enum UserType {
    user = 'user',
    admin = 'admin'
}

@Entity({ name: 'users' })
export class User extends Common {
    constructor() {
        super();
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true, nullable: false })
    email!: string;

    @Column({ nullable: false })
    password!: string;

    @Column({ default: UserType.user, enum: UserType, type: 'enum' })
    type!: UserType;
}