import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Box, Typography, Button, CircularProgress, Chip, Stack, Card, CardActionArea, CardContent, Avatar } from '@mui/material';
import { CheckCircleRounded, BrushRounded, MovieRounded, EditRounded, StorageRounded, CodeRounded, ArrowForwardRounded } from '@mui/icons-material';
import toast from 'react-hot-toast';

const SKILL_META = {
    'Graphic Design': { icon: BrushRounded, gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)' },
    'Video Editing': { icon: MovieRounded, gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
    'Content Writing': { icon: EditRounded, gradient: 'linear-gradient(135deg, #f59e0b, #f97316)' },
    'Data Entry': { icon: StorageRounded, gradient: 'linear-gradient(135deg, #10b981, #14b8a6)' },
    'Programming': { icon: CodeRounded, gradient: 'linear-gradient(135deg, #6366f1, #3b82f6)' },
};

export default function SkillSelection() {
    const navigate = useNavigate();
    const [skills, setSkills] = useState([]);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => { api.get('/skills/').then((r) => { setSkills(r.data); setLoading(false); }); }, []);

    const toggle = (id) => setSelected((p) => p.includes(id) ? p.filter((s) => s !== id) : [...p, id]);

    const handleSubmit = async () => {
        setSubmitting(true);
        await api.post('/skills/select/', { skill_ids: selected });
        toast.success('Skills saved!');
        navigate('/dashboard');
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 16 }}><CircularProgress /></Box>;

    return (
        <Box sx={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3,
            background: 'radial-gradient(ellipse at 30% 20%, rgba(124,58,237,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(6,182,212,0.06) 0%, transparent 50%), #0b0f1a',
        }}>
            <Box sx={{ width: '100%', maxWidth: 800 }} className="animate-in">
                <Stack alignItems="center" mb={5}>
                    <Chip label="Step 2 of 2" color="primary" size="small" sx={{ mb: 2 }} />
                    <Typography variant="h4" align="center">Choose Your Skills</Typography>
                    <Typography variant="body2" align="center" sx={{ mt: 1, maxWidth: 500 }}>
                        Select the skills you want to develop. We'll recommend tasks based on your choices.
                    </Typography>
                </Stack>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 5 }}>
                    {skills.map((skill, i) => {
                        const isSel = selected.includes(skill.id);
                        const meta = SKILL_META[skill.name] || { icon: CodeRounded, gradient: 'linear-gradient(135deg, #64748b, #475569)' };
                        const Icon = meta.icon;
                        return (
                            <Card
                                key={skill.id}
                                className={`animate-in delay-${Math.min(i + 1, 6)}`}
                                sx={{
                                    borderRadius: 4,
                                    border: '2px solid',
                                    borderColor: isSel ? 'primary.main' : 'transparent',
                                    boxShadow: isSel ? '0 0 24px rgba(124,58,237,0.15)' : undefined,
                                    position: 'relative',
                                }}
                            >
                                <CardActionArea onClick={() => toggle(skill.id)} sx={{ p: 3 }}>
                                    <CardContent sx={{ p: '0 !important' }}>
                                        <Avatar sx={{ width: 48, height: 48, borderRadius: 3, background: meta.gradient, mb: 2, boxShadow: '0 6px 20px rgba(0,0,0,0.25)' }}>
                                            <Icon />
                                        </Avatar>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: isSel ? 'primary.light' : 'text.primary' }}>
                                            {skill.name}
                                        </Typography>
                                        {isSel && (
                                            <CheckCircleRounded sx={{ position: 'absolute', top: 12, right: 12, color: 'primary.light', fontSize: 24 }} />
                                        )}
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        );
                    })}
                </Box>

                <Stack alignItems="center">
                    <Button
                        variant="contained"
                        size="large"
                        disabled={!selected.length || submitting}
                        onClick={handleSubmit}
                        endIcon={submitting ? null : <ArrowForwardRounded />}
                        sx={{ px: 5, py: 1.4 }}
                    >
                        {submitting ? <CircularProgress size={24} color="inherit" /> : `Continue with ${selected.length} skill${selected.length !== 1 ? 's' : ''}`}
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
}
