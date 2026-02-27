import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    Box, Card, CardContent, Typography, TextField, Button, Stack,
    MenuItem, LinearProgress, InputAdornment, CircularProgress,
} from '@mui/material';
import { CloudUploadRounded, LinkRounded, NotesRounded, ArrowForwardRounded, CheckCircleRounded } from '@mui/icons-material';
import toast from 'react-hot-toast';

export default function SubmitWork() {
    const location = useLocation();
    const navigate = useNavigate();
    const [myTasks, setMyTasks] = useState([]);
    const [form, setForm] = useState({ task: location.state?.taskId || '', external_link: '', notes: '' });
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => { api.get('/tasks/my/').then((r) => setMyTasks(r.data.filter((a) => a.status === 'accepted'))); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
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
            setTimeout(() => navigate('/my-tasks'), 2500);
        } catch (err) { toast.error(err.response?.data?.detail || 'Failed'); }
        finally { setSubmitting(false); }
    };

    if (success) {
        return (
            <Box sx={{ maxWidth: 480, mx: 'auto', mt: 10 }} className="animate-in">
                <Card sx={{ borderRadius: 4, textAlign: 'center', p: 6 }}>
                    <CheckCircleRounded sx={{ fontSize: 56, color: 'success.main', mb: 2 }} />
                    <Typography variant="h5">Submission Sent!</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>Your work has been submitted for admin review.</Typography>
                </Card>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 640, mx: 'auto' }} className="animate-in">
            <Typography variant="h5" gutterBottom>Submit Work</Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>Upload your completed work for review</Typography>

            <Card sx={{ borderRadius: 4 }}>
                <CardContent sx={{ p: 4 }}>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                select label="Task" required value={form.task}
                                onChange={(e) => setForm({ ...form, task: e.target.value })}
                            >
                                <MenuItem value="">Select a task</MenuItem>
                                {myTasks.map((a) => <MenuItem key={a.task.id} value={a.task.id}>{a.task.title}</MenuItem>)}
                            </TextField>

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
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>{file ? file.name : 'Click to upload or drag and drop'}</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Any file up to 10MB</Typography>
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

                            <Button type="submit" variant="contained" size="large" disabled={submitting || !form.task} endIcon={submitting ? null : <ArrowForwardRounded />} fullWidth sx={{ py: 1.4 }}>
                                {submitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Work'}
                            </Button>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
