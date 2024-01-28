import Sequelize from "sequelize";

const sequelize = new Sequelize("gamifyDb", "gamify_user", "gamifyGeeks", {
    host: "mysql",
    dialect: "mysql",
});

export default sequelize;
