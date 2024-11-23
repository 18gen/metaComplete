import ollama from 'ollama';

/**
 * Queries the Ollama server with a given prompt.
 * @param {string} content - The user's prompt/message.
 * @returns {Promise<string>} - The assistant's response from the model.
 */
async function queryOllama(content) {
    try {
        console.log('Querying Ollama with:', content);
        console.log('type of content:', typeof content);
        const response = await ollama.chat({
            model: 'llama3.2',
            messages: [{ role: 'user', content: content }],
        });
        return response.message.content;
    } catch (error) {
        console.error('Error querying Ollama:', error.message);
        throw new Error('Failed to get a response from Ollama');
    }
}

export default queryOllama;
