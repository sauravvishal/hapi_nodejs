import * as jwt from "jsonwebtoken";
import { config } from "../../config";

class JwtService {
    /**
     * createToken: To create token.
     * @param id 
     * @returns 
     */
    createToken(id: number) {
        return new Promise((resolve, reject) => {
            jwt.sign({ id }, config.JWT_SECRET, { expiresIn: 1 * 60 * 60 }, function (err, token) {
                if (err) resolve(false);
                resolve(token);
            });
        });
    }

    /**
     * verifyToken: To verify token.
     * @param token 
     * @returns 
     */
    verifyToken(token: string) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, config.JWT_SECRET, function (err, decoded) {
                if (err) resolve(false);
                resolve(decoded);
            });
        });
    }
}

export const jwtService = new JwtService();
