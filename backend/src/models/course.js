const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Course', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT }
  }, { tableName: 'courses', timestamps: false });
};
