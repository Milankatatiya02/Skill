import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar, { WIDTH } from './Sidebar';
import Topbar from './Topbar';

export default function MainLayout() {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1, ml: 0, display: 'flex', flexDirection: 'column' }}>
                <Topbar />
                <Box component="main" sx={{ p: { xs: 2, md: 4 }, flexGrow: 1 }} className="animate-in">
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}
