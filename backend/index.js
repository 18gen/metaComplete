// server.js
const WebSocket = require('ws');

// Create a WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket server is running on ws://localhost:8080');

wss.on('connection', (ws) => {
    console.log('New client connected');

    // Listen for messages from the client
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);

        // Echo the message back to the client
        ws.send(`Server received: ${message}`);
    });

    // Handle client disconnect
    ws.on('close', () => {
        console.log('Client disconnected');
    });

    // Optional: Send a welcome message on connection
    ws.send('Welcome to the WebSocket server!');
});
