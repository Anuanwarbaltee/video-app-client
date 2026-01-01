import React, { useEffect, useState } from "react";
import {
    Box,
    CssBaseline,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Tooltip,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import {
    Menu as MenuIcon,
    ChevronLeft,
    ChevronRight,
    Home,
    Subscriptions,
    History,
    PlaylistPlay,
    Slideshow,
    ThumbUp,
    Logout
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toggleDrawer } from "../redux/uiSlice";
import useLocalStorage from "../Component/Hooks/UseLocalStorage";
import ConfirmationDialog from "../Component/Common/ConformationDialog";
import { UserService } from "../Services/UserSercive";

const DRAWER_OPEN_WIDTH = 240;
const DRAWER_CLOSE_WIDTH = 60;

/* ---------------- styled components ---------------- */

const DrawerHeader = styled("div")(({ theme }) => ({
    ...theme.mixins.toolbar,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
}));

const Root = styled(Box)(({ theme }) => ({
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    padding: "0 10px",
}));

/* ---------------- menu data ---------------- */

const MAIN_MENU = [
    { label: "Home", icon: Home, url: "/home" },
];

const USER_MENU = [
    // { label: "You", icon: ChevronRight },
    { label: "Subscriptions", icon: Subscriptions, url: "/subscription" },
    { label: "History", icon: History, url: "/watch-history" },
    // { label: "Playlist", icon: PlaylistPlay },
    { label: "Your Videos", icon: Slideshow, url: `/video/${123}` },
    { label: "Liked Videos", icon: ThumbUp, url: "/liked-video" },
];

/* ---------------- reusable menu list ---------------- */

const MenuList = ({ items, open, activeRoute, onNavigate }) => {
    const theme = useTheme();


    return (
        <List>
            {items.map(({ label, icon: Icon, url }, index) => {
                if (label === "You" && !open) return null;
                return (

                    <ListItem key={label} disablePadding>
                        <ListItemButton
                            onClick={() => url && onNavigate(url)}
                            sx={{
                                m: 1,
                                borderRadius: 2,
                                justifyContent: open ? "flex-start" : "center",
                                backgroundColor:
                                    activeRoute === url ? theme.palette.action.selected : "inherit",
                                "&:hover": {
                                    backgroundColor: theme.palette.action.hover,

                                },

                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 2 : 0,
                                    justifyContent: "center",
                                }}
                            >
                                <Tooltip title={open ? "" : label}>
                                    <Icon />
                                </Tooltip>
                            </ListItemIcon>

                            {open && <ListItemText primary={label} />}
                        </ListItemButton>
                    </ListItem>
                )
            })}
        </List>
    );
};

const UserProfile = ({ open, user, onNavigate }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: open ? 1.5 : 0.5,
                m: 1,
                borderRadius: 2,
                cursor: "pointer",
                "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                },
            }}
            onClick={() => onNavigate(`/settings/${user?._id}`)}
        >
            <Box
                sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    backgroundImage: `url(${user?.avatar || "/avatar.png"})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    flexShrink: 0,
                }}
            />

            {open && (
                <Box>
                    <Typography fontWeight={600} noWrap>
                        {user?.userName || "Guest"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        View profile
                    </Typography>
                </Box>
            )}
        </Box>
    );
};


/* ---------------- main layout ---------------- */

export default function DefaultLayout({ children }) {
    const [open, setOpen] = useState(false);
    const [route, setRoute] = useState("/");
    const [avatar, setAvatar] = useState(null)
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const drawerWidth = open ? DRAWER_OPEN_WIDTH : DRAWER_CLOSE_WIDTH;
    const [user] = useLocalStorage("User", "");
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
    const [loading, setLoading] = useState(false)

    const handleNavigate = (url) => {
        setRoute(url);
        navigate(url);
    };

    const handlleDrawer = () => {
        dispatch(toggleDrawer(open))
        setOpen(!open)
    }

    const handleLogoutClick = () => {
        setOpenLogoutDialog(true);
    };

    const handleLogoutClose = () => {
        setOpenLogoutDialog(false);
    };
    const handleLogoutConfirm = async () => {
        try {
            setLoading(true)
            const res = await UserService.LougOutUser()
            localStorage.removeItem("Apikey");
            localStorage.removeItem("User");
            navigate("/login");
        } catch (error) {

        } finally {
            setLoading(false)
        }

    };
    useEffect(() => {
        if (user && Object.keys(user).length > 0) {
            setAvatar(user);
        }
    }, [user]);



    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />

            {/* Drawer */}
            <Drawer
                variant="permanent"
                open={open}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: { xs: open ? "95lvw" : drawerWidth, md: drawerWidth, sm: drawerWidth, xl: drawerWidth },
                        boxSizing: "border-box",
                        overflowX: "hidden",
                        backgroundColor: "background.default",
                        transition: (theme) =>
                            theme.transitions.create("width", {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                    },
                }}
            >
                <DrawerHeader>
                    <IconButton onClick={handlleDrawer}>
                        {open ? <ChevronLeft /> : <MenuIcon />}
                    </IconButton>
                </DrawerHeader>

                <MenuList
                    items={MAIN_MENU}
                    open={open}
                    activeRoute={route}
                    onNavigate={handleNavigate}
                />

                <MenuList
                    items={USER_MENU}
                    open={open}
                    activeRoute={route}
                    onNavigate={handleNavigate}
                />
                <Box sx={{ mt: "auto" }}>
                    <Box sx={{ mt: "auto" }}>
                        <UserProfile
                            open={open}
                            user={avatar}
                            onNavigate={handleNavigate}
                        />

                        <List>
                            <ListItem disablePadding>
                                <ListItemButton
                                    onClick={handleLogoutClick}
                                    sx={{
                                        m: 1,
                                        borderRadius: 2,
                                        justifyContent: open ? "flex-start" : "center",
                                        color: "error.main",
                                        "&:hover": {
                                            backgroundColor: "error.light",
                                        },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 2 : 0,
                                            justifyContent: "center",
                                            color: "error.main",
                                        }}
                                    >
                                        <Logout />
                                    </ListItemIcon>

                                    {open && <ListItemText primary="Logout" />}
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>
                    <ConfirmationDialog
                        open={openLogoutDialog}
                        title="Confirm Logout"
                        description="Are you sure you want to log out?"
                        confirmText={loading ? "Loading..." : "Logout"}
                        cancelText="Cancel"
                        confirmColor="error"
                        onConfirm={handleLogoutConfirm}
                        onClose={handleLogoutClose}
                    />

                </Box>

            </Drawer>

            {/* Main Content */}
            <Root
                component="main"
                sx={{
                    minWidth: `calc(100vw - ${drawerWidth + 20}px)`,
                }}
            >
                {children}
            </Root>
        </Box>
    );
}


