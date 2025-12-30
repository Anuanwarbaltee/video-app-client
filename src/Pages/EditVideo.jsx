import { useEffect, useState, useCallback } from "react";
import {
    Box,
    Grid,
    Typography,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    Card,
    CardContent,
    Stack,
    Divider,
    LinearProgress,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import UseLocalStorage from "../Component/Hooks/UseLocalStorage";
import { Videoservice } from "../Services/Videoservice";

const UpdateVideo = () => {
    const [user] = UseLocalStorage("User", "");
    const { videoId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const [form, setForm] = useState({
        title: "",
        description: "",
        isPublished: true,
    });

    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [videoPreview, setVideoPreview] = useState("");
    const [isSubmit, setIsSubmit] = useState(false);
    const [thumbLoading, setThumbLoading] = useState(false);
    const [videoLoading, setVideoLoading] = useState(false);
    const [metaLoading, setMetaLoading] = useState(false);
    const [videoData, setVideoData] = useState({})

    const { state } = useLocation();


    useEffect(() => {
        if (Object.keys(videoData).length) {
            setForm({
                title: videoData.title || "",
                description: videoData.description || "",
                isPublished: videoData.isPublished || true,
            });
            setThumbnailPreview(videoData.thumbnail);
            setVideoPreview(videoData.uservideoFile);
        }
    }, [videoData]);

    useEffect(() => {
        getVideo();
    }, [])

    const getVideo = async () => {
        try {
            let data = {
                id: state.video?._id,
                userId: user._id
            }
            let res = await Videoservice.getVideo(data)
            if (res.success) {
                setVideoData(res.data?.[0])
            } else {
                setVideoData([])
            }

        } catch (error) {

        }
    }

    const handleThumbnailUpload = async (file) => {
        try {
            setThumbLoading(true);

            const fd = new FormData();
            fd.append("thumbnail", file);
            fd.append("videoId", state?.video?._id);

            const { data } = await Videoservice.updateThumbnail(fd);
            setThumbnailPreview(data.thumbnail);
        } catch (err) {
            console.error(err);
        } finally {
            setThumbLoading(false);
        }
    };

    const handleVideoUpload = async (file) => {
        try {
            setVideoLoading(true);
            const fd = new FormData();
            fd.append("uservideoFile", file);
            fd.append("videoId", state?.video?._id);

            const { data } = await Videoservice.updateVideoFile(fd);

            setVideoPreview(data.uservideoFile);
        } catch (err) {
            console.error(err);
        } finally {
            setVideoLoading(false);
        }
    };



    const handleSubmit = async () => {
        try {
            setMetaLoading(true);
            setIsSubmit(true);

            if (!form.title?.trim()) return;
            form.videoId = state?.video?._id
            await Videoservice.updateVideoMeta(form);
            navigate(-1);
        } catch (err) {
            console.error(err);
        } finally {
            setMetaLoading(false);
        }
    };



    return (
        <Box maxWidth="1100px" mx="auto" px={2} py={4}>
            <Card sx={{ borderRadius: 3, boxShadow: 5 }}>
                {metaLoading && <LinearProgress value={progress} variant="determinate" />}

                <CardContent>
                    {/* VIDEO + THUMBNAIL */}
                    <Grid container spacing={3}>
                        {/* VIDEO */}
                        <Grid item xs={12} md={6}>
                            <Stack spacing={1}>
                                <Typography fontWeight={600}>Video</Typography>

                                <Box
                                    sx={{
                                        position: "relative",
                                        borderRadius: 2,
                                        overflow: "hidden",
                                        bgcolor: "black",
                                    }}
                                >
                                    <video
                                        src={videoPreview}
                                        controls
                                        style={{ width: "100%", height: 240 }}
                                    />

                                    {/* Duration Badge */}
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            bottom: 8,
                                            right: 8,
                                            bgcolor: "rgba(0,0,0,0.7)",
                                            color: "#fff",
                                            px: 1,
                                            borderRadius: 1,
                                            fontSize: 12,
                                        }}
                                    >
                                        Preview
                                    </Box>
                                    {videoLoading && (
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                inset: 0,
                                                bgcolor: "rgba(0,0,0,0.6)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#fff",
                                                fontWeight: 500,
                                            }}
                                        >
                                            Uploading...
                                        </Box>
                                    )}

                                </Box>

                                <Button
                                    component="label"
                                    variant="outlined"
                                    size="small"
                                    sx={{ alignSelf: "flex-start" }}
                                    disabled={videoLoading}
                                >
                                    Replace Video
                                    <input
                                        hidden
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) handleVideoUpload(file);
                                        }}
                                    />
                                </Button>

                            </Stack>
                        </Grid>

                        {/* THUMBNAIL */}
                        <Grid item xs={12} md={6}>
                            <Stack spacing={1}>
                                <Typography fontWeight={600}>Thumbnail</Typography>

                                <Box
                                    component="label"
                                    sx={{
                                        position: "relative",
                                        height: 240,
                                        borderRadius: 2,
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        border: "1px solid",
                                        borderColor: "divider",

                                        "&:hover .edit-overlay": {
                                            opacity: 1,
                                        },
                                    }}
                                >
                                    {/* Thumbnail Image */}
                                    <Box
                                        component="img"
                                        src={
                                            thumbnailPreview ||
                                            "https://via.placeholder.com/400x240?text=Upload+Thumbnail"
                                        }
                                        alt="thumbnail"
                                        sx={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />

                                    {/* Hover Overlay */}
                                    <Box
                                        className="edit-overlay"
                                        sx={{
                                            position: "absolute",
                                            inset: 0,
                                            bgcolor: "rgba(0,0,0,0.55)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            opacity: thumbLoading ? 1 : 0,
                                            transition: "opacity 0.25s ease",
                                        }}
                                    >
                                        <Typography color="white">
                                            {thumbLoading ? "Uploading..." : "✏️ Edit"}
                                        </Typography>
                                    </Box>


                                    {/* File Input */}
                                    <input
                                        hidden
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) handleThumbnailUpload(file);
                                        }}
                                    />
                                </Box>
                            </Stack>
                        </Grid>

                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    {/* FORM */}
                    <Stack spacing={3}>
                        <TextField
                            label="Title"
                            fullWidth
                            value={form.title}
                            error={isSubmit && !form.title?.trim()}
                            helperText={isSubmit && !form.title?.trim() ? "Title is required." : ""}
                            onChange={(e) =>
                                setForm((p) => ({ ...p, title: e.target.value }))
                            }
                        />

                        <TextField
                            label="Description"
                            multiline
                            rows={4}
                            fullWidth
                            value={form.description}
                            onChange={(e) =>
                                setForm((p) => ({ ...p, description: e.target.value }))
                            }
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={form.isPublished}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            isPublished: e.target.checked,
                                        }))
                                    }
                                />
                            }
                            label="Publish this video"
                        />

                        {/* ACTIONS */}
                        <Stack direction="row" justifyContent="flex-end" spacing={2}>
                            <Button onClick={() => navigate(-1)}>Cancel</Button>
                            <Button
                                variant="contained"
                                disabled={metaLoading}
                                onClick={handleSubmit}
                            >
                                Save Changes
                            </Button>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

export default UpdateVideo;
