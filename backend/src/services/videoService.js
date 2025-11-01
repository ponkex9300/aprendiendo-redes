const { Video, Module, Class, Progress } = require('../models');
const { Op } = require('sequelize');

async function checkIfCourseCompleted(studentId, video) {
  // video -> module -> class
  const module = await Module.findByPk(video.module_id, { include: [{ model: require('../models').Class }] });
  if (!module) return false;
  const classId = module.class_id;

  // obtener todos los videos de la clase (todas sus modules)
  const videosInClass = await Video.findAll({
    include: [{ model: Module, where: { class_id: classId }, attributes: [] }],
    attributes: ['id']
  });
  const videoIds = videosInClass.map(v => v.id);
  if (videoIds.length === 0) return false;

  // contar watched por student
  const watchedCount = await Progress.count({
    where: { student_id: studentId, video_id: { [Op.in]: videoIds }, watched: true }
  });

  return watchedCount === videoIds.length;
}

module.exports = { checkIfCourseCompleted };
