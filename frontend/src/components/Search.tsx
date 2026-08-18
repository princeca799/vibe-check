import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';

export default function InputWithIcon() {
    const sxId = React.useId();
    const [searchTerm, setSearchTerm] = React.useState('');

    const handleSearch = (value: string) => {
        console.log('Searching for:', value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch(searchTerm);
        }
    };

    return (
        <Box 
            sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                width: '100%', 
                minHeight: '200px' 
            }}
        >
            <Box 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-end', 
                    width: '100%', 
                    maxWidth: 600 
                }}
            >
                <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5, fontSize: 32 }} />
                
                <Typography 
                    component="span" 
                    sx={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 700, 
                        color: 'primary.main',
                        mr: 0.5,
                        mb: 0.25
                    }}
                >
                    r/
                </Typography>

                <TextField 
                    id={`${sxId}-input`} 
                    label="Subreddit Vibe Check" 
                    variant="standard" 
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    sx={{
                        '& .MuiInputBase-input': { fontSize: '1.25rem' },
                        '& .MuiInputLabel-root': { fontSize: '1.25rem' }
                    }}
                />
            </Box>
        </Box>
    );
}