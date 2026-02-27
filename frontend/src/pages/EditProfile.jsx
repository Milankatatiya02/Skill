import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
    Box, Card, CardContent, Typography, Avatar, Stack, Button, TextField,
    Chip, CircularProgress, Divider, Grid,
} from '@mui/material';
import {
    EditRounded, SaveRounded, BoltRounded, EmojiEventsRounded,
    CalendarTodayRounded, WorkRounded, VerifiedRounded, CheckRounded,
} from '@mui/icons-material';

export default function EditProfile() {
    const { user, refreshUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [skills, setSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [stats, setStats] = useState(null);
    const [saving, setSaving] = useState(false);
    const [loadingSkills, setLoadingSkills] = useState(true);

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
        </Box>
    );
}
