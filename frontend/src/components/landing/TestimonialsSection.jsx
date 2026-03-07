import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Paper, Avatar, Stack, Rating } from '@mui/material';
import { FormatQuote } from '@mui/icons-material';

const testimonials = [
    {
        name: 'Priya Sharma',
        role: 'Computer Science Student',
        avatar: 'PS',
        rating: 5,
        quote:
            'SkillBridge transformed my learning. The real tasks made my portfolio stand out, and my Skill Score showed my true capabilities way beyond what any certificate could.',
        color: '#a855f7',
    },
    {
        name: 'Rohan Mehta',
        role: 'Data Science Student',
        avatar: 'RM',
        rating: 5,
        quote:
            "I had no real experience but completed 12 tasks on SkillBridge. My verified portfolio showed exactly what I'd built — it gave me the confidence to showcase my skills anywhere.",
        color: '#3b82f6',
    },
    {
        name: 'Anika Patel',
        role: 'Design Student',
        avatar: 'AP',
        rating: 5,
        quote:
            "As a designer, I had projects — but no 'proof' they were real-world quality. SkillBridge changed that. My verified portfolio now includes real feedback and ratings.",
        color: '#ec4899',
    },
    {
        name: 'Karan Singh',
        role: 'Backend Development Student',
        avatar: 'KS',
        rating: 5,
        quote:
            "I used to only have academic projects. After building my Skill Score on SkillBridge, I have real proof of my abilities — and my confidence grew 10x. Total game-changer.",
        color: '#10b981',
    },
];

const TestimonialsSection = () => {
    const [hovered, setHovered] = useState(null);

    return (
        <Box sx={{ bgcolor: '#111827', py: { xs: 8, md: 12 } }}>
            <Container maxWidth="lg">
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
                    What Our Students Say
                </Typography>
                <Typography sx={{ textAlign: 'center', color: '#9ca3af', mb: 8, fontSize: '1.05rem' }}>
                    Real stories from students who transformed their skills with SkillBridge
                </Typography>

                <Grid container spacing={3}>
                    {testimonials.map((t, i) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                            <Paper
                                onMouseEnter={() => setHovered(i)}
                                onMouseLeave={() => setHovered(null)}
                                sx={{
                                    p: 3.5,
                                    bgcolor: 'rgba(0,0,0,0.35)',
                                    border: hovered === i ? `1px solid ${t.color}55` : '1px solid #374151',
                                    borderRadius: 2,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                    transition: 'all 0.3s ease',
                                    boxShadow: hovered === i ? `0 0 24px ${t.color}22` : 'none',
                                    transform: hovered === i ? 'translateY(-4px)' : 'none',
                                    cursor: 'default',
                                }}
                            >
                                <FormatQuote sx={{ color: t.color, fontSize: 32, opacity: 0.7 }} />

                                <Typography
                                    sx={{
                                        color: '#d1d5db',
                                        fontSize: '0.9rem',
                                        lineHeight: 1.75,
                                        flex: 1,
                                        fontStyle: 'italic',
                                    }}
                                >
                                    {t.quote}
                                </Typography>

                                <Box>
                                    <Rating
                                        value={t.rating}
                                        readOnly
                                        size="small"
                                        sx={{ mb: 1.5, '& .MuiRating-iconFilled': { color: '#fbbf24' } }}
                                    />
                                    <Stack direction="row" alignItems="center" gap={1.5}>
                                        <Avatar
                                            sx={{
                                                bgcolor: `${t.color}33`,
                                                color: t.color,
                                                fontWeight: 700,
                                                fontSize: '0.85rem',
                                                width: 40,
                                                height: 40,
                                                border: `1px solid ${t.color}44`,
                                            }}
                                        >
                                            {t.avatar}
                                        </Avatar>
                                        <Box>
                                            <Typography sx={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.9rem' }}>
                                                {t.name}
                                            </Typography>
                                            <Typography sx={{ color: '#6b7280', fontSize: '0.8rem' }}>{t.role}</Typography>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Aggregate rating */}
                <Box
                    sx={{
                        mt: 6,
                        p: 3,
                        borderRadius: 2,
                        border: '1px solid rgba(168,85,247,0.2)',
                        bgcolor: 'rgba(168,85,247,0.05)',
                        textAlign: 'center',
                    }}
                >
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="center" alignItems="center" gap={3} flexWrap="wrap">
                        {[
                            { val: '4.9/5', label: 'Average rating from students' },
                            { val: '2,000+', label: 'Active students on platform' },
                            { val: '96%', label: 'Would recommend to a friend' },
                        ].map((stat, i) => (
                            <Box key={i} sx={{ textAlign: 'center' }}>
                                <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#a855f7' }}>{stat.val}</Typography>
                                <Typography sx={{ color: '#9ca3af', fontSize: '0.85rem' }}>{stat.label}</Typography>
                            </Box>
                        ))}
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
};

export default TestimonialsSection;
