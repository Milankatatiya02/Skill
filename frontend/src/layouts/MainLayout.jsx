import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar, { WIDTH } from './Sidebar';
import Topbar from './Topbar';

export default function MainLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar mobileOpen={mobileOpen} onClose={handleDrawerToggle} />
            <Box sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0, // Ensure content doesn't overflow
            }}>
                <Topbar onToggleSidebar={handleDrawerToggle} />
                <Box component="main" sx={{ p: { xs: 2, sm: 3, md: 4 }, flexGrow: 1 }} className="animate-in">
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}
