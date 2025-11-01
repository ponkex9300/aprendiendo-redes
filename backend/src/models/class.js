const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Class', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    course_id: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    teacher_id: { type: DataTypes.INTEGER }
  }, { tableName: 'classes', timestamps: false });
};
