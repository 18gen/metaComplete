import express from 'express';
import bodyParser from 'body-parser';
import { queryOllama, generateSuggestions, summarize } from './llama.js';
import {generateInterestingReply, match} from './helper.js';
import cors from 'cors';

import axios from 'axios'; // For HTTP requests
import * as cheerio from 'cheerio';// For HTML parsing

import puppeteer from 'puppeteer';


const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

// Your cookie string
const LINKEDIN_COOKIE = 'AQEDAT4P3I8CXr_-AAABk17H1iQAAAGTgtRaJFYAvpHK4n-tZjsCKsGip358tcBCLKQl_2U-xt2aDuBQf9oDc1mqULwDAMDOCb6hD50jmg4vElGpuW_vw5_254nfKIs6cfEfJg8mMJ2zH8jJ_aRwZWJQ';

if (!LINKEDIN_COOKIE) {
    console.error('Error: LINKEDIN_COOKIE is not set in the environment variables.');
    process.exit(1);
}

// Utility function to introduce delays
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Scraper Endpoint using Puppeteer
app.post('/scrape', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ 
            error: 'Missing URL parameter',
            required: ['url']
        });
    }

    try {
        // Validate URL format
        new URL(url);

        // Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: true, // Set to false to see the browser actions
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        // Rotate User-Agent
        const userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
        ];

        const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
        await page.setUserAgent(randomUserAgent);

        // Set cookies
        await page.setCookie({
            name: 'li_at', // Assuming 'li_at' is the relevant LinkedIn session cookie
            value: LINKEDIN_COOKIE,
            domain: 'www.linkedin.com',
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'Lax',
        });

        // Optional: Set viewport and other page settings
        await page.setViewport({ width: 1280, height: 800 });

        // Navigate to the URL
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Optional: Wait for specific selectors to ensure the page has loaded
        // For example, wait for the main content to load
        // await page.waitForSelector('main');

        // Introduce random delay to mimic human behavior
        const randomDelay = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000; // 2-5 seconds
        await delay(randomDelay);

        // Get page content
        const content = await page.content();

        // Close the browser
        await browser.close();

        // Load the HTML content into cheerio
        const $ = cheerio.load(content);

        // Remove script, style, and noscript tags
        $('script, style, noscript').remove();

        // Extract text content from relevant tags
        const textContent = $('article, main, body')
            .find('p, h1, h2, h3, h4, h5, h6')
            .map((_, element) => $(element).text().trim())
            .get()
            .filter(text => text.length > 0)
            .join('\n');

        // Extract metadata
        const metadata = {
            title: $('title').text() || $('h1').first().text() || '',
            description: $('meta[name="description"]').attr('content') || '',
            url: url,
            dateScraped: new Date().toISOString()
        };

        console.log('Extracted Text Length:', textContent.length);

        // Check if there's sufficient content to summarize
        if (textContent.length < 50) { // Adjust threshold as needed
            return res.status(400).json({
                error: 'Insufficient content to summarize',
                details: 'The extracted text is too short to generate a meaningful summary.'
            });
        }

        // Summarize the content using your AI model
        const summary = await summarize(textContent);

        // Return the results
        res.json({
            success: true,
            metadata,
            summary,
            textLength: textContent.length,
            originalText: textContent.substring(0, 3000) + (textContent.length > 1000 ? '...' : '')
        });

    } catch (error) {
        console.error('Scraping error:', error);

        // Enhanced logging
        console.error('Error Details:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            response: error.response ? {
                status: error.response.status,
                headers: error.response.headers,
                data: error.response.data
            } : null
        });

        // Handle specific types of errors
        if (error.message.includes('Timeout')) {
            return res.status(504).json({
                error: 'Timeout',
                details: 'The request took too long to complete'
            });
        }

        res.status(500).json({
            error: 'Failed to scrape and summarize content',
            details: error.message
        });
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
