const http = require('http');
const fs = require('fs');
const url = require('url');

let invalidRequestCount = 0;

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  if (pathname === '/signup') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const { name, gender, age } = JSON.parse(body);
        if (!name || !gender || !age) {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Invalid input. Please provide name, gender, and age.');
          return;
        }

        fs.readFile('users.txt', 'utf8', (err, data) => {
          if (err && err.code !== 'ENOENT') {
            console.error('Error reading file:', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
          }

          const users = err ? [] : JSON.parse(data);
          users.push({ name, gender, age });
          fs.writeFile('users.txt', JSON.stringify(users), (err) => {
            if (err) {
              console.error('Error writing file:', err);
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Internal Server Error');
              return;
            }
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('User added successfully.');
          });
        });
      });
    } else if (req.method === 'GET') {
      invalidRequestCount++;
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`Invalid request method - ${invalidRequestCount}`);
    } else {
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('Method Not Allowed');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server started on port 3000');
});

