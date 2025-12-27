import React, { useEffect, useState, useCallback } from "react";
import {
    Box,
    Grid,
    Typography,
    TextField,
    Skeleton,
    Pagination,
} from "@mui/material";
import { Videoservice } from "../Services/Videoservice";
import UseLocalStorage from "../Component/Hooks/UseLocalStorage";
import { useNavigate } from "react-router-dom";

const ChannelVideos = ({ channelId }) => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [user] = UseLocalStorage("User", "");
    const navigate = useNavigate();
    const limit = 8;

    const fetchVideos = useCallback(async () => {
        try {
            setLoading(true);
            const payload = {
                id: user?._id,
                page,
                limit,
                search,
            }
            const { data } = await Videoservice.getChanalVideos(payload)
            setVideos(data?.videos || []);
            setTotalPages(data?.pagination?.totalPages || 1);
        } catch (error) {
            console.error("Failed to fetch channel videos", error);
        } finally {
            setLoading(false);
        }
    }, [channelId, page, search]);

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    const handleSearch = e => {
        setSearch(e.target.value);
        setPage(1);
    };

    const gotoPreview = (item) => {
        navigate(`/preview/${item._id}`, {
            state: { id: item._id, url: item.uservideoFile, userId: user?._id },
        });
    };

    return (
        <Box>
            {/* Header */}
            <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "16px 0 10px 0" }}>
                    <Box
                        sx={{
                            backgroundImage: `url(${user.avatar})`,
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            aspectRatio: "4/4",
                            height: "40px",
                            width: "40px",
                            borderRadius: "50%",
                        }}
                        title={user?.userName}
                    >

                    </Box>
                    <Typography sx={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        WebkitLineClamp: 3
                    }}
                        title={user?.userName}
                    >{user.userName || ''}</Typography>
                </Box>
            </Box>

            {/* Search */}
            <TextField
                fullWidth
                size="small"
                placeholder="Search videos..."
                value={search}
                onChange={handleSearch}
                sx={{ mb: 3 }}
            />

            {/* Videos Grid */}
            <Grid container spacing={2}>
                {loading
                    ? Array.from(new Array(limit)).map((_, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Skeleton variant="rectangular" height={180} />
                            <Skeleton width="80%" />
                            <Skeleton width="60%" />
                        </Grid>
                    ))
                    : videos.map(video => (
                        <Grid item xs={12} sm={6} md={3} key={video._id}>
                            <Box
                                sx={{
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    cursor: "pointer",
                                }}
                                onClick={() => gotoPreview(video)}
                            >
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    style={{
                                        width: "100%",
                                        height: 180,
                                        objectFit: "cover",
                                    }}
                                />
                                <Box p={1}>
                                    <Typography variant="subtitle2" noWrap>
                                        {video.title}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(video.createdAt).toDateString()}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
            </Grid>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <Box display="flex" justifyContent="end" alignItems="flex-end" mt={4}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, value) => setPage(value)}
                        color="primary"
                    />
                </Box>
            )
            }
        </Box >
    );
};

export default ChannelVideos;
