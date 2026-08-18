import { useState, useMemo } from 'react';
import './App.css';
import Menu from './components/Menu';
import Search from './components/Search';
import VibeSummary from './components/VibeSummary';
import SentimentChart from './components/SentimentChart';
import { Box, Container, CircularProgress } from '@mui/material';
import { type PostSentiment, type SentimentSummary } from './types';

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<PostSentiment[]>([]);

  // Derived state: automatically recalculates whenever `posts` changes
  const sentimentSummary = useMemo<SentimentSummary>(() => {
    if (posts.length === 0) {
      return { overallScore: 0, label: 'neutral', posts: [] };
    }

    const totalScore = posts.reduce((sum, post) => sum + post.score, 0);
    const averageScore = totalScore / posts.length;

    let label: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (averageScore > 0.05) label = 'positive';
    else if (averageScore < -0.05) label = 'negative';

    return {
      overallScore: Number(averageScore.toFixed(2)),
      label,
      posts,
    };
  }, [posts]);

  const fetchSubredditSentiments = async (subreddit: string) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/subreddit/${subreddit}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data from backend server.');
      }

      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Menu />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Search onSearch={fetchSubredditSentiments} loading={loading} />

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && posts.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <VibeSummary summary={sentimentSummary} />
            <SentimentChart posts={posts} />
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default App;