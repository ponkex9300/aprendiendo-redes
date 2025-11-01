const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Video', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    module_id: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING(255) },
    s3_key: { type: DataTypes.STRING(512), allowNull: false },
    video_order: { type: DataTypes.INTEGER },
    duration_seconds: { type: DataTypes.INTEGER, defaultValue: 5 },
    status: { type: DataTypes.ENUM('pending','available','failed'), defaultValue: 'pending' }
  }, { tableName: 'videos', timestamps: false });
};
