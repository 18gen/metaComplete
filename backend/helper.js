import Sentiment from 'sentiment';

// Helper function to analyze conversation tone
export function analyzeConversationTone(messageHistory) {
    const sentiment = new Sentiment();
    const lastMessages = messageHistory.slice(-3); // Get last 3 messages
    const toneAnalysis = lastMessages.map(msg => sentiment.analyze(msg.content));

    const averageScore = toneAnalysis.reduce((acc, curr) => acc + curr.score, 0) / toneAnalysis.length;
    return {
        overall: averageScore,
        isPositive: averageScore > 0,
        isNeutral: averageScore === 0,
        isNegative: averageScore < 0
    };
}

export default analyzeConversationTone;