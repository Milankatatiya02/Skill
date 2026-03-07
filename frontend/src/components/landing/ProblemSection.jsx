import React from 'react';
import { Box, Container, Typography, Grid, Stack, Paper } from '@mui/material';
import { Clear, CheckCircle } from '@mui/icons-material';

const ProblemSection = () => (
  <Box sx={{ bgcolor: 'rgba(107, 114, 128, 0.07)', py: { xs: 8, md: 12 } }}>
    <Container maxWidth="lg">
      <Typography
        variant="h2"
        sx={{ textAlign: 'center', color: '#fff', mb: 2, fontWeight: 800, fontSize: { xs: '2rem', md: '2.75rem' } }}
      >
        The Problem We&apos;re Solving
      </Typography>
      <Typography sx={{ textAlign: 'center', color: '#9ca3af', mb: 8, fontSize: '1.05rem' }}>
        The current system doesn&apos;t set students up for success
      </Typography>

      {/* The Old Way */}
      <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, mb: 3, color: '#ef4444' }}>❌ The Old Way</Typography>
      <Grid container spacing={3} mb={6}>
        {[
          'Courses but no real experience',
          'Certificates that don\'t prove anything',
          'No way to showcase actual skills',
          'Learning feels disconnected from practice',
          'Portfolios with only academic projects',
          'No verified proof of what you can do',
        ].map((problem, k) => (
          <Grid size={{ xs: 12, sm: 6 }} key={k}>
            <Paper
              sx={{
                border: '1px solid #ef444444',
                bgcolor: '#ef44440f',
                p: 2,
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                borderRadius: 2,
              }}
            >
              <Clear sx={{ color: '#ef4444', fontSize: 20, flexShrink: 0 }} />
              <Typography sx={{ color: '#d1d5db' }}>{problem}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          textAlign: 'center',
          py: 5,
          borderY: '1px solid #374151',
          background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, transparent 100%)',
          borderRadius: 0,
          my: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: '1.25rem', md: '1.6rem' },
            fontWeight: 700,
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Replace certificates with verified experience. Replace theory with proven skills.
        </Typography>
      </Box>

      {/* The SkillBridge Way */}
      <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, mb: 3, mt: 4, color: '#10b981' }}>✅ The SkillBridge Way</Typography>
      <Grid container spacing={3}>
        {[
          'Real work experience from day one',
          'Verified portfolio that proves your ability',
          'Skills measured by actual task output',
          'Learn by doing — not just watching',
          'A Skill Score that grows with every task',
          'A profile you can be proud to share',
        ].map((benefit, k) => (
          <Grid size={{ xs: 12, sm: 6 }} key={k}>
            <Paper
              sx={{
                border: '1px solid #10b98144',
                bgcolor: '#10b9810f',
                p: 2,
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                borderRadius: 2,
              }}
            >
              <CheckCircle sx={{ color: '#10b981', fontSize: 20, flexShrink: 0 }} />
              <Typography sx={{ color: '#d1d5db' }}>{benefit}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default ProblemSection;
