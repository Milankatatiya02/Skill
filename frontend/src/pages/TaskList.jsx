import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import {
    Box, Card, CardActionArea, CardContent, Typography, Chip, Stack, Grid,
    TextField, InputAdornment, MenuItem, CircularProgress,
} from '@mui/material';
import { SearchRounded, FilterListRounded, BoltRounded } from '@mui/icons-material';

export default function TaskList() {
    const [searchParams] = useSearchParams();
    const [tasks, setTasks] = useState([]);
    const [skills, setSkills] = useState([]);
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([api.get('/tasks/'), api.get('/skills/')]).then(([t, s]) => {
            setTasks(t.data); setSkills(s.data);
        }).finally(() => setLoading(false));
    }, []);

    const filtered = tasks
        .filter((t) => !filter || String(t.skill_required) === filter)
        .filter((t) => !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()));

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}><CircularProgress /></Box>;

    return (
        <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
                <Box>
                    <Typography variant="h5">Browse Tasks</Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{filtered.length} task{filtered.length !== 1 ? 's' : ''} available</Typography>
                </Box>
                <Stack direction="row" spacing={1.5}>
                    <TextField
                        size="small"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ width: 240 }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><SearchRounded sx={{ fontSize: 20, color: 'text.secondary' }} /></InputAdornment> }}
                    />
                    <TextField
                        select
                        size="small"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        sx={{ minWidth: 150 }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><FilterListRounded sx={{ fontSize: 20, color: 'text.secondary' }} /></InputAdornment> }}
                    >
                        <MenuItem value="">All Skills</MenuItem>
                        {skills.map((s) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                    </TextField>
                </Stack>
            </Stack>

            {filtered.length === 0 ? (
                <Card sx={{ borderRadius: 4, p: 6, textAlign: 'center' }}>
                    <SearchRounded sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2">No tasks match your search</Typography>
                </Card>
            ) : (
                <Grid container spacing={2.5}>
                    {filtered.map((task, i) => (
                        <Grid key={task.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                            <Card className={`animate-in delay-${Math.min(i + 1, 6)}`} sx={{ borderRadius: 4, height: '100%' }}>
                                <CardActionArea component={Link} to={`/tasks/${task.id}`} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                    <Box sx={{ width: '100%' }}>
                                        <Stack direction="row" spacing={0.8} mb={1.5}>
                                            <Chip label={task.difficulty} size="small" color={task.difficulty === 'easy' ? 'success' : task.difficulty === 'medium' ? 'warning' : 'error'} />
                                            <Chip label={task.skill_required_name} size="small" color="primary" />
                                        </Stack>
                                        <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600, mb: 0.5 }}>{task.title}</Typography>
                                        <Typography variant="body2" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5, fontSize: '0.82rem' }}>
                                            {task.description}
                                        </Typography>
                                    </Box>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                                        <Chip icon={<BoltRounded sx={{ fontSize: 14 }} />} label={`+${task.reward_points} XP`} size="small" color="primary" variant="outlined" />
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Due {new Date(task.deadline).toLocaleDateString()}</Typography>
                                    </Stack>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Stack>
    );
}
