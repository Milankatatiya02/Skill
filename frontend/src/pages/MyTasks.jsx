import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
    Box, Card, CardContent, Typography, Chip, Stack, Button, CircularProgress, Avatar,
} from '@mui/material';
import { TaskAltRounded, AccessTimeRounded, CloudUploadRounded, ArrowForwardRounded, BoltRounded } from '@mui/icons-material';

export default function MyTasks() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { api.get('/tasks/my/').then((r) => setAssignments(r.data)).finally(() => setLoading(false)); }, []);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}><CircularProgress /></Box>;

    const active = assignments.filter((a) => a.status === 'accepted');
    const completed = assignments.filter((a) => a.status === 'completed');

    return (
        <Stack spacing={4}>
            <Box>
                <Typography variant="h5">My Tasks</Typography>
                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                    {assignments.length} total &bull; {active.length} active &bull; {completed.length} completed
                </Typography>
            </Box>

            {assignments.length === 0 ? (
                <Card sx={{ borderRadius: 4, p: 6, textAlign: 'center' }}>
                    <TaskAltRounded sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body1" sx={{ mb: 0.5 }}>No tasks yet</Typography>
                    <Typography variant="body2" sx={{ mb: 2.5, fontSize: '0.82rem' }}>Accept tasks to start building your portfolio</Typography>
                    <Button component={Link} to="/tasks" variant="contained" endIcon={<ArrowForwardRounded />}>
                        Browse Tasks
                    </Button>
                </Card>
            ) : (
                <>
                    {active.length > 0 && (
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                <AccessTimeRounded sx={{ fontSize: 16, color: 'warning.light' }} /> In Progress ({active.length})
                            </Typography>
                            <Stack spacing={1.5}>
                                {active.map((a, i) => (
                                    <Card key={a.id} className={`animate-in delay-${Math.min(i + 1, 6)}`} sx={{ borderRadius: 3 }}>
                                        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <Avatar sx={{ width: 10, height: 10, bgcolor: 'warning.main', borderRadius: '50%' }}>&nbsp;</Avatar>
                                                <Box>
                                                    <Typography component={Link} to={`/tasks/${a.task.id}`} variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', textDecoration: 'none', '&:hover': { color: 'primary.light' } }}>
                                                        {a.task.title}
                                                    </Typography>
                                                    <Stack direction="row" spacing={0.8} mt={0.5}>
                                                        <Chip label={a.task.skill_required_name} size="small" color="primary" />
                                                        <Chip icon={<BoltRounded sx={{ fontSize: 12 }} />} label={`+${a.task.reward_points} XP`} size="small" variant="outlined" color="primary" />
                                                    </Stack>
                                                </Box>
                                            </Stack>
                                            <Button component={Link} to="/submit" state={{ taskId: a.task.id, taskTitle: a.task.title }}
                                                variant="outlined" size="small" startIcon={<CloudUploadRounded sx={{ fontSize: 16 }} />}
                                                sx={{ borderRadius: 2, textTransform: 'none' }}>
                                                Submit
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                        </Box>
                    )}

                    {completed.length > 0 && (
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                <TaskAltRounded sx={{ fontSize: 16, color: 'success.light' }} /> Completed ({completed.length})
                            </Typography>
                            <Stack spacing={1}>
                                {completed.map((a) => (
                                    <Card key={a.id} sx={{ borderRadius: 3, opacity: 0.7 }}>
                                        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <Avatar sx={{ width: 10, height: 10, bgcolor: 'success.main', borderRadius: '50%' }}>&nbsp;</Avatar>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{a.task.title}</Typography>
                                            </Stack>
                                            <Chip label="Completed" size="small" color="success" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                        </Box>
                    )}
                </>
            )}
        </Stack>
    );
}
