import { useEffect, useRef, useState, useCallback } from "react";
import UseLocalStorage from "../Component/Hooks/UseLocalStorage";
import { Box, Grid, Typography, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LikeService from "../Services/LikeService";
import { Skeleton } from "@mui/material";

const Root = styled(Grid)(({ theme }) => ({
    width: "100%",
    margin: "16px 0",

    ".video-row": {
        display: "flex",
        gap: 16,
        paddingBottom: 16,
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
    <Box className="video-row">
        <Skeleton variant="rectangular" width={220} height={120} />
        <Box sx={{ flex: 1 }}>
            <Skeleton width="70%" />
            <Skeleton width="50%" />
            <Skeleton width="90%" />
        </Box>
    </Box>
);

const LikedVideos = () => {
    const [user] = UseLocalStorage("User", "");
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const pageRef = useRef(1);
    const limitRef = useRef(10);
    const isFetching = useRef(false);
    const hasMore = useRef(true);
    const observer = useRef(null);

    const fetchLikedVideos = useCallback(async () => {
        if (isFetching.current || !hasMore.current) return;

        isFetching.current = true;
        setLoading(true);

        try {
            const res = await LikeService.getLikedVideos({
                page: pageRef.current,
                limit: limitRef.current,
            });

            if (res.success) {
                const newVideos = res.data.videos || [];

                setVideos((prev) => [...prev, ...newVideos]);

                if (newVideos.length < limitRef.current) {
                    hasMore.current = false;
                } else {
                    pageRef.current += 1;
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            isFetching.current = false;
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLikedVideos();
    }, [fetchLikedVideos]);


    const sentinelRef = useCallback(
        (node) => {
            if (!node || loading) return;

            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        fetchLikedVideos();
                    }
                },
                { rootMargin: "150px" }
            );

            observer.current.observe(node);
        },
        [loading, fetchLikedVideos]
    );

    const gotoPreview = (item) => {
        navigate(`/preview/${item._id}`, {
            state: { id: item._id, url: item.uservideoFile, userId: user?._id },
        });
    };

    return (
        <Root container>
            <Grid item xs={12}>
                {videos.length === 0 && !loading && (
                    <Typography align="center" mt={5}>
                        No Liked Videos Found
                    </Typography>
                )}

                {videos.map((item) => (
                    <Box key={item._id} className="video-row">
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

                {hasMore.current && <Box ref={sentinelRef} height={20} />}
            </Grid>
        </Root>
    );
};

export default LikedVideos;
