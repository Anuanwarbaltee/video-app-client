import { useCallback, useEffect, useState } from "react";
import { Box, Grid, Typography, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";

import useLocalStorage from "../Component/Hooks/UseLocalStorage";
import { UserService } from "../Services/UserSercive";
import { Skeleton } from "@mui/material";

const Root = styled(Grid)(({ theme }) => ({
    width: "100%",
    marginBottom: 15,

    ".history-row": {
        display: "flex",
        gap: 16,
        padding: "16px 0",
        borderBottom: `1px solid ${theme.palette.divider}`,
    },

    ".thumbnail": {
        width: 220,
        aspectRatio: "16/9",
        borderRadius: 10,
        backgroundSize: "cover",
        backgroundPosition: "center",
        cursor: "pointer",
    },
}));

const VideoSkeleton = () => (
    <Box className="history-row">
        <Skeleton variant="rectangular" width={220} height={120} />
        <Box sx={{ flex: 1 }}>
            <Skeleton width="70%" />
            <Skeleton width="50%" />
            <Skeleton width="90%" />
        </Box>
    </Box>
);

const WatchHistory = () => {
    const [user] = useLocalStorage("User", "");
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchWatchHistory = useCallback(async () => {
        setLoading(true)
        try {
            const res = await UserService.geHistory(user?._id);
            if (res?.success) {
                setHistory(res.data || []);
            }
        } catch (error) {
            console.error("Failed to load watch history", error);
        } finally {
            setLoading(false)
        }
    }, [user?._id]);

    useEffect(() => {
        fetchWatchHistory();
    }, [fetchWatchHistory]);

    const gotoPreview = useCallback(
        (item) => {
            if (!item?._id) return;

            navigate(`/preview/${item._id}`, {
                state: {
                    id: item._id,
                    url: item.uservideoFile,
                    userId: item?.owner?._id,
                },
            });
        },
        [navigate]
    );


    return (
        <Root container>
            <Grid item xs={12}>
                {history.length === 0 && !loading && (
                    <Typography align="center" mt={5}>
                        No Liked Videos Found
                    </Typography>
                )}

                {history.map((item) => (
                    <Box key={item._id} className="history-row">
                        <Box
                            className="thumbnail"
                            sx={{ backgroundImage: `url(${item.thumbnail})` }}
                            onClick={() => gotoPreview(item)}
                        />
                        <Box>
                            <Typography fontWeight={600}>{item.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {user?.userName || "Anonymous"} • {item.views} views
                            </Typography>
                            <Typography variant="body2">
                                {item.description}
                            </Typography>
                        </Box>
                    </Box>
                ))}

                {loading &&
                    Array.from({ length: 5 }).map((_, i) => <VideoSkeleton key={i} />)}

            </Grid>
        </Root>
    );
};

export default WatchHistory;
