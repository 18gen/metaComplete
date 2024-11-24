import axios from 'axios';
import { analyzeConversationTone}  from './helper.js';
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
export async function queryOllama(personOne, personTwo, messageHistory) {
    try {
        let currentUser = personOne.name;
        let state = "Start a conversation";
        console.log(messageHistory.length);
        if (messageHistory.length !== 0) {
            console.log("Business as usual");
            currentUser = messageHistory[messageHistory.length - 1].role == personOne.name ? personTwo.name : personOne.name;
            state = "Respond to this conversation";
        }
        const updatedMessageHistory = replaceRoles(messageHistory);
        const systemPrompt = `You are ${currentUser}. You are having a conversation with ${currentUser == personOne.name ? personTwo.name : personOne.name}. ${state} based on these personalities. ${JSON.stringify(personOne)} and ${JSON.stringify(personTwo)}. Your messages should be short, casual, and concise. You can include emojis as well. You should say at MAX one sentence. DO NOT MENTION the other person's name at the start or end of your response.`;
        let messages = [
                {
                    "role": "system",
                    "content": systemPrompt
                },
            ];
        if (messageHistory.length == 0) {
            messages.push({"role": "user", "content": "hi"});
        }
        messages.push(...updatedMessageHistory);
        console.log(systemPrompt);
        console.log(messages);

        const url = `${nebiusUrl}/api/chat`; // Local chat endpoint for Ollama

        const payload = {
            model: 'llama3.2',
            messages: messages,
            stream: false,
            options: {
                max_length: 100
            }
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

export async function generateSuggestions(personOne, personTwo, messageHistory) {
    const currentUser = messageHistory[messageHistory.length - 1].role == personOne.name ? personTwo.name : personOne.name;
    const tone = analyzeConversationTone(messageHistory);

    const suggestions = [];

    // Generate suggestions based on personality and conversation context
    suggestions.push({
            "type": tone,
            "content": await llamaSuggestion(tone, currentUser, messageHistory, personOne, personTwo)
    });

    // Ensure we have exactly 3 suggestions
    while (suggestions.length < 3) {
        suggestions.push(await llamaSuggestion(tone, currentUser, messageHistory, personOne, personTwo));
    }

    return suggestions.slice(0, 3); // Ensure exactly 3 suggestions
}

async function llamaSuggestion(tone, currentUser, messageHistory, personOne, personTwo) {
    try {
        const prompt = `You are ${currentUser}. You are having a conversation with ${currentUser == personOne.name ? personTwo.name : personOne.name}. Suggest a short message from yourself based on these personalities. ${JSON.stringify(personOne)} and ${JSON.stringify(personTwo)}. Your messages should be short, casual, and concise. You can include emojis as well. You should say at MAX one sentence. DO NOT MENTION the other person's name at the start or end of your response. The tone of the suggestion should be ${tone}.`;
        let messages = [
            {
                "role": "system",
                "content": prompt
            },
        ];
        const updatedMessageHistory = replaceRoles(messageHistory);
        messages.push(...updatedMessageHistory);
        const url = `${nebiusUrl}/api/chat`; // Local chat endpoint for Ollama

        const payload = {
            model: 'llama3.2',
            messages: messages,
            stream: false,
            options: {
                max_length: 100
            }
        };

        const response = await axios.post(url, payload, {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log(response.data.message)
        return response.data.message.content;
    } catch (error) {
        console.error('Error querying Ollama chat endpoint:', error.message);
        throw new Error('Failed to get a response from Ollama');
    }
}


export async function summarize(text) {
    const prompt = 'Summarize the following text into one concise sentence:\n\n' + text;

    try {
        let messages = [
            {
                "role": "system",
                "content": prompt
            },
        ];

        const url = `${nebiusUrl}/api/chat`; // Local chat endpoint for Ollama

        const payload = {
            model: 'llama3.2',
            messages: messages,
            stream: false,
            options: {
                max_length: 100
            }
        };

        const response = await axios.post(url, payload, {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log(response.data.message)
        return response.data.message.content;
    } catch (error) {
        console.error('Error querying Ollama chat endpoint for summarize:', error.message);
        throw new Error('Failed to get a response from Ollama');
    }
}

export default { queryOllama, generateSuggestions} ;
