import React from 'react';
import { Box, Container, Typography, Grid, Paper, Button } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const VisionSection = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, #111827 50%, rgba(236,72,153,0.08) 100%)',
        py: { xs: 8, md: 12 },
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative ring */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 600,
          height: 600,
          border: '1px solid rgba(168,85,247,0.08)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="md">
        <Box sx={{ width: 80, height: 3, background: 'linear-gradient(90deg, #a855f7, #ec4899)', mx: 'auto', mb: 5, borderRadius: 2 }} />

        <Typography
          variant="h2"
          sx={{ fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 800, mb: 3, lineHeight: 1.15 }}
        >
          <Box
            component="span"
            sx={{
              background: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            SkillBridge is building the Skill Identity Layer
          </Box>
          <Box component="span" sx={{ color: '#fff' }}> for the next generation of learners</Box>
        </Typography>

        <Typography sx={{ fontSize: { xs: '1.1rem', md: '1.35rem' }, color: '#d1d5db', mb: 8, lineHeight: 1.7 }}>
          Where{' '}
          <Box component="span" sx={{ fontWeight: 700, color: '#c4b5fd' }}>ability</Box>{' '}
          matters more than degrees. Where{' '}
          <Box component="span" sx={{ fontWeight: 700, color: '#f9a8d4' }}>proof</Box>{' '}
          matters more than promise.
        </Typography>

        {/* Stats */}
        <Grid container spacing={3} mb={6}>
          {[
            { num: '1M+', text: 'Students building experience' },
            { num: '50+', text: 'Skills to master' },
            { num: '10M+', text: 'Tasks completed & verified' },
          ].map((item, i) => (
            <Grid size={{ xs: 12, sm: 4 }} key={i}>
              <Paper
                sx={{
                  p: 3,
                  bgcolor: 'rgba(0,0,0,0.35)',
                  border: '1px solid rgba(168,85,247,0.2)',
                  borderRadius: 2,
                  '&:hover': { borderColor: 'rgba(168,85,247,0.4)' },
                  transition: 'all 0.3s',
                }}
              >
                <Typography sx={{ fontSize: '2.25rem', fontWeight: 800, color: '#a855f7', lineHeight: 1 }}>{item.num}</Typography>
                <Typography sx={{ color: '#9ca3af', mt: 0.5, fontSize: '0.9rem' }}>{item.text}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Vision cards */}
        <Grid container spacing={3} mb={6}>
          {[
            { title: 'For Students', desc: 'Your capabilities — not your pedigree — determine your opportunities. Build your skill identity and let your work speak for itself.' },
            { title: 'For Your Future', desc: 'Every task you complete is a step toward mastery. Build a portfolio of verified achievements that follows you throughout your career.' },
          ].map((item, i) => (
            <Grid size={{ xs: 12, md: 6 }} key={i}>
              <Paper
                sx={{
                  p: 4,
                  bgcolor: 'rgba(139, 92, 246, 0.07)',
                  border: '1px solid rgba(168,85,247,0.2)',
                  borderRadius: 2,
                  textAlign: 'left',
                  height: '100%',
                }}
              >
                <Typography sx={{ fontWeight: 700, mb: 2, fontSize: '1.1rem', color: '#a855f7' }}>{item.title}</Typography>
                <Typography sx={{ color: '#d1d5db', lineHeight: 1.7 }}>{item.desc}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowForward />}
          onClick={() => navigate('/signup')}
          sx={{
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            px: 5,
            py: 1.5,
            fontWeight: 700,
            fontSize: '1rem',
            borderRadius: '0.75rem',
            boxShadow: '0 0 24px rgba(168,85,247,0.4)',
            '&:hover': { boxShadow: '0 0 36px rgba(168,85,247,0.6)', opacity: 0.92 },
          }}
        >
          Start Your Journey
        </Button>
      </Container>
    </Box>
  );
};

export default VisionSection;
