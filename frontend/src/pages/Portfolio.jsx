import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
    Box, Card, CardContent, Typography, Chip, Stack, Grid, Avatar, Rating,
    CircularProgress, Divider, Button, LinearProgress, Tooltip, IconButton, Snackbar,
} from '@mui/material';
import {
    VerifiedRounded, BoltRounded, EmojiEventsRounded, WorkRounded,
    OpenInNewRounded, CalendarTodayRounded, StarRounded, TrendingUpRounded,
    ContentCopyRounded, ShareRounded, ChatBubbleOutlineRounded,
    SchoolRounded, CheckCircleRounded,
} from '@mui/icons-material';

export default function Portfolio() {
    const { user: authUser } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        api.get('/portfolio/my/').then((r) => setData(r.data)).finally(() => setLoading(false));
    }, []);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}><CircularProgress /></Box>;
    if (!data) return null;

    const { user, items, stats } = data;
    const shareUrl = `${window.location.origin}/portfolio/${user.id}`;

    const handleCopy = () => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(shareUrl).then(() => setCopied(true));
        } else {
            // Fallback for HTTP / older browsers
            const ta = document.createElement('textarea');
            ta.value = shareUrl;
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopied(true);
        }
    };

    return (
        <Box sx={{ maxWidth: 960, mx: 'auto' }} className="animate-in">
            {/* ─── Profile Header Card ─── */}
            <Card sx={{
                borderRadius: 4, mb: 3, position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(160deg, rgba(124,58,237,0.08) 0%, rgba(11,15,26,0.9) 35%, rgba(6,182,212,0.06) 100%)',
            }}>
                {/* Decorative orbs */}
                <Box sx={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)' }} />
                <Box sx={{ position: 'absolute', bottom: -40, left: -40, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)' }} />

                <CardContent sx={{ p: { xs: 3, md: 5 }, position: 'relative' }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems={{ md: 'center' }}>
                        {/* Avatar */}
                        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                            <Avatar sx={{
                                width: 100, height: 100, mx: { xs: 'auto', md: 0 }, borderRadius: 4,
                                background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
                                fontSize: '2.5rem', fontWeight: 800,
                                boxShadow: '0 12px 40px rgba(124, 58, 237, 0.35)',
                                border: '3px solid rgba(124,58,237,0.2)',
                            }}>
                                {user.name?.charAt(0).toUpperCase()}
                            </Avatar>
                        </Box>

                        {/* Info */}
                        <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                            <Stack direction="row" alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }} spacing={1} mb={0.5}>
                                <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>{user.name}</Typography>
                                <Tooltip title="Verified SkillBridge Member" arrow>
                                    <VerifiedRounded sx={{ fontSize: 22, color: '#06b6d4' }} />
                                </Tooltip>
                            </Stack>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{user.email}</Typography>

                            {/* Skills */}
                            <Stack direction="row" flexWrap="wrap" gap={0.8} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                                {user.skills?.map((s, i) => (
                                    <Chip key={i} label={s} size="small" color="primary" variant="outlined"
                                        sx={{ borderRadius: 2, fontWeight: 500, fontSize: '0.75rem' }} />
                                ))}
                            </Stack>
                        </Box>

                        {/* Share */}
                        <Stack spacing={1} alignItems="center">
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<ShareRounded sx={{ fontSize: 16 }} />}
                                onClick={handleCopy}
                                sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.78rem', borderColor: 'divider', color: 'text.secondary' }}
                            >
                                Share Portfolio
                            </Button>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                                Public link for companies
                            </Typography>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>

            {/* ─── Trust Stats Row ─── */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                    {
                        icon: EmojiEventsRounded, label: 'Projects Completed',
                        value: stats.total_projects, color: '#a78bfa',
                        bg: 'rgba(124,58,237,0.06)',
                    },
                    {
                        icon: StarRounded, label: 'Average Rating',
                        value: stats.avg_rating ? `${stats.avg_rating}/5` : '—', color: '#fbbf24',
                        bg: 'rgba(251,191,36,0.06)',
                    },
                    {
                        icon: BoltRounded, label: 'Total XP',
                        value: stats.total_xp, color: '#06b6d4',
                        bg: 'rgba(6,182,212,0.06)',
                    },
                    {
                        icon: CalendarTodayRounded, label: 'Member Since',
                        value: stats.member_since, color: '#10b981',
                        bg: 'rgba(16,185,129,0.06)',
                        small: true,
                    },
                ].map((s) => (
                    <Grid key={s.label} size={{ xs: 6, md: 3 }}>
                        <Card sx={{ borderRadius: 3, height: '100%' }}>
                            <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
                                <Avatar sx={{ width: 40, height: 40, mx: 'auto', mb: 1.5, bgcolor: s.bg, borderRadius: 2.5 }}>
                                    <s.icon sx={{ fontSize: 20, color: s.color }} />
                                </Avatar>
                                <Typography variant={s.small ? 'body1' : 'h5'} sx={{ fontWeight: 800, color: s.color, mb: 0.3 }}>
                                    {s.value}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                                    {s.label}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* ─── Skill Breakdown ─── */}
            {stats.skill_breakdown && Object.keys(stats.skill_breakdown).length > 0 && (
                <Card sx={{ borderRadius: 4, mb: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TrendingUpRounded sx={{ fontSize: 18, color: 'primary.light' }} /> Skill Progress
                        </Typography>
                        <Stack spacing={2}>
                            {Object.entries(stats.skill_breakdown).map(([skill, count]) => {
                                const pct = Math.min((count / Math.max(stats.total_projects, 1)) * 100, 100);
                                return (
                                    <Box key={skill}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                                            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.82rem' }}>{skill}</Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                {count} project{count !== 1 ? 's' : ''}
                                            </Typography>
                                        </Stack>
                                        <LinearProgress
                                            variant="determinate"
                                            value={pct}
                                            sx={{
                                                height: 6, borderRadius: 3,
                                                bgcolor: 'rgba(148,163,184,0.06)',
                                                '& .MuiLinearProgress-bar': {
                                                    borderRadius: 3,
                                                    background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                                                },
                                            }}
                                        />
                                    </Box>
                                );
                            })}
                        </Stack>
                    </CardContent>
                </Card>
            )}

            {/* ─── Verified Work Section ─── */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WorkRounded sx={{ fontSize: 18, color: 'primary.light' }} /> Verified Work
                </Typography>
                <Chip
                    icon={<CheckCircleRounded sx={{ fontSize: 14 }} />}
                    label="Admin Verified"
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                />
            </Stack>

            {items.length === 0 ? (
                <Card sx={{ borderRadius: 4, p: 6, textAlign: 'center' }}>
                    <SchoolRounded sx={{ fontSize: 56, color: 'text.secondary', mb: 1.5 }} />
                    <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>Start Building Your Portfolio</Typography>
                    <Typography variant="body2" sx={{ mb: 2.5, maxWidth: 400, mx: 'auto' }}>
                        Complete tasks to earn verified work experience. Each approved task automatically appears here with admin verification.
                    </Typography>
                    <Button variant="contained" href="/tasks" sx={{ borderRadius: 2.5 }}>
                        Browse Available Tasks
                    </Button>
                </Card>
            ) : (
                <Stack spacing={2}>
                    {items.map((item, i) => (
                        <Card
                            key={item.id}
                            className={`animate-in delay-${Math.min(i + 1, 6)}`}
                            sx={{
                                borderRadius: 3,
                                borderLeft: '3px solid',
                                borderLeftColor: item.rating >= 4 ? 'success.main' : item.rating >= 3 ? 'primary.main' : 'warning.main',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' },
                            }}
                        >
                            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                                <Stack spacing={1.5}>
                                    {/* Header */}
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.3 }}>
                                                {item.task_title}
                                            </Typography>
                                            <Stack direction="row" spacing={0.8} flexWrap="wrap">
                                                {item.skill_name && (
                                                    <Chip label={item.skill_name} size="small" color="primary" sx={{ height: 22, fontSize: '0.7rem' }} />
                                                )}
                                                {item.difficulty && (
                                                    <Chip
                                                        label={item.difficulty}
                                                        size="small"
                                                        color={item.difficulty === 'easy' ? 'success' : item.difficulty === 'medium' ? 'warning' : 'error'}
                                                        variant="outlined"
                                                        sx={{ height: 22, fontSize: '0.7rem', textTransform: 'capitalize' }}
                                                    />
                                                )}
                                                {item.reward_points > 0 && (
                                                    <Chip
                                                        icon={<BoltRounded sx={{ fontSize: 12 }} />}
                                                        label={`+${item.reward_points} XP`}
                                                        size="small"
                                                        variant="outlined"
                                                        color="primary"
                                                        sx={{ height: 22, fontSize: '0.7rem' }}
                                                    />
                                                )}
                                            </Stack>
                                        </Box>
                                        <Stack alignItems="flex-end" spacing={0.3}>
                                            <Chip
                                                icon={<VerifiedRounded sx={{ fontSize: 13 }} />}
                                                label="Verified"
                                                size="small"
                                                color="success"
                                                sx={{ height: 22, fontSize: '0.68rem', fontWeight: 600 }}
                                            />
                                        </Stack>
                                    </Stack>

                                    {/* Rating */}
                                    {item.rating && (
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Rating
                                                value={item.rating}
                                                readOnly
                                                size="small"
                                                sx={{
                                                    '& .MuiRating-iconFilled': { color: '#fbbf24' },
                                                    '& .MuiRating-iconEmpty': { color: 'rgba(148,163,184,0.12)' },
                                                }}
                                            />
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                                {item.rating}/5
                                            </Typography>
                                        </Stack>
                                    )}

                                    {/* Admin Feedback */}
                                    {item.feedback && (
                                        <Box sx={{
                                            p: 2, borderRadius: 2,
                                            bgcolor: 'rgba(16,185,129,0.04)',
                                            border: '1px solid rgba(16,185,129,0.1)',
                                        }}>
                                            <Stack direction="row" spacing={1}>
                                                <ChatBubbleOutlineRounded sx={{ fontSize: 15, color: 'success.light', mt: 0.2, flexShrink: 0 }} />
                                                <Box>
                                                    <Typography variant="caption" sx={{ color: 'success.light', fontWeight: 600, display: 'block', mb: 0.3 }}>
                                                        Admin Feedback
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                                                        "{item.feedback}"
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Box>
                                    )}

                                    {/* Footer */}
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                            Completed {new Date(item.completed_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </Typography>
                                        {item.work_link && (
                                            <Button
                                                component="a"
                                                href={item.work_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                size="small"
                                                variant="outlined"
                                                endIcon={<OpenInNewRounded sx={{ fontSize: 13 }} />}
                                                sx={{ textTransform: 'none', fontSize: '0.75rem', borderRadius: 2, py: 0.3 }}
                                            >
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

            {/* ─── Trust Footer ─── */}
            <Card sx={{ borderRadius: 3, mt: 3, textAlign: 'center', bgcolor: 'rgba(148,163,184,0.02)' }}>
                <CardContent sx={{ p: 2.5 }}>
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                        <VerifiedRounded sx={{ fontSize: 16, color: '#06b6d4' }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            All work is verified by SkillBridge administrators. Ratings and feedback are authentic.
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>

            {/* Copy Link Snackbar */}
            <Snackbar
                open={copied}
                autoHideDuration={3000}
                onClose={() => setCopied(false)}
                message="✓ Portfolio link copied to clipboard!"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Box>
    );
}
