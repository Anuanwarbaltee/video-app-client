import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Box,
    Typography,
    styled,
    Grid,
    Skeleton,
} from "@mui/material";
import { Videoservice } from "../../../Services/Videoservice";
import { Helpers } from "../../../Shell/Helpers";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../Hooks/Usedebounce";
import { addFilter } from "../../../redux/searchSlice";
import { useDispatch } from "react-redux";

const Root = styled(Grid)(({ theme }) => ({
    width: "100%",

    ".video-card": {
        display: "flex",
        gap: "10px",
        width: "100%",
        alignItems: "flex-start",
    },

    ".thumbnail": {
        width: "45%",              /* FIXED WIDTH */
        aspectRatio: "16 / 9",     /* SAME HEIGHT ALWAYS */
        borderRadius: "10px",
        backgroundSize: "cover",
        backgroundPosition: "center",
        flexShrink: 0,
    },

    ".details": {
        width: "55%",              /* REST OF SPACE */
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },

    ".description": {
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 3,
        overflow: "hidden",
        fontWeight: 500,
    },

    ".meta": {
        fontSize: "13px",
        color: theme.palette.text.secondary,
    },
}));


/* ---------- Skeleton Card ---------- */
const VideoSkeleton = () => (
    <Grid item xs={12}>
        <Box display="flex" gap={1}>
            <Skeleton variant="rectangular" width="60%" height={90} />
            <Box flex={1}>
                <Skeleton height={20} />
                <Skeleton height={18} width="70%" />
                <Skeleton height={14} width="50%" />
            </Box>
        </Box>
    </Grid>
);

const PreviewLeftSec = ({ searchValue }) => {
    const [listData, setListData] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const page = useRef(1);
    const limit = useRef(10);
    const hasMore = useRef(true);
    const isFetching = useRef(false);

    const debouncedSearch = useDebounce(searchValue, 500);

    const fetchVideos = useCallback(
        async (reset = false) => {
            if (isFetching.current) return;
            if (!hasMore.current && !reset) return;

            if (reset) {
                page.current = 1;
                hasMore.current = true;
                setListData([]);
            }

            isFetching.current = true;
            setLoading(true);

            try {
                const payload = {
                    sortType: "desc",
                    sortBy: "title",
                    limit: limit.current,
                    page: page.current,
                    search: debouncedSearch || "",
                };

                const res = await Videoservice.getVideoList(payload);

                if (res?.success) {
                    const videos = res.data?.videos || [];

                    setListData((prev) =>
                        reset ? videos : [...prev, ...videos]
                    );

                    if (videos.length < limit.current) {
                        hasMore.current = false;
                    } else {
                        page.current += 1;
                    }

                    dispatch(addFilter({ search: debouncedSearch }));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
                isFetching.current = false;
            }
        },
        [debouncedSearch, dispatch]
    );

    useEffect(() => {
        fetchVideos(true);
    }, [debouncedSearch]);


    const observer = useRef(null);

    const sentinelRef = useCallback(
        (node) => {
            if (loading || !node) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        fetchVideos();
                    }
                },
                { rootMargin: "100px" }
            );

            observer.current.observe(node);
        },
        [loading, fetchVideos]
    );

    const gotoPriewPage = (item) => {
        navigate(`/preview/${item._id}`, {
            state: {
                id: item._id,
                url: item.uservideoFile,
                userId: item.ownerDetails?._id,
            },
        });
    };

    return (
        <Root container spacing={2} my={"50px"}>

            {listData?.map((item) => (
                <Grid item xs={12} key={item._id}>
                    <Box className="video-card" onClick={() => gotoPriewPage(item)}>
                        <Box
                            className="thumbnail"
                            sx={{ backgroundImage: `url(${item.thumbnail})` }}
                        />

                        <Box className="details">
                            <Typography className="description">
                                {item.description || "No description available"}
                            </Typography>

                            <Typography className="meta">
                                {item.ownerDetails?.userName || "Anonymous"}
                            </Typography>

                            <Typography className="meta">
                                {item.views} views · {Helpers.timeAgo(item.createdAt)}
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
            ))}


            {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                    <VideoSkeleton key={i} />
                ))}

            {/* Sentinel */}
            {hasMore.current && <Box ref={sentinelRef} height={20} />}
        </Root>
    );
};

export default PreviewLeftSec;
