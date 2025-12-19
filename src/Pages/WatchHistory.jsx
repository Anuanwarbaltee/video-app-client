import React, { useEffect, useState } from 'react'
import { UserService } from '../Services/UserSercive'
import UseLocalStorage from '../Component/Common/UseLocalStorage'
import Header from '../Component/Common/Header'
import { Box, Grid, Typography, styled } from '@mui/material'
import { Helpers } from "../Shell/Helpers"
import { useNavigate } from 'react-router-dom'
const Root = styled("Grid")(({ theme }) => ({
    width: "100%",
    marginBottom: "15px",
    '& .main-container': {
        display: "flex",
        justifyContent: "start",
        alignItem: "center",
        flexDirection: "row",
        gap: "10px",
        spacing: "15px",
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

const WatchHistory = () => {
    const [user, setUser] = UseLocalStorage('User', '')
    const [history, setHistory] = useState([])
    const navigate = useNavigate();
    useEffect(() => {
        getWatchHistory();
    }, [])

    const getWatchHistory = async () => {
        try {
            let res = await UserService.geHistory(user?._id);
            if (res.success) {
                setHistory(res.data)
                console.log(history)
            }
        } catch (error) {

        }
    }

    const gotoPriewPage = (item) => {
        navigate(`/preview/${item._id}`, {
            state: { id: item?._id, url: item?.uservideoFile, userId: item?.owner?._id }
        })
    }
    return (
        <Root>
            <Header />
            <Box sx={{ marginTop: "65px", }}>
                <Grid container spacing={2} justifyContent={"space-between"} >
                    {history?.length > 0 && history?.map((item, index) => {
                        return (
                            <Grid key={item.id || index} item md={12} xs={12} className="main-container">
                                <Grid item md={4} sm={8}>
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
                                <Grid item md={5} sm={5}>
                                    <Box className="detail-sec">

                                        <Box className="content">
                                            <Box className="description">
                                                <Typography sx={{
                                                    display: "-webkit-box",
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                    WebkitLineClamp: 3
                                                }}
                                                    title={item?.title}
                                                >{item.title || 'No title available'}</Typography>
                                            </Box>
                                            <Box className="info">
                                                <Box>
                                                    <span>{item.owner?.userName || 'Anonymous'}</span>
                                                    <span> {item.views} View </span>
                                                    <Typography sx={{
                                                        display: "-webkit-box",
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                        WebkitLineClamp: 3
                                                    }}
                                                        title={item?.description}
                                                    >{item.description || 'No description available'}</Typography>
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
        </Root>

    )
}

export default WatchHistory