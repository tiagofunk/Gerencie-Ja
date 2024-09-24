const sequelize = require("sequelize");
const db_connector = require("./db_connector.js")

module.exports = db_connector.connection.define(
    "task",
    {
        id:{
            type:sequelize.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        name:{
            type:sequelize.STRING,
            allowNull:false
        },
        priority:{
            type:sequelize.INTEGER.UNSIGNED,
            allowNull:false
        },
        description:{
            type:sequelize.STRING
        },
        scheduled_date:{
            type:sequelize.DATE
        },
        deadline:{
            type:sequelize.DATE
        },
        duration:{
            type: sequelize.INTEGER.UNSIGNED
        }

    },
    { timestamps: false }
)