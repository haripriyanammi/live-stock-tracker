import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';

// Create express app and HTTP server
const app = express();
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server);

// SERVE STATIC FILES from public directory (correct path)
app.use(express.static(path.join(__dirname, '../public'))); // <- FIXED HERE

// Default route (optional, serves index.html)
app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('new number', (num: number) => {
    console.log(`Received number: ${num}`);

    let status = '';
    if (num > 1) status = 'rise';
    else if (num < 1) status = 'fall';
    else status = 'stable';

    socket.emit('numberResult', {
      number: num,
      status,
      message: `Stock is ${status === 'rise' ? 'rising' : status === 'down' ? 'falling' : 'stable'}`,
    });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
