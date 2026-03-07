import React from 'react';
import { Box, Container, Typography, Button, Stack, Grid, Paper, Chip } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, #111827 60%, rgba(236, 72, 153, 0.08) 100%)',
        pt: { xs: 8, md: 16 },
        pb: { xs: 12, md: 20 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorative blobs */}
      <Box
        sx={{
          position: 'absolute', top: -100, right: -100,
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute', bottom: -80, left: -80,
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={4}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, width: 'fit-content' }}>
                <Chip
                  label="🚀 Now in Beta — Join the waitlist"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(168,85,247,0.15)',
                    color: '#c4b5fd',
                    border: '1px solid rgba(168,85,247,0.3)',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                  }}
                />
              </Box>

              <Typography
                variant="h1"
                sx={{
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: { xs: '2.25rem', md: '3.5rem' },
                  lineHeight: 1.15,
                  letterSpacing: '-0.03em',
                }}
              >
                Build Experience{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Before
                </Box>{' '}
                You Graduate.
              </Typography>

              <Typography sx={{ color: '#d1d5db', fontSize: '1.15rem', lineHeight: 1.7 }}>
                Complete real-world tasks, prove your skills, and build a verified portfolio that speaks louder than any resume.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} pt={1}>
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/signup')}
                  sx={{
                    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                    px: 4,
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '1rem',
                    borderRadius: '0.75rem',
                    boxShadow: '0 0 20px rgba(168,85,247,0.3)',
                    '&:hover': { boxShadow: '0 0 32px rgba(168,85,247,0.5)', opacity: 0.92 },
                  }}
                >
                  Start Building Free
                </Button>
              </Stack>

              <Stack
                direction="row"
                spacing={6}
                pt={4}
                sx={{ borderTop: '1px solid #374151', flexWrap: 'wrap', gap: 3 }}
              >
                {[
                  { num: '500+', text: 'Real Tasks' },
                  { num: '2,000+', text: 'Students' },
                  { num: '10K+', text: 'Tasks Completed' },
                ].map((stat, i) => (
                  <Box key={i}>
                    <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color: '#a855f7', lineHeight: 1 }}>
                      {stat.num}
                    </Typography>
                    <Typography sx={{ color: '#9ca3af', fontSize: '0.875rem', mt: 0.5 }}>
                      {stat.text}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Grid>

          {/* Hero visual */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Paper
              sx={{
                background: 'rgba(168, 85, 247, 0.06)',
                border: '1px solid rgba(168, 85, 247, 0.2)',
                borderRadius: 3,
                p: 4,
                minHeight: 400,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              {/* Mock task cards */}
              {[
                { skill: 'React', task: 'Build a responsive dashboard UI', badge: '⭐ 450 pts', status: 'Open' },
                { skill: 'Python', task: 'Optimize a data pipeline script', badge: '⭐ 380 pts', status: 'Open' },
                { skill: 'UI/UX', task: 'Design a mobile onboarding flow', badge: '⭐ 320 pts', status: 'In Progress' },
              ].map((card, i) => (
                <Box
                  key={i}
                  sx={{
                    bgcolor: 'rgba(0,0,0,0.35)',
                    border: '1px solid rgba(168,85,247,0.15)',
                    borderRadius: 2,
                    p: 2.5,
                    transition: 'all 0.3s',
                    '&:hover': { borderColor: 'rgba(168,85,247,0.4)', transform: 'translateY(-2px)' },
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Chip
                      label={card.skill}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(168,85,247,0.2)',
                        color: '#c4b5fd',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      label={card.status}
                      size="small"
                      sx={{
                        bgcolor: card.status === 'Open' ? 'rgba(16,185,129,0.15)' : 'rgba(251,191,36,0.15)',
                        color: card.status === 'Open' ? '#10b981' : '#fbbf24',
                        fontSize: '0.7rem',
                      }}
                    />
                  </Stack>
                  <Typography sx={{ color: '#e5e7eb', fontSize: '0.9rem', fontWeight: 500, mb: 1 }}>
                    {card.task}
                  </Typography>
                  <Typography sx={{ color: '#a855f7', fontSize: '0.8rem', fontWeight: 600 }}>
                    {card.badge}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
