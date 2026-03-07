import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Stack, Paper, Button } from '@mui/material';
import { School, CheckCircle, EmojiEvents, WorkHistory } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HowItWorksSection = () => {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  const steps = [
    {
      title: 'Choose Your Skill',
      icon: School,
      desc: 'Browse skills curated by industry experts',
      detail: 'Start your journey by selecting from hundreds of in-demand skills curated by industry experts. Each skill path includes real-world tasks aligned with what the market actually needs.',
      color: '#a855f7',
    },
    {
      title: 'Complete Real Tasks',
      icon: CheckCircle,
      desc: 'Work on real-world projects',
      detail: 'Get assigned real tasks that mirror industry challenges. Build, design, analyze, or code — each task is reviewed by professionals, giving you feedback you can grow from.',
      color: '#ec4899',
    },
    {
      title: 'Get Verified Experience',
      icon: EmojiEvents,
      desc: 'Build a trusted, verified portfolio',
      detail: 'Every completed task is added to your verified portfolio with a Skill Score. Your work speaks for itself — no inflated resumes, just proof.',
      color: '#f97316',
    },
    {
      title: 'Track Your Growth',
      icon: WorkHistory,
      desc: 'Watch your Skill Score rise over time',
      detail: 'Every task you complete feeds into your multi-dimensional Skill Score. Track your quality, consistency, and problem-solving growth — and see how far you\'ve come.',
      color: '#10b981',
    },
  ];

  return (
    <Box sx={{ bgcolor: '#111827', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{ textAlign: 'center', color: '#fff', mb: 2, fontWeight: 800, fontSize: { xs: '2rem', md: '2.75rem' } }}
        >
          How SkillBridge Works
        </Typography>
        <Typography sx={{ textAlign: 'center', color: '#9ca3af', mb: 8, fontSize: '1.05rem' }}>
          Four simple steps to build real experience
        </Typography>

        <Grid container spacing={3} mb={4}>
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = active === idx;
            return (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                <Paper
                  onClick={() => setActive(idx)}
                  sx={{
                    p: 3,
                    cursor: 'pointer',
                    border: isActive ? `2px solid ${step.color}` : '1px solid #374151',
                    transition: 'all 0.3s ease',
                    bgcolor: isActive ? `${step.color}15` : 'rgba(0,0,0,0.3)',
                    position: 'relative',
                    borderRadius: 2,
                    '&:hover': {
                      borderColor: step.color,
                      bgcolor: `${step.color}10`,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -16,
                      left: 16,
                      width: 36,
                      height: 36,
                      bgcolor: isActive ? step.color : '#4b5563',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      boxShadow: isActive ? `0 0 12px ${step.color}66` : 'none',
                      transition: 'all 0.3s',
                    }}
                  >
                    {idx + 1}
                  </Box>
                  <Icon sx={{ fontSize: 32, color: step.color, mb: 1.5, mt: 2.5 }} />
                  <Typography sx={{ fontWeight: 700, mb: 0.5, color: '#e5e7eb' }}>{step.title}</Typography>
                  <Typography sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>{step.desc}</Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        {/* Active step detail */}
        <Paper
          sx={{
            p: { xs: 3, md: 4 },
            bgcolor: 'rgba(139, 92, 246, 0.06)',
            border: `1px solid ${steps[active].color}33`,
            borderRadius: 2,
            transition: 'all 0.3s ease',
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} gap={3} alignItems={{ xs: 'flex-start', md: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: { xs: '100%', md: 100 },
                height: 100,
                bgcolor: `${steps[active].color}18`,
                borderRadius: 2,
                border: `1px solid ${steps[active].color}33`,
              }}
            >
              {React.createElement(steps[active].icon, { sx: { fontSize: 48, color: steps[active].color } })}
            </Box>
            <Stack spacing={2} sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#f1f5f9' }}>
                Step {active + 1}: {steps[active].title}
              </Typography>
              <Typography sx={{ color: '#d1d5db', lineHeight: 1.7 }}>
                {steps[active].detail}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/signup')}
                  sx={{
                    bgcolor: steps[active].color,
                    fontWeight: 600,
                    borderRadius: '0.5rem',
                    '&:hover': { opacity: 0.88, boxShadow: `0 0 20px ${steps[active].color}44` },
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setActive((active + 1) % steps.length)}
                  sx={{
                    borderColor: '#4b5563',
                    color: '#d1d5db',
                    borderRadius: '0.5rem',
                    '&:hover': { borderColor: steps[active].color, color: steps[active].color },
                  }}
                >
                  Next Step →
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default HowItWorksSection;
