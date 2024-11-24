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
        
        // Get person names
        const personOneName = typeof personOne === 'string' ? personOne : personOne.name;
        const personTwoName = typeof personTwo === 'string' ? personTwo : personTwo.name;

        // Filter messages for each person using role
        const personOneMessages = messageHistory.filter(msg => msg.role === personOneName);
        const personTwoMessages = messageHistory.filter(msg => msg.role === personTwoName);

        // Calculate sentiment scores with additional weights for disagreements
        const personOneAnalysis = personOneMessages.map(msg => {
            const analysis = sentiment.analyze(msg.content);
            // Add extra negative weight for dismissive or confrontational words
            if (msg.content.toLowerCase().includes('waste of time') || 
                msg.content.toLowerCase().includes('pointless') ||
                msg.content.toLowerCase().includes('abstract')) {
                analysis.score -= 2;
            }
            return analysis;
        });
            
        const personTwoAnalysis = personTwoMessages.map(msg => {
            const analysis = sentiment.analyze(msg.content);
            // Add extra negative weight for defensive or confrontational responses
            if (msg.content.toLowerCase().includes('narrow perspective') || 
                msg.content.toLowerCase().includes('doesn\'t align')) {
                analysis.score -= 2;
            }
            return analysis;
        });

        // Calculate average sentiment scores
        const personOneAvgScore = personOneAnalysis.length > 0
            ? personOneAnalysis.reduce((acc, curr) => acc + curr.score, 0) / personOneAnalysis.length
            : 0;
            
        const personTwoAvgScore = personTwoAnalysis.length > 0
            ? personTwoAnalysis.reduce((acc, curr) => acc + curr.score, 0) / personTwoAnalysis.length
            : 0;

        // Calculate personality compatibility score
        const personalityScore = calculatePersonalityCompatibility(personOne.personality, personTwo.personality);

        const analysisResults = {
            personOne: {
                name: personOne,
                averageSentiment: personOneAvgScore || 0,
                messageCount: personOneMessages.length,
                detailedAnalysis: personOneAnalysis
            },
            personTwo: {
                name: personTwo,
                averageSentiment: personTwoAvgScore || 0,
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
    
    // Reduce score for mismatches in personality traits
    if (personality1.energyStyle !== personality2.energyStyle) score -= 15;
    if (personality1.valuesStyle !== personality2.valuesStyle) score -= 20;
    if (personality1.lifeStyle !== personality2.lifeStyle) score -= 15;
    
    return score;
}

function calculateCompatibilityScore(score1, score2, personalityScore) {
    if (score1 === 0 && score2 === 0) return 50;

    // Normalize sentiment scores to -1 to 1 range
    const normalizedScore1 = score1 / 5;
    const normalizedScore2 = score2 / 5;
    
    // Calculate interaction score (0-100)
    const interactionScore = ((normalizedScore1 + normalizedScore2) / 2 + 1) * 40; // Max 80
    
    // Weighted average of interaction and personality scores
    const finalScore = Math.round((interactionScore * 0.6 + personalityScore * 0.4));
    
    // For significantly negative interactions, ensure score stays below 50
    if (normalizedScore1 < -0.3 && normalizedScore2 < -0.3) {
        return Math.min(finalScore, 45);
    }
    
    return Math.max(0, Math.min(100, finalScore));
}

function generateCompatibilityAnalysis(score1, score2, personalityScore) {
    const avgScore = (score1 + score2) / 2;
    
    if (score1 === 0 && score2 === 0) return "No messages to analyze";
    if (avgScore < -2) return "Significant communication challenges and conflicting viewpoints";
    if (avgScore < -1) return "Notable differences in communication styles and perspectives";
    if (avgScore < 0) return "Some misalignment in communication and approaches";
    if (avgScore < 1) return "Neutral communication pattern with potential for improvement";
    if (avgScore < 2) return "Generally positive communication despite differences";
    return "Very positive interaction pattern";
}

app.listen(port, 'localhost', () => {
    console.log(`Server is listening on http://0.0.0.0:${port}`);
});
