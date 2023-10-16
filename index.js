const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hola, mundo!\n');
});

server.listen(3000, 'localhost', () => {
  console.log('Servidor está disponible en http://localhost:3000/');
});