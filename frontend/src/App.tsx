import { useState, useMemo } from 'react';
import './App.css';
import Menu from './components/Menu';
import Search from './components/Search';
import { Box } from '@mui/material';
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
  //logic
};

  return (
    <Box>
      <Menu />
      <Search onSearch={fetchSubredditSentiments} />
    </Box>
  );
}

export default App;