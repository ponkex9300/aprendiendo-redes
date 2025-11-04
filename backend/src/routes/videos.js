const express = require('express');
const router = express.Router();
const { Video } = require('../models');
const { getPresignedPutUrl, getPresignedGetUrl, headObject } = require('../services/s3');
const { authMiddleware, role } = require('../middlewares/auth');

// presign
router.post('/presign', authMiddleware, role(['teacher']), async (req, res) => {
  const { filename, contentType, classId, moduleId, videoOrder, title, duration } = req.body;
  if (!filename || !contentType || !moduleId) return res.status(400).json({ error: 'Missing fields' });
  if (!duration || duration <= 0) return res.status(400).json({ error: 'La duración del video es requerida' });
  const key = `classes/${classId || 'noclass'}/modules/${moduleId}/${Date.now()}_${filename}`;
  const uploadUrl = await getPresignedPutUrl(key, contentType, 600);
  const video = await Video.create({
    module_id: moduleId,
    title: title || filename,
    s3_key: key,
    video_order: videoOrder || 0,
    duration_seconds: Math.round(duration),
    status: 'pending'
  });
  res.json({ uploadUrl, s3Key: key, videoId: video.id });
});

// confirm
router.post('/confirm', authMiddleware, role(['teacher']), async (req, res) => {
  const { videoId } = req.body;
  if (!videoId) return res.status(400).json({ error: 'Missing videoId' });
  const video = await Video.findByPk(videoId);
  if (!video) return res.status(404).json({ error: 'Not found' });
  try {
    await headObject(video.s3_key);
    video.status = 'available';
    await video.save();
    return res.json({ ok: true, videoId: video.id });
  } catch (err) {
    video.status = 'failed';
    await video.save();
    return res.status(400).json({ error: 'S3 object not found' });
  }
});

// get presigned get url
router.get('/:id/url', authMiddleware, async (req, res) => {
  const video = await Video.findByPk(req.params.id);
  if (!video || video.status !== 'available') return res.status(404).json({ error: 'Video not available' });
  const url = await getPresignedGetUrl(video.s3_key, 3600);
  res.json({ url });
});

module.exports = router;
