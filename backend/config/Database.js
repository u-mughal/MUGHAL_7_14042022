import { Sequelize } from "sequelize";

const db = new Sequelize('groupomania_db', 'root', '', {
    host: "localhost",
    dialect: "mysql",
    logging: false
});


try {
    db.authenticate();
    console.log('Connection Sequelize to MySQL > successful !');
} catch (error) {
    console.error('Unable to connect sequelize to the database:', error);
}

(async () => { await db.sync(); })();

export default db;