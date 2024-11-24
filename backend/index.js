import express from 'express';
import bodyParser from 'body-parser';
import queryOllama from './llama.js';
import cors from 'cors';
import Sentiment from 'sentiment';

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

        res.json(analysisResults);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Unable to process sentiment analysis', 
            details: error.message
        });
    }
});

function calculatePersonalityCompatibility(personality1, personality2) {
    let score = 100;
    
    if (personality1.energyStyle !== personality2.energyStyle) score -= 10;
    if (personality1.valuesStyle !== personality2.valuesStyle) score -= 10;
    if (personality1.lifeStyle !== personality2.lifeStyle) score -= 10;
    
    return score;
}

function calculateCompatibilityScore(score1, score2, personalityScore) {
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

function generateCompatibilityAnalysis(score1, score2, personalityScore) {
    const avgScore = (score1 + score2) / 2;
    
    if (avgScore < -2) return "Significant communication challenges and conflicting approaches";
    if (avgScore < -1) return "Notable differences in priorities and communication styles";
    if (avgScore < 0) return "Some misalignment in goals and perspectives";
    if (avgScore < 1) return "Neutral interaction with potential compatibility challenges";
    if (avgScore < 2) return "Generally positive communication despite differences";
    return "Very positive interaction pattern";
}

















//function to provide suggestion responses based on people personailty and message history
// Helper function to analyze personality compatibility
function analyzePersonalityCompatibility(personOne, personTwo) {
    const compatibility = {
        energyMatch: personOne.personality.energyStyle === personTwo.personality.energyStyle,
        cognitiveMatch: personOne.personality.cognitiveStyle === personTwo.personality.cognitiveStyle,
        valuesMatch: personOne.personality.valuesStyle === personTwo.personality.valuesStyle,
        lifeStyleMatch: personOne.personality.lifeStyle === personTwo.personality.lifeStyle
    };
    return compatibility;
}

// Helper function to analyze conversation tone
function analyzeConversationTone(messageHistory) {
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

// Helper function to generate suggestions based on personality and context
function generateSuggestions(personOne, personTwo, messageHistory) {
    const lastMessage = messageHistory[messageHistory.length - 1];
    const compatibility = analyzePersonalityCompatibility(personOne, personTwo);
    const tone = analyzeConversationTone(messageHistory);
    
    const suggestions = [];
    
    // Generate suggestions based on personality and conversation context
    if (lastMessage.role === personTwo.name) {
        // Responding as personOne
        if (tone.isPositive) {
            suggestions.push({
                type: "enthusiastic",
                content: `I appreciate your perspective on ${personTwo.interests.split(',')[0]}. Let's explore how it connects with ${personOne.interests.split(',')[0]}.`
            });
        }
        
        // Add suggestion based on personality traits
        if (!compatibility.cognitiveMatch) {
            suggestions.push({
                type: "bridge_differences",
                content: `While I tend to focus on ${personOne.personality.cognitiveStyle} aspects, I'm curious about your ${personTwo.personality.cognitiveStyle} approach to this topic.`
            });
        }
        
        // Add suggestion based on shared interests
        suggestions.push({
            type: "common_ground",
            content: `Your background in ${personTwo.job} offers an interesting perspective on how ${personOne.interests.split(',')[0]} might impact society.`
        });
    }
    
    // Ensure we have exactly 3 suggestions
    while (suggestions.length < 3) {
        suggestions.push({
            type: "generic",
            content: `I'd like to hear more about your thoughts on how ${personOne.interests.split(',')[0]} could benefit from your expertise in ${personTwo.job}.`
        });
    }
    
    return suggestions.slice(0, 3); // Ensure exactly 3 suggestions
}

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
        const suggestions = generateSuggestions(personOne, personTwo, messageHistory);
        
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















app.listen(port, 'localhost', () => {
    console.log(`Server is listening on http://0.0.0.0:${port}`);
});
