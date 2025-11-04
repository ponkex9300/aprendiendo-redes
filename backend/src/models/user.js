const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING(255), unique: true, allowNull: false },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    name: { type: DataTypes.STRING(255) },
    role: { type: DataTypes.ENUM('admin','student','teacher'), allowNull: false }
  }, { tableName: 'users', timestamps: false });
};
