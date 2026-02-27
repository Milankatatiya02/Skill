import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
    Box, Card, CardContent, CardActionArea, Typography, Chip, Grid, Stack, Avatar, CircularProgress,
} from '@mui/material';
import { BoltRounded, TaskAltRounded, PlayCircleRounded, AutoAwesomeRounded, TrendingUpRounded, ArrowForwardRounded } from '@mui/icons-material';

const STAT_CFG = [
    { key: 'xp', label: 'Experience', unit: 'XP', icon: BoltRounded, gradient: 'linear-gradient(135deg, #7c3aed, #6d28d9)', glow: 'rgba(124,58,237,0.12)' },
    { key: 'completed', label: 'Completed', unit: 'tasks', icon: TaskAltRounded, gradient: 'linear-gradient(135deg, #10b981, #059669)', glow: 'rgba(16,185,129,0.12)' },
    { key: 'active', label: 'In Progress', unit: 'tasks', icon: PlayCircleRounded, gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', glow: 'rgba(245,158,11,0.12)' },
    { key: 'skills', label: 'Skills', unit: 'selected', icon: AutoAwesomeRounded, gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)', glow: 'rgba(6,182,212,0.12)' },
];

export default function Dashboard() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [myTasks, setMyTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([api.get('/tasks/'), api.get('/tasks/my/')]).then(([t, m]) => {
            setTasks(t.data); setMyTasks(m.data);
        }).finally(() => setLoading(false));
    }, []);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}><CircularProgress /></Box>;

    const completedCount = myTasks.filter((a) => a.status === 'completed').length;
    const activeCount = myTasks.filter((a) => a.status === 'accepted').length;
    const statValues = { xp: user?.experience_points || 0, completed: completedCount, active: activeCount, skills: user?.skills?.length || 0 };

    return (
        <Stack spacing={4}>
            {/* Stats */}
            <Grid container spacing={2.5}>
                {STAT_CFG.map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <Grid key={s.key} size={{ xs: 12, sm: 6, md: 3 }}>
                            <Card className={`animate-in delay-${i + 1}`} sx={{ borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Avatar sx={{ width: 44, height: 44, borderRadius: 2.5, background: s.gradient, mb: 2, boxShadow: `0 6px 20px ${s.glow}` }}>
                                        <Icon sx={{ fontSize: 22 }} />
                                    </Avatar>
                                    <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1, display: 'flex', alignItems: 'baseline', gap: 0.8 }}>
                                        {statValues[s.key]}
                                        <Typography component="span" variant="body2" sx={{ fontWeight: 500 }}>{s.unit}</Typography>
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 0.5, fontSize: '0.78rem' }}>{s.label}</Typography>
                                </CardContent>
                                {/* Glow */}
                                <Box sx={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: s.gradient, opacity: 0.06, filter: 'blur(30px)' }} />
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Skills */}
            <Card sx={{ borderRadius: 4 }}>
                <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AutoAwesomeRounded sx={{ fontSize: 18, color: 'primary.light' }} /> Your Skills
                        </Typography>
                        <Typography component={Link} to="/skills" variant="body2" sx={{ color: 'primary.light', textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>
                            Edit
                        </Typography>
                    </Stack>
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                        {user?.skills?.length ? user.skills.map((s, i) => <Chip key={i} label={s} color="primary" size="small" />) : (
                            <Typography variant="body2">
                                <Typography component={Link} to="/skills" sx={{ color: 'primary.light', textDecoration: 'none' }}>Select your skills</Typography>
                            </Typography>
                        )}
                    </Stack>
                </CardContent>
            </Card>

            {/* Recommended Tasks */}
            <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUpRounded sx={{ fontSize: 18, color: 'success.light' }} /> Recommended Tasks
                    </Typography>
                    <Typography component={Link} to="/tasks" variant="body2" sx={{ color: 'primary.light', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 0.5, '&:hover': { textDecoration: 'underline' } }}>
                        View all <ArrowForwardRounded sx={{ fontSize: 14 }} />
                    </Typography>
                </Stack>

                {tasks.length === 0 ? (
                    <Card sx={{ borderRadius: 4, p: 6, textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ mb: 1 }}>📋</Typography>
                        <Typography variant="body2">No tasks available yet. Check back soon!</Typography>
                    </Card>
                ) : (
                    <Grid container spacing={2.5}>
                        {tasks.slice(0, 6).map((task, i) => (
                            <Grid key={task.id} size={{ xs: 12, sm: 6, md: 4 }}>
                                <Card className={`animate-in delay-${Math.min(i + 1, 6)}`} sx={{ borderRadius: 4, height: '100%' }}>
                                    <CardActionArea component={Link} to={`/tasks/${task.id}`} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                        <Box sx={{ width: '100%' }}>
                                            <Stack direction="row" spacing={0.8} mb={1.5}>
                                                <Chip label={task.difficulty} size="small" color={task.difficulty === 'easy' ? 'success' : task.difficulty === 'medium' ? 'warning' : 'error'} />
                                                <Chip label={task.skill_required_name} size="small" color="primary" />
                                            </Stack>
                                            <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600, mb: 0.5 }}>{task.title}</Typography>
                                            <Typography variant="body2" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '0.82rem', lineHeight: 1.5 }}>
                                                {task.description}
                                            </Typography>
                                        </Box>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                                            <Chip icon={<BoltRounded sx={{ fontSize: 14 }} />} label={`+${task.reward_points} XP`} size="small" color="primary" variant="outlined" />
                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                Due {new Date(task.deadline).toLocaleDateString()}
                                            </Typography>
                                        </Stack>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Stack>
    );
}
