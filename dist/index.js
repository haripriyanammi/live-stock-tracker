"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('newNumber', (num) => {
        console.log(`Received number: ${num}`);
        // Here you can handle the received number, e.g., store it or process it
        let status = '';
        if (num > 1) {
            status = 'rise';
        }
        else if (num < 1) {
            status = 'down';
        }
        else {
            status = 'stable';
        }
        socket.emit('numberResult', {
            number: num,
            status: status
            // message:'stock is ${status==='rise' ? 'increasing' : status==='down' ? 'decreasing' : 'stable'}'
        });
    });
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
