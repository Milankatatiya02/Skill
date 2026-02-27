import { useState, useEffect } from 'react';
import api from '../services/api';
import {
    Box, Card, CardContent, Typography, Chip, Stack, Button, Grid, TextField, MenuItem,
    Tabs, Tab, CircularProgress, Rating, Divider, Alert, IconButton, Collapse,
} from '@mui/material';
import {
    AdminPanelSettingsRounded, AddRounded, CheckCircleRounded, CancelRounded,
    AccessTimeRounded, ChatBubbleOutlineRounded, OpenInNewRounded,
    DownloadRounded, ExpandMoreRounded, ExpandLessRounded, RefreshRounded,
} from '@mui/icons-material';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
    const [tab, setTab] = useState(0);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviewData, setReviewData] = useState({});
    const [reviewingId, setReviewingId] = useState(null);
    const [skills, setSkills] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [taskForm, setTaskForm] = useState({
        title: '', description: '', skill_required: '', difficulty: 'easy', deadline: '', reward_points: 10,
    });
    const [creating, setCreating] = useState(false);

    const fetchData = () => {
        setLoading(true);
        setError(null);
        Promise.all([api.get('/submissions/all/'), api.get('/skills/')])
            .then(([s, sk]) => {
                setSubmissions(s.data);
                setSkills(sk.data);
            })
            .catch((err) => {
                setError(err.response?.data?.detail || 'Failed to load data');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchData(); }, []);

    const handleReview = async (id, reviewStatus) => {
        const d = reviewData[id] || {};
        const payload = { status: reviewStatus, feedback: d.feedback || '' };
        if (d.rating && d.rating > 0) {
            payload.rating = Math.round(d.rating);
        }

        setReviewingId(id);
        try {
            const res = await api.post(`/submissions/${id}/review/`, payload);
            setSubmissions((prev) => prev.map((s) => (s.id === id ? res.data : s)));
            setReviewData((prev) => { const n = { ...prev }; delete n[id]; return n; });
            toast.success(`Submission ${reviewStatus === 'approved' ? 'approved ✓' : 'rejected'}`);
        } catch (err) {
            const msg = err.response?.data?.detail || err.response?.data?.status?.[0] || 'Review failed. Please try again.';
            toast.error(msg);
        } finally {
            setReviewingId(null);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            await api.post('/tasks/create/', {
                ...taskForm,
                reward_points: parseInt(taskForm.reward_points),
                skill_required: parseInt(taskForm.skill_required),
            });
            toast.success('Task created!');
            setTaskForm({ title: '', description: '', skill_required: '', difficulty: 'easy', deadline: '', reward_points: 10 });
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to create task');
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ borderRadius: 3 }}>
                {error}
                <Button size="small" onClick={fetchData} sx={{ ml: 2 }}>Retry</Button>
            </Alert>
        );
    }

    const pending = submissions.filter((s) => s.status === 'pending');
    const reviewed = submissions.filter((s) => s.status !== 'pending');

    return (
        <Stack spacing={3} className="animate-in">
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AdminPanelSettingsRounded sx={{ color: 'primary.light' }} /> Admin Dashboard
                    </Typography>
                    <Typography variant="body2">Manage submissions and create tasks</Typography>
                </Box>
                <Button
                    startIcon={<RefreshRounded />}
                    onClick={fetchData}
                    variant="outlined"
                    size="small"
                    sx={{ borderRadius: 2 }}
                >
                    Refresh
                </Button>
            </Stack>

            <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                sx={{
                    '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.85rem', minHeight: 44 },
                    '& .MuiTabs-indicator': { height: 3, borderRadius: 2 },
                }}
            >
                <Tab
                    icon={<AccessTimeRounded sx={{ fontSize: 18 }} />}
                    iconPosition="start"
                    label={
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <span>Submissions</span>
                            {pending.length > 0 && (
                                <Chip label={pending.length} size="small" color="warning" sx={{ height: 20, fontSize: '0.7rem' }} />
                            )}
                        </Stack>
                    }
                />
                <Tab icon={<AddRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Create Task" />
            </Tabs>

            {/* ─── Submissions Tab ─── */}
            {tab === 0 && (
                <Stack spacing={2.5}>
                    {submissions.length === 0 && (
                        <Card sx={{ borderRadius: 4, p: 6, textAlign: 'center' }}>
                            <AccessTimeRounded sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                            <Typography variant="body1" sx={{ mb: 0.5 }}>No submissions yet</Typography>
                            <Typography variant="body2">Student submissions will appear here</Typography>
                        </Card>
                    )}

                    {/* Pending */}
                    {pending.length > 0 && (
                        <>
                            <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                <AccessTimeRounded sx={{ fontSize: 16, color: 'warning.light' }} />
                                Pending Review ({pending.length})
                            </Typography>

                            {pending.map((sub) => {
                                const isExpanded = expandedId === sub.id;
                                const isReviewing = reviewingId === sub.id;

                                return (
                                    <Card key={sub.id} sx={{ borderRadius: 3, borderLeft: '3px solid', borderLeftColor: 'warning.main' }}>
                                        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                                            <Stack spacing={2}>
                                                {/* Header */}
                                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                            {sub.task_title}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                            Submitted by <strong>{sub.user_name}</strong> ({sub.user_email})
                                                            &nbsp;•&nbsp;{new Date(sub.submitted_at).toLocaleString()}
                                                        </Typography>
                                                    </Box>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <Chip label="Pending" size="small" color="warning" />
                                                        <IconButton size="small" onClick={() => setExpandedId(isExpanded ? null : sub.id)}>
                                                            {isExpanded ? <ExpandLessRounded /> : <ExpandMoreRounded />}
                                                        </IconButton>
                                                    </Stack>
                                                </Stack>

                                                {/* Student Notes */}
                                                {sub.notes && (
                                                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(148,163,184,0.04)', border: '1px solid', borderColor: 'divider' }}>
                                                        <Stack direction="row" spacing={1}>
                                                            <ChatBubbleOutlineRounded sx={{ fontSize: 16, color: 'text.secondary', mt: 0.3, flexShrink: 0 }} />
                                                            <Typography variant="body2" sx={{ fontSize: '0.82rem' }}>{sub.notes}</Typography>
                                                        </Stack>
                                                    </Box>
                                                )}

                                                {/* Attachments */}
                                                <Stack direction="row" spacing={1.5} flexWrap="wrap">
                                                    {sub.external_link && (
                                                        <Button
                                                            component="a"
                                                            href={sub.external_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            size="small"
                                                            variant="outlined"
                                                            startIcon={<OpenInNewRounded sx={{ fontSize: 14 }} />}
                                                            sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.78rem' }}
                                                        >
                                                            External Link
                                                        </Button>
                                                    )}
                                                    {sub.file_download && (
                                                        <Button
                                                            component="a"
                                                            href={sub.file_download}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            size="small"
                                                            variant="outlined"
                                                            color="secondary"
                                                            startIcon={<DownloadRounded sx={{ fontSize: 14 }} />}
                                                            sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.78rem' }}
                                                        >
                                                            Download File
                                                        </Button>
                                                    )}
                                                    {!sub.external_link && !sub.file_download && (
                                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                                                            No attachments
                                                        </Typography>
                                                    )}
                                                </Stack>

                                                {/* Review Controls — always visible */}
                                                <Divider />

                                                <Collapse in={!isExpanded} timeout={0}>
                                                    {/* Quick Actions */}
                                                    <Stack direction="row" alignItems="center" spacing={1.5}>
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            size="small"
                                                            disabled={isReviewing}
                                                            startIcon={isReviewing ? <CircularProgress size={14} color="inherit" /> : <CheckCircleRounded sx={{ fontSize: 16 }} />}
                                                            onClick={() => handleReview(sub.id, 'approved')}
                                                            sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #10b981, #059669)', '&:hover': { background: 'linear-gradient(135deg, #34d399, #10b981)' } }}
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            size="small"
                                                            disabled={isReviewing}
                                                            startIcon={<CancelRounded sx={{ fontSize: 16 }} />}
                                                            onClick={() => handleReview(sub.id, 'rejected')}
                                                            sx={{ borderRadius: 2 }}
                                                        >
                                                            Reject
                                                        </Button>
                                                        <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
                                                            Click expand for rating & feedback
                                                        </Typography>
                                                    </Stack>
                                                </Collapse>

                                                <Collapse in={isExpanded}>
                                                    {/* Detailed Review */}
                                                    <Stack spacing={2}>
                                                        <Box>
                                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mb: 0.5, display: 'block' }}>
                                                                Rating (optional)
                                                            </Typography>
                                                            <Rating
                                                                value={Number(reviewData[sub.id]?.rating) || 0}
                                                                onChange={(_, v) => setReviewData({ ...reviewData, [sub.id]: { ...reviewData[sub.id], rating: v } })}
                                                                size="medium"
                                                                sx={{ '& .MuiRating-iconFilled': { color: '#fbbf24' } }}
                                                            />
                                                        </Box>
                                                        <TextField
                                                            size="small"
                                                            label="Feedback"
                                                            multiline
                                                            rows={2}
                                                            placeholder="Write feedback for the student..."
                                                            value={reviewData[sub.id]?.feedback || ''}
                                                            onChange={(e) => setReviewData({ ...reviewData, [sub.id]: { ...reviewData[sub.id], feedback: e.target.value } })}
                                                        />
                                                        <Stack direction="row" spacing={1.5}>
                                                            <Button
                                                                variant="contained"
                                                                color="success"
                                                                disabled={isReviewing}
                                                                startIcon={isReviewing ? <CircularProgress size={16} color="inherit" /> : <CheckCircleRounded />}
                                                                onClick={() => handleReview(sub.id, 'approved')}
                                                                sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #10b981, #059669)', '&:hover': { background: 'linear-gradient(135deg, #34d399, #10b981)' } }}
                                                            >
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                variant="outlined"
                                                                color="error"
                                                                disabled={isReviewing}
                                                                startIcon={<CancelRounded />}
                                                                onClick={() => handleReview(sub.id, 'rejected')}
                                                                sx={{ borderRadius: 2 }}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </Stack>
                                                    </Stack>
                                                </Collapse>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </>
                    )}

                    {/* Reviewed */}
                    {reviewed.length > 0 && (
                        <>
                            <Typography variant="subtitle2" sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                <CheckCircleRounded sx={{ fontSize: 16, color: 'text.secondary' }} />
                                Reviewed ({reviewed.length})
                            </Typography>
                            {reviewed.map((sub) => (
                                <Card key={sub.id} sx={{ borderRadius: 3, opacity: 0.65 }}>
                                    <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                                    {sub.task_title}
                                                </Typography>
                                                <Stack direction="row" alignItems="center" spacing={1} mt={0.3}>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                        by {sub.user_name}
                                                    </Typography>
                                                    {sub.rating && (
                                                        <Rating value={sub.rating} readOnly size="small" sx={{ '& .MuiRating-iconFilled': { color: '#fbbf24' }, '& .MuiRating-iconEmpty': { color: 'rgba(148,163,184,0.15)' } }} />
                                                    )}
                                                    {sub.feedback && (
                                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                                                            "{sub.feedback}"
                                                        </Typography>
                                                    )}
                                                </Stack>
                                            </Box>
                                            <Chip
                                                label={sub.status}
                                                size="small"
                                                color={sub.status === 'approved' ? 'success' : 'error'}
                                                sx={{ textTransform: 'capitalize' }}
                                            />
                                        </Stack>
                                    </CardContent>
                                </Card>
                            ))}
                        </>
                    )}
                </Stack>
            )}

            {/* ─── Create Task Tab ─── */}
            {tab === 1 && (
                <Card sx={{ borderRadius: 4, maxWidth: 640 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AddRounded sx={{ color: 'primary.light' }} /> New Task
                        </Typography>
                        <Box component="form" onSubmit={handleCreateTask}>
                            <Stack spacing={2.5}>
                                <TextField label="Title" required value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="Design a logo concept" />
                                <TextField label="Description" required multiline rows={4} value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} placeholder="Describe the task requirements..." />
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 6 }}>
                                        <TextField select label="Skill" required value={taskForm.skill_required} onChange={(e) => setTaskForm({ ...taskForm, skill_required: e.target.value })}>
                                            <MenuItem value="">Select</MenuItem>
                                            {skills.map((s) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                                        </TextField>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <TextField select label="Difficulty" value={taskForm.difficulty} onChange={(e) => setTaskForm({ ...taskForm, difficulty: e.target.value })}>
                                            <MenuItem value="easy">Easy</MenuItem>
                                            <MenuItem value="medium">Medium</MenuItem>
                                            <MenuItem value="hard">Hard</MenuItem>
                                        </TextField>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 6 }}>
                                        <TextField label="Deadline" type="datetime-local" required value={taskForm.deadline} onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })} InputLabelProps={{ shrink: true }} />
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <TextField label="Reward Points" type="number" required value={taskForm.reward_points} onChange={(e) => setTaskForm({ ...taskForm, reward_points: e.target.value })} inputProps={{ min: 1 }} />
                                    </Grid>
                                </Grid>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    startIcon={creating ? <CircularProgress size={18} color="inherit" /> : <AddRounded />}
                                    disabled={creating}
                                    fullWidth
                                    sx={{ py: 1.4 }}
                                >
                                    {creating ? 'Creating...' : 'Create Task'}
                                </Button>
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Stack>
    );
}
