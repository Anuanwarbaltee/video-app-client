import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Typography, styled, Grid, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import Header from "../Component/Common/Header";
import useDebounce from "../Component/Hooks/Usedebounce";
import { Videoservice } from "../Services/Videoservice";
import { Helpers } from "../Shell/Helpers";
import { addFilter } from "../redux/searchSlice";
import { Padding } from "@mui/icons-material";

const Root = styled(Grid)(({ theme }) => ({
    width: "100%",

    ".video-card": {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        cursor: "pointer",
        padding: "10px",
        position: "relative",
        "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            borderRadius: 10,
            boxShadow: "-7px 9px 56px -21px rgba(0, 0, 0, 0.75)",
            opacity: 0,
            transition: "opacity 0.2s ease",

        },
        "&:hover::before": {
            opacity: 1,
        },
    },

    ".thumbnail": {
        width: "100%",
        aspectRatio: "16 / 9",
        borderRadius: 12,
        backgroundSize: "cover",
        backgroundPosition: "center",
    },

    ".card-footer": {
        display: "flex",
        gap: 12,
        marginTop: 8,
    },

    ".avatar": {
        width: 44,
        height: 44,
        borderRadius: "50%",
        backgroundSize: "cover",
        backgroundPosition: "center",
        flexShrink: 0,
    },

    ".content": {
        display: "flex",
        flexDirection: "column",
        gap: 4,
    },

    ".title": {
        fontWeight: 600,
        lineHeight: 1.3,
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 2,
        overflow: "hidden",
    },

    ".meta": {
        fontSize: 13,
        color: theme.palette.text.secondary,
    },

    ".empty-state": {
        height: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
        gap: 8,
        width: "80vw"
    },
}));

const Home = () => {
    const [listData, setListData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const page = useRef(1);
    const limit = useRef(10);
    const sortBy = useRef("title");
    const isFetching = useRef(false);
    const hasMore = useRef(true);

    const fetchVideos = useCallback(
        async (reset = false) => {
            if (isFetching.current) return;
            if (!hasMore.current && !reset) return;

            if (reset) {
                page.current = 1;
                hasMore.current = true;
            }

            isFetching.current = true;
            setLoading(true);

            try {
                const payload = {
                    sortType: "desc",
                    sortBy: sortBy.current,
                    limit: limit.current,
                    page: page.current,
                    search: debouncedSearch || "",
                };
                const res = await Videoservice.getVideoList(payload);

                if (res?.success) {
                    const newVideos = res.data?.videos || [];

                    setListData((prev) => (reset ? newVideos : [...prev, ...newVideos]));

                    if (newVideos.length < limit.current) {
                        hasMore.current = false;
                    } else {
                        page.current += 1;
                    }
                } else {
                    setListData(reset ? [] : listData);
                }

                dispatch(addFilter({ search: debouncedSearch }));
            } catch (error) {
                console.error("Fetch error:", error);
                setListData(reset ? [] : listData);
            } finally {
                setLoading(false);
                isFetching.current = false;
            }
        },
        [debouncedSearch, dispatch]
    );

    useEffect(() => {
        fetchVideos();
    }, []);

    useEffect(() => {
        if (debouncedSearch !== undefined) {
            fetchVideos(true);
        }
    }, [debouncedSearch]);

    // IntersectionObserver 
    const observer = useRef();
    const sentinelRef = useCallback(
        (node) => {
            if (loading || !node) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && hasMore.current && !isFetching.current) {
                        fetchVideos();
                    }
                },
                { threshold: 0.1, rootMargin: "100px" }
            );

            observer.current.observe(node);
        },
        [loading, fetchVideos]
    );

    const goToPreview = useCallback(
        (item) => {
            navigate(`/preview/${item._id}`, {
                state: {
                    id: item._id,
                    url: item.uservideoFile,
                    userId: item.ownerDetails?._id,
                },
            });
        },
        [navigate]
    );

    const skeletonArray = Array.from({ length: 6 });

    return (
        <Root container>
            <Header handleSearch={setSearch} />

            <Box mt={{ xs: "60px", md: "15px" }} mb={{ xs: "20px", md: "15px" }}>
                <Grid container spacing={3}>
                    {listData.length === 0 && !loading ? (
                        <Grid item xs={12}>
                            <Box className="empty-state" >
                                <Typography variant="h6" sx={{ textAlign: "center" }}>No Data Found</Typography>
                            </Box>
                        </Grid>
                    ) : (
                        <>
                            {listData.map((item) => (
                                <Grid item xs={12} sm={6} md={4} key={item._id}>
                                    <Box className="video-card" onClick={() => goToPreview(item)}>
                                        <Box
                                            className="thumbnail"
                                            sx={{ backgroundImage: `url(${item.thumbnail})` }}
                                        />
                                        <Box className="card-footer">
                                            <Box
                                                className="avatar"
                                                sx={{ backgroundImage: `url(${item.ownerDetails?.avatar})` }}
                                            />
                                            <Box className="content">
                                                <Typography className="title" title={item.title || "No title available"}>
                                                    {item.title || "No title available"}
                                                </Typography>
                                                <Typography className="meta">
                                                    {item.ownerDetails?.userName || "Anonymous"}
                                                </Typography>
                                                <Typography className="meta">
                                                    {item.views} views · {Helpers.timeAgo(item.createdAt)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}

                            {loading &&
                                skeletonArray.map((_, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
                                        <Box className="video-card">
                                            <Skeleton variant="rectangular" height={180} width={300} sx={{ borderRadius: 2 }} />
                                            <Box className="card-footer" sx={{ mt: 1 }}>
                                                <Skeleton variant="circular" width={44} height={44} />
                                                <Box sx={{ flex: 1, ml: 1 }}>
                                                    <Skeleton variant="text" width="80%" />
                                                    <Skeleton variant="text" width="60%" />
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Grid>
                                ))}
                        </>
                    )}
                </Grid>
            </Box>

            {hasMore.current && <Box ref={sentinelRef} height={20} width="100%" />}
        </Root>
    );
};

export default Home;
