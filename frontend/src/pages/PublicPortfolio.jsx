import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import {
    Box, Card, CardContent, Typography, Chip, Stack, Grid, Avatar, Rating,
    CircularProgress, LinearProgress, Button,
} from '@mui/material';
import {
    VerifiedRounded, BoltRounded, EmojiEventsRounded, WorkRounded,
    OpenInNewRounded, CalendarTodayRounded, StarRounded, TrendingUpRounded,
    ChatBubbleOutlineRounded, SchoolRounded, CheckCircleRounded,
} from '@mui/icons-material';

export default function PublicPortfolio() {
    const { userId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get(`/portfolio/${userId}/`)
            .then((r) => setData(r.data))
            .catch(() => setError('Portfolio not found'))
            .finally(() => setLoading(false));
    }, [userId]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}><CircularProgress /></Box>;
    if (error) return <Box sx={{ textAlign: 'center', pt: 10 }}><Typography color="error">{error}</Typography></Box>;
    if (!data) return null;

    const { user, items, stats } = data;

    return (
        <Box sx={{
            minHeight: '100vh', py: 5, px: 2,
            background: 'radial-gradient(ellipse at top, rgba(124,58,237,0.06) 0%, #0b0f1a 50%)',
        }}>
            <Box sx={{ maxWidth: 900, mx: 'auto' }}>
                {/* Header */}
                <Card sx={{
                    borderRadius: 4, mb: 3, overflow: 'hidden',
                    background: 'linear-gradient(160deg, rgba(124,58,237,0.08) 0%, rgba(11,15,26,0.95) 35%, rgba(6,182,212,0.06) 100%)',
                }}>
                    <CardContent sx={{ p: { xs: 3, md: 5 }, textAlign: 'center' }}>
                        <Avatar sx={{
                            width: 90, height: 90, mx: 'auto', mb: 2, borderRadius: 4,
                            background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
                            fontSize: '2.2rem', fontWeight: 800,
                            boxShadow: '0 12px 40px rgba(124, 58, 237, 0.35)',
                        }}>
                            {user.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} mb={0.5}>
                            <Typography variant="h4" sx={{ fontWeight: 800 }}>{user.name}</Typography>
                            <VerifiedRounded sx={{ fontSize: 22, color: '#06b6d4' }} />
                        </Stack>
                        {user.member_since && (
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>Member since {user.member_since}</Typography>
                        )}
                        <Stack direction="row" flexWrap="wrap" gap={0.8} justifyContent="center">
                            {user.skills?.map((s, i) => (
                                <Chip key={i} label={s} size="small" color="primary" variant="outlined" sx={{ borderRadius: 2 }} />
                            ))}
                        </Stack>
                    </CardContent>
                </Card>

                {/* Stats */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    {[
                        { icon: EmojiEventsRounded, label: 'Projects', value: stats.total_projects, color: '#a78bfa' },
                        { icon: StarRounded, label: 'Avg Rating', value: stats.avg_rating ? `${stats.avg_rating}/5` : '—', color: '#fbbf24' },
                        { icon: BoltRounded, label: 'XP Earned', value: stats.total_xp, color: '#06b6d4' },
                    ].map((s) => (
                        <Grid key={s.label} size={{ xs: 4 }}>
                            <Card sx={{ borderRadius: 3, textAlign: 'center' }}>
                                <CardContent sx={{ p: 2 }}>
                                    <s.icon sx={{ fontSize: 24, color: s.color, mb: 0.5 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 800, color: s.color }}>{s.value}</Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{s.label}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Skills */}
                {stats.skill_breakdown && Object.keys(stats.skill_breakdown).length > 0 && (
                    <Card sx={{ borderRadius: 4, mb: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TrendingUpRounded sx={{ fontSize: 18, color: 'primary.light' }} /> Skills
                            </Typography>
                            <Stack spacing={1.5}>
                                {Object.entries(stats.skill_breakdown).map(([skill, count]) => (
                                    <Box key={skill}>
                                        <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.82rem' }}>{skill}</Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{count} project{count !== 1 ? 's' : ''}</Typography>
                                        </Stack>
                                        <LinearProgress variant="determinate" value={Math.min((count / Math.max(stats.total_projects, 1)) * 100, 100)}
                                            sx={{ height: 5, borderRadius: 3, bgcolor: 'rgba(148,163,184,0.06)', '& .MuiLinearProgress-bar': { borderRadius: 3, background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' } }} />
                                    </Box>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                )}

                {/* Work Items */}
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WorkRounded sx={{ fontSize: 18, color: 'primary.light' }} /> Verified Work
                    <Chip icon={<CheckCircleRounded sx={{ fontSize: 13 }} />} label="Admin Verified" size="small" color="success" variant="outlined" sx={{ ml: 1, fontSize: '0.68rem' }} />
                </Typography>

                {items.length === 0 ? (
                    <Card sx={{ borderRadius: 4, p: 5, textAlign: 'center' }}>
                        <SchoolRounded sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                        <Typography variant="body2">No completed work yet</Typography>
                    </Card>
                ) : (
                    <Stack spacing={2}>
                        {items.map((item) => (
                            <Card key={item.id} sx={{ borderRadius: 3, borderLeft: '3px solid', borderLeftColor: item.rating >= 4 ? 'success.main' : item.rating >= 3 ? 'primary.main' : 'warning.main' }}>
                                <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                                    <Stack spacing={1.5}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{item.task_title}</Typography>
                                                <Stack direction="row" spacing={0.8} mt={0.5}>
                                                    {item.skill_name && <Chip label={item.skill_name} size="small" color="primary" sx={{ height: 22, fontSize: '0.7rem' }} />}
                                                    {item.difficulty && <Chip label={item.difficulty} size="small" variant="outlined" sx={{ height: 22, fontSize: '0.7rem', textTransform: 'capitalize' }}
                                                        color={item.difficulty === 'easy' ? 'success' : item.difficulty === 'medium' ? 'warning' : 'error'} />}
                                                </Stack>
                                            </Box>
                                            <Chip icon={<VerifiedRounded sx={{ fontSize: 13 }} />} label="Verified" size="small" color="success" sx={{ height: 22, fontSize: '0.68rem' }} />
                                        </Stack>
                                        {item.rating && (
                                            <Rating value={item.rating} readOnly size="small" sx={{ '& .MuiRating-iconFilled': { color: '#fbbf24' } }} />
                                        )}
                                        {item.feedback && (
                                            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.1)' }}>
                                                <Stack direction="row" spacing={1}>
                                                    <ChatBubbleOutlineRounded sx={{ fontSize: 14, color: 'success.light', mt: 0.2 }} />
                                                    <Typography variant="body2" sx={{ fontSize: '0.82rem' }}>"{item.feedback}"</Typography>
                                                </Stack>
                                            </Box>
                                        )}
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                {new Date(item.completed_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </Typography>
                                            {item.work_link && (
                                                <Button component="a" href={item.work_link} target="_blank" size="small" variant="outlined"
                                                    endIcon={<OpenInNewRounded sx={{ fontSize: 13 }} />}
                                                    sx={{ textTransform: 'none', fontSize: '0.75rem', borderRadius: 2, py: 0.3 }}>
                                                    View Work
                                                </Button>
                                            )}
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                )}

                {/* Trust Footer */}
                <Card sx={{ borderRadius: 3, mt: 3, textAlign: 'center', bgcolor: 'rgba(148,163,184,0.02)' }}>
                    <CardContent sx={{ p: 2 }}>
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                            <VerifiedRounded sx={{ fontSize: 16, color: '#06b6d4' }} />
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Verified by SkillBridge — All work reviewed by administrators
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
