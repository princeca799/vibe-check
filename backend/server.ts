import express, { Request, Response } from 'express';
import cors from 'cors';
import Sentiment from 'sentiment';

const app = express();
const PORT = process.env.PORT || 3001;
const sentiment = new Sentiment();

app.use(cors());
app.use(express.json());

// ---------------------------------------------------------
// Types & Interfaces
// ---------------------------------------------------------
export interface PostSentiment {
    id: string;
    title: string;
    score: number;
    comparative: number;
    voteCount: number;
}

// ---------------------------------------------------------
// Reddit OAuth Configuration
// Replace with environment variables or your actual credentials
// ---------------------------------------------------------
const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID || '';
const REDDIT_CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET || '';
const USER_AGENT = process.env.REDDIT_USER_AGENT || 'web:vibe-check-app:v1.0.0 (by /u/YOUR_REDDIT_USERNAME)';

let cachedToken: string | null = null;
let tokenExpirationTime = 0;

/**
 * Retrieves a cached OAuth token or requests a new one from Reddit.
 */
async function getRedditAccessToken(): Promise<string> {
    const now = Date.now();

    // Return cached token if valid (with 60s buffer)
    if (cachedToken && now < tokenExpirationTime - 60000) {
        return cachedToken;
    }

    const authHeader = Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString('base64');

    const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': USER_AGENT,
        },
        body: 'grant_type=client_credentials',
    });

    if (!tokenResponse.ok) {
        throw new Error(`Failed to obtain access token: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    cachedToken = tokenData.access_token;
    tokenExpirationTime = Date.now() + tokenData.expires_in * 1000;

    return cachedToken as string;
}

// ---------------------------------------------------------
// Mock Data Generator (50 Posts Fallback)
// ---------------------------------------------------------
const sampleTopics = [
    'React 19 release looks promising for web performance!',
    'Why is debugging async code in JavaScript still so annoying?',
    'This new framework fixed all my state management issues.',
    'I hate when libraries make breaking changes without clear docs.',
    'TypeScript error messages are getting way too complex to read.',
    'Amazing open-source tools every developer should check out today.',
    'Terrible experience with deployment tools this morning.',
    'Is anyone else super excited about new web features coming out?',
    'Unpopular opinion: standard CSS is better than utility frameworks.',
    'Frustrated with performance slowdowns after the latest update.'
];

function generateMockPosts(subreddit: string): PostSentiment[] {
    return Array.from({ length: 50 }, (_, index) => {
        const baseTitle = sampleTopics[index % sampleTopics.length];
        const title = `[${subreddit}] Post #${index + 1}: ${baseTitle}`;
        const analysis = sentiment.analyze(title);

        return {
            id: `mock_${index + 1}`,
            title,
            score: analysis.score,
            comparative: Number(analysis.comparative.toFixed(2)),
            voteCount: Math.floor(Math.random() * 5000) + 10,
        };
    });
}

// ---------------------------------------------------------
// Route Handler
// ---------------------------------------------------------
app.get('/api/subreddit/:subreddit', async (req: Request, res: Response) => {
    const subreddit = req.params.subreddit as string;
    const useReal = req.query.useReal !== 'true'; // defaults to true unless explicitly disabled

    // Return mock data directly if useReal=false query parameter is passed
    if (!useReal) {
        console.log(`[Mock Mode] Returning 50 generated posts for r/${subreddit}`);
        return res.json({ posts: generateMockPosts(subreddit) });
    }

    try {
        console.log(`Fetching r/${subreddit} from oauth.reddit.com...`);
        const token = await getRedditAccessToken();

        const response = await fetch(`https://oauth.reddit.com/r/${subreddit}/hot.json?limit=50`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'User-Agent': USER_AGENT,
            },
        });

        if (!response.ok) {
            throw new Error(`Reddit API returned HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!data?.data?.children) {
            throw new Error('Invalid response structure or empty subreddit.');
        }

        const posts: PostSentiment[] = data.data.children.map((child: any) => {
            const title = child.data.title;
            const analysis = sentiment.analyze(title);

            return {
                id: child.data.id,
                title,
                score: analysis.score,
                comparative: Number(analysis.comparative.toFixed(2)),
                voteCount: child.data.ups,
            };
        });

        return res.json({ posts });
    } catch (error) {
        console.warn(`OAuth fetch failed for r/${subreddit}. Falling back to mock data. Error:`, error);
        return res.json({ posts: generateMockPosts(subreddit) });
    }
});

// ---------------------------------------------------------
// Server Start
// ---------------------------------------------------------
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});