import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env
const nebiusUrl = process.env.NEBIUS_URL;
console.log(`Nebius URL: ${nebiusUrl}`);


/**
 * Queries the locally running Ollama server's chat endpoint with a given prompt.
 * @param {object} personOne - The first person in the conversation.
 * @param {object} personTwo - The second person in the conversation.
 * @param {object[]} messageHistory - The conversation history.
 * @returns {Promise<string>} - The assistant's response from the model.
 */
async function queryOllama(personOne, personTwo, messageHistory) {
    try {
        let currentUser = personOne.name;
        let state = "Start a conversation";
        console.log(messageHistory.length);
        if (messageHistory.length !== 0) {
            console.log("Business as usual");
            currentUser = messageHistory[messageHistory.length - 1].role;
            state = "Continue the conversation";
        }
        const updatedMessageHistory = replaceRoles(messageHistory);
        const systemPrompt = `You are ${currentUser}. You are having a conversation with ${!currentUser == personOne.name ? personTwo.name : personOne.name}. ${state} based on these personalities. Your response should be one sentence max. ${JSON.stringify(personOne)} and ${JSON.stringify(personTwo)}`;
        let messages = [
                {
                    "role": "system",
                    "content": systemPrompt
                },
            ];
        messages.push(...updatedMessageHistory);
        console.log(systemPrompt);

        const url = `${nebiusUrl}/api/chat`; // Local chat endpoint for Ollama

        const payload = {
            model: 'llama3.2',
            messages: messages,
            stream: false,
        };

        const response = await axios.post(url, payload, {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log(response.data.message)

        // console.log(response.data.message.content)

        return response.data.message.content;
    } catch (error) {
        console.error('Error querying Ollama chat endpoint:', error.message);
        throw new Error('Failed to get a response from Ollama');
    }
}

function replaceRoles(messageHistory) {
    return messageHistory.map(message => {
        if (message.role !== "assistant") {
            return { ...message, role: "user" };
        } else {
            return message;
        }
    });
}

export default queryOllama;
