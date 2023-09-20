import bcrypt from 'bcrypt';

class BcryptService {
    saltRounds: number;

    constructor() {
        this.saltRounds = 10
    }

    /**
     * encrypt: To encrypt password.
     * @param password 
     * @returns 
     */
    encryptPassword(password: string) {
        return bcrypt.hash(password, this.saltRounds);
    }

    /**
     * decrypt: To decrypt password.
     * @param data 
     * @returns 
     */
    decryptPassword(password: string, hash: string) {
        return bcrypt.compare(password, hash);
    }
}

export const bcryptService = new BcryptService();