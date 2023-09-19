import dotenv from "dotenv";
dotenv.config();

class Config {
    PORT: number;
    DB_TYPE: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DATABASE: string;
    JWT_SECRET: string;

    constructor() {
        this.PORT = +process.env.PORT! || 3000;
        this.DB_TYPE = process.env.DB_TYPE! || "mysql";
        this.DB_HOST = process.env.DB_HOST! || "127.0.0.1";
        this.DB_PORT = +process.env.DB_PORT! || 3306;
        this.DB_USERNAME = process.env.DB_USERNAME! || "root";
        this.DB_PASSWORD = process.env.DB_PASSWORD! || "123";
        this.DATABASE = process.env.DATABASE! || "hapi_node_db";
        this.JWT_SECRET = process.env.DATABASE! || "some_secret";
    }
}

export const config = new Config();