import { useCallback, useEffect, useState } from "react";
import { Box, Grid, Typography, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";

import UseLocalStorage from "../Component/Hooks/UseLocalStorage";
import { UserService } from "../Services/UserSercive";
import Loader from "../Component/Common/Loader";

const Root = styled(Grid)(({ theme }) => ({
    width: "100%",
    marginBottom: 15,

    ".history-card": {
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        paddingBottom: 16,
        borderBottom: `1px solid ${theme.palette.divider}`,
    },

    ".thumbnail": {
        width: "100%",
        aspectRatio: "16/9",
        borderRadius: 10,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        cursor: "pointer",
    },

    ".details": {
        display: "flex",
        flexDirection: "column",
        gap: 6,
    },

    ".clamp": {
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        WebkitLineClamp: 3,
    },

    ".empty-state": {
        textAlign: "center",
        padding: theme.spacing(6),
        color: theme.palette.text.secondary,
    },
}));

const WatchHistory = () => {
    const [user] = UseLocalStorage("User", "");
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

    const goToPreview = useCallback(
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
        <Root container spacing={2} mt={3}>
            {!loading && history.length === 0 ? (
                <Grid item xs={12}>
                    <Box className="empty-state">
                        <Typography variant="h6">No watch history found</Typography>
                        <Typography variant="body2">
                            Videos you watch will appear here.
                        </Typography>
                    </Box>
                </Grid>
            ) : !loading ?
                (
                    history.map((item, index) => (
                        <Grid item xs={12} key={item?._id || index}>
                            <Box className="history-card">
                                {/* Thumbnail */}
                                <Grid item xs={12} md={4}>
                                    <Box
                                        className="thumbnail"
                                        sx={{ backgroundImage: `url(${item?.thumbnail})` }}
                                        onClick={() => goToPreview(item)}
                                    />
                                </Grid>

                                {/* Details */}
                                <Grid item xs={12} md={7}>
                                    <Box className="details">
                                        <Typography className="clamp" title={item?.title}>
                                            {item?.title || "No title available"}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            {item?.owner?.userName || "Anonymous"} ·{" "}
                                            {item?.views || 0} Views
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            className="clamp"
                                            title={item?.description}
                                        >
                                            {item?.description || "No description available"}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Box>
                        </Grid>
                    ))
                )
                :
                <Loader size={50} message={"Loading..."} />
            }
        </Root>
    );
};

export default WatchHistory;
