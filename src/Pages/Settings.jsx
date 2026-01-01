import { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Avatar,
    Typography,
    Button,
    Divider,
    TextField,
    Skeleton,
    CircularProgress
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ModeIcon from '@mui/icons-material/Mode';
import { UserService } from "../Services/UserSercive";
import useLocalStorage from "../Component/Hooks/UseLocalStorage";
import ApiAlert from "../Component/Common/Alert";

const Settings = () => {
    const [user, setUser] = useLocalStorage("User", null);
    const [loading, setLoading] = useState(false);
    const [avartarLoading, setAvartarLoading] = useState(false);
    const [coverImageLoading, setCoverImageLoading] = useState(false);
    const [infoLoading, setInfoLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [data, setData] = useState([])
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const [formData, setFormData] = useState({
        fullName: user?.fullName || "",
        userName: user?.userName || "",
        email: user?.email || "",
        coverImage: user?.coverImage,
        avatar: user?.avatar,
        channelSubricedToCount: 0,
        subscribersCount: 0

    });

    if (!user || loading) {
        return <SettingsSkeleton />;
    }

    const showAlert = (message, severity = "success") => {
        setAlert({ open: true, message, severity });
    };

    const handleClose = () => {
        setAlert({ ...alert, open: false });
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const getUserChannelProfile = async () => {
        try {

            const res = await UserService.getUserChannelProfile(user?.userName)
            if (res.success) {
                setData(res?.data)
            } else {

            }
        } catch (error) {

        }
    }

    const updateAvatar = async (file) => {
        try {
            setAvartarLoading(true)
            const fd = new FormData();
            fd.append("avatar", file);
            let res = await UserService.updateAvatar(fd)
            if (res.success) {
                showAlert(res.message || "Avatar updated successfully", "success");
                // setData(res?.data)
                setFormData(prev => ({
                    ...prev,
                    avatar: res?.data?.avatar,
                }));
                setUser(res?.data)
            } else {
                showAlert(res.message || "Something went wrong", "error");
            }
        } catch (error) {
            showAlert("Something went wrong", "error");
        } finally {
            setAvartarLoading(false)
        }
    }

    const updateCoverImage = async (file) => {
        try {
            setCoverImageLoading(true)
            const fd = new FormData();
            fd.append("coverImage", file);
            let res = await UserService.updateCoverImage(fd)
            if (res.success) {
                showAlert(res.message || "Cover Image updated successfully", "success");
                // setData(res?.data)
                setFormData(prev => ({
                    ...prev,
                    coverImage: res?.data?.coverImage,
                }));
                setUser(res?.data)
            } else {
                showAlert(res.message || "Something went wrong", "error");
            }
        } catch (error) {
            showAlert("Something went wrong", "error");
        } finally {
            setCoverImageLoading(false)
        }
    }

    const updateUserData = async () => {

        try {
            setInfoLoading(true)
            const data = {
                userName: formData.userName,
                email: formData.email,
                fullName: formData.fullName
            }
            const res = await UserService.updateUserData(data)
            if (res.success) {
                showAlert(res.message || "User updated successfully", "success");
                setFormData(prev => ({
                    ...prev,
                    fullName: res?.data?.fullName,
                    userName: res?.data?.userName,
                    email: res?.data?.email,
                }));
                setIsEditing(!isEditing)
                setUser(res?.data)
            } else {
                showAlert(res.message || "Something went wrong", "error");
            }
        } catch (error) {
            showAlert("Something went wrong", "error");
        } finally {
            setInfoLoading(false)
        }
    }


    useEffect(() => {
        getUserChannelProfile();
    }, [])

    useEffect(() => {
        if (data.length) {
            setFormData(prev => ({
                ...prev,
                fullName: data?.[0]?.fullName,
                userName: data?.[0]?.userName,
                email: data?.[0]?.email,
                channelSubricedToCount: data?.[0]?.channelSubricedToCount,
                subscribersCount: data?.[0]?.subscribersCount,
                coverImage: data?.[0]?.coverImage,
                avatar: data?.[0]?.avatar,
            }));
        }
    }, [data])

    return (
        <Box sx={{ maxWidth: 900, mx: "auto", mt: 2, mb: 2 }}>
            <Card sx={{ mb: 3 }}>
                <Box
                    sx={{
                        height: 200,
                        backgroundImage: `url(${formData.coverImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        position: "relative",
                    }}
                >
                    <Button
                        variant="contained"
                        size="small"
                        disabled={coverImageLoading}
                        startIcon={coverImageLoading ? <CircularProgress /> : <CameraAltIcon />}
                        sx={{ position: "absolute", right: 16, bottom: 16 }}
                        component="label"
                    >
                        {coverImageLoading ? "Updating" : "Update Cover"}
                        <input
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) updateCoverImage(file);
                            }}
                        />
                    </Button>

                    <Avatar
                        src={formData.avatar}
                        sx={{
                            width: 120,
                            height: 120,
                            position: "absolute",
                            left: 24,
                            bottom: -60,
                            border: "4px solid #fff",
                        }}
                    />
                </Box>

                <CardContent sx={{ mt: 8 }}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="h6">{user.fullName}</Typography>
                        <Typography color="text.secondary">
                            @{user.userName}
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        size="small"
                        disabled={avartarLoading}
                        startIcon={avartarLoading ? <CircularProgress /> : <CameraAltIcon />}
                        sx={{ mt: 1 }}
                        component="label"
                    >
                        {avartarLoading ? "Updating..." : "Update Avatar"}
                        <input
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) updateAvatar(file);
                            }}
                        />
                    </Button>
                </CardContent>
            </Card>

            {/* Basic Info */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box mb={2} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" gutterBottom>
                            Basic Information
                        </Typography>
                        {!isEditing ?
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<ModeIcon />}
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                Edit
                            </Button>
                            : ""}
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ width: { xs: "100%", md: !isEditing ? "16vw" : "100%" } }}>
                                {isEditing ? (
                                    <TextField
                                        label="Full Name"
                                        name="fullName"
                                        fullWidth
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <>
                                        <Typography color="text.secondary">Full Name</Typography>
                                        <Typography>{user.fullName}</Typography>
                                    </>
                                )}
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{ width: { xs: "100%", md: !isEditing ? "15vw" : "100%" } }}>
                                {isEditing ? (
                                    <TextField
                                        label="User Name"
                                        name="userName"
                                        fullWidth
                                        value={formData.userName}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <>
                                        <Typography color="text.secondary">User Name</Typography>
                                        <Typography>@{user.userName}</Typography>
                                    </>
                                )}
                            </Box>

                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ width: { xs: "100%", md: !isEditing ? "16vw" : "100%" } }}>
                                {isEditing ? (
                                    <TextField
                                        label="Email"
                                        name="email"
                                        fullWidth
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <>
                                        <Typography color="text.secondary">Email</Typography>
                                        <Typography>{user.email}</Typography>
                                    </>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                    {isEditing ?
                        <Box mt={2} sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, alignItems: "center" }}>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                Cancel
                            </Button>

                            <Button
                                variant="contained"
                                size="small"
                                startIcon={infoLoading && <CircularProgress />}
                                onClick={updateUserData}
                                disabled={infoLoading}
                            >
                                {infoLoading ? "Updating..." : "Submit"}
                            </Button>

                        </Box>
                        : ""}
                </CardContent>
            </Card>

            {/* Channel Stats */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Channel Stats
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Subscribers
                            </Typography>
                            <Typography variant="h6">
                                {formData.subscribersCount || 0}
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Subscribed To
                            </Typography>
                            <Typography variant="h6">
                                {formData.channelSubricedToCount || 0}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <ApiAlert
                open={alert.open}
                message={alert.message}
                severity={alert.severity}
                onClose={handleClose}
            />
        </Box>
    );
};

export default Settings;

const SettingsSkeleton = () => (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
        <Skeleton variant="rectangular" height={200} />
        <Box sx={{ display: "flex", alignItems: "center", mt: -6, px: 3 }}>
            <Skeleton variant="circular" width={120} height={120} />
            <Box sx={{ ml: 3 }}>
                <Skeleton width={200} height={30} />
                <Skeleton width={150} height={20} />
            </Box>
        </Box>

        <Skeleton variant="rectangular" height={200} sx={{ mt: 4 }} />
        <Skeleton variant="rectangular" height={120} sx={{ mt: 3 }} />
    </Box>
);
