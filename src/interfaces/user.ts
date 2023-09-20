import { UserType } from '../database/entities';

export interface User {
    id?: number,
    email?: string,
    password?: string,
    firstName?: string,
    lastName?: string,
    dateOfBirth?: Date,
    type?: UserType
};