import { AppDataSource } from "../database";
import { User as UserInterface } from "../interfaces";
import { User, UserMeta } from "../database/entities";

class UserModal {
    db: any;
    constructor() {
        this.db = AppDataSource;
    }

    getUserByID(id: any) {
        return this.db.query(`
            SELECT 
	            u.id, u.email, u.type, um.first_name, um.last_name, um.date_of_birth
            FROM users u 
            JOIN user_meta um ON u.id = um.user_id
            WHERE u.id = ${id}
        `);
    }

    getAllUsers(limit: number, offset: number) {
        let query = `
            SELECT 
	            u.id, u.email, u.password, u.type, CONCAT(um.first_name, " ", um.last_name) AS full_name, um.date_of_birth
            FROM users u 
            JOIN user_meta um ON u.id = um.user_id
            ORDER BY u.id
        `;

        if (limit) {
            query += ` LIMIT ${limit}`;
            if (offset) query += ` OFFSET ${offset}`;
        }

        return this.db.query(query);
    }

    getUserByEmail(email: string) {
        return this.db.query(`SELECT id, password, type FROM users WHERE email = '${email}';`);
    }

    deleteUser(id: any) {
        return this.db.query(`DELETE FROM users WHERE id = '${id}';`);
    }

    async createUser(user: UserInterface) {
        try {
            const userRepository = this.db.getRepository(User);
            const userMetaRepository = this.db.getRepository(UserMeta);
            const insertedUserData = await userRepository.insert({
                email: user.email,
                password: user.password,
                type: user.type
            });

            if (insertedUserData?.raw.affectedRows) {
                await userMetaRepository.insert({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    dateOfBirth: user.dateOfBirth,
                    user_id: insertedUserData?.raw.insertId
                });
                return insertedUserData?.raw.insertId;
            }

            return false;
        } catch (error) {
            return false;
        }
    }

    async updateUser(id: any, user: UserInterface) {
        try {
            const { email, password, firstName, lastName, dateOfBirth } = user;
            let query1 = ``;
            let query2 = ``;

            if (email) query1 += query1.length ? `, email = '${email}' ` : `UPDATE users SET email = '${email}' `;

            if (password) query1 += query1.length ? `, password = '${password}' ` : `UPDATE users SET password = '${password}' `;

            if (firstName) query2 += query2.length ? `, first_name = '${firstName}' ` : `UPDATE user_meta SET first_name = '${firstName}' `;

            if (lastName) query2 += query2.length ? `, last_name = '${lastName}' ` : `UPDATE user_meta SET first_name = '${lastName}' `;

            if (dateOfBirth) query2 += query2.length ? `, date_of_birth = '${dateOfBirth}' ` : `UPDATE user_meta SET first_name = '${dateOfBirth}' `;

            let userUpdate, umetaUpdate;

            if (query1.length) {
                query1 += `WHERE id = ${id};`;
                userUpdate = await this.db.query(query1);
            }
            
            if (query2.length) {
                query2 += `WHERE user_id = ${id};`;
                umetaUpdate = await this.db.query(query2);
            }

            if (userUpdate || umetaUpdate) return true;

            return false;
        } catch (error) {
            return false;
        }
    }
}

export const userModal = new UserModal();