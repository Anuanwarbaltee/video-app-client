import { useEffect, useState, useContext, useCallback } from "react";
import {
    AppBar,
    Toolbar,
    Box,
    InputAdornment,
    TextField,
    IconButton,
    Typography,
    Button,
    Tooltip,
    Avatar
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import { useSelector } from "react-redux";
import { ThemeContext } from "../../Shell/Theme";
import UseLocalStorage from "../Hooks/UseLocalStorage";
import VideoUploadModal from "./Videos/VideoUploadPopUp";

const Header = ({ handleSearch }) => {
    const { mode, toggleTheme } = useContext(ThemeContext);
    const [userData] = UseLocalStorage("User", "");
    const [openDialog, setOpenDialog] = useState(false);
    const [search, setSearch] = useState("");

    const searchValue = useSelector((state) => state.search.filters.search);

    useEffect(() => {
        setSearch(searchValue || "");
    }, [searchValue]);

    const handleSearchChange = useCallback(
        (e) => {
            const value = e.target.value;
            setSearch(value);
            handleSearch(value);
        },
        [handleSearch]
    );

    return (
        <>
            <AppBar
                position="fixed"
                elevation={1}
                sx={{
                    bgcolor: "background.default",
                    color: "text.primary",
                }}
            >
                <Toolbar
                    sx={{
                        flexWrap: "wrap",
                        rowGap: 1,
                    }}
                >
                    {/* Search Bar */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: "flex",
                            justifyContent: { xs: "flex-start", sm: "center" },
                            width: { xs: "100%", sm: "auto" },
                            order: { xs: 1, sm: 0 },
                            mt: { xs: 1, sm: 0 },
                            paddingLeft: { xs: "50px" }
                        }}
                    >
                        <TextField
                            placeholder="Search"
                            value={search}
                            onChange={handleSearchChange}
                            sx={{
                                width: "100%",
                                maxWidth: {
                                    xs: "100%",
                                    sm: 360,
                                    md: 480,
                                    lg: 500,
                                },
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "20px",
                                },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton>
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>


                    {/* Actions */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            width: { xs: "100%", sm: "auto" },
                            justifyContent: { xs: "flex-end", sm: "flex-start" },
                            order: { xs: 2, sm: 0 },
                        }}
                    >
                        {/* Theme Toggle */}
                        <Tooltip title="Theme">
                            <IconButton onClick={toggleTheme}>
                                {mode === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
                            </IconButton>
                        </Tooltip>

                        {/* Create Button */}
                        <Tooltip title="Create">
                            <Button
                                onClick={() => setOpenDialog(true)}
                                sx={{
                                    bgcolor: "action.hover",
                                    color: "text.primary",
                                    textTransform: "none",
                                    borderRadius: "18px",
                                    px: 2,
                                    py: 0.6,
                                    "&:hover": { bgcolor: "action.selected" },
                                }}
                                startIcon={<AddIcon />}
                            >
                                <Typography variant="body2">Create</Typography>
                            </Button>
                        </Tooltip>

                        {/* Avatar */}
                        {/* <Box
                            sx={{
                                height: 32,
                                width: 32,
                                borderRadius: "50%",
                                backgroundImage: `url(${userData?.avatar || "https://via.placeholder.com/32"})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                cursor: "pointer",
                            }}
                        /> */}

                        <Avatar
                            src={userData?.avatar}
                            sx={{ width: 35, height: 35 }}
                        />
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Spacer */}
            <Toolbar />

            <VideoUploadModal
                open={openDialog}
                onClose={() => setOpenDialog(false)}
            />
        </>
    );
};

export default Header;
