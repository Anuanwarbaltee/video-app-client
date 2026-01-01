import React from "react";
import { Snackbar, Alert } from "@mui/material";

const ApiAlert = ({
    open,
    onClose,
    message = "",
    severity = "success", // success | error | warning | info
    duration = 4000,
}) => {
    if (!message) return null;

    return (
        <Snackbar
            open={open}
            autoHideDuration={duration}
            onClose={onClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
            <Alert
                onClose={onClose}
                severity={severity}
                variant="filled"
                sx={{ width: "100%" }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default ApiAlert;
