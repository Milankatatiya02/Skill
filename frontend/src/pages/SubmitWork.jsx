import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    Box, Card, CardContent, Typography, TextField, Button, Stack,
    MenuItem, LinearProgress, InputAdornment, CircularProgress, Alert, Chip,
} from '@mui/material';
import {
    CloudUploadRounded, LinkRounded, NotesRounded, ArrowForwardRounded,
    CheckCircleRounded, EditRounded, InsertDriveFileRounded,
} from '@mui/icons-material';
import toast from 'react-hot-toast';

export default function SubmitWork() {
    const location = useLocation();
    const navigate = useNavigate();

    // Edit mode: passed via route state
    const editSubmission = location.state?.editSubmission || null;
    const isEditing = !!editSubmission;

    const [myTasks, setMyTasks] = useState([]);
    const [form, setForm] = useState({
        task: location.state?.taskId || editSubmission?.task || '',
        external_link: editSubmission?.external_link || '',
        notes: editSubmission?.notes || '',
    });
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!isEditing) {
            api.get('/tasks/my/').then((r) => setMyTasks(r.data.filter((a) => a.status === 'accepted')));
        }
    }, [isEditing]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (isEditing) {
                // PATCH existing submission
                const fd = new FormData();
                fd.append('external_link', form.external_link);
                fd.append('notes', form.notes);
                if (file) fd.append('file_url', file);
                await api.patch(`/submissions/${editSubmission.id}/edit/`, fd, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total)),
                });
                setSuccess(true);
                toast.success(editSubmission.status === 'rejected' ? 'Resubmitted for review!' : 'Submission updated!');
            } else {
                // POST new submission
                const fd = new FormData();
                fd.append('task', form.task);
                fd.append('external_link', form.external_link);
                fd.append('notes', form.notes);
                if (file) fd.append('file_url', file);
                await api.post('/submissions/upload/', fd, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total)),
                });
                setSuccess(true);
                toast.success('Work submitted!');
            }
            setTimeout(() => navigate('/my-tasks'), 2000);
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <Box sx={{ maxWidth: 480, mx: 'auto', mt: 10 }} className="animate-in">
                <Card sx={{ borderRadius: 4, textAlign: 'center', p: 6 }}>
                    <CheckCircleRounded sx={{ fontSize: 56, color: 'success.main', mb: 2 }} />
                    <Typography variant="h5">
                        {isEditing ? 'Submission Updated!' : 'Submission Sent!'}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        {isEditing && editSubmission.status === 'rejected'
                            ? 'Your work has been resubmitted for admin review.'
                            : isEditing
                                ? 'Your changes have been saved.'
                                : 'Your work has been submitted for admin review.'}
                    </Typography>
                </Card>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 640, mx: 'auto' }} className="animate-in">
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {isEditing ? <EditRounded /> : <CloudUploadRounded />}
                {isEditing ? 'Edit Submission' : 'Submit Work'}
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
                {isEditing ? 'Update your submission details' : 'Upload your completed work for review'}
            </Typography>

            {/* Edit mode: show which task and current status */}
            {isEditing && (
                <Alert
                    severity={editSubmission.status === 'rejected' ? 'warning' : 'info'}
                    icon={editSubmission.status === 'rejected' ? undefined : <EditRounded />}
                    sx={{ mb: 2, borderRadius: 2 }}
                >
                    <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
                        <Typography variant="body2">
                            Editing submission for <strong>{editSubmission.task_title}</strong>
                        </Typography>
                        <Chip
                            label={editSubmission.status === 'rejected' ? 'Rejected — will resubmit for review' : 'Pending'}
                            size="small"
                            color={editSubmission.status === 'rejected' ? 'warning' : 'info'}
                            sx={{ fontWeight: 600 }}
                        />
                    </Stack>
                    {editSubmission.feedback && (
                        <Typography variant="caption" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
                            Previous feedback: &ldquo;{editSubmission.feedback}&rdquo;
                        </Typography>
                    )}
                </Alert>
            )}

            <Card sx={{ borderRadius: 4 }}>
                <CardContent sx={{ p: 4 }}>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            {/* Task selector: only for new submissions */}
                            {!isEditing && (
                                <TextField
                                    select label="Task" required value={form.task}
                                    onChange={(e) => setForm({ ...form, task: e.target.value })}
                                >
                                    <MenuItem value="">Select a task</MenuItem>
                                    {/* Placeholder for initial selection to prevent MUI out-of-range error */}
                                    {form.task && !myTasks.find(a => a.task.id === form.task) && (
                                        <MenuItem value={form.task}>
                                            {location.state?.taskTitle || 'Loading task...'}
                                        </MenuItem>
                                    )}
                                    {myTasks.map((a) => <MenuItem key={a.task.id} value={a.task.id}>{a.task.title}</MenuItem>)}
                                </TextField>
                            )}

                            {/* File Upload */}
                            <Box
                                component="label"
                                sx={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    p: 4, borderRadius: 3, border: '2px dashed', cursor: 'pointer',
                                    borderColor: file ? 'primary.main' : 'divider',
                                    bgcolor: file ? 'rgba(124,58,237,0.04)' : 'transparent',
                                    transition: 'all 0.2s',
                                    '&:hover': { borderColor: 'primary.light', bgcolor: 'rgba(124,58,237,0.04)' },
                                }}
                            >
                                <CloudUploadRounded sx={{ fontSize: 36, color: 'text.secondary', mb: 1 }} />
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {file ? file.name : isEditing ? 'Upload a new file (optional)' : 'Click to upload or drag and drop'}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    Any file up to 10MB
                                </Typography>
                                {/* Show existing file if editing */}
                                {isEditing && editSubmission.file_download && !file && (
                                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                                        <InsertDriveFileRounded sx={{ fontSize: 14, color: 'primary.light' }} />
                                        <Typography variant="caption" sx={{ color: 'primary.light' }}>
                                            Current file attached — upload new to replace
                                        </Typography>
                                    </Stack>
                                )}
                                <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} />
                            </Box>

                            <TextField
                                label="External Link" type="url" value={form.external_link}
                                onChange={(e) => setForm({ ...form, external_link: e.target.value })}
                                InputProps={{ startAdornment: <InputAdornment position="start"><LinkRounded sx={{ fontSize: 20, color: 'text.secondary' }} /></InputAdornment> }}
                                placeholder="https://drive.google.com/..."
                            />

                            <TextField
                                label="Notes" multiline rows={4} value={form.notes}
                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                InputProps={{ startAdornment: <InputAdornment position="start"><NotesRounded sx={{ fontSize: 20, color: 'text.secondary', alignSelf: 'flex-start', mt: 0.5 }} /></InputAdornment> }}
                                placeholder="Describe your work..."
                            />

                            {submitting && (
                                <Box>
                                    <LinearProgress variant="determinate" value={progress} sx={{ borderRadius: 2, height: 6 }} />
                                    <Typography variant="caption" align="center" display="block" sx={{ mt: 0.5 }}>{progress}% uploaded</Typography>
                                </Box>
                            )}

                            <Button
                                type="submit" variant="contained" size="large"
                                disabled={submitting || (!isEditing && !form.task)}
                                endIcon={submitting ? null : isEditing ? <EditRounded /> : <ArrowForwardRounded />}
                                fullWidth sx={{ py: 1.4 }}
                            >
                                {submitting
                                    ? <CircularProgress size={24} color="inherit" />
                                    : isEditing
                                        ? (editSubmission.status === 'rejected' ? 'Resubmit for Review' : 'Save Changes')
                                        : 'Submit Work'
                                }
                            </Button>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
