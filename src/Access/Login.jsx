
import { Box, Button, colors, TextField, Typography, useTheme } from '@mui/material'
import Grid from '@mui/material/Grid2';
import React, { useContext, useEffect, useState } from 'react'
import { UserService } from '../Services/UserSercive';
import UseLocalStorage from '../Component/Hooks/UseLocalStorage';
import { useNavigate } from 'react-router-dom';
import Loader from '../Component/Common/Loader';
import { ThemeContext } from '../Shell/Theme';

const Login = () => {
    const [formFields, setformsFields] = useState({})
    const [isSubmit, setIsSubmit] = useState(false)
    const [loading, setLoading] = useState(false)
    const [apikey, setApiKey] = UseLocalStorage("Apikey", "")
    const [user, setUser] = UseLocalStorage("User", "")
    const theme = useTheme();
    const { mode, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const handleChange = (event) => {
        setformsFields((prev) => ({ ...prev, [event.target.name]: event.target.value }))
    }

    useEffect(() => {
        localStorage.removeItem("Apikey");
        localStorage.removeItem("User");
    }, [])
    const handleSubmit = async () => {
        setIsSubmit(true)
        if (formFields.userName && formFields.password) {
            setLoading(true)
            try {
                let res = await UserService.logInUser(formFields)
                if (res.success) {
                    setApiKey(res.data.accessToken)
                    setUser(res.data.user)
                    setTimeout(() => {
                        navigate("/home")
                    }, 1000)
                } else {
                    console.log("api error")
                }
            } catch (error) {
                console.log("api error", error)
            } finally {
                setIsSubmit(false)
                setLoading(false)
            }

        }
    }
    return (
        <Box sx={{ bgcolor: theme.palette.background.paper, height: "100vh", width: "100vw" }}>
            <Box sx={{ color: theme.palette.text.primary, borderRadius: "10px", padding: "10px", textAlign: "end" }}>
                <Button onClick={toggleTheme}>{mode === "dark" ? "Light" : "Dark"}</Button>
            </Box>
            <Grid container spacing={2} sx={{ position: "absolute", top: "30%", left: "50%", translate: "-50%" }}>
                <Grid size={12}>
                    <Typography>User Name / Email</Typography>
                    <TextField fullWidth onChange={handleChange} name='userName' value={formFields?.userName} error={!formFields?.userName && isSubmit} helperText={!formFields?.userName && isSubmit ? "User Name is required." : ""} type='text' placeholder='User Name / Email' />
                </Grid>
                <Grid size={12}>
                    <Typography>Password</Typography>
                    <TextField fullWidth onChange={handleChange} name='password' value={formFields?.password} type='text' placeholder='Password' error={!formFields?.password && isSubmit} helperText={!formFields?.password && isSubmit ? "Password Field is required." : ""} />
                </Grid>
                <Grid size={12}>
                    <Button fullWidth sx={{ padding: "20px " }} variant='contained' onClick={handleSubmit}>Submit</Button>
                    <Typography sx={{ padding: "10px 0" }}>Don't have an account ? <span style={{ color: "blue", cursor: "pointer", fontWeight: "bold" }}>Sign Up</span></Typography>
                </Grid>

            </Grid>
            {loading && <Loader size={50} message={"loading..."} />}
        </Box>

    )
}

export default Login