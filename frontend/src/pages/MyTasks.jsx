import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    Box, Card, CardContent, Typography, Chip, Stack, Button, CircularProgress, Avatar,
    Collapse, IconButton, Tooltip, Rating, Divider,
} from '@mui/material';
import {
    TaskAltRounded, AccessTimeRounded, CloudUploadRounded, ArrowForwardRounded,
    BoltRounded, EditRounded, ExpandMoreRounded, ExpandLessRounded,
    CheckCircleRounded, CancelRounded, VisibilityRounded, ReplayRounded,
    InsertDriveFileRounded, LinkRounded, DescriptionRounded, DeleteRounded,
} from '@mui/icons-material';
import toast from 'react-hot-toast';

const formatDate = (d) => d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

export default function MyTasks() {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedSubId, setExpandedSubId] = useState(null);

    useEffect(() => {
        Promise.all([
            api.get('/tasks/my/'),
            api.get('/submissions/my/'),
        ]).then(([taskRes, subRes]) => {
            setAssignments(taskRes.data);
            setSubmissions(subRes.data);
        }).finally(() => setLoading(false));
    }, []);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}><CircularProgress /></Box>;

    const active = assignments.filter((a) => a.status === 'accepted');
    const completed = assignments.filter((a) => a.status === 'completed');

    const pending = submissions.filter((s) => s.status === 'pending');
    const approved = submissions.filter((s) => s.status === 'approved');
    const rejected = submissions.filter((s) => s.status === 'rejected');

    const handleEdit = (sub) => {
        navigate('/submit', {
            state: { editSubmission: sub },
        });
    };

    const handleDelete = async (subId) => {
        if (!window.confirm('Are you sure you want to delete this submission?')) return;
        try {
            await api.delete(`/submissions/${subId}/delete/`);
            setSubmissions((prev) => prev.filter((s) => s.id !== subId));
            toast.success('Submission deleted');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to delete submission.');
        }
    };

    const statusIcon = (s) => {
        if (s === 'pending') return <AccessTimeRounded sx={{ fontSize: 16, color: 'warning.main' }} />;
        if (s === 'approved') return <CheckCircleRounded sx={{ fontSize: 16, color: 'success.main' }} />;
        return <CancelRounded sx={{ fontSize: 16, color: 'error.main' }} />;
    };

    const statusColor = (s) => s === 'pending' ? 'warning' : s === 'approved' ? 'success' : 'error';

    return (
        <Stack spacing={4}>
            <Box>
                <Typography variant="h5">My Tasks & Submissions</Typography>
                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                    {assignments.length} tasks &bull; {submissions.length} submissions
                </Typography>
            </Box>

            {/* ═══════════ Active Tasks ═══════════ */}
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

            {/* ═══════════ My Submissions ═══════════ */}
            {submissions.length > 0 && (
                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <DescriptionRounded sx={{ fontSize: 16, color: 'primary.light' }} /> My Submissions ({submissions.length})
                    </Typography>

                    {/* Pending */}
                    {pending.length > 0 && (
                        <Stack spacing={1.5} sx={{ mb: 2 }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'warning.main' }}>
                                Pending Review ({pending.length})
                            </Typography>
                            {pending.map((sub) => {
                                const isExpanded = expandedSubId === sub.id;
                                return (
                                    <Card key={sub.id} sx={{ borderRadius: 3, borderLeft: '3px solid', borderLeftColor: 'warning.main' }}>
                                        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                            <Stack spacing={1}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Stack direction="row" alignItems="center" spacing={1.5}>
                                                        {statusIcon(sub.status)}
                                                        <Box>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{sub.task_title}</Typography>
                                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Submitted {formatDate(sub.submitted_at)}</Typography>
                                                        </Box>
                                                    </Stack>
                                                    <Stack direction="row" spacing={1}>
                                                        <Chip label="Pending" size="small" color="warning" sx={{ fontWeight: 600 }} />
                                                        <Tooltip title="Edit submission">
                                                            <IconButton size="small" onClick={() => handleEdit(sub)}
                                                                sx={{ color: 'primary.main', bgcolor: 'rgba(124,58,237,0.08)', '&:hover': { bgcolor: 'rgba(124,58,237,0.15)' } }}>
                                                                <EditRounded sx={{ fontSize: 18 }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete submission">
                                                            <IconButton size="small" onClick={() => handleDelete(sub.id)}
                                                                sx={{ color: 'error.main', bgcolor: 'rgba(239,68,68,0.08)', '&:hover': { bgcolor: 'rgba(239,68,68,0.15)' } }}>
                                                                <DeleteRounded sx={{ fontSize: 18 }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <IconButton size="small" onClick={() => setExpandedSubId(isExpanded ? null : sub.id)}>
                                                            {isExpanded ? <ExpandLessRounded /> : <ExpandMoreRounded />}
                                                        </IconButton>
                                                    </Stack>
                                                </Stack>
                                                {/* Content indicators */}
                                                <Stack direction="row" spacing={0.8}>
                                                    {sub.file_download && <Chip icon={<InsertDriveFileRounded sx={{ fontSize: 13 }} />} label="File" size="small" sx={{ height: 20, fontSize: '0.68rem', bgcolor: 'rgba(59,130,246,0.1)', color: '#3b82f6', '& .MuiChip-icon': { color: '#3b82f6' } }} />}
                                                    {sub.external_link && <Chip icon={<LinkRounded sx={{ fontSize: 13 }} />} label="Link" size="small" sx={{ height: 20, fontSize: '0.68rem', bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981', '& .MuiChip-icon': { color: '#10b981' } }} />}
                                                    {sub.notes && <Chip icon={<DescriptionRounded sx={{ fontSize: 13 }} />} label="Notes" size="small" sx={{ height: 20, fontSize: '0.68rem', bgcolor: 'rgba(168,85,247,0.1)', color: '#a855f7', '& .MuiChip-icon': { color: '#a855f7' } }} />}
                                                </Stack>
                                                <Collapse in={isExpanded}>
                                                    <Stack spacing={1} sx={{ mt: 1 }}>
                                                        {sub.notes && <Typography variant="body2" sx={{ fontSize: '0.82rem', whiteSpace: 'pre-wrap', bgcolor: 'rgba(0,0,0,0.02)', p: 1.5, borderRadius: 1.5 }}>{sub.notes}</Typography>}
                                                        {sub.external_link && (
                                                            <Typography component="a" href={sub.external_link} target="_blank" rel="noopener noreferrer" variant="body2" sx={{ color: '#3b82f6', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                                                                🔗 {sub.external_link}
                                                            </Typography>
                                                        )}
                                                        {sub.file_download && (
                                                            <Button component="a" href={sub.file_download} target="_blank" rel="noopener noreferrer" size="small" startIcon={<VisibilityRounded sx={{ fontSize: 14 }} />} sx={{ alignSelf: 'flex-start', textTransform: 'none' }}>
                                                                View uploaded file
                                                            </Button>
                                                        )}
                                                    </Stack>
                                                </Collapse>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Stack>
                    )}

                    {/* Rejected */}
                    {rejected.length > 0 && (
                        <Stack spacing={1.5} sx={{ mb: 2 }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'error.main' }}>
                                Rejected — Needs Revision ({rejected.length})
                            </Typography>
                            {rejected.map((sub) => {
                                const isExpanded = expandedSubId === sub.id;
                                return (
                                    <Card key={sub.id} sx={{ borderRadius: 3, borderLeft: '3px solid', borderLeftColor: 'error.main' }}>
                                        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                            <Stack spacing={1}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Stack direction="row" alignItems="center" spacing={1.5}>
                                                        {statusIcon(sub.status)}
                                                        <Box>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{sub.task_title}</Typography>
                                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Submitted {formatDate(sub.submitted_at)}</Typography>
                                                        </Box>
                                                    </Stack>
                                                    <Stack direction="row" spacing={1}>
                                                        <Chip label="Rejected" size="small" color="error" sx={{ fontWeight: 600 }} />
                                                        <Tooltip title="Edit & resubmit">
                                                            <Button size="small" variant="contained" startIcon={<ReplayRounded sx={{ fontSize: 16 }} />}
                                                                onClick={() => handleEdit(sub)}
                                                                sx={{
                                                                    borderRadius: 2, textTransform: 'none', fontSize: '0.75rem',
                                                                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                                                    '&:hover': { background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' },
                                                                }}>
                                                                Resubmit
                                                            </Button>
                                                        </Tooltip>
                                                        <Tooltip title="Delete submission">
                                                            <IconButton size="small" onClick={() => handleDelete(sub.id)}
                                                                sx={{ color: 'error.main', bgcolor: 'rgba(239,68,68,0.08)', '&:hover': { bgcolor: 'rgba(239,68,68,0.15)' } }}>
                                                                <DeleteRounded sx={{ fontSize: 18 }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <IconButton size="small" onClick={() => setExpandedSubId(isExpanded ? null : sub.id)}>
                                                            {isExpanded ? <ExpandLessRounded /> : <ExpandMoreRounded />}
                                                        </IconButton>
                                                    </Stack>
                                                </Stack>
                                                {sub.feedback && (
                                                    <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                                                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'error.main' }}>Faculty Feedback:</Typography>
                                                        <Typography variant="body2" sx={{ fontSize: '0.82rem', mt: 0.3 }}>{sub.feedback}</Typography>
                                                    </Box>
                                                )}
                                                {sub.rating > 0 && (
                                                    <Rating value={sub.rating} readOnly size="small" sx={{ '& .MuiRating-iconFilled': { color: '#fbbf24' } }} />
                                                )}
                                                <Collapse in={isExpanded}>
                                                    <Stack spacing={1} sx={{ mt: 1 }}>
                                                        {sub.notes && <Typography variant="body2" sx={{ fontSize: '0.82rem', whiteSpace: 'pre-wrap', bgcolor: 'rgba(0,0,0,0.02)', p: 1.5, borderRadius: 1.5 }}>{sub.notes}</Typography>}
                                                        {sub.external_link && (
                                                            <Typography component="a" href={sub.external_link} target="_blank" rel="noopener noreferrer" variant="body2" sx={{ color: '#3b82f6', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                                                                🔗 {sub.external_link}
                                                            </Typography>
                                                        )}
                                                        {sub.file_download && (
                                                            <Button component="a" href={sub.file_download} target="_blank" rel="noopener noreferrer" size="small" startIcon={<VisibilityRounded sx={{ fontSize: 14 }} />} sx={{ alignSelf: 'flex-start', textTransform: 'none' }}>
                                                                View uploaded file
                                                            </Button>
                                                        )}
                                                    </Stack>
                                                </Collapse>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Stack>
                    )}

                    {/* Approved */}
                    {approved.length > 0 && (
                        <Stack spacing={1.5}>
                            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'success.main' }}>
                                Approved ({approved.length})
                            </Typography>
                            {approved.map((sub) => {
                                const isExpanded = expandedSubId === sub.id;
                                return (
                                    <Card key={sub.id} sx={{ borderRadius: 3, borderLeft: '3px solid', borderLeftColor: 'success.main', opacity: 0.85 }}>
                                        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                            <Stack spacing={1}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Stack direction="row" alignItems="center" spacing={1.5}>
                                                        {statusIcon(sub.status)}
                                                        <Box>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{sub.task_title}</Typography>
                                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Approved {formatDate(sub.reviewed_at)}</Typography>
                                                        </Box>
                                                    </Stack>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <Chip label="Approved" size="small" color="success" sx={{ fontWeight: 600 }} />
                                                        {sub.rating > 0 && (
                                                            <Rating value={sub.rating} readOnly size="small" sx={{ '& .MuiRating-iconFilled': { color: '#fbbf24' } }} />
                                                        )}
                                                        <IconButton size="small" onClick={() => setExpandedSubId(isExpanded ? null : sub.id)}>
                                                            {isExpanded ? <ExpandLessRounded /> : <ExpandMoreRounded />}
                                                        </IconButton>
                                                    </Stack>
                                                </Stack>
                                                {sub.feedback && !isExpanded && (
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                                                        &ldquo;{sub.feedback}&rdquo;
                                                    </Typography>
                                                )}
                                                <Collapse in={isExpanded}>
                                                    <Stack spacing={1} sx={{ mt: 1 }}>
                                                        {sub.feedback && (
                                                            <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                                                                <Typography variant="caption" sx={{ fontWeight: 600, color: 'success.main' }}>Faculty Feedback:</Typography>
                                                                <Typography variant="body2" sx={{ fontSize: '0.82rem', mt: 0.3 }}>{sub.feedback}</Typography>
                                                            </Box>
                                                        )}
                                                        {sub.notes && <Typography variant="body2" sx={{ fontSize: '0.82rem', whiteSpace: 'pre-wrap', bgcolor: 'rgba(0,0,0,0.02)', p: 1.5, borderRadius: 1.5 }}>{sub.notes}</Typography>}
                                                        {sub.external_link && (
                                                            <Typography component="a" href={sub.external_link} target="_blank" rel="noopener noreferrer" variant="body2" sx={{ color: '#3b82f6', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                                                                🔗 {sub.external_link}
                                                            </Typography>
                                                        )}
                                                        {sub.file_download && (
                                                            <Button component="a" href={sub.file_download} target="_blank" rel="noopener noreferrer" size="small" startIcon={<VisibilityRounded sx={{ fontSize: 14 }} />} sx={{ alignSelf: 'flex-start', textTransform: 'none' }}>
                                                                View uploaded file
                                                            </Button>
                                                        )}
                                                    </Stack>
                                                </Collapse>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Stack>
                    )}
                </Box>
            )}

            {/* ═══════════ Completed Tasks (no submissions) ═══════════ */}
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

            {/* Empty state */}
            {assignments.length === 0 && submissions.length === 0 && (
                <Card sx={{ borderRadius: 4, p: 6, textAlign: 'center' }}>
                    <TaskAltRounded sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body1" sx={{ mb: 0.5 }}>No tasks yet</Typography>
                    <Typography variant="body2" sx={{ mb: 2.5, fontSize: '0.82rem' }}>Accept tasks to start building your portfolio</Typography>
                    <Button component={Link} to="/tasks" variant="contained" endIcon={<ArrowForwardRounded />}>
                        Browse Tasks
                    </Button>
                </Card>
            )}
        </Stack>
    );
}
