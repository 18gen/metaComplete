import express from 'express';
import bodyParser from 'body-parser';
import queryOllama from './llama.js'; // Import the query function
import cors from 'cors';

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());
app.use(cors());

console.log(`HTTP REST API server running on http://0.0.0.0:${port}`);

// Endpoint to handle requests
app.post('/query', async (req, res) => {
    const { personOne, personTwo, messageHistory } = req.body;

    if (!personOne | !personTwo | !messageHistory ) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    try {
        const response = await queryOllama(personOne, personTwo, messageHistory); // Query the model
        console.log('Sent response');
        res.json({ response }); // Respond to the client with the result
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Unable to process your request' });
    }
});

// Start the server
app.listen(port, 'localhost', () => {
    console.log(`Server is listening on http://0.0.0.0:${port}`);
});
