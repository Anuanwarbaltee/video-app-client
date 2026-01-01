import React, { useEffect, useState, useCallback } from "react";
import {
    Box,
    Grid,
    Typography,
    TextField,
    Skeleton,
    Pagination,
    Avatar,
    Card,
    CardMedia,
    CardContent,
    Stack,
} from "@mui/material";
import { Videoservice } from "../Services/Videoservice";
import useLocalStorage from "../Component/Hooks/UseLocalStorage";
import { useNavigate } from "react-router-dom";

const LIMIT = 8;

const ChannelVideos = ({ channelId }) => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [user] = useLocalStorage("User", "");
    const navigate = useNavigate();

    const fetchVideos = useCallback(async () => {
        try {
            setLoading(true);
            const payload = {
                id: user?._id,
                page,
                limit: LIMIT,
                search,
            };

            const { data } = await Videoservice.getChanalVideos(payload);
            setVideos(data?.videos || []);
            setTotalPages(data?.pagination?.totalPages || 1);
        } catch (err) {
            console.error("Failed to fetch channel videos", err);
        } finally {
            setLoading(false);
        }
    }, [user?._id, page, search]);

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const gotoPreview = (video) => {
        navigate(`/edit-video/${video._id}`, {
            state: {
                video
            },
        });
    };

    return (
        <Box>
            {/* Channel Header */}
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Avatar
                    src={user?.avatar}
                    sx={{ width: 44, height: 44 }}
                />
                <Typography fontWeight={600}>
                    {user?.userName}
                </Typography>
            </Stack>

            {/* Search */}
            <TextField
                placeholder="Search videos..."
                value={search}
                onChange={handleSearch}
                size="small"
                sx={{
                    mb: 3,
                    width: "100%",
                    maxWidth: 420,
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "20px",
                    },
                }}
            />

            {/* Videos Grid */}
            <Grid container spacing={2}>
                {loading
                    ? Array.from({ length: LIMIT }).map((_, i) => (
                        <Grid item xs={12} sm={6} md={3} key={i}>
                            <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
                            <Skeleton sx={{ mt: 1 }} width="90%" />
                            <Skeleton width="60%" />
                        </Grid>
                    ))
                    : videos.map((video) => (
                        <Grid item xs={12} sm={6} md={3} key={video._id}>
                            <Card
                                onClick={() => gotoPreview(video)}
                                sx={{
                                    cursor: "pointer",
                                    borderRadius: 2,
                                    transition: "0.25s",
                                    "&:hover": {
                                        transform: "translateY(-4px)",
                                        boxShadow: 4,
                                    },
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="180"
                                    image={video.thumbnail}
                                    alt={video.title}
                                />
                                <CardContent sx={{ p: 1.2 }}>
                                    <Typography
                                        variant="subtitle2"
                                        fontWeight={500}
                                        noWrap
                                    >
                                        {video.title}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        {new Date(video.createdAt).toDateString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
            </Grid>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={4}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, value) => setPage(value)}
                        color="primary"
                    />
                </Box>
            )}
        </Box>
    );
};

export default ChannelVideos;
