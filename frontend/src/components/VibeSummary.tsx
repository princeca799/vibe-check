import { Box, Card, CardContent, Typography, Chip, Grid } from '@mui/material';
import MoodIcon from '@mui/icons-material/Mood';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

interface VibeSummaryProps {
  summary: {
    overallScore: number;
    label: 'positive' | 'negative' | 'neutral';
    posts: Array<{ score: number }>;
  };
}

export default function VibeSummary({ summary }: VibeSummaryProps) {
  const { overallScore, label, posts } = summary;

  const positiveCount = posts.filter((p) => p.score > 0).length;
  const neutralCount = posts.filter((p) => p.score === 0).length;
  const negativeCount = posts.filter((p) => p.score < 0).length;

  const getVibeColor = () => {
    if (label === 'positive') return 'success';
    if (label === 'negative') return 'error';
    return 'default';
  };

  return (
    <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Community Vibe Overview
        </Typography>

        <Grid container spacing={3} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {overallScore > 0 ? `+${overallScore}` : overallScore}
              </Typography>
              <Chip
                label={label.toUpperCase()}
                color={getVibeColor()}
                sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              Average Sentiment Score
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 8 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
              <Box sx={{ textAlign: 'center' }}>
                <MoodIcon color="success" sx={{ fontSize: 32 }} />
                <Typography variant="h6">{positiveCount}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Positive
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <SentimentNeutralIcon color="action" sx={{ fontSize: 32 }} />
                <Typography variant="h6">{neutralCount}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Neutral
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <SentimentDissatisfiedIcon color="error" sx={{ fontSize: 32 }} />
                <Typography variant="h6">{negativeCount}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Negative
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}