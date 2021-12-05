const sequelize = require('../../db');
const Sequelize = require("sequelize");
let AppUser = sequelize.define('app-user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    appId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    appKey: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
    },
    status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
}, {
    freezeTableName: true,
    timestamps: true, // don't add the timestamp attributes (updatedAt, createdAt)
    createdAt: true, // If don't want createdAt
    updatedAt: true, // If don't want updatedAt
});

module.exports = AppUser;