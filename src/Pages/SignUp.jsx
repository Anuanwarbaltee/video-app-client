import {
    Box,
    Button,
    TextField,
    Typography,
    useTheme,
    IconButton,
    InputAdornment,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useCallback, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import Loader from "../Component/Common/Loader";
import ApiAlert from "../Component/Common/Alert";
import { UserService } from "../Services/UserSercive";

const Signup = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [formFields, setFormFields] = useState({
        fullName: "",
        email: "",
        userName: "",
        password: "",
    });

    const [files, setFiles] = useState({
        avatar: null,
        coverImage: null,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const showAlert = (message, severity = "success") => {
        setAlert({ open: true, message, severity });
    };

    const handleClose = () => {
        setAlert((prev) => ({ ...prev, open: false }));
    };

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormFields((prev) => ({ ...prev, [name]: value }));
        setIsSubmit(false);
    }, []);

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFiles((prev) => ({ ...prev, [name]: files[0] }));
    };

    const handleSubmit = async () => {
        setIsSubmit(true);
        const { fullName, email, userName, password } = formFields;

        if (!fullName || !email || !userName || !password || !files.avatar) {
            showAlert("All fields including avatar are required.", "error");
            return;
        }

        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("email", email);
        formData.append("userName", userName);
        formData.append("password", password);
        formData.append("avatar", files.avatar);

        if (files.coverImage) {
            formData.append("coverImage", files.coverImage);
        }

        setLoading(true);
        try {
            const res = await UserService.registerUser(formData);

            if (res?.success) {
                showAlert("Account created successfully!", "success");
                setTimeout(() => navigate("/"), 1200);
            } else {
                showAlert(res.message || "Signup failed", "error");
            }
        } catch (err) {
            showAlert("Something went wrong. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Box
                sx={{
                    minHeight: "100vh",
                    minWidth: "100vw",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: theme.palette.background.paper,
                }}
            >
                <Box
                    component="form"

                    sx={{
                        width: "100%",
                        maxWidth: 480,
                        p: 4,
                        borderRadius: 2,
                        boxShadow: theme.shadows[4],
                        bgcolor: theme.palette.background.default,
                    }}
                >
                    <Typography variant="h5" textAlign="center" mb={3}>
                        Sign Up
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="fullName"
                                value={formFields.fullName}
                                onChange={handleChange}
                                error={isSubmit && !formFields.fullName}
                            />
                        </Grid>

                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                value={formFields.email}
                                onChange={handleChange}
                                error={isSubmit && !formFields.email}
                            />
                        </Grid>

                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="User Name"
                                name="userName"
                                value={formFields.userName}
                                onChange={handleChange}
                                error={isSubmit && !formFields.userName}
                            />
                        </Grid>

                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formFields.password}
                                onChange={handleChange}
                                error={isSubmit && !formFields.password}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() =>
                                                    setShowPassword((p) => !p)
                                                }
                                            >
                                                {showPassword ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid size={12}>
                            <Button variant="outlined" component="label" fullWidth>
                                Upload Avatar (Required)
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    name="avatar"
                                    onChange={handleFileChange}
                                />
                            </Button>
                        </Grid>

                        <Grid size={12}>
                            <Button variant="outlined" component="label" fullWidth>
                                Upload Cover Image (Optional)
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    name="coverImage"
                                    onChange={handleFileChange}
                                />
                            </Button>
                        </Grid>

                        <Grid size={12}>
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                onClick={handleSubmit}
                            >
                                {loading ? "Creating Account..." : "Sign Up"}
                            </Button>
                        </Grid>

                        <Grid size={12}>
                            <Typography textAlign="center">
                                Already have an account?{" "}
                                <Box
                                    component="span"
                                    sx={{
                                        color: "primary.main",
                                        cursor: "pointer",
                                        fontWeight: 600,
                                    }}
                                    onClick={() => navigate("/")}
                                >
                                    Login
                                </Box>
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>

                {loading && <Loader size={50} message="Creating account..." />}

                <ApiAlert
                    open={alert.open}
                    message={alert.message}
                    severity={alert.severity}
                    onClose={handleClose}
                />
            </Box>
        </>
    );
};

export default Signup;
