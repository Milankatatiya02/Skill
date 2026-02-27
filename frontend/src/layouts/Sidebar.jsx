import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import {
    Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
    Typography, Avatar, Divider, IconButton, Tooltip, Stack, Badge,
} from '@mui/material';
import {
    DashboardRounded, AssignmentRounded, TaskAltRounded, CloudUploadRounded,
    WorkRounded, AdminPanelSettingsRounded, LogoutRounded, BoltRounded,
    NotificationsRounded, EmojiEventsRounded, PersonRounded,
} from '@mui/icons-material';

const WIDTH = 264;

const studentLinks = [
    { to: '/dashboard', icon: DashboardRounded, label: 'Dashboard' },
    { to: '/tasks', icon: AssignmentRounded, label: 'Browse Tasks' },
    { to: '/my-tasks', icon: TaskAltRounded, label: 'My Tasks' },
    { to: '/leaderboard', icon: EmojiEventsRounded, label: 'Leaderboard' },
    { to: '/submit', icon: CloudUploadRounded, label: 'Submit Work' },
    { to: '/portfolio', icon: WorkRounded, label: 'Portfolio' },
    { to: '/notifications', icon: NotificationsRounded, label: 'Notifications', badge: true },
];

const adminLinks = [
    { to: '/dashboard', icon: DashboardRounded, label: 'Dashboard' },
    { to: '/admin', icon: AdminPanelSettingsRounded, label: 'Admin Panel' },
    { to: '/tasks', icon: AssignmentRounded, label: 'Tasks' },
    { to: '/portfolio', icon: WorkRounded, label: 'Portfolio' },
    { to: '/notifications', icon: NotificationsRounded, label: 'Notifications', badge: true },
];

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const links = user?.role === 'admin' ? adminLinks : studentLinks;
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnread = useCallback(() => {
        api.get('/notifications/unread-count/').then((r) => setUnreadCount(r.data.count)).catch(() => { });
    }, []);

    useEffect(() => {
        fetchUnread();
        const interval = setInterval(fetchUnread, 30000);
        return () => clearInterval(interval);
    }, [fetchUnread]);

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': { width: WIDTH, boxSizing: 'border-box', py: 2 },
            }}
        >
            {/* Logo */}
            <Box sx={{ px: 3, pb: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Avatar
                        sx={{
                            width: 40, height: 40, borderRadius: 2.5,
                            background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
                        }}
                    >
                        <BoltRounded sx={{ fontSize: 22 }} />
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2, color: 'text.primary' }}>
                            SkillBridge
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                            Skill-to-Income
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            <Divider sx={{ mx: 2, borderColor: 'divider' }} />

            {/* Nav */}
            <Box sx={{ flex: 1, px: 1.5, pt: 2, overflow: 'auto' }}>
                <Typography variant="subtitle2" sx={{ px: 1.5, pb: 1, fontSize: '0.65rem' }}>
                    Menu
                </Typography>
                <List disablePadding>
                    {links.map(({ to, icon: Icon, label, badge }) => (
                        <ListItemButton
                            key={to}
                            component={NavLink}
                            to={to}
                            sx={{
                                borderRadius: 2.5,
                                mb: 0.3,
                                py: 1,
                                px: 1.5,
                                '&.active': {
                                    bgcolor: 'rgba(124, 58, 237, 0.08)',
                                    '& .MuiListItemIcon-root': { color: 'primary.light' },
                                    '& .MuiListItemText-primary': { color: 'primary.light', fontWeight: 600 },
                                },
                                '&:hover': { bgcolor: 'rgba(148, 163, 184, 0.04)' },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                                {badge && unreadCount > 0 ? (
                                    <Badge badgeContent={unreadCount} color="error" max={9}
                                        sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 16, minWidth: 16 } }}>
                                        <Icon sx={{ fontSize: 20 }} />
                                    </Badge>
                                ) : (
                                    <Icon sx={{ fontSize: 20 }} />
                                )}
                            </ListItemIcon>
                            <ListItemText
                                primary={label}
                                primaryTypographyProps={{ fontSize: '0.84rem', fontWeight: 500, color: 'text.secondary' }}
                            />
                        </ListItemButton>
                    ))}
                </List>
            </Box>

            {/* User card */}
            <Box sx={{ px: 2, pb: 1 }}>
                <Box sx={{
                    p: 2, borderRadius: 3,
                    bgcolor: 'rgba(148, 163, 184, 0.03)',
                    border: '1px solid',
                    borderColor: 'divider',
                }}>
                    <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
                        <Avatar
                            sx={{
                                width: 38, height: 38, borderRadius: 2,
                                background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
                                fontSize: '0.9rem', fontWeight: 700,
                            }}
                        >
                            {user?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="body2" noWrap sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.82rem' }}>
                                {user?.name}
                            </Typography>
                            <Typography variant="caption" noWrap sx={{ color: 'text.secondary', display: 'block', fontSize: '0.7rem' }}>
                                {user?.email}
                            </Typography>
                        </Box>
                    </Stack>
                    <Tooltip title="Sign out" arrow>
                        <IconButton
                            onClick={() => { logout(); navigate('/login'); }}
                            size="small"
                            sx={{
                                width: '100%', borderRadius: 2, py: 0.8,
                                color: 'text.secondary', fontSize: '0.75rem',
                                '&:hover': { bgcolor: 'rgba(239,68,68,0.06)', color: 'error.light' },
                            }}
                        >
                            <LogoutRounded sx={{ fontSize: 16, mr: 0.8 }} />
                            <Typography variant="caption" sx={{ fontWeight: 500 }}>Sign Out</Typography>
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </Drawer>
    );
}

export { WIDTH };
