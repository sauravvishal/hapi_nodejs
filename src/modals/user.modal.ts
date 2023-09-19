import { AppDataSource } from "../database/data-source";
import { User as UserInterface } from "../interfaces";
import { User, UserMeta } from "../database/entities";

class UserModal {
    db: any;
    constructor() {
        this.db = AppDataSource;
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
        return this.db.query(`SELECT id, password FROM users WHERE email = '${email}';`);
    }

    async createUser(user: UserInterface) {
        try {
            const userRepository = AppDataSource.getRepository(User);
            const userMetaRepository = AppDataSource.getRepository(UserMeta);
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
}

export const userModal = new UserModal();