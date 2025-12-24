import { useEffect, useState } from 'react'
import UseLocalStorage from '../Component/Hooks/UseLocalStorage'
import { Box, Grid, Typography, styled } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import SubscriptionService from '../Services/SubscriptionService'
import Loader from '../Component/Common/Loader'
const Root = styled("Grid")(({ theme }) => ({
    width: "100%",
    marginBottom: "15px",
    '& .main-container': {
        display: "flex",
        justifyContent: "start",
        alignItem: "center",
        flexDirection: "row",
        spacing: "15px",
        flexWrap: "wrap",
        gap: 16,
        paddingBottom: 16,
        borderBottom: `1px solid ${theme.palette.divider}`,


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

const Subscription = () => {
    const [user, setUser] = UseLocalStorage('User', '')
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        getUserChannelSubscribers();
    }, [])

    const getUserChannelSubscribers = async () => {
        setLoading(true)
        try {
            let res = await SubscriptionService.getSubscribebChainels(user?._id);

            if (res.success) {
                setHistory(res.data)
                console.log(history)
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }

    const gotoPriewPage = (item) => {
        navigate(`/preview/${item?.latestVideo?._id}`, {
            state: { id: item?.latestVideo?._id, url: item?.latestVideo?.uservideoFile, userId: item?.channel?._id }
        })
    }
    return (
        <Root>
            {/* <Header /> */}
            <Box sx={{ mt: { xs: "25px", md: "25px", xl: "25px" } }}>
                <Grid container spacing={2} justifyContent={"space-between"}  >
                    {!loading && history.length === 0 ? (
                        <Grid item xs={12}>
                            <Box className="empty-state">
                                <Typography variant="h6">No subscription found</Typography>
                                <Typography variant="body2">
                                    Subscriptions will appear here.
                                </Typography>
                            </Box>
                        </Grid>
                    ) : !loading ? (
                        history?.length > 0 && history?.map((item, index) => {
                            return (
                                <Grid key={item.id || index} item md={12} xs={12} className="main-container" >
                                    <Grid key={item.id || index} item md={12} xs={12} >
                                        <Box sx={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                                            <Box
                                                sx={{
                                                    backgroundImage: `url(${item.channel?.avatar})`,
                                                    backgroundPosition: "center",
                                                    backgroundSize: "cover",
                                                    backgroundRepeat: "no-repeat",
                                                    aspectRatio: "4/4", // Maintains consistent height across screen sizes
                                                    height: "40px",
                                                    width: "40px",
                                                    borderRadius: "50%",
                                                }}
                                                title={item.channel?.userName}
                                            >

                                            </Box>
                                            <Typography sx={{
                                                display: "-webkit-box",
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                WebkitLineClamp: 3
                                            }}
                                                title={item.channel?.userName}
                                            >{item.channel?.userName || ''}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item md={4} sm={8}>
                                        <Box className="iframe-sec" onClick={() => (gotoPriewPage(item))}
                                            sx={{
                                                backgroundImage: `url(${item.latestVideo.thumbnail})`,
                                                backgroundPosition: "center",
                                                backgroundSize: "cover",
                                                backgroundRepeat: "no-repeat",
                                                width: "100%",
                                                aspectRatio: "16/9",
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
                                                        title={item.latestVideo.title}
                                                    >{item.latestVideo.title || 'No title available'}</Typography>
                                                </Box>
                                                <Box className="info">
                                                    <Box>
                                                        <span>{item.channel?.userName || 'Anonymous'}</span>
                                                        <span> {item.latestVideo.views} View </span>
                                                        <Typography sx={{
                                                            display: "-webkit-box",
                                                            WebkitBoxOrient: "vertical",
                                                            overflow: "hidden",
                                                            WebkitLineClamp: 3
                                                        }}
                                                            title={item?.latestVideo.description}
                                                        >{item.latestVideo.description || 'No description available'}</Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Grid>

                                </Grid>
                            );
                        }))
                        :
                        <Loader size={50} message={"Loading..."} />
                    }

                </Grid>
            </Box>
        </Root>

    )
}

export default Subscription