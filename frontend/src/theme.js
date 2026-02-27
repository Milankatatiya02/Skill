import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#7c3aed',
            light: '#a78bfa',
            dark: '#5b21b6',
        },
        secondary: {
            main: '#06b6d4',
            light: '#22d3ee',
            dark: '#0891b2',
        },
        success: {
            main: '#10b981',
            light: '#34d399',
            dark: '#059669',
        },
        warning: {
            main: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
        },
        error: {
            main: '#ef4444',
            light: '#f87171',
            dark: '#dc2626',
        },
        background: {
            default: '#0b0f1a',
            paper: '#111827',
        },
        text: {
            primary: '#f1f5f9',
            secondary: '#94a3b8',
        },
        divider: 'rgba(148, 163, 184, 0.08)',
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: { fontWeight: 700, letterSpacing: '-0.02em' },
        h5: { fontWeight: 700, letterSpacing: '-0.01em' },
        h6: { fontWeight: 600 },
        subtitle1: { fontWeight: 500 },
        subtitle2: { fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#64748b' },
        body2: { color: '#94a3b8' },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: 14 },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background: 'linear-gradient(160deg, #0b0f1a 0%, #0f172a 50%, #0b0f1a 100%)',
                    minHeight: '100vh',
                    scrollbarWidth: 'thin',
                    '&::-webkit-scrollbar': { width: 6 },
                    '&::-webkit-scrollbar-thumb': { background: '#1e293b', borderRadius: 99 },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: '10px 24px',
                    fontSize: '0.875rem',
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)',
                    boxShadow: '0 4px 20px rgba(124, 58, 237, 0.3)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)',
                        boxShadow: '0 6px 28px rgba(124, 58, 237, 0.45)',
                        transform: 'translateY(-1px)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    background: 'rgba(17, 24, 39, 0.7)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(148, 163, 184, 0.06)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        borderColor: 'rgba(124, 58, 237, 0.15)',
                        boxShadow: '0 8px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(124, 58, 237, 0.08)',
                        transform: 'translateY(-2px)',
                    },
                },
            },
        },
        MuiTextField: {
            defaultProps: { variant: 'outlined', fullWidth: true, size: 'medium' },
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.1)' },
                        '&:hover fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                        '&.Mui-focused fieldset': {
                            borderColor: '#7c3aed',
                            boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.15)',
                        },
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: { fontWeight: 600, fontSize: '0.75rem' },
                colorPrimary: { backgroundColor: 'rgba(124, 58, 237, 0.12)', color: '#a78bfa' },
                colorSuccess: { backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#6ee7b7' },
                colorWarning: { backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24' },
                colorError: { backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#fca5a5' },
                colorSecondary: { backgroundColor: 'rgba(6, 182, 212, 0.12)', color: '#67e8f9' },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    background: 'rgba(11, 15, 26, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRight: '1px solid rgba(148, 163, 184, 0.05)',
                },
            },
        },
        MuiLinearProgress: {
            styleOverrides: {
                root: { borderRadius: 10, height: 6, backgroundColor: 'rgba(148,163,184,0.08)' },
                barColorPrimary: { background: 'linear-gradient(90deg, #7c3aed, #06b6d4)', borderRadius: 10 },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
    },
});

export default theme;
