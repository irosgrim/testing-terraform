import { DbInterface } from ".";

export class Heroes {
    private db;
    constructor (db: DbInterface) {
        this.db = db;
    }
    public async getHallOfFame (nr: number = 10) {
        return  this.db.query("SELECT * FROM heroes order by sold desc LIMIT $1;", [nr]);
    }
}
