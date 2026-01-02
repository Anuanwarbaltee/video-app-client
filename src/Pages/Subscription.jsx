import { useEffect, useState } from 'react'
import useLocalStorage from '../Component/Hooks/UseLocalStorage'
import { Box, Grid, Skeleton, Typography, styled } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import SubscriptionService from '../Services/SubscriptionService'
import Loader from '../Component/Common/Loader'
const Root = styled("Grid")(({ theme }) => ({
    width: "100%",
    marginBottom: "15px",
    '& .video-container': {
        display: "flex",
        gap: 16,
        paddingBottom: "16px",
        borderBottom: `1px solid ${theme.palette.divider}`,
        alignItems: "flex-start",
        flexDirection: "column",
        [theme.breakpoints.up("sm")]: {
            flexDirection: "row",
        },

        '& .iframe-sec': {
            backgroundPosition: "center",
            backgroundSize: "cover",
            width: "250px",
            aspectRatio: "16/9",
            borderRadius: "10px",
        },

    }
}))

const Skeletons = () => (
    <Box>
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "16px 0 10px 0" }}>
                <Skeleton variant='circular' width={40} height={40} />
                <Skeleton width={"40%"} />
            </Box>
        </Box>
        <Box className="video-container">
            <Skeleton variant="rectangular" width={220} height={120} />
            <Box sx={{ flex: 1 }}>
                <Skeleton width="70%" />
                <Skeleton width="50%" />
                <Skeleton width="90%" />
            </Box>
        </Box>
    </Box>
)

const Subscription = () => {
    const [user, setUser] = useLocalStorage('User', '')
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
        <Root container>
            {/* <Header /> */}
            <Grid item xs={12}>
                {history.length === 0 && !loading && (
                    <Typography align="center" mt={5}>
                        No Data Found
                    </Typography>
                )}
                {
                    history?.map((item, index) => (
                        <Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "16px 0 10px 0" }}>
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
                            <Box className="video-container">
                                <Box className="iframe-sec" onClick={() => (gotoPriewPage(item))}
                                    sx={{
                                        backgroundImage: `url(${item.latestVideo.thumbnail})`,

                                    }}
                                >
                                </Box>

                                <Box>
                                    <Typography
                                        fontWeight={600}
                                        title={item.latestVideo.title}
                                    >{item.latestVideo.title || 'No title available'}</Typography>
                                    <Typography variant="body1">{item.channel?.userName || 'Anonymous'}</Typography>
                                    <Typography variant="body2" color="text.secondary"> {item.latestVideo.views} View </Typography>
                                    <Typography
                                        variant="body2"
                                        title={item?.latestVideo.description}
                                    >{item.latestVideo.description || 'No description available'}</Typography>
                                </Box>
                            </Box>
                        </Box>


                    ))}

                {loading &&
                    Array.from({ length: 5 }).map((_, i) => <Skeletons key={i} />)}
            </Grid>
        </Root>

    )
}

export default Subscription