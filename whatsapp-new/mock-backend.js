const http = require('http');
const { Server } = require('socket.io');

const httpServer = http.createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

io.on('connection', (socket) => {
    console.log('Bot connected to mock backend');

    socket.on('start_tracking', (data) => {
        console.log('Bot requested tracking for:', data.userPhone);

        // Simulate a location update after 2 seconds
        setTimeout(() => {
            console.log('Sending mock location update...');
            socket.emit('location_update', {
                lat: 12.9716,
                lng: 77.5946,
                userPhone: data.userPhone
            });
        }, 2000);

        // Simulate arrival after 5 seconds
        setTimeout(() => {
            console.log('Sending arrival ping...');
            socket.emit('arrival_ping', {
                locationName: 'Indiranagar Metro Station',
                userPhone: data.userPhone,
                type: 'here'
            });
        }, 5000);
    });
});

const PORT = 4000;
httpServer.listen(PORT, () => {
    console.log(`Mock Tracking Backend running on port ${PORT}`);
});
