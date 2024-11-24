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

// Helper function to generate interesting topics for discussion
export function generateInterestingReply(personOne, personTwo, messageHistory) {
    const lastMessage = messageHistory[messageHistory.length - 1];
    const personSpeaking = lastMessage.role === personOne.name ? personOne : personTwo;
    const personListening = lastMessage.role === personOne.name ? personTwo : personOne;

    const topics = [
        `If you could solve one problem in ${personListening.interests.split(',')[0]}, what would it be?`,
        `I wonder how your work in ${personListening.job} aligns with futuristic ideas like ${personSpeaking.interests.split(',')[1]}.`,
        `What’s one unconventional idea you’ve always wanted to explore in ${personListening.job}?`,
        `If you could collaborate on ${personSpeaking.interests.split(',')[0]} together, what would your first step be?`,
        `Let’s think big! How could ${personSpeaking.personality.summary.toLowerCase()} and ${personListening.personality.summary.toLowerCase()} combine for an innovative project?`
    ];

    // Ensure replies are varied and interesting
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    return {
        response: randomTopic,
        context: {
            generatedFor: personListening.name,
            lastMessageContent: lastMessage.content
        }
    };
}

//function to provide suggestion responses based on people personailty and message history
// Helper function to analyze personality compatibility
export function analyzePersonalityCompatibility(personOne, personTwo) {
    const compatibility = {
        energyMatch: personOne.personality.energyStyle === personTwo.personality.energyStyle,
        cognitiveMatch: personOne.personality.cognitiveStyle === personTwo.personality.cognitiveStyle,
        valuesMatch: personOne.personality.valuesStyle === personTwo.personality.valuesStyle,
        lifeStyleMatch: personOne.personality.lifeStyle === personTwo.personality.lifeStyle
    };
    return compatibility;
}

export function calculateCompatibilityScore(score1, score2, personalityScore) {
    if (score1 === 0 && score2 === 0) return 50;

    // More aggressive normalization of sentiment scores
    const normalizedScore1 = score1 / 3; // Reduced from 5 to make scores more extreme
    const normalizedScore2 = score2 / 3;

    // Calculate interaction score with higher weight on negative interactions
    const interactionScore = ((normalizedScore1 + normalizedScore2) / 2) * 25 + 50;

    // Reduce weight of personality score
    const weightedPersonalityScore = personalityScore * 0.2; // 20% weight
    const weightedInteractionScore = interactionScore * 0.8; // 80% weight

    let finalScore = Math.round(weightedInteractionScore + weightedPersonalityScore);

    // Additional penalties for negative interactions
    if (normalizedScore1 < 0 && normalizedScore2 < 0) {
        finalScore = Math.min(finalScore, 45); // Cap at 45 if both negative
    }

    if (Math.abs(normalizedScore1 - normalizedScore2) > 1) {
        finalScore -= 10; // Penalty for large sentiment disparities
    }

    return Math.max(0, Math.min(100, finalScore));
}

export function generateCompatibilityAnalysis(score1, score2, personalityScore) {
    const avgScore = (score1 + score2) / 2;

    if (avgScore < -2) return "Significant communication challenges and conflicting approaches";
    if (avgScore < -1) return "Notable differences in priorities and communication styles";
    if (avgScore < 0) return "Some misalignment in goals and perspectives";
    if (avgScore < 1) return "Neutral interaction with potential compatibility challenges";
    if (avgScore < 2) return "Generally positive communication despite differences";
    return "Very positive interaction pattern";
}

export function calculatePersonalityCompatibility(personality1, personality2) {
    let score = 100;

    if (personality1.energyStyle !== personality2.energyStyle) score -= 10;
    if (personality1.valuesStyle !== personality2.valuesStyle) score -= 10;
    if (personality1.lifeStyle !== personality2.lifeStyle) score -= 10;

    return score;
}

export function match(personOne, personTwo, messageHistory) {
    try {
        const sentiment = new Sentiment();

        const personOneName = typeof personOne === 'string' ? personOne : personOne.name;
        const personTwoName = typeof personTwo === 'string' ? personTwo : personTwo.name;

        const personOneMessages = messageHistory.filter(msg => msg.role === personOneName);
        const personTwoMessages = messageHistory.filter(msg => msg.role === personTwoName);

        // Enhanced negative patterns detection
        const negativePatterns = [
            'waste', 'vanity', 'doesn\'t align', 'doesn\'t contribute',
            'isn\'t productive', 'rather', 'prefer', 'just', 'eventually',
            'undervaluing', 'abstract', 'tangible'
        ];

        const dismissivePatterns = [
            'why would you', 'waste time', 'intellectual vanity',
            'just', 'rather', 'prefer'
        ];

        // Calculate sentiment scores with increased weights for negative patterns
        const personOneAnalysis = personOneMessages.map(msg => {
            const analysis = sentiment.analyze(msg.content);
            const content = msg.content.toLowerCase();

            // Count negative patterns
            const negativeCount = negativePatterns.filter(pattern =>
                content.includes(pattern.toLowerCase())).length;

            // Count dismissive patterns
            const dismissiveCount = dismissivePatterns.filter(pattern =>
                content.includes(pattern.toLowerCase())).length;

            // Apply heavy penalties for negative and dismissive language
            analysis.score -= (negativeCount * 2 + dismissiveCount * 3);

            return analysis;
        });

        const personTwoAnalysis = personTwoMessages.map(msg => {
            const analysis = sentiment.analyze(msg.content);
            const content = msg.content.toLowerCase();

            const negativeCount = negativePatterns.filter(pattern =>
                content.includes(pattern.toLowerCase())).length;
            const dismissiveCount = dismissivePatterns.filter(pattern =>
                content.includes(pattern.toLowerCase())).length;

            analysis.score -= (negativeCount * 2 + dismissiveCount * 3);

            return analysis;
        });

        const personOneAvgScore = personOneAnalysis.length > 0
            ? personOneAnalysis.reduce((acc, curr) => acc + curr.score, 0) / personOneAnalysis.length
            : 0;

        const personTwoAvgScore = personTwoAnalysis.length > 0
            ? personTwoAnalysis.reduce((acc, curr) => acc + curr.score, 0) / personTwoAnalysis.length
            : 0;

        // Calculate personality compatibility with reduced weight
        const personalityScore = calculatePersonalityCompatibility(personOne.personality, personTwo.personality);

        const analysisResults = {
            personOne: {
                name: personOne,
                averageSentiment: personOneAvgScore,
                messageCount: personOneMessages.length,
                detailedAnalysis: personOneAnalysis
            },
            personTwo: {
                name: personTwo,
                averageSentiment: personTwoAvgScore,
                messageCount: personTwoMessages.length,
                detailedAnalysis: personTwoAnalysis
            },
            compatibility: {
                score: calculateCompatibilityScore(personOneAvgScore, personTwoAvgScore, personalityScore),
                analysis: generateCompatibilityAnalysis(personOneAvgScore, personTwoAvgScore, personalityScore),
                rawScores: {
                    personOne: personOneAvgScore,
                    personTwo: personTwoAvgScore,
                    personalityCompatibility: personalityScore
                }
            }
        };

        return analysisResults;
    } catch (error) {
        console.error('Error:', error);
    }
}

export default { analyzeConversationTone, generateInterestingReply, analyzePersonalityCompatibility, calculateCompatibilityScore, generateCompatibilityAnalysis, calculatePersonalityCompatibility, match };