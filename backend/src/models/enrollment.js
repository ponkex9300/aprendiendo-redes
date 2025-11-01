const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Enrollment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    student_id: { type: DataTypes.INTEGER, allowNull: false },
    class_id: { type: DataTypes.INTEGER, allowNull: false }
  }, { tableName: 'enrollments', timestamps: false });
};
