import React from 'react';
import {
  Box, Container, Typography, Paper, Button, Stack, Grid
} from '@mui/material';
import { ArrowForward, CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const FinalCTASection = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: 'rgba(107, 114, 128, 0.07)', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{ textAlign: 'center', color: '#fff', mb: 2, fontWeight: 800, fontSize: { xs: '2rem', md: '2.75rem' } }}
        >
          Ready to Build Your Future?
        </Typography>
        <Typography sx={{ textAlign: 'center', color: '#9ca3af', mb: 6, fontSize: '1.05rem' }}>
          Take the first step and start building real experience today
        </Typography>

        <Paper
          sx={{
            p: { xs: 3, md: 6 },
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(0,0,0,0.4) 100%)',
            border: '2px solid #a855f744',
            maxWidth: 780,
            mx: 'auto',
            borderRadius: 3,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#f1f5f9', fontSize: { xs: '1.5rem', md: '2rem' } }}>
            Start Building Your Experience Today
          </Typography>
          <Typography sx={{ color: '#d1d5db', mb: 5, fontSize: '1.05rem', lineHeight: 1.7 }}>
            Join thousands of students building verified portfolios and growing their skills through real tasks.
          </Typography>

          {/* Steps */}
          <Stack spacing={2} mb={5} sx={{ textAlign: 'left', maxWidth: 480, mx: 'auto' }}>
            {[
              'Create your free profile in 5 minutes',
              'Choose a skill and receive your first task',
              'Complete work, get verified, grow your Skill Score',
            ].map((step, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CheckCircle sx={{ color: '#a855f7', fontSize: 20, flexShrink: 0 }} />
                <Typography sx={{ color: '#e5e7eb', fontSize: '0.95rem' }}>{step}</Typography>
              </Box>
            ))}
          </Stack>

          {/* Stats */}
          <Grid container spacing={2} mb={4} justifyContent="center">
            {[
              { val: '5 min', txt: 'To sign up' },
              { val: 'Free', txt: 'Forever' },
              { val: '2,000+', txt: 'Active students' },
            ].map((stat, i) => (
              <Grid size={{ xs: 6, sm: 4 }} key={i}>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: 'rgba(0,0,0,0.35)',
                    border: '1px solid #a855f733',
                    borderRadius: 2,
                  }}
                >
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#a855f7' }}>
                    {stat.val}
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#9ca3af', mt: 0.5 }}>{stat.txt}</Typography>
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
              background: 'linear-gradient(135deg, #a855f7 0%, #a855f7bb 100%)',
              px: 5,
              py: 1.5,
              mb: 2,
              fontWeight: 700,
              fontSize: '1rem',
              borderRadius: '0.75rem',
              boxShadow: '0 0 24px #a855f744',
              '&:hover': { boxShadow: '0 0 36px #a855f766', opacity: 0.9 },
            }}
          >
            Sign Up for Free
          </Button>
          <Typography sx={{ color: '#6b7280', fontSize: '0.85rem' }}>
            No credit card required. Always free for students.
          </Typography>
        </Paper>

        {/* Trusted by */}
        <Box sx={{ textAlign: 'center', mt: 7 }}>
          <Typography sx={{ color: '#6b7280', mb: 3, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: 1 }}>
            Trusted by students from top institutions
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center', opacity: 0.5 }}>
            {['IIT Delhi', 'NIT Trichy', 'BITS Pilani', 'VIT Vellore', 'DTU Delhi', 'IIIT Hyderabad'].map((name, i) => (
              <Typography key={i} sx={{ color: '#9ca3af', fontWeight: 700, fontSize: '1rem', letterSpacing: 1 }}>
                {name}
              </Typography>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default FinalCTASection;
