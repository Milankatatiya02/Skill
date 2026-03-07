import React from 'react';
import { Box, Container, Typography, Grid, Stack, Paper, Button } from '@mui/material';
import { TrendingUp, Security, FlashOn, GpsFixed, People, EmojiEvents } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const StudentBenefitsSection = () => {
  const navigate = useNavigate();

  const benefits = [
    { icon: TrendingUp, title: 'Earn While Learning', desc: 'Get rewarded for completing real tasks. No more unpaid busywork.' },
    { icon: Security, title: 'Real Experience', desc: 'Work on production-ready projects that matter to actual businesses.' },
    { icon: FlashOn, title: 'Skill Score Growth', desc: 'AI-powered evaluation gives you actionable improvement insights.' },
    { icon: GpsFixed, title: 'Career-Ready Profile', desc: 'Build a verified portfolio that showcases your real abilities.' },
    { icon: People, title: 'Community Support', desc: 'Learn from peers, mentors, and industry professionals.' },
    { icon: EmojiEvents, title: 'Automatic Portfolio', desc: 'Every task you complete automatically builds your verified portfolio.' },
  ];

  return (
    <Box sx={{ bgcolor: 'rgba(107, 114, 128, 0.07)', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{ textAlign: 'center', color: '#fff', mb: 2, fontWeight: 800, fontSize: { xs: '2rem', md: '2.75rem' } }}
        >
          Why Students Love SkillBridge
        </Typography>
        <Typography sx={{ textAlign: 'center', color: '#9ca3af', mb: 8, fontSize: '1.05rem' }}>
          Everything you need to launch your career — starting today
        </Typography>

        <Grid container spacing={3} mb={6}>
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                <Paper
                  sx={{
                    p: 3,
                    bgcolor: 'rgba(0,0,0,0.3)',
                    border: '1px solid #374151',
                    borderRadius: 2,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#a855f7',
                      boxShadow: '0 0 24px rgba(168,85,247,0.15)',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 52,
                      height: 52,
                      bgcolor: 'rgba(168, 85, 247, 0.15)',
                      borderRadius: 1.5,
                      mb: 2,
                    }}
                  >
                    <Icon sx={{ color: '#a855f7', fontSize: 26 }} />
                  </Box>
                  <Typography sx={{ fontWeight: 700, mb: 1, color: '#f1f5f9' }}>{benefit.title}</Typography>
                  <Typography sx={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.6 }}>{benefit.desc}</Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        {/* Stats */}
        <Grid container spacing={3} mb={5}>
          {[
            { stat: '₹50K+', text: 'Avg earnings per student per year' },
            { stat: '92%', text: 'Students get job in their field' },
            { stat: '3.2x', text: 'Faster path to first job' },
          ].map((item, i) => (
            <Grid size={{ xs: 12, sm: 4 }} key={i}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  bgcolor: 'rgba(168, 85, 247, 0.06)',
                  borderRadius: 2,
                }}
              >
                <Typography sx={{ fontSize: '2.25rem', fontWeight: 800, color: '#a855f7' }}>{item.stat}</Typography>
                <Typography sx={{ color: '#9ca3af', fontSize: '0.9rem', mt: 0.5 }}>{item.text}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/signup')}
            sx={{
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              px: 5,
              py: 1.5,
              fontWeight: 700,
              fontSize: '1rem',
              borderRadius: '0.75rem',
              boxShadow: '0 0 20px rgba(168,85,247,0.3)',
              '&:hover': { boxShadow: '0 0 32px rgba(168,85,247,0.5)', opacity: 0.92 },
            }}
          >
            Join as a Student — It&apos;s Free
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default StudentBenefitsSection;
