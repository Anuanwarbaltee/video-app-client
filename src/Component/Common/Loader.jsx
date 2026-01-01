import { Box, CircularProgress, Typography, useTheme } from '@mui/material'
import React from 'react'

function Loader(props) {
    const theme = useTheme();
    const { size, message } = props;
    const loaderBgColor = theme.palette.mode === "dark" ? "#121212" : "rgba(0, 0, 0, 0.5)";
    return (

        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                minWidth: "100vw",
                bgcolor: loaderBgColor,
                zIndex: "111",
                position: "relative",
                left: 0,
            }}>
            <CircularProgress size={size} sx={{ color: "#fff" }} />
            <Typography sx={{ paddingTop: "10px", fontSize: "18px", color: "#fff" }}>
                {message}
            </Typography>
        </Box>
    )
}

export default Loader