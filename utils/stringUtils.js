function appendTimestamp(input) {
    const timestamp = new Date().toISOString().replace(/[-:.T]/g, '').slice(0, 14);
    return `${input}_${timestamp}`;
  }
  
  module.exports = { appendTimestamp };
  