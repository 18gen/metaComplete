import express from 'express';
import bodyParser from 'body-parser';
import { queryOllama, generateSuggestions } from './llama.js';
import {generateInterestingReply, match} from './helper.js';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

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

app.post('/match', async (req, res) => {
    const { personOne, personTwo, messageHistory } = req.body;

    if (!personOne || !personTwo || !messageHistory) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    try {
        res.json(await match(personOne, personTwo, messageHistory));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Unable to process sentiment analysis', 
            details: error.message
        });
    }
});

// Suggestions endpoint
app.post('/suggestions', async (req, res) => {
    const { personOne, personTwo, messageHistory } = req.body;
    
    if (!personOne || !personTwo || !messageHistory) {
        return res.status(400).json({ 
            error: 'Missing required parameters',
            required: ['personOne', 'personTwo', 'messageHistory']
        });
    }
    
    try {
        const suggestions = await generateSuggestions(personOne, personTwo, messageHistory);
        console.log(suggestions);
        res.json({
            suggestions,
            metadata: {
                basedOn: {
                    lastMessage: messageHistory[messageHistory.length - 1],
                    personality: personOne.personality.summary,
                    interests: personOne.interests
                }
            }
        });
    } catch (error) {
        console.error('Error generating suggestions:', error);
        res.status(500).json({ 
            error: 'Failed to generate suggestions',
            details: error.message 
        });
    }
});

// Endpoint to generate a reply to keep the conversation fun and engaging
app.post('/topic', async (req, res) => {
    const { personOne, personTwo, messageHistory } = req.body;

    if (!personOne || !personTwo || !messageHistory) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }
    try {
        const reply = generateInterestingReply(personOne, personTwo, messageHistory);
        res.json({
            topicReply: reply.response,
            metadata: reply.context
        });
    } catch (error) {
        console.error('Error generating topic:', error);
        res.status(500).json({ 
            error: 'Failed to generate topic reply', 
            details: error.message 
        });
    }
});

app.listen(port, 'localhost', () => {
    console.log(`Server is listening on http://0.0.0.0:${port}`);
});
