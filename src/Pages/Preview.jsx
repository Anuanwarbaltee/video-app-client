
import React, { useEffect, useState } from 'react'
import { Button, Box, Typography, styled, Grid, Avatar, IconButton, TextField } from "@mui/material";
import { Videoservice } from '../Services/Videoservice';
import { useLocation } from 'react-router-dom';
import ReactPlayers from '../Component/Common/ReactPlayer';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SubscriptionService from '../Services/SubscriptionService';
import LikeService from '../Services/LikeService';
import CommentService from '../Services/CommentService';
import PreviewLeftSec from '../Component/Common/Videos/PreviewLeftSec';
import Header from '../Component/Common/Header';
import BasicMenu from '../Component/Common/Menu';
import CircularProgress from '@mui/material/CircularProgress';
import UseLocalStorage from '../Component/Hooks/UseLocalStorage';
const Root = styled("Grid")(({ theme }) => ({
    width: "100%",
    // padding: "10px 0",

    '& .main-container': {
        display: "flex",
        justifyContent: "start",
        alignItem: "center",
        flexDirection: "row",
        '& .leftSec': {
            marginTop: "65px",
        },
        // gap: "10px",
        '& .iframe-sec': {
            height: "300px",
            width: "100%",
            borderRadius: "10px"
        },
        '& .detail-sec': {
            marginTop: "10px",
            display: "flex",
            justifyContent: "start",
            alignItem: "start",
            flexDirection: "column",
            gap: "10px",
            '& .avatar': {
                height: "60px",
                width: "60px",
                borderRadius: "50%",
            },
            '& .content': {
                display: "flex",
                alignItem: "center",
                gap: "50px",
                flexWrap: "wrap"
            },
            '& .chips': {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50px",
                padding: "0 25px",
                borderRadius: "25px",
                backgroundColor: theme.palette.action.selected,
                fontSize: "16px",
                cursor: "pointer"
            },

        },
        '& .input-container': {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            // alignItems: "center",
            // pb: 1,
            "& .MuiFormControl-root": {
                "& .MuiInputBase-root": {
                    "& input": {
                        padding: "5px",
                    }

                },

                "& fieldset": {
                    border: "none"
                }
            },
            "& .button-area": {
                display: "flex",
                justifyContent: "space-between",
                alignItem: "center"
            }
        }
    }
}))


const Preview = () => {
    const [videoData, setVideoData] = useState([])
    const [commentList, setCommentList] = useState([])
    const [isSubscribe, setIssubscribe] = useState();
    const [isLiked, setIsLiked] = useState();
    const [isCommentLiked, setIsCommentLiked] = useState();
    const [comment, setComment] = useState();
    const [commentLike, setcommentLike] = useState([])
    const [condition, setCondition] = useState({
        isSubscribeToggle: false,
        isCommentLike: false,
    })
    const [subscribercounts, setSubscribercounts] = useState(0)
    const [likeCounts, setLikeCounts] = useState(0)
    const [commentLikeCount, setCommentLikeCount] = useState(0)
    const [anchorEl, setAnchorEl] = useState('');
    const [commentIds, setCommentIds] = useState([]);
    const [updateComment, setUpdateComment] = useState("");
    const [isSubmitComment, setIsSubmitComment] = useState(false);
    const [search, setSearch] = useState('')
    const { state } = useLocation();
    const [user] = UseLocalStorage("User", "");

    useEffect(() => {
        if (state.id) {
            getVideo();
            getSubsCriptions();
            getSubsLikes();
            getCommentList();
        }
    }, [state.id])

    useEffect(() => {
        // getSubsCriptions();
        if (isSubscribe) {
            setSubscribercounts(subscribercounts + 1)
        } else if (!isSubscribe && subscribercounts > 0) {
            setSubscribercounts(subscribercounts - 1)
        }
    }, [isSubscribe])

    useEffect(() => {
        // getSubsCriptions();
        if (isLiked) {
            setLikeCounts(likeCounts + 1)
        } else if (!isLiked && likeCounts > 0) {
            setLikeCounts(likeCounts - 1)
        }
    }, [isLiked])

    useEffect(() => {
        // getSubsCriptions();
        if (commentLike) {
            setCommentLikeCount(commentLike + 1)
        } else if (!isCommentLiked && commentLike > 0) {
            setCommentLikeCount(commentLike - 1)
        }
    }, [commentLike])

    const handleMenuItems = (option, items) => {
        setAnchorEl(option)
        if (option === "edit") {
            setUpdateComment(items.content)
            setCommentIds(items._id)
        }
        if (option === 'delete') {
            deleteCommets(items)
        }
    }

    // handle Change Comment

    const handleChangeComment = (event, option) => {
        if (option === "cancel") {
            setComment("")
        }
        setComment(event.target.value)
    }


    const handleChangeUpdateComment = async (event, option) => {

        if (option === "cancel") {
            setUpdateComment(option.content)
        }
        setUpdateComment(event.target.value)

    }

    const deleteCommets = async (items) => {
        setCommentList((prev) =>
            prev.filter((item) =>
                item._id !== items._id
            )
        );
        setAnchorEl(null)
        let data = {
            commentId: items?._id,
        }

        let res = await CommentService.deleteComment(data)
    }

    const handleCancelComments = (items) => {
        setAnchorEl(null)
        setCommentIds([])
    }

    const handleUpdateComments = async (items) => {
        setCommentList((prev) =>
            prev.map((item) =>
                item._id === items._id ? { ...item, content: updateComment } : item
            )
        );
        setCommentIds([])
        setAnchorEl(null)
        let data = {
            commentId: items?._id,
            content: updateComment
        }

        let res = await CommentService.updateComment(data)

    };


    const getVideo = async () => {
        try {
            let data = {
                id: state.id,
                userId: user._id
            }
            let res = await Videoservice.getVideo(data)
            if (res.success) {
                setVideoData(res.data)
            } else {
                setVideoData([])
            }

        } catch (error) {

        }
    }

    const getSubsCriptions = async () => {
        try {

            let res = await SubscriptionService.getSubscribers(state.userId)
            if (res.success) {
                setSubscribercounts(res.data.count)
                setIssubscribe(res.data.isSubscribed)
            } else {
                console.log(res.error)
            }
        } catch (error) {

        }
    }

    //get video Likes
    const getSubsLikes = async () => {
        try {
            let res = await LikeService.getlikes(state.id)
            if (res.success) {
                setLikeCounts(res.data.count)
                setIsLiked(res.data.isLiked)
            } else {
                console.log(res.error)
            }
        } catch (error) {

        }
    }


    const toggleSubscription = async () => {
        setIssubscribe(!isSubscribe)
        try {
            let res = await SubscriptionService.toggleSubscription(state.userId)
            if (res.success) {
                setIssubscribe(res.data.isSubscribed)
                setCondition((prev) => ({ ...prev, isSubscribeToggle: !condition.isSubscribeToggle }))
            } else {
                console.log(res.error)
            }
        } catch (error) {

        }
    }

    const toggleLikes = async (type, id) => {
        setIsLiked(!isLiked)
        try {
            let res = await LikeService.toggleLikes(id)
            if (res.success) {
                if (type === "video") {
                    setIsLiked(res.data.isLiked)
                }
                if (type == "comment") {
                    // setcommentLike(res.data.isLiked)
                }
            } else {
                console.log(res.error)
            }
        } catch (error) {

        }
    }

    const toggleCommentLikes = async (type, id) => {
        setCommentList((prev) =>
            prev.map((item) => {
                if (item._id === id) {
                    return {
                        ...item,
                        isLiked: !item.isLiked,
                        likesCount: item.isLiked ? item.likesCount - 1 : item.likesCount + 1
                    };
                }
                return item;
            })
        );
        try {
            let res = await LikeService.toggleCommentLikes(id)
            if (res.success) {
                if (type == "comment") {
                    // setcommentLike(res.data.isLiked)
                }
            } else {
                console.log(res.error)
            }
        } catch (error) {

        }
    }

    const handleSubmitComments = async () => {
        setIsSubmitComment(true)
        const data = {
            id: state.id,
            content: comment
        }

        try {
            let res = await CommentService.addcomment(data);
            if (res.success) {
                setComment("")
            } else {
                console.log(res.error)
            }
        } catch (error) {

        } finally {
            setIsSubmitComment(false)
            getCommentList()
        }
    }

    const getCommentList = async () => {
        const data = {
            id: state.id,
            skip: 1,
            limit: 30
        }
        try {
            let res = await CommentService.getCommentList(data);
            if (res.success) {
                setCommentList(res.data.comments)
            } else {
                console.log(res.error)
            }
        } catch (error) {

        }
    }

    const handleSearch = (value) => {
        setSearch(value)
    }

    return (
        <Root>
            <>

                <Header handleSearch={handleSearch} />
                <Grid container className="main-container">
                    <Grid item md={7} xs={12} className='leftSec'>
                        <ReactPlayers url={state.url} videoId={state?.id} />
                        {/* {videoData?.length > 0 && videoData.map((item, index) => {
                        return ( */}
                        <Box className="detail-sec">
                            <Box className="description">
                                <Typography variant='body1' sx={{ fontWeight: "bold" }}>{videoData?.[0]?.description || 'No description available'}</Typography>
                            </Box>
                            <Box className="content">
                                <Box className="avatar" sx={{ backgroundImage: `url(${videoData?.[0]?.ownerDetails?.avatar || "https://via.placeholder.com/40"})`, backgroundPosition: "center", backgroundSize: "cover", height: "100%" }}>
                                </Box>
                                <Box className="info">
                                    <Typography variant='body1'>{videoData?.[0]?.ownerDetails?.userName || 'Anonymous'}</Typography>
                                    <Box sx={{ display: "flex", justifyContent: "start", alignItems: "center", gap: 1 }}>
                                        <Typography variant='body2'>{subscribercounts}  </Typography>
                                        <Typography variant='body2'>{subscribercounts > 1 ? "subscribers" : "subscriber"}  </Typography>
                                    </Box>
                                </Box>
                                {videoData?.[0]?.isOwner ?
                                    <Box className="chips" sx={{ backgroundColor: "#0f7ba4 !important" }} onClick={() => toggleSubscription()}>
                                        <Typography variant='body1' sx={{ color: "#fff" }}>Edit video</Typography>
                                    </Box>
                                    :
                                    <Box className="chips" sx={{ backgroundColor: isSubscribe ? "#0f7ba4 !important" : "", }} onClick={() => toggleSubscription()}>
                                        <Typography variant='body1' sx={{ color: isSubscribe ? "#fff" : "" }}>{isSubscribe ? "Subscribed" : "Subscribe"}</Typography>
                                    </Box>
                                }
                                <Box className="chips" onClick={() => toggleLikes("video", state.id)} sx={{ backgroundColor: isLiked ? "#0f7ba4 !important" : "" }}>
                                    <ThumbUpIcon sx={{ color: isLiked ? "#fff" : "" }} />
                                    <Typography variant='body2' sx={{ marginLeft: "10px" }}>{likeCounts}</Typography>
                                </Box>
                            </Box>
                        </Box>
                        {/* )
                    })} */}

                        {/* Comment Sec */}

                        <Box className="comment-container" mt={5}>
                            {/* Comment Input */}
                            <Box sx={{ display: "flex", alignItems: "start", mb: comment?.length > 0 ? 4 : 2 }}>
                                <Avatar src="https://via.placeholder.com/40" sx={{ mr: 1 }} />
                                <Box className='input-container'>
                                    <Box sx={{ borderBottom: "1px solid #ccc", marginBottom: 2, display: 'flex' }}>
                                        <TextField
                                            value={comment}
                                            onChange={handleChangeComment}
                                            id="filled-search"
                                            fullWidth
                                            type="text"
                                            placeholder='Add a comment...'
                                        // variant="filled"
                                        />
                                        {isSubmitComment ?
                                            <Box sx={{ display: 'flex' }}>
                                                <CircularProgress style={{ padding: "10px", fontSize: "18px" }} />
                                            </Box>
                                            : ""}
                                    </Box>

                                    {comment?.length > 0 ? <Box className="button-area">
                                        <SentimentSatisfiedIcon sx={{ mr: 1 }} />
                                        <Box sx={{ display: "flex", gap: 1 }}>
                                            <Button variant='outline' onClick={() => handleChangeComment(event, "cancel")} className='roundButton'>Cancel</Button>
                                            <Button variant='contained' onClick={handleSubmitComments} className='roundButton'>Save</Button>
                                        </Box>
                                    </Box> : ""}

                                </Box>
                            </Box>
                            {/* Comment List */}
                            {commentList?.length ? commentList?.map((comment) => (
                                <Box key={comment.id} sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                                    <Avatar src={comment.ownerDetails.avatar} sx={{ mr: 1 }} />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                            @{comment.ownerDetails.userName} <Typography component="span" sx={{ color: "#777", fontSize: "12px" }}>{comment.time}</Typography>
                                        </Typography>
                                        {anchorEl === "edit" && commentIds?.includes(comment._id) ?
                                            <Box sx={{ display: "flex", alignItems: "start", mb: comment?.length > 0 ? 4 : 2 }}>
                                                {/* <Avatar src="https://via.placeholder.com/40" sx={{ mr: 1 }} /> */}
                                                <Box className='input-container'>
                                                    <Box sx={{ borderBottom: "1px solid #ccc", marginBottom: 2 }}>
                                                        <TextField
                                                            value={updateComment}
                                                            onChange={handleChangeUpdateComment}
                                                            id="filled-search"
                                                            fullWidth
                                                            type="text"
                                                            placeholder='Add a comment...'
                                                        // variant="filled"
                                                        />
                                                    </Box>
                                                    {comment?.content?.trim() !== updateComment?.trim() ? <Box className="button-area">
                                                        <SentimentSatisfiedIcon sx={{ mr: 1 }} />
                                                        <Box sx={{ display: "flex", gap: 1 }}>
                                                            <Button variant='outline' onClick={() => handleCancelComments(comment)} className='roundButton'>Cancel</Button>
                                                            <Button variant='contained' onClick={() => handleUpdateComments(comment)} className='roundButton'>Save</Button>
                                                        </Box>
                                                    </Box> : ""}

                                                </Box>
                                            </Box>
                                            :
                                            <>
                                                <Typography variant="body1" sx={{ mt: 0.5 }}>{comment.content}</Typography>
                                                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                                    <IconButton size="small" onClick={() => toggleCommentLikes("comment", comment._id)}>
                                                        <ThumbUpIcon sx={{ fontSize: 18, color: comment.isLiked ? "blue" : "" }} />
                                                    </IconButton>
                                                    <Typography sx={{ fontSize: 14, mr: 2 }}>{comment.likesCount > 0 ? comment.likesCount : ""}</Typography>
                                                    <Button size="small" sx={{ textTransform: "none", fontSize: 14 }}>Reply</Button>
                                                </Box>
                                            </>

                                        }

                                    </Box>
                                    <BasicMenu handleMenuItems={(option) => handleMenuItems(option, comment)} />
                                </Box>
                            ))
                                : ""
                            }

                        </Box>
                    </Grid>
                    <Grid item md={5} paddingLeft={"5px"}>
                        <PreviewLeftSec searchValue={search} />
                    </Grid>
                </Grid>
            </>
        </Root>
    )
}

export default Preview