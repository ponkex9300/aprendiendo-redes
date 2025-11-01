const { sequelize } = require('../config/db');
const UserModel = require('./user');
const CourseModel = require('./course');
const ClassModel = require('./class');
const ModuleModel = require('./module');
const VideoModel = require('./video');
const EnrollmentModel = require('./enrollment');
const ProgressModel = require('./progress');

const User = UserModel(sequelize);
const Course = CourseModel(sequelize);
const Class = ClassModel(sequelize);
const Module = ModuleModel(sequelize);
const Video = VideoModel(sequelize);
const Enrollment = EnrollmentModel(sequelize);
const Progress = ProgressModel(sequelize);

/* Relaciones */
Course.hasMany(Class, { foreignKey: 'course_id' });
Class.belongsTo(Course, { foreignKey: 'course_id' });

Class.hasMany(Module, { foreignKey: 'class_id' });
Module.belongsTo(Class, { foreignKey: 'class_id' });

Module.hasMany(Video, { foreignKey: 'module_id' });
Video.belongsTo(Module, { foreignKey: 'module_id' });

User.hasMany(Class, { foreignKey: 'teacher_id' });
Class.belongsTo(User, { foreignKey: 'teacher_id', as: 'teacher' });

User.belongsToMany(Class, { through: Enrollment, foreignKey: 'student_id', otherKey: 'class_id' });
Class.belongsToMany(User, { through: Enrollment, foreignKey: 'class_id', otherKey: 'student_id' });

User.hasMany(Progress, { foreignKey: 'student_id' });
Progress.belongsTo(User, { foreignKey: 'student_id' });
Video.hasMany(Progress, { foreignKey: 'video_id' });
Progress.belongsTo(Video, { foreignKey: 'video_id' });

module.exports = { sequelize, User, Course, Class, Module, Video, Enrollment, Progress };
