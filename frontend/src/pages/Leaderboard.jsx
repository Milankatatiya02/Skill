import { useState, useEffect } from 'react';
import api from '../services/api';
import {
    Box, Card, CardContent, Typography, Avatar, Stack, Chip,
    CircularProgress,
} from '@mui/material';
import {
    BoltRounded, EmojiEventsRounded, WorkRounded,
} from '@mui/icons-material';

const MEDALS = [
    { bg: 'linear-gradient(135deg, #f59e0b, #fbbf24)', border: 'rgba(245,158,11,0.4)', shadow: 'rgba(245,158,11,0.25)', label: '🥇' },
    { bg: 'linear-gradient(135deg, #94a3b8, #cbd5e1)', border: 'rgba(148,163,184,0.4)', shadow: 'rgba(148,163,184,0.2)', label: '🥈' },
    { bg: 'linear-gradient(135deg, #cd7c2f, #e09a50)', border: 'rgba(205,124,47,0.4)', shadow: 'rgba(205,124,47,0.2)', label: '🥉' },
];

export default function Leaderboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/auth/leaderboard/')
            .then((r) => setUsers(r.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}>
            <CircularProgress />
        </Box>
    );

    const topThree = users.slice(0, 3);
    const rest = users.slice(3);

    return (
        <Box sx={{ maxWidth: 760, mx: 'auto' }} className="animate-in">
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
                <Avatar sx={{ width: 44, height: 44, borderRadius: 2.5, background: 'linear-gradient(135deg, #f59e0b, #a78bfa)', boxShadow: '0 8px 24px rgba(245,158,11,0.25)' }}>
                    <EmojiEventsRounded sx={{ fontSize: 22 }} />
                </Avatar>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>Leaderboard</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Top earners ranked by experience points</Typography>
                </Box>
            </Stack>

            {users.length === 0 ? (
                <Card sx={{ borderRadius: 4, p: 8, textAlign: 'center' }}>
                    <EmojiEventsRounded sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.3 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>No rankings yet</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>Complete tasks to earn XP and appear here!</Typography>
                </Card>
            ) : (
                <>
                    {/* Top 3 podium */}
                    {topThree.length > 0 && (
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
                            {topThree.map((u, i) => {
                                const medal = MEDALS[i];
                                return (
                                    <Card
                                        key={u.id}
                                        className={`animate-in delay-${i + 1}`}
                                        sx={{
                                            flex: 1, borderRadius: 4, position: 'relative', overflow: 'hidden',
                                            border: `1px solid ${medal.border}`,
                                            boxShadow: `0 8px 32px ${medal.shadow}`,
                                            bgcolor: u.is_current_user ? 'rgba(124,58,237,0.06)' : 'transparent',
                                        }}
                                    >
                                        {u.is_current_user && (
                                            <Box sx={{ position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: '50%', bgcolor: '#7c3aed', boxShadow: '0 0 0 3px rgba(124,58,237,0.2)' }} />
                                        )}
                                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                            <Typography variant="h4" sx={{ mb: 1 }}>{medal.label}</Typography>
                                            <Avatar sx={{
                                                width: 56, height: 56, mx: 'auto', mb: 1.5, borderRadius: 3,
                                                background: medal.bg, fontSize: '1.4rem', fontWeight: 800,
                                                boxShadow: `0 8px 24px ${medal.shadow}`,
                                            }}>
                                                {u.name?.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.3 }}>{u.name}</Typography>
                                            {u.is_current_user && (
                                                <Chip label="You" size="small" color="primary" sx={{ mb: 1, height: 20, fontSize: '0.65rem' }} />
                                            )}
                                            <Stack direction="row" justifyContent="center" spacing={1} flexWrap="wrap" mb={1.5}>
                                                {u.skills.slice(0, 2).map((s) => (
                                                    <Chip key={s} label={s} size="small" variant="outlined" color="primary" sx={{ height: 20, fontSize: '0.65rem' }} />
                                                ))}
                                            </Stack>
                                            <Stack direction="row" justifyContent="center" spacing={2}>
                                                <Stack alignItems="center">
                                                    <Stack direction="row" alignItems="center" spacing={0.3}>
                                                        <BoltRounded sx={{ fontSize: 14, color: '#a78bfa' }} />
                                                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#a78bfa' }}>{u.experience_points}</Typography>
                                                    </Stack>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>XP</Typography>
                                                </Stack>
                                                <Stack alignItems="center">
                                                    <Stack direction="row" alignItems="center" spacing={0.3}>
                                                        <WorkRounded sx={{ fontSize: 14, color: '#06b6d4' }} />
                                                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#06b6d4' }}>{u.project_count}</Typography>
                                                    </Stack>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>Projects</Typography>
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Stack>
                    )}

                    {/* Ranks 4–20 */}
                    {rest.length > 0 && (
                        <Stack spacing={0.8}>
                            {rest.map((u, i) => (
                                <Card
                                    key={u.id}
                                    className={`animate-in delay-${Math.min(i + 4, 6)}`}
                                    sx={{
                                        borderRadius: 3,
                                        bgcolor: u.is_current_user ? 'rgba(124,58,237,0.06)' : 'transparent',
                                        border: u.is_current_user ? '1px solid rgba(124,58,237,0.15)' : '1px solid transparent',
                                        transition: 'all 0.2s',
                                        '&:hover': { bgcolor: 'rgba(148,163,184,0.03)', borderColor: 'divider' },
                                    }}
                                >
                                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            {/* Rank */}
                                            <Typography variant="body2" sx={{ width: 28, textAlign: 'center', fontWeight: 700, color: 'text.secondary', fontSize: '0.88rem', flexShrink: 0 }}>
                                                #{u.rank}
                                            </Typography>

                                            {/* Avatar */}
                                            <Avatar sx={{
                                                width: 40, height: 40, borderRadius: 2.5, flexShrink: 0,
                                                background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
                                                fontSize: '1rem', fontWeight: 700,
                                            }}>
                                                {u.name?.charAt(0).toUpperCase()}
                                            </Avatar>

                                            {/* Info */}
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.88rem' }} noWrap>{u.name}</Typography>
                                                    {u.is_current_user && <Chip label="You" size="small" color="primary" sx={{ height: 18, fontSize: '0.6rem' }} />}
                                                </Stack>
                                                <Stack direction="row" spacing={0.6} mt={0.3} flexWrap="wrap">
                                                    {u.skills.slice(0, 3).map((s) => (
                                                        <Chip key={s} label={s} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.6rem', borderColor: 'divider' }} />
                                                    ))}
                                                </Stack>
                                            </Box>

                                            {/* Stats */}
                                            <Stack direction="row" spacing={2.5} alignItems="center" sx={{ flexShrink: 0 }}>
                                                <Stack alignItems="center">
                                                    <Stack direction="row" alignItems="center" spacing={0.3}>
                                                        <WorkRounded sx={{ fontSize: 13, color: '#06b6d4' }} />
                                                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#06b6d4' }}>{u.project_count}</Typography>
                                                    </Stack>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6rem' }}>proj</Typography>
                                                </Stack>
                                                <Stack alignItems="center">
                                                    <Stack direction="row" alignItems="center" spacing={0.3}>
                                                        <BoltRounded sx={{ fontSize: 13, color: '#a78bfa' }} />
                                                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#a78bfa' }}>{u.experience_points}</Typography>
                                                    </Stack>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6rem' }}>XP</Typography>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>
                    )}
                </>
            )}
        </Box>
    );
}
