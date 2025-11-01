function errorHandler(err, req, res, next) {
  console.error(err);
  const payload = { error: 'internal_server_error' };
  if (process.env.NODE_ENV !== 'production') payload.detail = err.message;
  res.status(500).json(payload);
}

module.exports = { errorHandler };
