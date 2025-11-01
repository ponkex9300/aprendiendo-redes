const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Progress', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    student_id: { type: DataTypes.INTEGER, allowNull: false },
    video_id: { type: DataTypes.INTEGER, allowNull: false },
    watched: { type: DataTypes.BOOLEAN, defaultValue: false },
    watched_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'progress', timestamps: false });
};
