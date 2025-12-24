import React, { useEffect, useRef, useState } from "react";
import { Button, Box, Typography, styled, Grid } from "@mui/material";
import Loader from "../Loader";
import { Videoservice } from "../../../Services/Videoservice";
import { Helpers } from "../../../Shell/Helpers";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../Hooks/Usedebounce";
import { addFilter } from "../../../redux/searchSlice";
import { useDispatch } from "react-redux";

const Root = styled("Grid")(({ theme }) => ({
    width: "100%",

    '& .main-container': {
        display: "flex",
        justifyContent: "start",
        alignItem: "center",
        flexDirection: "row",
        gap: "10px",
        spacing: "10px",
        flexWrap: "wrap",
        '& .iframe-sec': {
            height: "160px !important",
            width: "100%",
            // backgroundColor: "red",
            borderRadius: "10px"
        },
        '& .detail-sec': {
            display: "flex",
            justifyContent: "start",
            alignItem: "start",
            '& .content': {
                display: "flex",
                alignItem: "center",
                gap: "5px",
                flexDirection: "column"
            }

        }
    }
}))


const PreviewLeftSec = ({ searchValue }) => {
    const [listData, setListData] = useState([])
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const page = useRef(1);
    const limits = useRef(10)
    const sortBy = useRef("title")
    const debounceValue = useDebounce(searchValue, 500)
    const dispatch = useDispatch()

    useEffect(() => {
        getVideoList();
    }, [debounceValue])

    const getVideoList = async () => {

        setLoading(true)
        let data = {
            sortType: "desc",
            sortBy: sortBy.current,
            limit: limits.current,
            page: page.current,
            search: debounceValue || ""
        }
        try {
            let res = await Videoservice.getVideoList(data);
            if (res.success) {
                setListData(res.data)
                dispatch(addFilter({ search: debounceValue }))
            } else {
                setListData([])
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }

    const gotoPriewPage = (item) => {
        navigate(`/preview/${item._id}`, {
            state: { id: item._id, url: item.uservideoFile, userId: item.ownerDetails._id }
        })
    }

    return (
        <Root>
            {!loading ?
                <Box sx={{ marginTop: "65px", }}>
                    <Grid container spacing={1} justifyContent={"space-between"} >
                        {listData?.videos?.length > 0 && listData?.videos?.map((item, index) => {
                            return (
                                <Grid key={item.id || index} item md={12} xs={12} className="main-container">
                                    <Grid item md={7} sm={7}>
                                        <Box className="iframe-sec" onClick={() => (gotoPriewPage(item))}
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
                                    </Grid>
                                    <Grid item md={4} sm={4}>
                                        <Box className="detail-sec">

                                            <Box className="content">
                                                <Box className="description">
                                                    <Typography sx={{
                                                        display: "-webkit-box",
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                        WebkitLineClamp: 3
                                                    }}
                                                        title={item?.description}
                                                    >{item.description || 'No description available'}</Typography>
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
                                </Grid>
                            );
                        })}

                    </Grid>
                </Box>
                :
                <Loader size={50} message={"Loading..."} />}
        </Root>
    );
};

export default PreviewLeftSec;
