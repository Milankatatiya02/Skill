import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Stack, Link, Divider, TextField, Button, Snackbar, Alert } from '@mui/material';
import { GitHub, Twitter, LinkedIn, Mail } from '@mui/icons-material';

const FooterSection = () => {
  const [email, setEmail] = useState('');
  const [snack, setSnack] = useState(false);

  const links = {
    Product: ['For Students', 'Skill Paths', 'Portfolio', 'Leaderboard', 'Features'],
    Resources: ['About Us', 'Blog', 'Community', 'Open Source', 'Changelog'],
    Support: ['Help Center', 'Contact', 'Privacy Policy', 'Terms of Service', 'Security'],
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSnack(true);
      setEmail('');
    }
  };

  return (
    <Box sx={{ bgcolor: '#030712', borderTop: '1px solid #1f2937' }}>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} mb={6}>
          {/* Brand + newsletter */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              sx={{
                fontSize: '1.5rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1.5,
                letterSpacing: '-0.02em',
              }}
            >
              SkillBridge
            </Typography>
            <Typography sx={{ color: '#6b7280', mb: 3, fontSize: '0.875rem', lineHeight: 1.7 }}>
              Building the skill identity layer of the future workforce. Where ability matters more than degrees.
            </Typography>

            {/* Social links */}
            <Stack direction="row" spacing={2} mb={4}>
              {[
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: LinkedIn, href: '#', label: 'LinkedIn' },
                { icon: GitHub, href: '#', label: 'GitHub' },
                { icon: Mail, href: 'mailto:hello@skillbridge.app', label: 'Email' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={i}
                    href={item.href}
                    aria-label={item.label}
                    sx={{
                      color: '#4b5563',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 36,
                      height: 36,
                      borderRadius: 1,
                      border: '1px solid #1f2937',
                      transition: 'all 0.2s',
                      '&:hover': { color: '#a855f7', borderColor: 'rgba(168,85,247,0.4)', bgcolor: 'rgba(168,85,247,0.08)' },
                    }}
                  >
                    <Icon sx={{ fontSize: 18 }} />
                  </Link>
                );
              })}
            </Stack>

            {/* Newsletter */}
            <Typography sx={{ color: '#9ca3af', fontSize: '0.85rem', fontWeight: 600, mb: 1.5, textTransform: 'uppercase', letterSpacing: 1 }}>
              Stay updated
            </Typography>
            <form onSubmit={handleSubscribe}>
              <Stack direction="row" gap={1}>
                <TextField
                  size="small"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#0f172a',
                      color: '#e5e7eb',
                      borderRadius: 1,
                      '& fieldset': { borderColor: '#1f2937' },
                      '&:hover fieldset': { borderColor: '#374151' },
                      '&.Mui-focused fieldset': { borderColor: '#a855f7' },
                    },
                    '& input::placeholder': { color: '#4b5563', fontSize: '0.85rem' },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    bgcolor: '#a855f7',
                    px: 2,
                    minWidth: 'auto',
                    borderRadius: 1,
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    '&:hover': { bgcolor: '#9333ea' },
                  }}
                >
                  Join
                </Button>
              </Stack>
            </form>
          </Grid>

          {/* Links columns */}
          {Object.entries(links).map(([title, items]) => (
            <Grid size={{ xs: 6, sm: 4, md: 2.5 }} key={title}>
              <Typography sx={{ fontWeight: 700, mb: 2.5, color: '#e5e7eb', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                {title}
              </Typography>
              <Stack spacing={1.5}>
                {items.map((item, i) => (
                  <Link
                    key={i}
                    href="#"
                    sx={{
                      color: '#6b7280',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      transition: 'color 0.2s',
                      '&:hover': { color: '#a855f7' },
                    }}
                  >
                    {item}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ bgcolor: '#1f2937', mb: 4 }} />

        <Grid container justifyContent="space-between" alignItems="center" gap={2}>
          <Grid size={{ xs: 12, md: 'auto' }}>
            <Typography sx={{ color: '#4b5563', fontSize: '0.8rem' }}>
              © 2026 SkillBridge Technologies Pvt. Ltd. All rights reserved.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 'auto' }}>
            <Stack direction="row" spacing={3}>
              {['Sitemap', 'Privacy', 'Terms', 'Security'].map((item, i) => (
                <Link
                  key={i}
                  href="#"
                  sx={{ color: '#4b5563', textDecoration: 'none', fontSize: '0.8rem', '&:hover': { color: '#9ca3af' } }}
                >
                  {item}
                </Link>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snack}
        autoHideDuration={4000}
        onClose={() => setSnack(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnack(false)}
          severity="success"
          sx={{ bgcolor: '#1e293b', color: '#f1f5f9', '& .MuiAlert-icon': { color: '#10b981' } }}
        >
          You&apos;re on the list! We&apos;ll be in touch soon.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FooterSection;
