import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Typography, styled, Grid } from "@mui/material";
import Loader from "../Component/Common/Loader";
import { Videoservice } from "../Services/Videoservice";
import { Helpers } from "../Shell/Helpers";
import { useNavigate } from "react-router-dom";
import Header from "../Component/Common/Header";
import useDebounce from "../Component/Hooks/Usedebounce";

const Root = styled("Grid")(({ theme }) => ({
    width: "100%",
    // padding: "60px 0px",
    '& .main-container': {
        display: "flex",
        justifyContent: "start",
        alignItem: "center",
        flexDirection: "column",
        gap: "10px",
        '& .iframe-sec': {
            // height: "300px",
            width: "100%",
            // backgroundColor: "red",
            borderRadius: "10px"
        },
        '& .detail-sec': {
            display: "flex",
            justifyContent: "start",
            alignItem: "start",
            gap: "10px",
            '& .avatar': {
                height: "50px",
                width: "50px",
                borderRadius: "50%",
                // backgroundColor: "red"
            },
            '& .content': {
                display: "flex",
                alignItem: "center",
                gap: "5px",
                flexDirection: "column"
            }

        }
    }
}))


const Home = () => {
    const [listData, setListData] = useState([])
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('')
    const debounceValue = useDebounce(search, 500)
    const isFirstLoad = useRef(true)
    const navigate = useNavigate();

    const page = useRef(1);
    const limits = useRef(10)
    const sortBy = useRef("title")

    useEffect(() => {
        // if (!isFirstLoad && debounceValue == '') return;
        // isFirstLoad.current = false;
        getVideoList();
    }, [debounceValue]);

    const getVideoList = async () => {
        setLoading(true);

        const data = {
            sortType: "desc",
            sortBy: sortBy.current,
            limit: limits.current,
            page: page.current,
            search: debounceValue || ""
        };

        try {
            const res = await Videoservice.getVideoList(data);
            // setSearch('')
            setListData(res.success ? res.data : []);
        } catch {
            setListData([]);
        } finally {
            setLoading(false);
        }
    };

    const gotoPriewPage = (item) => {
        navigate(`/preview/${item._id}`, {
            state: { id: item._id, url: item.uservideoFile, userId: item.ownerDetails._id }
        })
    }

    const handleSearch = (value) => {
        setSearch(value)
    }
    return (
        <Root>
            {!loading ?
                <>
                    <Header handleSearch={handleSearch} />
                    <Box sx={{ mt: { xs: "130px", md: "65px", xl: "65px" } }}>
                        <Grid container spacing={2} justifyContent={"space-between"} >
                            {listData?.videos?.length > 0 && listData?.videos?.map((item, index) => {
                                return (
                                    <Grid key={item.id || index} item md={6} xs={12} className="main-container">
                                        <Box className="iframe-sec" onClick={() => (gotoPriewPage(item))}
                                            //  sx={{ backgroundImage: `url(${item.thumbnail})`, backgroundPosition: "center", backgroundSize: "cover", height: "300px" }}
                                            sx={{
                                                backgroundImage: `url(${item.thumbnail})`,
                                                backgroundPosition: "center",
                                                backgroundSize: "cover",
                                                backgroundRepeat: "no-repeat",
                                                width: "100%",
                                                aspectRatio: "16/9", // Maintains consistent height across screen sizes
                                                borderRadius: "10px",
                                            }}
                                        >

                                        </Box>
                                        <Box className="detail-sec">
                                            <Box className="avatar"
                                                //  sx={{ backgroundImage: `url(${item.ownerDetails?.avatar})`, backgroundPosition: "center", backgroundSize: "cover", height: "100%" }}
                                                sx={{
                                                    backgroundImage: `url(${item.ownerDetails?.avatar})`,
                                                    backgroundPosition: "center",
                                                    backgroundSize: "cover",
                                                    backgroundRepeat: "no-repeat",
                                                    width: "100%",
                                                    aspectRatio: "4/4", // Maintains consistent height across screen sizes
                                                    // borderRadius: "10px",
                                                }}
                                            >

                                            </Box>
                                            <Box className="content">
                                                <Box className="description">
                                                    <Typography>{item.description || 'No description available'}</Typography>
                                                </Box>
                                                <Box className="info">
                                                    <Typography>{item.ownerDetails?.userName || 'Anonymous'}</Typography>
                                                    <Box>
                                                        <span>{item.views} View </span>
                                                        <span>{Helpers.timeAgo(item.createdAt)}</span>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Grid>
                                );
                            })}

                        </Grid>
                    </Box>
                </>
                :
                <Loader size={50} message={"Loading..."} />}
        </Root>
    );
};

export default Home;
