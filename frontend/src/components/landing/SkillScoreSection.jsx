import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Stack, Paper, Button, LinearProgress } from '@mui/material';
import { Star, TrendingUp, FlashOn, EmojiEvents } from '@mui/icons-material';

const SkillScoreSection = () => {
  const [active, setActive] = useState('quality');
  const metrics = {
    quality: { title: 'Quality Score', icon: Star, factor: 92 },
    consistency: { title: 'Consistency', icon: TrendingUp, factor: 88 },
    problemSolving: { title: 'Problem-Solving', icon: FlashOn, factor: 85 },
    improvement: { title: 'Improvement', icon: EmojiEvents, factor: 79 }
  };

  return (
    <Box sx={{ bgcolor: 'rgba(107, 114, 128, 0.1)', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ textAlign: 'center', color: '#fff', mb: 2, fontWeight: 'bold' }}>The Skill Score Advantage</Typography>
        <Typography sx={{ textAlign: 'center', color: '#9ca3af', mb: 6 }}>Beyond resumes: Real capability measurement</Typography>

        <Grid container spacing={4}>
          {/* Score Card */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 4, bgcolor: 'rgba(139, 92, 246, 0.08)', border: '2px solid rgba(168, 85, 247, 0.3)' }}>
              <Typography sx={{ color: '#9ca3af', fontSize: '0.875rem', fontWeight: 'bold', mb: 2 }}>OVERALL SKILL SCORE</Typography>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Typography sx={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#a855f7' }}>87</Typography>
                <Box sx={{ flex: 1 }}>
                  <LinearProgress variant="determinate" value={87} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(107, 114, 128, 0.3)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #a855f7, #ec4899)' } }} />
                </Box>
              </Stack>

              <Stack spacing={2}>
                {Object.entries(metrics).map(([key, metric]) => (
                  <Box key={key}>
                    <Stack direction="row" justifyContent="space-between" mb={1}>
                      <Typography sx={{ fontSize: '0.875rem' }}>{metric.title}</Typography>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#10b981' }}>{metric.factor}</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={metric.factor} sx={{ height: 4, borderRadius: 2, bgcolor: 'rgba(107, 114, 128, 0.3)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #fbbf24, #f97316)' } }} />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Metric Selector */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              <Grid container spacing={2}>
                {Object.entries(metrics).map(([key, metric]) => {
                  const Icon = metric.icon;
                  return (
                    <Grid size={{ xs: 6 }} key={key}>
                      <Paper onClick={() => setActive(key)} sx={{ p: 2, cursor: 'pointer', border: active === key ? '2px solid #a855f7' : '1px solid #374151', bgcolor: active === key ? 'rgba(168, 85, 247, 0.1)' : 'rgba(0,0,0,0.2)', transition: 'all 0.3s' }}>
                        <Icon sx={{ color: '#a855f7', mb: 1 }} />
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{metric.title}</Typography>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>

              <Paper sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.3)', border: '1px solid #374151' }}>
                <Typography sx={{ fontWeight: 'bold', mb: 2 }}>Measured by:</Typography>
                <Stack spacing={1}>
                  {['Code quality', 'Consistency', 'Problem-solving', 'Growth'].map((factor, i) => (
                    <Stack key={i} direction="row" sx={{ color: '#d1d5db', fontSize: '0.875rem', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 6, height: 6, bgcolor: '#a855f7', borderRadius: '50%' }} />
                      {factor}
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>

        {/* Why It Matters */}
        <Grid container spacing={3} mt={2}>
          {[
            { title: '📊 Growth Tracking', desc: 'Measures real learning growth' },
            { title: '🔍 Transparent', desc: 'Backed by actual work' },
            { title: '📈 Actionable', desc: 'Track your progress over time' }
          ].map((item, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'rgba(139, 92, 246, 0.08)', border: '1px solid #374151' }}>
                <Typography sx={{ fontWeight: 'bold', mb: 1 }}>{item.title}</Typography>
                <Typography sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>{item.desc}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default SkillScoreSection;
