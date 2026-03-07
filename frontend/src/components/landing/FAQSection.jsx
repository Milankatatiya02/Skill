import React, { useState } from 'react';
import {
    Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, Stack,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const faqs = [
    {
        q: 'Is SkillBridge free for students?',
        a: 'Yes — SkillBridge is completely free for students. Sign up, choose your skills, and start completing tasks with no fees, no credit card, and no catch.',
    },
    {
        q: 'Do I need prior work experience to join?',
        a: 'Not at all. SkillBridge is designed for students with no experience. We have tasks at every level — from beginner to advanced — so you can start where you are.',
    },
    {
        q: 'How does the Skill Score work?',
        a: 'Your Skill Score is calculated across four dimensions: quality, consistency, problem-solving, and improvement. It\'s updated every time you complete a task and is verified by our review system.',
    },
    {
        q: 'Can I earn rewards from tasks?',
        a: 'Yes! Every task awards experience points and boosts your Skill Score. The more tasks you complete, the higher your score grows — unlocking harder challenges and greater rewards.',
    },
    {
        q: 'What kind of tasks are available?',
        a: 'Tasks range from building UI components and designing mobile flows to writing backend scripts, analyzing data, and more. Each task is aligned with in-demand industry skills.',
    },
    {
        q: 'How is this different from online courses?',
        a: 'Online courses teach theory. SkillBridge gives you practice. You complete real-world tasks, get professional feedback, and build a verified portfolio — not just a certificate.',
    },
    {
        q: 'How does the portfolio work?',
        a: 'Every approved task is automatically added to your verified portfolio. It shows what you built, the feedback you received, and your ratings — giving you real proof of your abilities.',
    },
    {
        q: 'Can I share my profile?',
        a: 'Yes! Your SkillBridge profile — with your Skill Score, portfolio, and task history — can be shared via a unique link. Perfect for adding to your LinkedIn or personal website.',
    },
];

const FAQSection = () => {
    const [expanded, setExpanded] = useState(null);
    const color = '#a855f7';

    return (
        <Box sx={{ bgcolor: 'rgba(107, 114, 128, 0.07)', py: { xs: 8, md: 12 } }}>
            <Container maxWidth="md">
                <Typography
                    variant="h2"
                    sx={{
                        textAlign: 'center',
                        color: '#fff',
                        mb: 2,
                        fontWeight: 800,
                        fontSize: { xs: '2rem', md: '2.75rem' },
                    }}
                >
                    Frequently Asked Questions
                </Typography>
                <Typography sx={{ textAlign: 'center', color: '#9ca3af', mb: 6, fontSize: '1.05rem' }}>
                    Everything you need to know about SkillBridge
                </Typography>

                {/* Accordion */}
                <Stack spacing={1.5}>
                    {faqs.map((item, i) => (
                        <Accordion
                            key={i}
                            expanded={expanded === i}
                            onChange={() => setExpanded(expanded === i ? null : i)}
                            disableGutters
                            elevation={0}
                            sx={{
                                bgcolor: 'rgba(0,0,0,0.3)',
                                border: expanded === i
                                    ? `1px solid ${color}55`
                                    : '1px solid #374151',
                                borderRadius: '0.75rem !important',
                                '&:before': { display: 'none' },
                                transition: 'all 0.3s',
                                '&:hover': { borderColor: `${color}33` },
                                overflow: 'hidden',
                            }}
                        >
                            <AccordionSummary
                                expandIcon={
                                    <ExpandMore
                                        sx={{
                                            color: expanded === i ? color : '#6b7280',
                                            transition: 'color 0.3s',
                                        }}
                                    />
                                }
                                sx={{ px: 3, py: 0.5 }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        color: expanded === i ? '#f1f5f9' : '#d1d5db',
                                        fontSize: '0.95rem',
                                        transition: 'color 0.3s',
                                        pr: 2,
                                    }}
                                >
                                    {item.q}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                                <Typography sx={{ color: '#9ca3af', lineHeight: 1.75, fontSize: '0.9rem' }}>
                                    {item.a}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Stack>

                {/* Still have questions */}
                <Box
                    sx={{
                        mt: 6,
                        p: 3,
                        textAlign: 'center',
                        border: '1px dashed #374151',
                        borderRadius: 2,
                        bgcolor: 'rgba(0,0,0,0.2)',
                    }}
                >
                    <Typography sx={{ color: '#d1d5db', fontWeight: 600, mb: 0.5 }}>
                        Still have questions?
                    </Typography>
                    <Typography sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        Reach us at{' '}
                        <Box
                            component="a"
                            href="mailto:hello@skillbridge.app"
                            sx={{ color: '#a855f7', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                        >
                            hello@skillbridge.app
                        </Box>{' '}
                        — we respond within 24 hours.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default FAQSection;
