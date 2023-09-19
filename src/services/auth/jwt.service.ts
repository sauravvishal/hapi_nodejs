import { ResponseToolkit } from "hapi";
import * as jwt from "jsonwebtoken";
import { config } from "../../config";
import { userModal } from "../../modals";

class JwtService {
    createToken(id: number, type: string) {
        return new Promise((resolve, reject) => {
            jwt.sign({ id, type }, config.JWT_SECRET, { expiresIn: 1 * 60 * 60 }, function (err, token) {
                if (err) resolve(false);
                resolve(token);
            });
        });
    }

    async validate(data: any) {
        try {
            let [userData] = await userModal.getUserByID(data.id);
            return { isValid: true, credentials: userData };
        } catch (error) {
            console.log(error)
        }
        
    }
}

export const jwtService = new JwtService();
