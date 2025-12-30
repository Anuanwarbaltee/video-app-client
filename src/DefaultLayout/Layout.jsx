import React, { useState } from "react";
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
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toggleDrawer } from "../redux/uiSlice";

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
    { label: "Subscriptions", icon: Subscriptions, url: "/subscription" },
];

const USER_MENU = [
    { label: "You", icon: ChevronRight },
    { label: "History", icon: History, url: "/watch-history" },
    { label: "Playlist", icon: PlaylistPlay },
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

/* ---------------- main layout ---------------- */

export default function DefaultLayout({ children }) {
    const [open, setOpen] = useState(false);
    const [route, setRoute] = useState("/");
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const drawerWidth = open ? DRAWER_OPEN_WIDTH : DRAWER_CLOSE_WIDTH;

    const handleNavigate = (url) => {
        setRoute(url);
        navigate(url);
    };

    const handlleDrawer = () => {
        dispatch(toggleDrawer(open))
        setOpen(!open)
    }

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
