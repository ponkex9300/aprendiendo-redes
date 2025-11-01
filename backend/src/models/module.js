const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Module', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    class_id: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING(255) },
    module_order: { type: DataTypes.INTEGER }
  }, { tableName: 'modules', timestamps: false });
};
