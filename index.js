import express from 'express';
import { Server } from 'socket.io';
import * as path from "path";
import cors from 'cors';

const app = express();
app.use(cors());
const server = app.listen(3000);
const socket = new Server(server);
const __dirname = path.resolve();
const rooms = ['room1', 'room2', 'room3', 'room4', 'room5'];
// for testing
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

socket.on('connection', (socket) => {
    const auth = socket.handshake.auth;
    if(auth.token) {
        // join room by token
        socket.join(auth.token);
    }
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// send message to all clients every 300 ms

setInterval(() => {
    const room = rooms[Math.floor(Math.random() * rooms.length)];
    socket.to(room).emit('message', {message: 'hello world', room});
}, 300);
