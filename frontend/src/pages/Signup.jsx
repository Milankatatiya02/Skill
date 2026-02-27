import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Box, Card, CardContent, TextField, Button, Typography,
    InputAdornment, IconButton, Stack, Avatar, CircularProgress,
} from '@mui/material';
import { VisibilityRounded, VisibilityOffRounded, EmailRounded, LockRounded, PersonRounded, BoltRounded, ArrowForwardRounded } from '@mui/icons-material';
import toast from 'react-hot-toast';

export default function Signup() {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
        setLoading(true);
        try {
            await signup(form.name, form.email, form.password);
            toast.success("Account created! Let's pick your skills.");
            navigate('/skills');
        } catch (err) {
            const d = err.response?.data;
            toast.error(d?.email?.[0] || d?.password?.[0] || d?.detail || 'Signup failed');
        } finally { setLoading(false); }
    };

    return (
        <Box sx={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3,
            background: 'radial-gradient(ellipse at 30% 20%, rgba(124,58,237,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(6,182,212,0.06) 0%, transparent 50%), #0b0f1a',
        }}>
            <Box sx={{ width: '100%', maxWidth: 440 }} className="animate-in">
                <Stack alignItems="center" mb={4}>
                    <Avatar sx={{ width: 56, height: 56, mb: 2, borderRadius: 3, background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)', boxShadow: '0 8px 32px rgba(124,58,237,0.3)' }}>
                        <BoltRounded sx={{ fontSize: 30 }} />
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 800, background: 'linear-gradient(135deg, #a78bfa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        SkillBridge
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>Create your account and start building</Typography>
                </Stack>

                <Card sx={{ borderRadius: 4 }}>
                    <CardContent sx={{ p: 4, '&:last-child': { pb: 4 } }}>
                        <Typography variant="h6" gutterBottom>Create Account</Typography>

                        <Box component="form" onSubmit={handleSubmit}>
                            <Stack spacing={2.5} mt={2}>
                                <TextField id="signup-name" label="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><PersonRounded sx={{ fontSize: 20, color: 'text.secondary' }} /></InputAdornment> }} />
                                <TextField id="signup-email" label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><EmailRounded sx={{ fontSize: 20, color: 'text.secondary' }} /></InputAdornment> }} />
                                <TextField id="signup-password" label="Password" type={showPw ? 'text' : 'password'} required inputProps={{ minLength: 8 }} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><LockRounded sx={{ fontSize: 20, color: 'text.secondary' }} /></InputAdornment>,
                                        endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPw(!showPw)} edge="end" size="small">{showPw ? <VisibilityOffRounded sx={{ fontSize: 20 }} /> : <VisibilityRounded sx={{ fontSize: 20 }} />}</IconButton></InputAdornment>,
                                    }} />
                                <TextField id="signup-confirm" label="Confirm Password" type="password" required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><LockRounded sx={{ fontSize: 20, color: 'text.secondary' }} /></InputAdornment> }} />
                                <Button id="signup-submit" type="submit" variant="contained" size="large" disabled={loading} endIcon={loading ? null : <ArrowForwardRounded />} fullWidth sx={{ py: 1.4 }}>
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                                </Button>
                            </Stack>
                        </Box>

                        <Typography variant="body2" align="center" sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                            Already have an account?{' '}
                            <Typography component={Link} to="/login" sx={{ color: 'primary.light', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Sign In</Typography>
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
