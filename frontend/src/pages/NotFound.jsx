import { Link } from 'react-router-dom';
import { Box, Typography, Button, Stack, Avatar } from '@mui/material';
import { SearchOffRounded, HomeRounded, ArrowBackRounded } from '@mui/icons-material';

export default function NotFound() {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                p: 3,
                background: 'radial-gradient(ellipse at 30% 20%, rgba(124,58,237,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(6,182,212,0.06) 0%, transparent 50%), #0b0f1a',
            }}
        >
            <Stack alignItems="center" spacing={3} className="animate-in" sx={{ textAlign: 'center', maxWidth: 480 }}>
                <Avatar
                    sx={{
                        width: 80, height: 80, borderRadius: 4,
                        background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.15))',
                        border: '1px solid rgba(124,58,237,0.2)',
                    }}
                >
                    <SearchOffRounded sx={{ fontSize: 40, color: '#a78bfa' }} />
                </Avatar>

                <Box>
                    <Typography variant="h1" sx={{
                        fontWeight: 900, fontSize: '6rem', lineHeight: 1,
                        background: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                        404
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                        Page not found
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary', maxWidth: 360, mx: 'auto' }}>
                        The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    </Typography>
                </Box>

                <Stack direction="row" spacing={2}>
                    <Button
                        component={Link} to="/dashboard"
                        variant="contained" startIcon={<HomeRounded />}
                        sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
                    >
                        Go to Dashboard
                    </Button>
                    <Button
                        onClick={() => window.history.back()}
                        variant="outlined" startIcon={<ArrowBackRounded />}
                        sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
                    >
                        Go Back
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}
