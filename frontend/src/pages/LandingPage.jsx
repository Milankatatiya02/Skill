import React, { useEffect, useState } from 'react';
import { Box, Fab, Zoom, Tooltip } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import Navigation from '../components/landing/Navigation';
import HeroSection from '../components/landing/HeroSection';
import ProblemSection from '../components/landing/ProblemSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import StudentBenefitsSection from '../components/landing/StudentBenefitsSection';

import SkillScoreSection from '../components/landing/SkillScoreSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import FAQSection from '../components/landing/FAQSection';
import VisionSection from '../components/landing/VisionSection';
import FinalCTASection from '../components/landing/FinalCTASection';
import FooterSection from '../components/landing/FooterSection';

const LandingPage = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0);
      setShowScrollTop(scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#111827', color: '#fff' }}>
      {/* Scroll Progress Bar */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: 3,
          width: `${scrollProgress}%`,
          background: 'linear-gradient(90deg, #a855f7, #ec4899)',
          zIndex: 9999,
          transition: 'width 0.1s linear',
        }}
      />

      <Navigation />

      <Box id="hero"><HeroSection /></Box>
      <Box id="problem"><ProblemSection /></Box>
      <Box id="how-it-works"><HowItWorksSection /></Box>
      <Box id="students"><StudentBenefitsSection /></Box>

      <Box id="skill-score"><SkillScoreSection /></Box>
      <Box id="testimonials"><TestimonialsSection /></Box>
      <Box id="faq"><FAQSection /></Box>
      <VisionSection />
      <FinalCTASection />
      <FooterSection />

      {/* Scroll to Top Button */}
      <Zoom in={showScrollTop}>
        <Tooltip title="Back to top" placement="left">
          <Fab
            onClick={scrollToTop}
            size="medium"
            aria-label="scroll back to top"
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              color: '#fff',
              zIndex: 1000,
              '&:hover': {
                background: 'linear-gradient(135deg, #9333ea, #db2777)',
                boxShadow: '0 0 24px rgba(168,85,247,0.5)',
              },
            }}
          >
            <KeyboardArrowUp />
          </Fab>
        </Tooltip>
      </Zoom>
    </Box>
  );
};

export default LandingPage;
