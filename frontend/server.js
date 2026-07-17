const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5173;

const server = http.createServer((req, res) => {
  // Serve index.html for all routes
  const filePath = req.url === '/' ? '/index.html' : req.url;
  const fullPath = path.join(__dirname, filePath);

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      // Return 404 for missing files except root, which gets index.html
      if (req.url === '/' || req.url === '') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        });
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
    } else {
      const contentType = filePath.endsWith('.css') ? 'text/css' :
                         filePath.endsWith('.js') ? 'application/javascript' :
                         'text/html';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`✅ Frontend server running on http://localhost:${PORT}`);
});
