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
Course.hasMany(Class, { foreignKey: 'course_id', as: 'classes' });
Class.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

Class.hasMany(Module, { foreignKey: 'class_id', as: 'modules' });
Module.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });

Module.hasMany(Video, { foreignKey: 'module_id', as: 'videos' });
Video.belongsTo(Module, { foreignKey: 'module_id', as: 'module' });

User.hasMany(Class, { foreignKey: 'teacher_id', as: 'teacherClasses' });
Class.belongsTo(User, { foreignKey: 'teacher_id', as: 'teacher' });

// Relaciones para Enrollment
Enrollment.belongsTo(User, { foreignKey: 'student_id', as: 'student' });
Enrollment.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });

User.belongsToMany(Class, { through: Enrollment, foreignKey: 'student_id', otherKey: 'class_id', as: 'enrolledClasses' });
Class.belongsToMany(User, { through: Enrollment, foreignKey: 'class_id', otherKey: 'student_id', as: 'students' });

User.hasMany(Progress, { foreignKey: 'student_id', as: 'progress' });
Progress.belongsTo(User, { foreignKey: 'student_id', as: 'student' });
Video.hasMany(Progress, { foreignKey: 'video_id', as: 'progress' });
Progress.belongsTo(Video, { foreignKey: 'video_id', as: 'video' });

module.exports = { sequelize, User, Course, Class, Module, Video, Enrollment, Progress };
