import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import {
    Box, Card, CardContent, Typography, Avatar, Stack, Button, Chip,
    CircularProgress, Divider, IconButton, Tooltip,
} from '@mui/material';
import {
    NotificationsRounded, CheckCircleRounded, CancelRounded, TaskAltRounded,
    BoltRounded, DoneAllRounded, MarkEmailReadRounded,
} from '@mui/icons-material';

const TYPE_CONFIG = {
    task_approved: { icon: CheckCircleRounded, color: '#10b981', bg: 'rgba(16,185,129,0.08)', label: 'Approved' },
    task_rejected: { icon: CancelRounded, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', label: 'Rejected' },
    task_accepted: { icon: TaskAltRounded, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', label: 'Accepted' },
    xp_earned: { icon: BoltRounded, color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', label: 'XP' },
    new_task: { icon: TaskAltRounded, color: '#06b6d4', bg: 'rgba(6,182,212,0.08)', label: 'New Task' },
};

function timeAgo(dateStr) {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

function isToday(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifs = useCallback(() => {
        setLoading(true);
        api.get('/notifications/').then((r) => setNotifications(r.data)).finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchNotifs(); }, [fetchNotifs]);

    const handleMarkRead = (id) => {
        api.post(`/notifications/${id}/read/`).then(() =>
            setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n))
        );
    };

    const handleMarkAllRead = () => {
        api.post('/notifications/read-all/').then(() =>
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
        );
    };

    const unreadCount = notifications.filter((n) => !n.is_read).length;
    const todayNotifs = notifications.filter((n) => isToday(n.created_at));
    const earlierNotifs = notifications.filter((n) => !isToday(n.created_at));

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}>
            <CircularProgress />
        </Box>
    );

    return (
        <Box sx={{ maxWidth: 720, mx: 'auto' }} className="animate-in">
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                        Notifications
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.3 }}>
                        {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                    </Typography>
                </Box>
                {unreadCount > 0 && (
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DoneAllRounded sx={{ fontSize: 16 }} />}
                        onClick={handleMarkAllRead}
                        sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.8rem', borderColor: 'divider', color: 'text.secondary' }}
                    >
                        Mark all read
                    </Button>
                )}
            </Stack>

            {notifications.length === 0 ? (
                <Card sx={{ borderRadius: 4, p: 8, textAlign: 'center' }}>
                    <NotificationsRounded sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.4 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>No notifications yet</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 340, mx: 'auto' }}>
                        You'll be notified here when tasks are approved, rejected, or when new tasks are posted.
                    </Typography>
                </Card>
            ) : (
                <Stack spacing={0.5}>
                    {/* Today */}
                    {todayNotifs.length > 0 && (
                        <>
                            <Typography variant="caption" sx={{ px: 1, pb: 0.5, color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                                Today
                            </Typography>
                            {todayNotifs.map((n, i) => (
                                <NotifCard key={n.id} n={n} onMarkRead={handleMarkRead} delay={i} />
                            ))}
                        </>
                    )}

                    {/* Earlier */}
                    {earlierNotifs.length > 0 && (
                        <>
                            {todayNotifs.length > 0 && <Divider sx={{ my: 1.5, borderColor: 'divider' }} />}
                            <Typography variant="caption" sx={{ px: 1, pb: 0.5, color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                                Earlier
                            </Typography>
                            {earlierNotifs.map((n, i) => (
                                <NotifCard key={n.id} n={n} onMarkRead={handleMarkRead} delay={i + todayNotifs.length} />
                            ))}
                        </>
                    )}
                </Stack>
            )}
        </Box>
    );
}

function NotifCard({ n, onMarkRead, delay }) {
    const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.new_task;
    const Icon = cfg.icon;

    return (
        <Card
            className={`animate-in delay-${Math.min(delay + 1, 6)}`}
            sx={{
                borderRadius: 3,
                borderLeft: n.is_read ? 'none' : `3px solid ${cfg.color}`,
                bgcolor: n.is_read ? 'transparent' : `${cfg.bg}`,
                transition: 'all 0.2s',
                '&:hover': { bgcolor: 'rgba(148,163,184,0.03)' },
                cursor: n.is_read ? 'default' : 'pointer',
            }}
            onClick={() => !n.is_read && onMarkRead(n.id)}
        >
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Avatar sx={{ width: 42, height: 42, borderRadius: 2.5, bgcolor: cfg.bg, flexShrink: 0 }}>
                        <Icon sx={{ fontSize: 20, color: cfg.color }} />
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: n.is_read ? 400 : 700, fontSize: '0.88rem', mb: 0.3 }}>
                                    {n.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.82rem', lineHeight: 1.5 }}>
                                    {n.message}
                                </Typography>
                            </Box>
                            <Stack alignItems="flex-end" spacing={0.5} ml={2} sx={{ flexShrink: 0 }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem', whiteSpace: 'nowrap' }}>
                                    {timeAgo(n.created_at)}
                                </Typography>
                                {!n.is_read && (
                                    <Tooltip title="Mark as read" arrow>
                                        <IconButton size="small"
                                            onClick={(e) => { e.stopPropagation(); onMarkRead(n.id); }}
                                            sx={{ p: 0.4, '&:hover': { color: cfg.color } }}
                                        >
                                            <MarkEmailReadRounded sx={{ fontSize: 15, color: 'text.secondary' }} />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
                {!n.is_read && (
                    <Stack direction="row" justifyContent="flex-end" mt={1}>
                        <Chip label={cfg.label} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600, bgcolor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }} />
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
}
