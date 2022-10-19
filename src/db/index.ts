import { Pool }  from "pg";

const isLocalEnvironment = process.env.ENVIRONMENT && process.env.ENVIRONMENT  === "local";

const config = {
    host: isLocalEnvironment ? process.env.DB_HOST : process.env.SOCKETS_DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: isLocalEnvironment ? process.env.DB_PORT : undefined,
}

const POOL = new Pool(config);

export class DbInterface {
    private pool;
    constructor (pool : Pool) {
        this.pool = pool
    }

    public async query(text: string, params?: (string | number)[]) {
        return this.pool.query(text, params);
    }
}

const DB = new DbInterface(POOL);
export default DB;

