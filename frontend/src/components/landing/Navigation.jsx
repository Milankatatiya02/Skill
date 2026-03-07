import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const navLinks = [
  { label: 'For Students', href: '#students' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Skill Score', href: '#skill-score' },
  { label: 'FAQ', href: '#faq' },
];

const scrollToSection = (href) => {
  if (href === '#') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const el = document.querySelector(href);
  if (el) {
    const offset = 72; // navbar height
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
};

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Highlight active nav link based on scroll
      const sections = ['students', 'how-it-works', 'skill-score', 'faq'];
      const offset = 100;
      let current = '';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= offset) {
          current = `#${id}`;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href) => {
    setMobileOpen(false);
    scrollToSection(href);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppBar
      position="sticky"
      elevation={scrolled ? 4 : 0}
      sx={{
        background: scrolled
          ? 'rgba(3, 7, 18, 0.95)'
          : 'rgba(17, 24, 39, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
        transition: 'all 0.3s ease',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: { xs: 60, md: 68 } }}>
          {/* Logo */}
          <Box
            component="a"
            href="/"
            onClick={handleLogoClick}
            sx={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #a855f7, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none',
              cursor: 'pointer',
              letterSpacing: '-0.02em',
            }}
          >
            SkillBridge
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <>
              <Stack direction="row" spacing={1} sx={{ flex: 1, ml: 6 }}>
                {navLinks.map((link) => (
                  <Button
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    sx={{
                      color: activeSection === link.href ? '#a855f7' : '#d1d5db',
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      fontWeight: activeSection === link.href ? 600 : 500,
                      position: 'relative',
                      '&:hover': { color: '#a855f7', bgcolor: 'transparent' },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 4,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: activeSection === link.href ? '80%' : '0%',
                        height: 2,
                        background: 'linear-gradient(90deg, #a855f7, #ec4899)',
                        borderRadius: 1,
                        transition: 'width 0.3s ease',
                      },
                      '&:hover::after': { width: '80%' },
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Stack>

              <Stack direction="row" spacing={2}>
                <Button
                  onClick={() => navigate('/login')}
                  sx={{
                    px: 3,
                    py: 1,
                    color: '#d1d5db',
                    border: '1px solid #4b5563',
                    borderRadius: '0.5rem',
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    '&:hover': {
                      backgroundColor: 'rgba(75,85,99,0.3)',
                      borderColor: '#6b7280',
                    },
                  }}
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate('/signup')}
                  sx={{
                    px: 3,
                    py: 1,
                    background: 'linear-gradient(to right, #9333ea, #ec4899)',
                    color: 'white',
                    borderRadius: '0.5rem',
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    '&:hover': {
                      boxShadow: '0 0 24px rgba(168, 85, 247, 0.4)',
                      opacity: 0.92,
                    },
                  }}
                >
                  Get Started Free
                </Button>
              </Stack>
            </>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              sx={{ color: '#9ca3af' }}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          )}
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="top"
        open={isMobile && mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: '#0f172a',
            borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
            top: '60px !important',
          },
          '& .MuiBackdrop-root': { top: 60 },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Stack spacing={1}>
            {navLinks.map((link) => (
              <Button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                fullWidth
                sx={{
                  color: '#d1d5db',
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  py: 1.5,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(168,85,247,0.1)',
                    color: '#a855f7',
                  },
                }}
              >
                {link.label}
              </Button>
            ))}
            <Box sx={{ borderTop: '1px solid #374151', pt: 2, mt: 1, display: 'flex', gap: 2 }}>
              <Button
                onClick={() => { setMobileOpen(false); navigate('/login'); }}
                fullWidth
                sx={{
                  color: '#d1d5db',
                  border: '1px solid #4b5563',
                  borderRadius: '0.5rem',
                  textTransform: 'none',
                }}
              >
                Sign In
              </Button>
              <Button
                onClick={() => { setMobileOpen(false); navigate('/signup'); }}
                fullWidth
                sx={{
                  background: 'linear-gradient(to right, #9333ea, #ec4899)',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '0.5rem',
                }}
              >
                Get Started
              </Button>
            </Box>
          </Stack>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navigation;
