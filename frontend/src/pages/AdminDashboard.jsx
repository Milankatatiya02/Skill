import { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../services/api';
import {
    Box, Card, CardContent, Typography, Chip, Stack, Button, Grid, TextField, MenuItem,
    Tabs, Tab, CircularProgress, Rating, Divider, Alert, IconButton, Collapse,
    LinearProgress, InputAdornment, Checkbox, Avatar, Paper, Dialog, DialogTitle,
    DialogContent, DialogActions, Tooltip,
} from '@mui/material';
import {
    AdminPanelSettingsRounded, AddRounded, CheckCircleRounded, CancelRounded,
    AccessTimeRounded, ChatBubbleOutlineRounded, OpenInNewRounded,
    DownloadRounded, ExpandMoreRounded, ExpandLessRounded, RefreshRounded,
    DashboardRounded, PeopleRounded, SearchRounded, SchoolRounded,
    TrendingUpRounded, AssignmentRounded, DeleteRounded, CategoryRounded,
    VisibilityRounded, InsertDriveFileRounded, ImageRounded, LinkRounded,
    CalendarTodayRounded, PersonRounded, DescriptionRounded,
    EditRounded, ListAltRounded, BoltRounded, SaveRounded,
} from '@mui/icons-material';
import toast from 'react-hot-toast';

// ─── Helpers ─────────────────────────────────────────────────────
const isImageUrl = (url) => /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|$)/i.test(url || '');
const formatDate = (d) => d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

// ─── Stat Card ───────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card sx={{
        borderRadius: 4,
        background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
        border: `1px solid ${color}33`,
        transition: 'all 0.3s',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 8px 32px ${color}22` },
    }}>
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, color }}>
                        {value}
                    </Typography>
                </Box>
                <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon sx={{ color, fontSize: 26 }} />
                </Box>
            </Stack>
        </CardContent>
    </Card>
);

// ─── Score Bar ───────────────────────────────────────────────────
const ScoreBar = ({ label, value, color }) => (
    <Box>
        <Stack direction="row" justifyContent="space-between" mb={0.5}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>{label}</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color }}>{value}</Typography>
        </Stack>
        <LinearProgress
            variant="determinate" value={value}
            sx={{
                height: 6, borderRadius: 3, bgcolor: 'rgba(107,114,128,0.15)',
                '& .MuiLinearProgress-bar': { borderRadius: 3, background: `linear-gradient(90deg, ${color}, ${color}bb)` },
            }}
        />
    </Box>
);

// ─── Submission Content Viewer ───────────────────────────────────
const SubmissionContent = ({ sub, compact = false }) => {
    const hasFile = !!sub.file_download;
    const hasLink = !!sub.external_link;
    const hasNotes = !!sub.notes;
    const fileIsImage = isImageUrl(sub.file_download);

    if (!hasFile && !hasLink && !hasNotes) {
        return (
            <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                No content attached
            </Typography>
        );
    }

    return (
        <Stack spacing={1.5}>
            {/* Student notes */}
            {hasNotes && (
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(148,163,184,0.04)', border: '1px solid', borderColor: 'divider' }}>
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                        <ChatBubbleOutlineRounded sx={{ fontSize: 16, color: 'text.secondary', mt: 0.3, flexShrink: 0 }} />
                        <Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.3 }}>Student Notes</Typography>
                            <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{sub.notes}</Typography>
                        </Box>
                    </Stack>
                </Box>
            )}

            {/* File preview */}
            {hasFile && (
                <Box sx={{
                    borderRadius: 2, border: '1px solid', borderColor: 'divider',
                    overflow: 'hidden', bgcolor: 'rgba(0,0,0,0.02)',
                }}>
                    {/* Image preview */}
                    {fileIsImage && !compact && (
                        <Box sx={{
                            width: '100%', maxHeight: 300, overflow: 'hidden',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            bgcolor: 'rgba(0,0,0,0.04)', borderBottom: '1px solid', borderColor: 'divider',
                        }}>
                            <Box
                                component="img"
                                src={sub.file_download}
                                alt="Submitted file"
                                sx={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain' }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        </Box>
                    )}
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: 1.5 }}>
                        {fileIsImage ? (
                            <ImageRounded sx={{ fontSize: 22, color: '#a855f7', flexShrink: 0 }} />
                        ) : (
                            <InsertDriveFileRounded sx={{ fontSize: 22, color: '#3b82f6', flexShrink: 0 }} />
                        )}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.82rem' }}>
                                Submitted File
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {sub.file_download}
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={0.5}>
                            <Tooltip title="View in new tab">
                                <IconButton component="a" href={sub.file_download} target="_blank" rel="noopener noreferrer" size="small" sx={{ color: 'primary.main' }}>
                                    <VisibilityRounded sx={{ fontSize: 18 }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Download">
                                <IconButton component="a" href={sub.file_download} download target="_blank" rel="noopener noreferrer" size="small" sx={{ color: 'secondary.main' }}>
                                    <DownloadRounded sx={{ fontSize: 18 }} />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Stack>
                </Box>
            )}

            {/* External link */}
            {hasLink && (
                <Box sx={{ p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'rgba(0,0,0,0.02)' }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <LinkRounded sx={{ fontSize: 22, color: '#10b981', flexShrink: 0 }} />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.82rem' }}>External Link</Typography>
                            <Typography
                                component="a"
                                href={sub.external_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="caption"
                                sx={{
                                    color: '#3b82f6', textDecoration: 'none', display: 'block',
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                    '&:hover': { textDecoration: 'underline' },
                                }}
                            >
                                {sub.external_link}
                            </Typography>
                        </Box>
                        <Tooltip title="Open link">
                            <IconButton component="a" href={sub.external_link} target="_blank" rel="noopener noreferrer" size="small" sx={{ color: '#10b981' }}>
                                <OpenInNewRounded sx={{ fontSize: 18 }} />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Box>
            )}
        </Stack>
    );
};

// ─── Submission Card (unified for pending + reviewed) ────────────
const SubmissionCard = ({ sub, isPending, expandedId, setExpandedId, reviewData, setReviewData, reviewingId, handleReview, selectedIds, setSelectedIds }) => {
    const isExpanded = expandedId === sub.id;
    const isReviewing = reviewingId === sub.id;
    const isSelected = isPending && selectedIds.has(sub.id);

    const borderColor = isPending ? 'warning.main' : sub.status === 'approved' ? 'success.main' : 'error.main';
    const statusColor = sub.status === 'pending' ? 'warning' : sub.status === 'approved' ? 'success' : 'error';

    return (
        <Card sx={{
            borderRadius: 3,
            borderLeft: '3px solid',
            borderLeftColor: borderColor,
            transition: 'all 0.2s',
            '&:hover': { boxShadow: 3 },
            opacity: !isPending && !isExpanded ? 0.75 : 1,
        }}>
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <Stack spacing={2}>
                    {/* Header row */}
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Stack direction="row" alignItems="flex-start" spacing={1.5} sx={{ flex: 1 }}>
                            {isPending && (
                                <Checkbox
                                    checked={isSelected}
                                    onChange={(e) => {
                                        setSelectedIds((prev) => {
                                            const n = new Set(prev);
                                            e.target.checked ? n.add(sub.id) : n.delete(sub.id);
                                            return n;
                                        });
                                    }}
                                    size="small"
                                    sx={{ mt: -0.5, ml: -0.5 }}
                                />
                            )}
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                                    {sub.task_title}
                                </Typography>
                                <Stack direction="row" alignItems="center" spacing={1} mt={0.5} flexWrap="wrap" useFlexGap>
                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                        <PersonRounded sx={{ fontSize: 14, color: 'text.secondary' }} />
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                            <strong>{sub.user_name}</strong> ({sub.user_email})
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                        <CalendarTodayRounded sx={{ fontSize: 12, color: 'text.secondary' }} />
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{formatDate(sub.submitted_at)}</Typography>
                                    </Stack>
                                    {/* Content indicators */}
                                    {sub.file_download && (
                                        <Tooltip title="Has file submission">
                                            <Chip icon={<InsertDriveFileRounded sx={{ fontSize: 14 }} />} label="File" size="small"
                                                sx={{ height: 22, fontSize: '0.7rem', bgcolor: 'rgba(59,130,246,0.1)', color: '#3b82f6', '& .MuiChip-icon': { color: '#3b82f6' } }} />
                                        </Tooltip>
                                    )}
                                    {sub.external_link && (
                                        <Tooltip title="Has external link">
                                            <Chip icon={<LinkRounded sx={{ fontSize: 14 }} />} label="Link" size="small"
                                                sx={{ height: 22, fontSize: '0.7rem', bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981', '& .MuiChip-icon': { color: '#10b981' } }} />
                                        </Tooltip>
                                    )}
                                    {sub.notes && (
                                        <Tooltip title="Has student notes">
                                            <Chip icon={<DescriptionRounded sx={{ fontSize: 14 }} />} label="Notes" size="small"
                                                sx={{ height: 22, fontSize: '0.7rem', bgcolor: 'rgba(168,85,247,0.1)', color: '#a855f7', '& .MuiChip-icon': { color: '#a855f7' } }} />
                                        </Tooltip>
                                    )}
                                </Stack>
                            </Box>
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Chip label={sub.status} size="small" color={statusColor} sx={{ textTransform: 'capitalize', fontWeight: 600 }} />
                            {sub.rating > 0 && (
                                <Rating value={sub.rating} readOnly size="small" sx={{ '& .MuiRating-iconFilled': { color: '#fbbf24' } }} />
                            )}
                            <Tooltip title={isExpanded ? 'Collapse' : 'View details & content'}>
                                <IconButton size="small" onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                                    sx={{ bgcolor: isExpanded ? 'action.selected' : 'transparent' }}>
                                    {isExpanded ? <ExpandLessRounded /> : <ExpandMoreRounded />}
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Stack>

                    {/* Admin feedback (visible even collapsed for reviewed items) */}
                    {!isPending && !isExpanded && (sub.feedback || sub.reviewed_by_name) && (
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ pl: 0.5 }}>
                            {sub.reviewed_by_name && (
                                <Chip
                                    icon={<PersonRounded sx={{ fontSize: 14 }} />}
                                    label={`Reviewed by ${sub.reviewed_by_name}`}
                                    size="small"
                                    sx={{ height: 22, fontSize: '0.7rem', bgcolor: 'rgba(59,130,246,0.1)', color: '#3b82f6', '& .MuiChip-icon': { color: '#3b82f6' } }}
                                />
                            )}
                            {sub.feedback && (
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                                    &ldquo;{sub.feedback}&rdquo;
                                </Typography>
                            )}
                        </Stack>
                    )}

                    {/* Expanded content */}
                    <Collapse in={isExpanded}>
                        <Stack spacing={2.5} sx={{ pt: 1 }}>
                            <Divider />

                            {/* Submitted content viewer */}
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                    <VisibilityRounded sx={{ fontSize: 18, color: 'primary.light' }} /> Submitted Content
                                </Typography>
                                <SubmissionContent sub={sub} />
                            </Box>

                            {/* Review info for reviewed items */}
                            {!isPending && (
                                <Box sx={{ p: 2, borderRadius: 2, bgcolor: sub.status === 'approved' ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)', border: '1px solid', borderColor: sub.status === 'approved' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)' }}>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: sub.status === 'approved' ? '#10b981' : '#ef4444' }}>
                                            {sub.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                                            {sub.reviewed_at && <Typography component="span" variant="caption" sx={{ ml: 1, color: 'text.secondary', fontWeight: 400 }}>on {formatDate(sub.reviewed_at)}</Typography>}
                                        </Typography>
                                        {sub.reviewed_by_name && (
                                            <Chip
                                                icon={<PersonRounded sx={{ fontSize: 14 }} />}
                                                label={`by ${sub.reviewed_by_name}`}
                                                size="small"
                                                sx={{ fontWeight: 600, bgcolor: 'rgba(59,130,246,0.1)', color: '#3b82f6', '& .MuiChip-icon': { color: '#3b82f6' } }}
                                            />
                                        )}
                                    </Stack>
                                    {sub.rating > 0 && (
                                        <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                                            <Typography variant="caption" sx={{ fontWeight: 600 }}>Rating:</Typography>
                                            <Rating value={sub.rating} readOnly size="small" sx={{ '& .MuiRating-iconFilled': { color: '#fbbf24' } }} />
                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>({sub.rating}/5)</Typography>
                                        </Stack>
                                    )}
                                    {sub.feedback && (
                                        <Box>
                                            <Typography variant="caption" sx={{ fontWeight: 600 }}>Feedback:</Typography>
                                            <Typography variant="body2" sx={{ mt: 0.3, fontSize: '0.85rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{sub.feedback}</Typography>
                                        </Box>
                                    )}
                                </Box>
                            )}

                            {/* Review controls for pending items */}
                            {isPending && (
                                <>
                                    <Divider />
                                    <Stack spacing={2}>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mb: 0.5, display: 'block' }}>
                                                Rate this submission (optional)
                                            </Typography>
                                            <Rating
                                                value={Number(reviewData[sub.id]?.rating) || 0}
                                                onChange={(_, v) => setReviewData({ ...reviewData, [sub.id]: { ...reviewData[sub.id], rating: v } })}
                                                size="large"
                                                sx={{ '& .MuiRating-iconFilled': { color: '#fbbf24' } }}
                                            />
                                        </Box>
                                        <TextField
                                            size="small" label="Feedback to student" multiline rows={2}
                                            placeholder="Write feedback for the student..."
                                            value={reviewData[sub.id]?.feedback || ''}
                                            onChange={(e) => setReviewData({ ...reviewData, [sub.id]: { ...reviewData[sub.id], feedback: e.target.value } })}
                                        />
                                        <Stack direction="row" spacing={1.5}>
                                            <Button variant="contained" color="success" disabled={isReviewing}
                                                startIcon={isReviewing ? <CircularProgress size={16} color="inherit" /> : <CheckCircleRounded />}
                                                onClick={() => handleReview(sub.id, 'approved')}
                                                sx={{ borderRadius: 2, px: 3, background: 'linear-gradient(135deg, #10b981, #059669)', '&:hover': { background: 'linear-gradient(135deg, #34d399, #10b981)' } }}>
                                                Approve
                                            </Button>
                                            <Button variant="outlined" color="error" disabled={isReviewing}
                                                startIcon={<CancelRounded />}
                                                onClick={() => handleReview(sub.id, 'rejected')} sx={{ borderRadius: 2, px: 3 }}>
                                                Reject
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </>
                            )}
                        </Stack>
                    </Collapse>

                    {/* Quick actions for pending (collapsed) */}
                    {isPending && !isExpanded && (
                        <>
                            <Divider />
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                <Button variant="contained" color="success" size="small" disabled={isReviewing}
                                    startIcon={isReviewing ? <CircularProgress size={14} color="inherit" /> : <CheckCircleRounded sx={{ fontSize: 16 }} />}
                                    onClick={() => handleReview(sub.id, 'approved')}
                                    sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #10b981, #059669)', '&:hover': { background: 'linear-gradient(135deg, #34d399, #10b981)' } }}>
                                    Approve
                                </Button>
                                <Button variant="outlined" color="error" size="small" disabled={isReviewing}
                                    startIcon={<CancelRounded sx={{ fontSize: 16 }} />}
                                    onClick={() => handleReview(sub.id, 'rejected')} sx={{ borderRadius: 2 }}>
                                    Reject
                                </Button>
                                <Tooltip title="Expand to view content, add rating & feedback">
                                    <Button size="small" startIcon={<VisibilityRounded sx={{ fontSize: 14 }} />}
                                        onClick={() => setExpandedId(sub.id)}
                                        sx={{ borderRadius: 2, textTransform: 'none', ml: 'auto', color: 'text.secondary' }}>
                                        View Content
                                    </Button>
                                </Tooltip>
                            </Stack>
                        </>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
};


export default function AdminDashboard() {
    const [tab, setTab] = useState(0);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviewData, setReviewData] = useState({});
    const [reviewingId, setReviewingId] = useState(null);
    const [skills, setSkills] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [stats, setStats] = useState(null);
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [studentSearch, setStudentSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [newSkillName, setNewSkillName] = useState('');
    const [addingSkill, setAddingSkill] = useState(false);
    const [expandedStudentId, setExpandedStudentId] = useState(null);
    const [taskForm, setTaskForm] = useState({
        title: '', description: '', skill_required: '', difficulty: 'easy', deadline: '', reward_points: 10,
    });
    const [creating, setCreating] = useState(false);

    // Task management state
    const [allTasks, setAllTasks] = useState([]);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [taskSearch, setTaskSearch] = useState('');
    const [updatingTask, setUpdatingTask] = useState(false);

    const fetchData = useCallback(() => {
        setLoading(true);
        setError(null);
        Promise.all([
            api.get('/submissions/all/'),
            api.get('/skills/'),
            api.get('/submissions/stats/'),
            api.get('/submissions/students/'),
            api.get('/tasks/'),
        ])
            .then(([s, sk, st, stu, tsk]) => {
                setSubmissions(s.data);
                setSkills(sk.data);
                setStats(st.data);
                setStudents(stu.data);
                setAllTasks(tsk.data);
            })
            .catch((err) => setError(err.response?.data?.detail || 'Failed to load data'))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // ─── Submission review ───────────────────────────────────────
    const handleReview = async (id, reviewStatus) => {
        const d = reviewData[id] || {};
        const payload = { status: reviewStatus, feedback: d.feedback || '' };
        if (d.rating && d.rating > 0) payload.rating = Math.round(d.rating);

        setReviewingId(id);
        try {
            const res = await api.post(`/submissions/${id}/review/`, payload);
            setSubmissions((prev) => prev.map((s) => (s.id === id ? res.data : s)));
            setReviewData((prev) => { const n = { ...prev }; delete n[id]; return n; });
            setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
            toast.success(`Submission ${reviewStatus === 'approved' ? 'approved ✓' : 'rejected'}`);
            api.get('/submissions/stats/').then(r => setStats(r.data));
        } catch (err) {
            toast.error(err.response?.data?.detail || err.response?.data?.status?.[0] || 'Review failed.');
        } finally {
            setReviewingId(null);
        }
    };

    const handleBulkReview = async (reviewStatus) => {
        const ids = Array.from(selectedIds);
        for (const id of ids) await handleReview(id, reviewStatus);
        setSelectedIds(new Set());
    };

    // ─── Create task ─────────────────────────────────────────────
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
            api.get('/submissions/stats/').then(r => setStats(r.data));
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to create task');
        } finally {
            setCreating(false);
        }
    };

    // ─── Skill management ────────────────────────────────────────
    const handleAddSkill = async () => {
        if (!newSkillName.trim()) return;
        setAddingSkill(true);
        try {
            const res = await api.post('/skills/add/', { name: newSkillName.trim() });
            setSkills((prev) => [...prev, res.data]);
            setNewSkillName('');
            toast.success('Skill added!');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to add skill');
        } finally {
            setAddingSkill(false);
        }
    };

    const handleDeleteSkill = async (id) => {
        try {
            await api.delete(`/skills/${id}/delete/`);
            setSkills((prev) => prev.filter((s) => s.id !== id));
            toast.success('Skill deleted');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to delete skill');
        }
    };

    // ─── Task management ─────────────────────────────────────────
    const startEditTask = (task) => {
        setEditingTaskId(task.id);
        setEditForm({
            title: task.title,
            description: task.description,
            difficulty: task.difficulty,
            deadline: task.deadline ? task.deadline.slice(0, 16) : '',
            reward_points: task.reward_points,
        });
    };

    const handleUpdateTask = async (id) => {
        setUpdatingTask(true);
        try {
            const res = await api.patch(`/tasks/${id}/update/`, editForm);
            setAllTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
            setEditingTaskId(null);
            toast.success('Task updated!');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to update task');
        } finally {
            setUpdatingTask(false);
        }
    };

    const handleDeleteTask = async (id) => {
        if (!window.confirm('Delete this task? This cannot be undone.')) return;
        try {
            await api.delete(`/tasks/${id}/delete/`);
            setAllTasks((prev) => prev.filter((t) => t.id !== id));
            toast.success('Task deleted');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to delete task');
        }
    };

    const filteredTasks = useMemo(() => {
        if (!taskSearch) return allTasks;
        const q = taskSearch.toLowerCase();
        return allTasks.filter((t) =>
            t.title?.toLowerCase().includes(q) ||
            t.description?.toLowerCase().includes(q) ||
            t.skill_required_name?.toLowerCase().includes(q)
        );
    }, [allTasks, taskSearch]);

    // ─── Filtered data ───────────────────────────────────────────
    const filteredSubmissions = useMemo(() => {
        let list = submissions;
        if (statusFilter !== 'all') list = list.filter((s) => s.status === statusFilter);
        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            list = list.filter((s) =>
                s.task_title?.toLowerCase().includes(q) ||
                s.user_name?.toLowerCase().includes(q) ||
                s.user_email?.toLowerCase().includes(q)
            );
        }
        return list;
    }, [submissions, statusFilter, searchTerm]);

    const pending = filteredSubmissions.filter((s) => s.status === 'pending');
    const reviewed = filteredSubmissions.filter((s) => s.status !== 'pending');

    const filteredStudents = useMemo(() => {
        if (!studentSearch) return students;
        const q = studentSearch.toLowerCase();
        return students.filter((s) => s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q));
    }, [students, studentSearch]);

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

    return (
        <Stack spacing={3} className="animate-in">
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
                        <AdminPanelSettingsRounded sx={{ color: 'primary.light' }} /> Admin Dashboard
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Manage your platform at a glance
                    </Typography>
                </Box>
                <Button startIcon={<RefreshRounded />} onClick={fetchData} variant="outlined" size="small" sx={{ borderRadius: 2 }}>
                    Refresh
                </Button>
            </Stack>

            {/* Tabs */}
            <Tabs
                value={tab} onChange={(_, v) => setTab(v)}
                variant="scrollable" scrollButtons="auto"
                sx={{
                    '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.85rem', minHeight: 44 },
                    '& .MuiTabs-indicator': { height: 3, borderRadius: 2 },
                }}
            >
                <Tab icon={<DashboardRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Dashboard" />
                <Tab
                    icon={<AccessTimeRounded sx={{ fontSize: 18 }} />} iconPosition="start"
                    label={
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <span>Submissions</span>
                            {submissions.filter(s => s.status === 'pending').length > 0 && (
                                <Chip label={submissions.filter(s => s.status === 'pending').length} size="small" color="warning" sx={{ height: 20, fontSize: '0.7rem' }} />
                            )}
                        </Stack>
                    }
                />
                <Tab icon={<PeopleRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Students" />
                <Tab icon={<CategoryRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Skills" />
                <Tab icon={<ListAltRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Tasks" />
                <Tab icon={<AddRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Create Task" />
            </Tabs>


            {/* ════════════ TAB 0: Dashboard ════════════ */}
            {tab === 0 && stats && (
                <Stack spacing={3}>
                    <Grid container spacing={2.5}>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard title="Total Students" value={stats.total_students} icon={SchoolRounded} color="#a855f7" /></Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard title="Total Tasks" value={stats.total_tasks} icon={AssignmentRounded} color="#3b82f6" /></Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard title="Pending Review" value={stats.pending_submissions} icon={AccessTimeRounded} color="#f59e0b" /></Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard title="Approved" value={stats.approved_submissions} icon={CheckCircleRounded} color="#10b981" /></Grid>
                    </Grid>

                    <Grid container spacing={2.5}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card sx={{ borderRadius: 4, height: '100%' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <TrendingUpRounded sx={{ color: 'primary.light', fontSize: 20 }} /> Submission Overview
                                    </Typography>
                                    <Stack spacing={2}>
                                        <ScoreBar label="Approval Rate" value={stats.total_submissions > 0 ? Math.round((stats.approved_submissions / stats.total_submissions) * 100) : 0} color="#10b981" />
                                        <ScoreBar label="Rejection Rate" value={stats.total_submissions > 0 ? Math.round((stats.rejected_submissions / stats.total_submissions) * 100) : 0} color="#ef4444" />
                                        <ScoreBar label="Pending" value={stats.total_submissions > 0 ? Math.round((stats.pending_submissions / stats.total_submissions) * 100) : 0} color="#f59e0b" />
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card sx={{ borderRadius: 4, height: '100%' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CategoryRounded sx={{ color: 'primary.light', fontSize: 20 }} /> Platform Summary
                                    </Typography>
                                    <Stack spacing={2.5}>
                                        {[
                                            { label: 'Total Submissions', val: stats.total_submissions },
                                            { label: 'Active Skills', val: skills.length },
                                            { label: 'Rejected', val: stats.rejected_submissions },
                                        ].map((item, i) => (
                                            <Stack key={i} direction="row" justifyContent="space-between" alignItems="center">
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{item.label}</Typography>
                                                <Chip label={item.val} size="small" sx={{ fontWeight: 700 }} />
                                            </Stack>
                                        ))}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Stack>
            )}


            {/* ════════════ TAB 1: Submissions ════════════ */}
            {tab === 1 && (
                <Stack spacing={2.5}>
                    {/* Search + Filter bar */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                        <TextField
                            size="small" placeholder="Search by student or task..."
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><SearchRounded sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment>,
                            }}
                            sx={{ minWidth: 280 }}
                        />
                        <TextField select size="small" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 140 }}>
                            <MenuItem value="all">All Status</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="approved">Approved</MenuItem>
                            <MenuItem value="rejected">Rejected</MenuItem>
                        </TextField>
                        {selectedIds.size > 0 && (
                            <Stack direction="row" spacing={1}>
                                <Button size="small" variant="contained" color="success" onClick={() => handleBulkReview('approved')}
                                    sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                                    Approve ({selectedIds.size})
                                </Button>
                                <Button size="small" variant="outlined" color="error" onClick={() => handleBulkReview('rejected')} sx={{ borderRadius: 2 }}>
                                    Reject ({selectedIds.size})
                                </Button>
                            </Stack>
                        )}
                    </Stack>

                    {filteredSubmissions.length === 0 && (
                        <Card sx={{ borderRadius: 4, p: 6, textAlign: 'center' }}>
                            <AccessTimeRounded sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                            <Typography variant="body1" sx={{ mb: 0.5 }}>No submissions found</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Try adjusting your search or filter</Typography>
                        </Card>
                    )}

                    {/* Pending submissions */}
                    {pending.length > 0 && (
                        <>
                            <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                <AccessTimeRounded sx={{ fontSize: 16, color: 'warning.light' }} />
                                Pending Review ({pending.length})
                            </Typography>
                            {pending.map((sub) => (
                                <SubmissionCard
                                    key={sub.id} sub={sub} isPending={true}
                                    expandedId={expandedId} setExpandedId={setExpandedId}
                                    reviewData={reviewData} setReviewData={setReviewData}
                                    reviewingId={reviewingId} handleReview={handleReview}
                                    selectedIds={selectedIds} setSelectedIds={setSelectedIds}
                                />
                            ))}
                        </>
                    )}

                    {/* Reviewed submissions */}
                    {reviewed.length > 0 && (
                        <>
                            <Typography variant="subtitle2" sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                <CheckCircleRounded sx={{ fontSize: 16, color: 'text.secondary' }} />
                                Reviewed ({reviewed.length})
                            </Typography>
                            {reviewed.map((sub) => (
                                <SubmissionCard
                                    key={sub.id} sub={sub} isPending={false}
                                    expandedId={expandedId} setExpandedId={setExpandedId}
                                    reviewData={reviewData} setReviewData={setReviewData}
                                    reviewingId={reviewingId} handleReview={handleReview}
                                    selectedIds={selectedIds} setSelectedIds={setSelectedIds}
                                />
                            ))}
                        </>
                    )}
                </Stack>
            )}


            {/* ════════════ TAB 2: Students ════════════ */}
            {tab === 2 && (
                <Stack spacing={2.5}>
                    <TextField
                        size="small" placeholder="Search students by name or email..."
                        value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchRounded sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment>,
                        }}
                        sx={{ maxWidth: 400 }}
                    />

                    {filteredStudents.length === 0 && (
                        <Card sx={{ borderRadius: 4, p: 6, textAlign: 'center' }}>
                            <PeopleRounded sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                            <Typography variant="body1">No students found</Typography>
                        </Card>
                    )}

                    {filteredStudents.map((student) => {
                        const isExpanded = expandedStudentId === student.id;
                        return (
                            <Card key={student.id} sx={{ borderRadius: 3, transition: 'all 0.2s', '&:hover': { boxShadow: 3 } }}>
                                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                    <Stack spacing={1.5}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar sx={{ width: 42, height: 42, bgcolor: 'rgba(168,85,247,0.15)', color: '#a855f7', fontWeight: 700, fontSize: '0.9rem' }}>
                                                    {student.name?.charAt(0)?.toUpperCase() || '?'}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{student.name}</Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{student.email}</Typography>
                                                </Box>
                                            </Stack>
                                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                                <Chip label={`${student.experience_points} XP`} size="small" sx={{ fontWeight: 700, bgcolor: 'rgba(168,85,247,0.12)', color: '#a855f7' }} />
                                                <Chip label={`${student.approved_submissions}/${student.total_submissions} approved`} size="small" color={student.approved_submissions > 0 ? 'success' : 'default'} />
                                                <IconButton size="small" onClick={() => setExpandedStudentId(isExpanded ? null : student.id)}>
                                                    {isExpanded ? <ExpandLessRounded /> : <ExpandMoreRounded />}
                                                </IconButton>
                                            </Stack>
                                        </Stack>

                                        <Collapse in={isExpanded}>
                                            <Stack spacing={2} sx={{ mt: 1 }}>
                                                {student.skills?.length > 0 && (
                                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                        {student.skills.map((s, i) => (
                                                            <Chip key={i} label={s} size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} />
                                                        ))}
                                                    </Stack>
                                                )}
                                                {student.bio && (
                                                    <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                                                        &ldquo;{student.bio}&rdquo;
                                                    </Typography>
                                                )}
                                                {student.skill_score ? (
                                                    <Paper sx={{ p: 2.5, borderRadius: 2, bgcolor: 'rgba(168,85,247,0.04)', border: '1px solid', borderColor: 'divider' }}>
                                                        <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Skill Score</Typography>
                                                            <Chip label={student.skill_score.overall_score} size="small"
                                                                sx={{ fontWeight: 800, bgcolor: 'rgba(168,85,247,0.15)', color: '#a855f7', fontSize: '0.85rem' }} />
                                                        </Stack>
                                                        <Grid container spacing={2}>
                                                            <Grid size={{ xs: 6 }}><ScoreBar label="Quality" value={student.skill_score.quality_score} color="#a855f7" /></Grid>
                                                            <Grid size={{ xs: 6 }}><ScoreBar label="Consistency" value={student.skill_score.consistency_score} color="#3b82f6" /></Grid>
                                                            <Grid size={{ xs: 6 }}><ScoreBar label="Problem-Solving" value={student.skill_score.problem_solving_score} color="#f59e0b" /></Grid>
                                                            <Grid size={{ xs: 6 }}><ScoreBar label="Improvement" value={student.skill_score.improvement_score} color="#10b981" /></Grid>
                                                        </Grid>
                                                    </Paper>
                                                ) : (
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                                                        No skill score yet — calculated after first submission review
                                                    </Typography>
                                                )}
                                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                    Joined {new Date(student.created_at).toLocaleDateString()}
                                                </Typography>
                                            </Stack>
                                        </Collapse>
                                    </Stack>
                                </CardContent>
                            </Card>
                        );
                    })}
                </Stack>
            )}


            {/* ════════════ TAB 3: Skills ════════════ */}
            {tab === 3 && (
                <Stack spacing={2.5}>
                    <Card sx={{ borderRadius: 4 }}>
                        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AddRounded sx={{ color: 'primary.light' }} /> Add New Skill
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                <TextField
                                    size="small" placeholder="e.g. Machine Learning, Flutter, Node.js..."
                                    value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                                    sx={{ flex: 1 }}
                                />
                                <Button variant="contained" onClick={handleAddSkill} disabled={addingSkill || !newSkillName.trim()}
                                    startIcon={addingSkill ? <CircularProgress size={16} color="inherit" /> : <AddRounded />}
                                    sx={{ borderRadius: 2, px: 3 }}>
                                    Add
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>

                    <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <CategoryRounded sx={{ fontSize: 16, color: 'text.secondary' }} />
                        All Skills ({skills.length})
                    </Typography>

                    <Grid container spacing={1.5}>
                        {skills.map((skill) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={skill.id}>
                                <Card sx={{ borderRadius: 2, transition: 'all 0.2s', '&:hover': { boxShadow: 2 } }}>
                                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{skill.name}</Typography>
                                            <IconButton size="small" onClick={() => handleDeleteSkill(skill.id)}
                                                sx={{ color: 'error.main', opacity: 0.6, '&:hover': { opacity: 1 } }}>
                                                <DeleteRounded sx={{ fontSize: 18 }} />
                                            </IconButton>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Stack>
            )}


            {/* ════════════ TAB 4: Manage Tasks ════════════ */}
            {tab === 4 && (
                <Stack spacing={2.5}>
                    <TextField
                        size="small" placeholder="Search tasks by title, description, or skill..."
                        value={taskSearch} onChange={(e) => setTaskSearch(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchRounded sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment>,
                        }}
                        sx={{ maxWidth: 400 }}
                    />

                    <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <ListAltRounded sx={{ fontSize: 16, color: 'text.secondary' }} />
                        All Tasks ({filteredTasks.length})
                    </Typography>

                    {filteredTasks.length === 0 && (
                        <Card sx={{ borderRadius: 4, p: 6, textAlign: 'center' }}>
                            <ListAltRounded sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                            <Typography variant="body1">No tasks found</Typography>
                        </Card>
                    )}

                    {filteredTasks.map((task) => {
                        const isEditing = editingTaskId === task.id;
                        return (
                            <Card key={task.id} sx={{ borderRadius: 3, transition: 'all 0.2s', '&:hover': { boxShadow: 3 } }}>
                                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                    {isEditing ? (
                                        <Stack spacing={2}>
                                            <TextField size="small" label="Title" value={editForm.title}
                                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} fullWidth />
                                            <TextField size="small" label="Description" value={editForm.description}
                                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} multiline rows={3} fullWidth />
                                            <Stack direction="row" spacing={2}>
                                                <TextField select size="small" label="Difficulty" value={editForm.difficulty}
                                                    onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value })} sx={{ minWidth: 120 }}>
                                                    <MenuItem value="easy">Easy</MenuItem>
                                                    <MenuItem value="medium">Medium</MenuItem>
                                                    <MenuItem value="hard">Hard</MenuItem>
                                                </TextField>
                                                <TextField size="small" label="Deadline" type="datetime-local" value={editForm.deadline}
                                                    onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })} InputLabelProps={{ shrink: true }} />
                                                <TextField size="small" label="XP" type="number" value={editForm.reward_points}
                                                    onChange={(e) => setEditForm({ ...editForm, reward_points: e.target.value })} sx={{ width: 100 }} inputProps={{ min: 1 }} />
                                            </Stack>
                                            <Stack direction="row" spacing={1}>
                                                <Button variant="contained" size="small" startIcon={updatingTask ? <CircularProgress size={14} color="inherit" /> : <SaveRounded />}
                                                    onClick={() => handleUpdateTask(task.id)} disabled={updatingTask}
                                                    sx={{ borderRadius: 2, textTransform: 'none' }}>
                                                    Save
                                                </Button>
                                                <Button size="small" onClick={() => setEditingTaskId(null)} sx={{ borderRadius: 2, textTransform: 'none' }}>
                                                    Cancel
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    ) : (
                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{task.title}</Typography>
                                                <Typography variant="body2" sx={{
                                                    color: 'text.secondary', fontSize: '0.82rem', mt: 0.3,
                                                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                                }}>
                                                    {task.description}
                                                </Typography>
                                                <Stack direction="row" spacing={0.8} mt={1} flexWrap="wrap" useFlexGap>
                                                    <Chip label={task.skill_required_name} size="small" color="primary" />
                                                    <Chip label={task.difficulty} size="small" color={task.difficulty === 'easy' ? 'success' : task.difficulty === 'medium' ? 'warning' : 'error'} />
                                                    <Chip icon={<BoltRounded sx={{ fontSize: 12 }} />} label={`+${task.reward_points} XP`} size="small" variant="outlined" color="primary" />
                                                    {task.deadline && (
                                                        <Chip icon={<CalendarTodayRounded sx={{ fontSize: 12 }} />}
                                                            label={`Due ${new Date(task.deadline).toLocaleDateString()}`} size="small" variant="outlined" />
                                                    )}
                                                </Stack>
                                            </Box>
                                            <Stack direction="row" spacing={0.5}>
                                                <Tooltip title="Edit task">
                                                    <IconButton size="small" onClick={() => startEditTask(task)}
                                                        sx={{ color: 'primary.main', bgcolor: 'rgba(124,58,237,0.08)', '&:hover': { bgcolor: 'rgba(124,58,237,0.15)' } }}>
                                                        <EditRounded sx={{ fontSize: 18 }} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete task">
                                                    <IconButton size="small" onClick={() => handleDeleteTask(task.id)}
                                                        sx={{ color: 'error.main', bgcolor: 'rgba(239,68,68,0.08)', '&:hover': { bgcolor: 'rgba(239,68,68,0.15)' } }}>
                                                        <DeleteRounded sx={{ fontSize: 18 }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </Stack>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </Stack>
            )}

            {/* ════════════ TAB 5: Create Task ════════════ */}
            {tab === 5 && (
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
                                <Button type="submit" variant="contained" size="large"
                                    startIcon={creating ? <CircularProgress size={18} color="inherit" /> : <AddRounded />}
                                    disabled={creating} fullWidth sx={{ py: 1.4 }}>
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
