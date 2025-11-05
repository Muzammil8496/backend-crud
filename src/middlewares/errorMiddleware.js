function handleError(res, message = 'Server Error', status = 500) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: message }));
}

module.exports = handleError;
