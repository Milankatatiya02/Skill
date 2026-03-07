import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
    Box, Card, CardContent, Typography, Avatar, Stack, Button, TextField,
    Chip, CircularProgress, Divider, Grid,
    Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import {
    EditRounded, SaveRounded, BoltRounded, EmojiEventsRounded,
    CalendarTodayRounded, WorkRounded, VerifiedRounded, CheckRounded,
    LockRounded, DeleteForeverRounded, WarningAmberRounded,
} from '@mui/icons-material';

export default function EditProfile() {
    const { user, refreshUser, logout } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [skills, setSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [stats, setStats] = useState(null);
    const [saving, setSaving] = useState(false);
    const [loadingSkills, setLoadingSkills] = useState(true);

    // Password change state
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [changingPassword, setChangingPassword] = useState(false);

    // Delete account state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        // Load available skills
        api.get('/skills/')
            .then((r) => setSkills(r.data))
            .finally(() => setLoadingSkills(false));

        // Pre-select current user skills
        if (user?.skills) {
            // user.skills is an array of skill names; we need ids
            // Fetch all skills and match names
            api.get('/skills/').then((r) => {
                const currentNames = new Set(user.skills || []);
                setSelectedSkills(r.data.filter((s) => currentNames.has(s.name)).map((s) => s.id));
            });
        }

        // Load stats from portfolio
        api.get('/portfolio/my/').then((r) => {
            setStats(r.data.stats);
        }).catch(() => { });
    }, []);

    const toggleSkill = (id) => {
        setSelectedSkills((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    const handleSave = async () => {
        if (!name.trim()) return toast.error('Name cannot be empty.');
        setSaving(true);
        try {
            // Update profile
            await api.patch('/auth/profile/', { name: name.trim(), bio: bio.trim() });
            // Update skills if any selected
            if (selectedSkills.length > 0) {
                await api.post('/skills/select/', { skill_ids: selectedSkills });
            }
            // Refresh user in context from server
            await refreshUser();
            toast.success('Profile updated successfully!');
        } catch {
            toast.error('Failed to save changes.');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) return toast.error('All password fields are required.');
        if (newPassword.length < 8) return toast.error('New password must be at least 8 characters.');
        if (newPassword !== confirmPassword) return toast.error('Passwords do not match.');
        setChangingPassword(true);
        try {
            await api.post('/auth/change-password/', { old_password: oldPassword, new_password: newPassword });
            toast.success('Password changed successfully!');
            setOldPassword(''); setNewPassword(''); setConfirmPassword('');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to change password.');
        } finally {
            setChangingPassword(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword) return toast.error('Password is required.');
        setDeleting(true);
        try {
            await api.delete('/auth/delete-account/', { data: { password: deletePassword } });
            toast.success('Account deleted.');
            setDeleteDialogOpen(false);
            logout();
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to delete account.');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 720, mx: 'auto' }} className="animate-in">
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
                <Avatar sx={{
                    width: 44, height: 44, borderRadius: 2.5,
                    background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
                    boxShadow: '0 8px 24px rgba(124,58,237,0.25)',
                }}>
                    <EditRounded sx={{ fontSize: 20 }} />
                </Avatar>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>Edit Profile</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Update your name, bio, and skills</Typography>
                </Box>
            </Stack>

            <Grid container spacing={3}>
                {/* Left — Edit Form */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Stack spacing={2.5}>
                        {/* Identity Card */}
                        <Card sx={{ borderRadius: 4 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                                    <Avatar sx={{
                                        width: 72, height: 72, borderRadius: 3,
                                        background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
                                        fontSize: '1.8rem', fontWeight: 800,
                                        boxShadow: '0 8px 24px rgba(124,58,237,0.25)',
                                    }}>
                                        {name?.charAt(0).toUpperCase() || '?'}
                                    </Avatar>
                                    <Box>
                                        <Stack direction="row" alignItems="center" spacing={0.8}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{name || 'Your Name'}</Typography>
                                            <VerifiedRounded sx={{ fontSize: 16, color: '#06b6d4' }} />
                                        </Stack>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{user?.email}</Typography>
                                    </Box>
                                </Stack>

                                <Stack spacing={2}>
                                    <TextField
                                        label="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        fullWidth
                                        size="small"
                                        inputProps={{ maxLength: 150 }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                    <TextField
                                        label="Bio"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        fullWidth
                                        multiline
                                        rows={3}
                                        size="small"
                                        placeholder="Tell companies a bit about yourself..."
                                        inputProps={{ maxLength: 200 }}
                                        helperText={`${bio.length}/200`}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* Skills Card */}
                        <Card sx={{ borderRadius: 4 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>Skills</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                                    Select skills you'd like to represent on your profile
                                </Typography>
                                {loadingSkills ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                                        <CircularProgress size={20} />
                                    </Box>
                                ) : (
                                    <Stack direction="row" flexWrap="wrap" gap={1}>
                                        {skills.map((s) => {
                                            const selected = selectedSkills.includes(s.id);
                                            return (
                                                <Chip
                                                    key={s.id}
                                                    label={s.name}
                                                    icon={selected ? <CheckRounded sx={{ fontSize: 14 }} /> : undefined}
                                                    onClick={() => toggleSkill(s.id)}
                                                    color={selected ? 'primary' : 'default'}
                                                    variant={selected ? 'filled' : 'outlined'}
                                                    sx={{
                                                        borderRadius: 2, height: 32, fontWeight: selected ? 600 : 400,
                                                        cursor: 'pointer', transition: 'all 0.15s',
                                                        '&:hover': { transform: 'scale(1.04)' },
                                                    }}
                                                />
                                            );
                                        })}
                                    </Stack>
                                )}
                            </CardContent>
                        </Card>

                        {/* Save Button */}
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveRounded />}
                            onClick={handleSave}
                            disabled={saving}
                            sx={{
                                borderRadius: 3, py: 1.5, fontWeight: 700, textTransform: 'none',
                                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                                '&:hover': { background: 'linear-gradient(135deg, #6d28d9, #0891b2)' }
                            }}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>

                        <Divider sx={{ my: 1 }} />

                        {/* ═══════════ Change Password ═══════════ */}
                        <Card sx={{ borderRadius: 4 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                                    <LockRounded sx={{ fontSize: 20, color: '#f59e0b' }} />
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Change Password</Typography>
                                </Stack>
                                <Stack spacing={2}>
                                    <TextField
                                        label="Current Password" type="password" size="small" fullWidth
                                        value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                    <TextField
                                        label="New Password" type="password" size="small" fullWidth
                                        value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                        helperText="Minimum 8 characters"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                    <TextField
                                        label="Confirm New Password" type="password" size="small" fullWidth
                                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                        error={confirmPassword !== '' && confirmPassword !== newPassword}
                                        helperText={confirmPassword !== '' && confirmPassword !== newPassword ? 'Passwords do not match' : ''}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                    <Button
                                        variant="outlined" color="warning"
                                        startIcon={changingPassword ? <CircularProgress size={16} color="inherit" /> : <LockRounded />}
                                        onClick={handleChangePassword}
                                        disabled={changingPassword || !oldPassword || !newPassword || !confirmPassword}
                                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, alignSelf: 'flex-start' }}
                                    >
                                        {changingPassword ? 'Changing...' : 'Change Password'}
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* ═══════════ Danger Zone ═══════════ */}
                        <Card sx={{
                            borderRadius: 4,
                            border: '1px solid rgba(239,68,68,0.3)',
                            bgcolor: 'rgba(239,68,68,0.02)',
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                                    <WarningAmberRounded sx={{ fontSize: 20, color: '#ef4444' }} />
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#ef4444' }}>Danger Zone</Typography>
                                </Stack>
                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontSize: '0.82rem' }}>
                                    Permanently delete your account and all associated data. This action cannot be undone.
                                </Typography>
                                <Button
                                    variant="outlined" color="error"
                                    startIcon={<DeleteForeverRounded />}
                                    onClick={() => setDeleteDialogOpen(true)}
                                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                                >
                                    Delete Account
                                </Button>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>

                {/* Right — Stats */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 4, position: 'sticky', top: 90 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Your Stats</Typography>
                            <Stack spacing={2}>
                                {[
                                    { icon: BoltRounded, label: 'Total XP', value: user?.experience_points ?? 0, color: '#a78bfa' },
                                    { icon: EmojiEventsRounded, label: 'Projects', value: stats?.total_projects ?? 0, color: '#06b6d4' },
                                    { icon: WorkRounded, label: 'Avg Rating', value: stats?.avg_rating ? `${stats.avg_rating}/5` : '—', color: '#fbbf24' },
                                    { icon: CalendarTodayRounded, label: 'Member Since', value: stats?.member_since ?? '—', color: '#10b981', small: true },
                                ].map((s) => (
                                    <Stack key={s.label} direction="row" alignItems="center" spacing={1.5}>
                                        <Avatar sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: `${s.color}15` }}>
                                            <s.icon sx={{ fontSize: 18, color: s.color }} />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.68rem' }}>{s.label}</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: s.color, fontSize: s.small ? '0.82rem' : '1rem' }}>{s.value}</Typography>
                                        </Box>
                                    </Stack>
                                ))}
                            </Stack>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                                Your stats are automatically updated when admins approve your submissions.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* ═══════════ Delete Account Dialog ═══════════ */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => { setDeleteDialogOpen(false); setDeletePassword(''); }}
                maxWidth="xs" fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 4, bgcolor: 'rgba(17, 24, 39, 0.97)',
                        backdropFilter: 'blur(20px)', border: '1px solid rgba(239,68,68,0.2)',
                    },
                }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
                    <WarningAmberRounded sx={{ color: '#ef4444' }} /> Delete Account
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                        This will permanently deactivate your account. Enter your password to confirm.
                    </Typography>
                    <TextField
                        label="Your Password" type="password" size="small" fullWidth autoFocus
                        value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={() => { setDeleteDialogOpen(false); setDeletePassword(''); }}
                        sx={{ borderRadius: 2, textTransform: 'none' }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained" color="error"
                        startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <DeleteForeverRounded />}
                        onClick={handleDeleteAccount}
                        disabled={deleting || !deletePassword}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                    >
                        {deleting ? 'Deleting...' : 'Delete My Account'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

