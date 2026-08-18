export interface PostSentiment {
  id: string;
  title: string;
  score: number; // e.g., raw score from sentiment library
  comparative: number; // score normalized by word count
  voteCount: number;
}

export interface SentimentSummary {
  overallScore: number;
  label: 'positive' | 'negative' | 'neutral';
  posts: PostSentiment[];
}