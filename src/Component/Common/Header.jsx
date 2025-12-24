import React, { useState } from 'react'
import LightModeIcon from '@mui/icons-material/LightMode';
import { ThemeContext } from '../../Shell/Theme';
import { useContext } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { Box, Button, Grid, InputAdornment, TextField, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import UseLocalStorage from '../Hooks/UseLocalStorage';
import VideoUploadModal from './Videos/VideoUploadPopUp';

const Header = ({ handleSearch }) => {
    const [userData, setUserdata] = UseLocalStorage("User", '')
    const { mode, toggleTheme } = useContext(ThemeContext);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [search, setSearch] = useState('')
    const handleSeachValue = (event) => {
        handleSearch(event.target.value)
        setSearch(event.target.value)
    }
    return (
        <>
            <Box sx={{ display: 'flex', flexWrap: "wrap", alignItems: "center", justifyContent: "normal", gap: 2, position: "fixed", padding: "10px 0", bgcolor: "background.default", minWidth: "100lvw", zIndex: 999 }}>

                <Box>
                    <TextField
                        type="text"
                        placeholder="Search"
                        fullWidth
                        value={search}
                        onChange={handleSeachValue}
                        sx={{
                            minWidth: { xs: "80lvw", md: "500px", sm: "500px" },

                            "& .MuiInputBase-input": {
                                padding: "10px 14px",
                            },
                        }}
                        InputProps={{
                            sx: { textAlign: "left" },
                            endAdornment: (
                                <InputAdornment
                                    position="end"
                                    sx={{
                                        alignSelf: "flex-end",
                                        margin: 0,
                                        marginBottom: "4px",
                                        // opacity: 0,
                                        textAlign: "center"
                                    }}
                                >
                                    <IconButton>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                </Box>
                <Box sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: "100px",
                    height: "40px",
                    border: "1px solid #ccc",
                    borderRadius: "25px",
                    padding: "10px"
                }}
                    onClick={() => setOpenDialog(true)}
                >
                    <AddIcon />
                    <Typography>Create</Typography>
                </Box>

                <Box>
                    {mode === "dark" ? <IconButton><DarkModeIcon onClick={toggleTheme} /></IconButton> : <IconButton ><LightModeIcon onClick={toggleTheme} /></IconButton>}
                </Box>

                <Box sx={{}}>
                    <Box sx={{
                        height: "40px",
                        width: "40px",
                        borderRadius: "50%",
                        backgroundImage: `url(${userData.avatar || "https://via.placeholder.com/40"})`, backgroundPosition: "center", backgroundSize: "cover", objectFit: "cover",
                    }}>

                    </Box>
                </Box>
            </Box>
            <VideoUploadModal open={openDialog} onClose={() => setOpenDialog(false)} />
        </>
    )
}

export default Header