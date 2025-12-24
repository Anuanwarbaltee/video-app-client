import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Typography, styled, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import Loader from "../Component/Common/Loader";
import Header from "../Component/Common/Header";
import useDebounce from "../Component/Hooks/Usedebounce";

import { Videoservice } from "../Services/Videoservice";
import { Helpers } from "../Shell/Helpers";
import { addFilter } from "../redux/searchSlice";

const Root = styled(Grid)(({ theme }) => ({
    width: "100%",

    ".video-card": {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        // "&:hover": {
        //     transform: "translateY(-4px)",
        //     boxShadow: theme.shadows[2],
        //     borderRadius: "10px"
        // },
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
        gap: 8,
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

    const fetchVideos = useCallback(async () => {
        setLoading(true);

        const payload = {
            sortType: "desc",
            sortBy: sortBy.current,
            limit: limit.current,
            page: page.current,
            search: debouncedSearch || "",
        };

        try {
            const res = await Videoservice.getVideoList(payload);
            setListData(res?.success ? res.data : []);
            dispatch(addFilter({ search: debouncedSearch }));
        } catch (error) {
            setListData([]);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, dispatch]);

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

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

    return (
        <Root container>
            {loading ? (
                <Loader size={50} message="Loading videos..." />
            ) : (
                <>
                    <Header handleSearch={setSearch} />

                    <Box mt={{ xs: "130px", md: "70px" }}>
                        <Grid container spacing={3}>
                            {listData?.videos?.length > 0 ? (
                                listData.videos.map((item) => (
                                    <Grid item xs={12} sm={6} md={4} key={item._id}>
                                        <Box
                                            className="video-card"
                                            onClick={() => goToPreview(item)}
                                        >
                                            {/* Thumbnail */}
                                            <Box
                                                className="thumbnail"
                                                sx={{ backgroundImage: `url(${item.thumbnail})` }}
                                            />

                                            {/* Footer */}
                                            <Box className="card-footer">
                                                <Box
                                                    className="avatar"
                                                    sx={{
                                                        backgroundImage: `url(${item.ownerDetails?.avatar})`,
                                                    }}
                                                />

                                                <Box className="content">
                                                    <Typography className="title">
                                                        {item.description || "No description available"}
                                                    </Typography>

                                                    <Typography className="meta">
                                                        {item.ownerDetails?.userName || "Anonymous"}
                                                    </Typography>

                                                    <Typography className="meta">
                                                        {item.views} views ·{" "}
                                                        {Helpers.timeAgo(item.createdAt)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Grid>
                                ))
                            ) : (
                                <Grid item xs={12}>
                                    <Box className="empty-state">
                                        <Typography variant="h6">No Data Found</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Try searching with a different keyword
                                        </Typography>
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                </>
            )}
        </Root>
    );
};

export default Home;
