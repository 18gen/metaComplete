import WebSocket, { WebSocketServer } from 'ws';
import queryOllama from './llama.js'; // Import the query function

const wss = new WebSocketServer({ port: 8080 });

console.log('WebSocket server running on ws://localhost:8080');

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', async (message) => {
        console.log(`Received message: ${message}`);

        try {
            const response = await queryOllama(message.toString());
            ws.send(response); // Send response back to the client
        } catch (error) {
            console.error('Error:', error.message);
            ws.send('Error: Unable to process your request');
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
