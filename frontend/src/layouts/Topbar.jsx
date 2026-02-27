import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import {
    AppBar, Toolbar, Typography, Chip, Stack, Badge, IconButton, Box,
    Avatar, InputBase, Tooltip, Menu, MenuItem, ListItemIcon, Divider,
    Popover, List, ListItem, ListItemText, Button, CircularProgress,
} from '@mui/material';
import {
    SearchRounded, NotificationsRounded, BoltRounded, SettingsRounded,
    PersonRounded, LogoutRounded, CalendarTodayRounded,
    CheckCircleRounded, CancelRounded, TaskAltRounded, DoneAllRounded,
} from '@mui/icons-material';
import { WIDTH } from './Sidebar';

const PAGE_TITLES = {
    '/dashboard': 'Dashboard',
    '/tasks': 'Browse Tasks',
    '/my-tasks': 'My Tasks',
    '/submit': 'Submit Work',
    '/portfolio': 'Portfolio',
    '/admin': 'Admin Panel',
    '/skills': 'Skill Selection',
    '/notifications': 'Notifications',
    '/profile/edit': 'Edit Profile',
    '/leaderboard': 'Leaderboard',
};

const NOTIF_ICONS = {
    task_approved: { icon: CheckCircleRounded, color: '#10b981' },
    task_rejected: { icon: CancelRounded, color: '#ef4444' },
    task_accepted: { icon: TaskAltRounded, color: '#f59e0b' },
    xp_earned: { icon: BoltRounded, color: '#a78bfa' },
    new_task: { icon: TaskAltRounded, color: '#06b6d4' },
};

export default function Topbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifAnchor, setNotifAnchor] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loadingNotifs, setLoadingNotifs] = useState(false);

    const pageTitle = PAGE_TITLES[location.pathname] || 'SkillBridge';
    const now = new Date();
    const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';

    // Fetch unread count on mount and every 30 seconds
    const fetchUnread = useCallback(() => {
        api.get('/notifications/unread-count/')
            .then((r) => setUnreadCount(r.data.count))
            .catch(() => { });
    }, []);

    useEffect(() => {
        fetchUnread();
        const interval = setInterval(fetchUnread, 30000);
        return () => clearInterval(interval);
    }, [fetchUnread]);

    const openNotifications = (e) => {
        setNotifAnchor(e.currentTarget);
        setLoadingNotifs(true);
        api.get('/notifications/')
            .then((r) => setNotifications(r.data))
            .finally(() => setLoadingNotifs(false));
    };

    const handleMarkRead = (id) => {
        api.post(`/notifications/${id}/read/`).then(() => {
            setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
            setUnreadCount((c) => Math.max(0, c - 1));
        });
    };

    const handleMarkAllRead = () => {
        api.post('/notifications/read-all/').then(() => {
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
            setUnreadCount(0);
        });
    };

    const timeAgo = (dateStr) => {
        const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
        if (diff < 60) return 'just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                width: `calc(100% - ${WIDTH}px)`,
                ml: `${WIDTH}px`,
                bgcolor: 'rgba(11, 15, 26, 0.85)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', minHeight: '70px !important', px: { xs: 2, md: 3 } }}>
                {/* Left */}
                <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem', mb: -0.3 }}>
                        {greeting}, <Box component="span" sx={{ color: 'primary.light', fontWeight: 600 }}>{user?.name?.split(' ')[0]}</Box>
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.15rem', letterSpacing: '-0.01em' }}>
                        {pageTitle}
                    </Typography>
                </Box>

                {/* Center — Search */}
                <Box sx={{
                    display: { xs: 'none', md: 'flex' },
                    alignItems: 'center', bgcolor: 'rgba(148, 163, 184, 0.04)',
                    border: '1px solid', borderColor: 'divider', borderRadius: 3,
                    px: 2, py: 0.6, width: 300, cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: 'rgba(148,163,184,0.15)', bgcolor: 'rgba(148,163,184,0.06)' },
                }}>
                    <SearchRounded sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                    <InputBase placeholder="Search anything..." sx={{ flex: 1, fontSize: '0.82rem', color: 'text.secondary', '& input::placeholder': { opacity: 0.7 } }} />
                    <Chip label="⌘K" size="small" sx={{ height: 22, fontSize: '0.65rem', fontWeight: 700, bgcolor: 'rgba(148,163,184,0.08)', color: 'text.secondary', borderRadius: 1.5 }} />
                </Box>

                {/* Right */}
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Chip icon={<BoltRounded sx={{ fontSize: 15 }} />} label={`${user?.experience_points || 0} XP`} size="small"
                        sx={{ fontWeight: 700, fontSize: '0.78rem', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', '& .MuiChip-icon': { color: '#a78bfa' }, color: '#a78bfa' }} />

                    <Chip icon={<CalendarTodayRounded sx={{ fontSize: 13 }} />}
                        label={now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        size="small"
                        sx={{ display: { xs: 'none', lg: 'flex' }, fontWeight: 500, fontSize: '0.75rem', bgcolor: 'rgba(148,163,184,0.06)', border: '1px solid', borderColor: 'divider', color: 'text.secondary' }} />

                    {/* Notifications */}
                    <Tooltip title="Notifications" arrow>
                        <IconButton size="small" onClick={openNotifications}
                            sx={{ width: 38, height: 38, bgcolor: 'rgba(148,163,184,0.04)', border: '1px solid', borderColor: 'divider', transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(124,58,237,0.06)', borderColor: 'rgba(124,58,237,0.15)' } }}>
                            <Badge badgeContent={unreadCount} color="error" max={9}
                                sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', height: 18, minWidth: 18 } }}>
                                <NotificationsRounded sx={{ fontSize: 19, color: 'text.secondary' }} />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    {/* Notification Panel */}
                    <Popover
                        open={Boolean(notifAnchor)}
                        anchorEl={notifAnchor}
                        onClose={() => setNotifAnchor(null)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        slotProps={{
                            paper: {
                                sx: {
                                    mt: 1.5, borderRadius: 3, width: 380, maxHeight: 480,
                                    bgcolor: 'rgba(17, 24, 39, 0.97)', backdropFilter: 'blur(20px)',
                                    border: '1px solid', borderColor: 'divider',
                                    boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
                                },
                            },
                        }}
                    >
                        {/* Header */}
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2.5, py: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Notifications</Typography>
                            {unreadCount > 0 && (
                                <Button size="small" startIcon={<DoneAllRounded sx={{ fontSize: 14 }} />}
                                    onClick={handleMarkAllRead} sx={{ textTransform: 'none', fontSize: '0.75rem' }}>
                                    Mark all read
                                </Button>
                            )}
                        </Stack>
                        <Divider />

                        {/* List */}
                        {loadingNotifs ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={24} /></Box>
                        ) : notifications.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 5 }}>
                                <NotificationsRounded sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>No notifications yet</Typography>
                            </Box>
                        ) : (
                            <List disablePadding sx={{ maxHeight: 370, overflowY: 'auto' }}>
                                {notifications.map((n) => {
                                    const cfg = NOTIF_ICONS[n.type] || NOTIF_ICONS.new_task;
                                    const Icon = cfg.icon;
                                    return (
                                        <ListItem
                                            key={n.id}
                                            onClick={() => !n.is_read && handleMarkRead(n.id)}
                                            sx={{
                                                px: 2.5, py: 1.5, cursor: n.is_read ? 'default' : 'pointer',
                                                bgcolor: n.is_read ? 'transparent' : 'rgba(124,58,237,0.03)',
                                                borderLeft: n.is_read ? 'none' : `3px solid ${cfg.color}`,
                                                transition: 'background 0.2s',
                                                '&:hover': { bgcolor: 'rgba(148,163,184,0.04)' },
                                            }}
                                        >
                                            <Avatar sx={{ width: 36, height: 36, mr: 1.5, bgcolor: `${cfg.color}15`, borderRadius: 2 }}>
                                                <Icon sx={{ fontSize: 18, color: cfg.color }} />
                                            </Avatar>
                                            <ListItemText
                                                primary={n.title}
                                                secondary={
                                                    <>
                                                        <Typography component="span" variant="caption" sx={{ display: 'block', color: 'text.secondary', lineHeight: 1.4 }}>
                                                            {n.message}
                                                        </Typography>
                                                        <Typography component="span" variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', mt: 0.3, display: 'block' }}>
                                                            {timeAgo(n.created_at)}
                                                        </Typography>
                                                    </>
                                                }
                                                primaryTypographyProps={{ variant: 'body2', fontWeight: n.is_read ? 400 : 600, fontSize: '0.82rem' }}
                                            />
                                            {!n.is_read && (
                                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: cfg.color, flexShrink: 0, ml: 1 }} />
                                            )}
                                        </ListItem>
                                    );
                                })}
                            </List>
                        )}
                    </Popover>

                    {/* Avatar + Menu */}
                    <Tooltip title="Account" arrow>
                        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.4 }}>
                            <Avatar sx={{
                                width: 36, height: 36, borderRadius: 2.5,
                                background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
                                fontSize: '0.85rem', fontWeight: 700,
                                border: '2px solid transparent',
                                boxShadow: '0 0 0 2px rgba(124,58,237,0.2)',
                                transition: 'box-shadow 0.2s',
                                '&:hover': { boxShadow: '0 0 0 3px rgba(124,58,237,0.35)' },
                            }}>
                                {user?.name?.charAt(0).toUpperCase()}
                            </Avatar>
                        </IconButton>
                    </Tooltip>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        slotProps={{
                            paper: {
                                sx: {
                                    mt: 1.5, borderRadius: 3, minWidth: 220,
                                    bgcolor: 'rgba(17, 24, 39, 0.95)', backdropFilter: 'blur(20px)',
                                    border: '1px solid', borderColor: 'divider',
                                    boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
                                },
                            },
                        }}
                    >
                        <Box sx={{ px: 2, py: 1.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{user?.name}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{user?.email}</Typography>
                            <Chip label={user?.role} color="secondary" size="small" sx={{ mt: 1, textTransform: 'capitalize', height: 22, fontSize: '0.7rem' }} />
                        </Box>
                        <Divider sx={{ my: 0.5 }} />
                        <MenuItem onClick={() => { setAnchorEl(null); navigate('/profile/edit'); }} sx={{ py: 1, fontSize: '0.84rem' }}>
                            <ListItemIcon><PersonRounded sx={{ fontSize: 18 }} /></ListItemIcon>My Profile
                        </MenuItem>
                        <MenuItem onClick={() => { setAnchorEl(null); navigate('/profile/edit'); }} sx={{ py: 1, fontSize: '0.84rem' }}>
                            <ListItemIcon><SettingsRounded sx={{ fontSize: 18 }} /></ListItemIcon>Edit Profile
                        </MenuItem>
                        <Divider sx={{ my: 0.5 }} />
                        <MenuItem onClick={() => { setAnchorEl(null); logout(); navigate('/login'); }}
                            sx={{ py: 1, fontSize: '0.84rem', color: 'error.light', '&:hover': { bgcolor: 'rgba(239,68,68,0.06)' } }}>
                            <ListItemIcon><LogoutRounded sx={{ fontSize: 18, color: 'error.light' }} /></ListItemIcon>Sign Out
                        </MenuItem>
                    </Menu>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}
