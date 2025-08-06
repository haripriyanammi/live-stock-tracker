    import express from 'express';
    import http from 'http';
    import { Server, Socket } from 'socket.io';
    import path from 'path';
     const app= express();
     const server=http.createServer(app);
        const io = new Server(server);

        app.use(express.static(path.join(__dirname, 'public')));

    io.on('connection',(socket) => {
    console.log('A user connected');
    
socket.on('newNumber',(num:number)=> {
        console.log(`Received number: ${num}`);
        // Here you can handle the received number, e.g., store it or process it
    let status='';
        if(num>1)
        {
        status='rise';
        }
        else if(num<1)
        {
            status='down';
        }
            else
        {
           status='stable';
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
