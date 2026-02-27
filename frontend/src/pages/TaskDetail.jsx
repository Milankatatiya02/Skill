import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    Box, Card, CardContent, Typography, Chip, Stack, Button, Grid, CircularProgress,
} from '@mui/material';
import { ArrowBackRounded, BoltRounded, CalendarTodayRounded, BarChartRounded, CheckCircleRounded, CloudUploadRounded } from '@mui/icons-material';
import toast from 'react-hot-toast';

export default function TaskDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accepting, setAccepting] = useState(false);

    useEffect(() => { api.get(`/tasks/${id}/`).then((r) => { setTask(r.data); setLoading(false); }); }, [id]);

    const handleAccept = async () => {
        setAccepting(true);
        try {
            await api.post(`/tasks/${id}/accept/`);
            setTask((t) => ({ ...t, is_accepted: true }));
            toast.success('Task accepted!');
        } catch (err) { toast.error(err.response?.data?.detail || 'Failed'); }
        finally { setAccepting(false); }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}><CircularProgress /></Box>;
    if (!task) return <Typography color="text.secondary">Task not found.</Typography>;

    return (
        <Box sx={{ maxWidth: 740, mx: 'auto' }} className="animate-in">
            <Button startIcon={<ArrowBackRounded />} onClick={() => navigate(-1)} sx={{ mb: 3, color: 'text.secondary' }}>
                Back to tasks
            </Button>

            <Card sx={{ borderRadius: 4 }}>
                <CardContent sx={{ p: 4 }}>
                    <Stack spacing={3}>
                        <Box>
                            <Stack direction="row" spacing={0.8} mb={1.5}>
                                <Chip label={task.difficulty} size="small" color={task.difficulty === 'easy' ? 'success' : task.difficulty === 'medium' ? 'warning' : 'error'} />
                                <Chip label={task.skill_required_name} size="small" color="primary" />
                            </Stack>
                            <Typography variant="h5">{task.title}</Typography>
                        </Box>

                        <Grid container spacing={2}>
                            {[
                                { icon: BoltRounded, label: 'Reward', value: `+${task.reward_points} XP`, color: 'primary.light' },
                                { icon: CalendarTodayRounded, label: 'Deadline', value: new Date(task.deadline).toLocaleDateString(), color: 'warning.light' },
                                { icon: BarChartRounded, label: 'Difficulty', value: task.difficulty, color: 'success.light' },
                            ].map((s) => (
                                <Grid key={s.label} size={{ xs: 4 }}>
                                    <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'rgba(148,163,184,0.03)', border: '1px solid', borderColor: 'divider' }}>
                                        <Stack direction="row" alignItems="center" spacing={0.8} mb={0.5}>
                                            <s.icon sx={{ fontSize: 16, color: s.color }} />
                                            <Typography variant="subtitle2" sx={{ fontSize: '0.65rem' }}>{s.label}</Typography>
                                        </Stack>
                                        <Typography variant="h6" sx={{ color: s.color, textTransform: 'capitalize' }}>{s.value}</Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>

                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Description</Typography>
                            <Typography variant="body2" sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{task.description}</Typography>
                        </Box>

                        <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                            {task.is_accepted ? (
                                <Button variant="contained" color="success" startIcon={<CloudUploadRounded />}
                                    onClick={() => navigate('/submit', { state: { taskId: task.id, taskTitle: task.title } })}
                                    sx={{ background: 'linear-gradient(135deg, #10b981, #059669)', '&:hover': { background: 'linear-gradient(135deg, #34d399, #10b981)' } }}>
                                    Submit Work
                                </Button>
                            ) : (
                                <Button variant="contained" startIcon={accepting ? null : <CheckCircleRounded />} disabled={accepting} onClick={handleAccept}>
                                    {accepting ? <CircularProgress size={22} color="inherit" /> : 'Accept Task'}
                                </Button>
                            )}
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}
