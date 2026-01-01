import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from "@mui/material";

const ConfirmationDialog = ({
    open,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onClose,
    confirmColor = "error",
    loading = false,
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle>{title}</DialogTitle>

            <DialogContent>
                <DialogContentText>
                    {description}
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    {cancelText}
                </Button>

                <Button
                    onClick={onConfirm}
                    color={confirmColor}
                    variant="contained"
                    disabled={loading}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
