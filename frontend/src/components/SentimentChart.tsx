import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';

interface SentimentChartProps {
  posts: Array<{
    id: string;
    title: string;
    score: number;
  }>;
}

export default function SentimentChart({ posts }: SentimentChartProps) {
  const chartData = posts.map((post, index) => ({
    name: `Post ${index + 1}`,
    score: post.score,
    title: post.title,
  }));

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Post Sentiment Breakdown
        </Typography>

        <Box sx={{ width: '100%', height: 320, mt: 2 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={4} />
              <YAxis />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <Box
                        sx={{
                          bgcolor: 'background.paper',
                          p: 1.5,
                          border: '1px solid #ccc',
                          borderRadius: 2,
                          maxWidth: 300,
                        }}
                      >
                        <Typography >
                          {data.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          color={data.score >= 0 ? 'success.main' : 'error.main'}
                        >
                          Score: {data.score}
                        </Typography>
                      </Box>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
              <Bar dataKey="score">
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.score > 0 ? '#4caf50' : entry.score < 0 ? '#f44336' : '#9e9e9e'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}