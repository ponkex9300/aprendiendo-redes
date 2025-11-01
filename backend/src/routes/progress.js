const express = require('express');
const router = express.Router();
const { Progress, Video } = require('../models');
const { authMiddleware, role } = require('../middlewares/auth');
const { checkIfCourseCompleted } = require('../services/videoService');

// upsert watch
router.post('/watch', authMiddleware, role(['student']), async (req, res) => {
  const { videoId } = req.body;
  if (!videoId) return res.status(400).json({ error: 'Missing videoId' });
  const studentId = req.user.id;

  // upsert
  const existing = await Progress.findOne({ where: { student_id: studentId, video_id: videoId } });
  if (existing) {
    existing.watched = true;
    existing.watched_at = new Date();
    await existing.save();
  } else {
    await Progress.create({ student_id: studentId, video_id: videoId, watched: true, watched_at: new Date() });
  }

  const video = await Video.findByPk(videoId);
  const courseCompleted = await checkIfCourseCompleted(studentId, video);
  res.json({ ok: true, courseCompleted });
});

module.exports = router;
