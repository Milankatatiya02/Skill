import { Box, CircularProgress } from '@mui/material';

export default function Spinner({ size = 'md' }) {
    const sizeMap = { sm: 24, md: 36, lg: 48 };
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}>
            <CircularProgress size={sizeMap[size]} />
        </Box>
    );
}
