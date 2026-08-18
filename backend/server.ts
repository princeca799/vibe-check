import express, { Request, Response } from 'express';
import cors from 'cors';
import Sentiment from 'sentiment';

const app = express();
const PORT = 3001;
const sentiment = new Sentiment();

app.use(cors());
app.use(express.json());

// Interface definitions
export interface PostSentiment {
    id: string;
    title: string;
    score: number;
    comparative: number;
    voteCount: number;
}

// ---------------------------------------------------------
// Mock Data Generator (50 Posts)
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
// API Endpoint
// ---------------------------------------------------------
app.get('/api/subreddit/:subreddit', async (req: Request, res: Response) => {
    const subreddit = req.params.subreddit as string;
    const useReal = req.query.useReal === 'true';

    // Return mock data by default or if real fetch fails
    if (!useReal) {
        console.log(`Returning 50 mock posts for r/${subreddit}`);
        return res.json({ posts: generateMockPosts(subreddit) });
    }

    try {
        console.log(`Fetching real data for r/${subreddit} from Reddit API...`);
        const response = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=50`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SentimentApp/1.0.0',
            },
        });

        if (!response.ok) {
            throw new Error(`Reddit API returned status ${response.status}`);
        }

        const data = await response.json();

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
        console.warn(`Failed to fetch real data from Reddit. Falling back to mock data. Error:`, error);
        return res.json({ posts: generateMockPosts(subreddit) });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});