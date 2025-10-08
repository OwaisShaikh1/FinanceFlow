console.log('Starting simple HTTP server...');

const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  
  if (req.url === '/test') {
    res.end(JSON.stringify({ message: 'Simple server works!', timestamp: new Date().toISOString() }));
  } else if (req.url === '/api/reports/balance-sheet/test') {
    res.end(JSON.stringify({ message: 'Balance Sheet endpoint works!', timestamp: new Date().toISOString() }));
  } else {
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(3001, () => {
  console.log('🚀 Simple server running on http://localhost:3001');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});