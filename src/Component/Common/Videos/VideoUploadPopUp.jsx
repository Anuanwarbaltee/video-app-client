import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Checkbox,
    FormControlLabel,
    Button,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Videoservice } from '../../../Services/Videoservice';

const ModalContent = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    backgroundColor: theme.palette.background.paper,
    borderRadius: "8px",
    boxShadow: 24,
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
}));

const UploadArea = styled(Box)(({ theme }) => ({
    border: "2px dashed #c4c4c4",
    borderRadius: "4px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    overflow: "hidden",
}));

const VideoUploadModal = ({ open, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPublish, setIsPublish] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleVideoUpload = (event) => {
        setVideoFile(event.target.files[0]);
    };

    const handleClosePopup = () => {
        setIsSubmit(false)
        onClose()
    }

    const handleThumbnailUpload = (event) => {
        setThumbnail(event.target.files[0]);
    };

    const handleSubmit = () => {
        setLoading(true)
        setIsSubmit(true)
        if (title && videoFile) {
            const submissionData = new FormData();
            submissionData.append("title", title);
            submissionData.append("description", title);
            submissionData.append("isPublished", isPublish);

            if (videoFile) submissionData.append("uservideoFile", videoFile);
            if (thumbnail) submissionData.append("thumbnail", thumbnail);
            for (let pair of submissionData.entries()) {
                console.log(pair[0], pair[1]); // Should log all key-value pairs
            }
            try {
                let response = Videoservice.UploadVideo(submissionData)
            } catch (error) {

            } finally {
                setIsSubmit(false)
            }
        }

    };

    return (
        <>
            <Modal
                open={open}
                handleClosePopup={handleClosePopup}
                aria-labelledby="video-upload-modal"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(2px)',
                }}
            >
                <ModalContent className="modalStyle" sx={{}}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography id="video-upload-modal" variant="h6" fontWeight="bold">
                            Upload a Video
                        </Typography>
                        <IconButton onClick={handleClosePopup}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Title */}
                    <TextField
                        size='small'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        variant="outlined"
                        placeholder="Enter video title"
                        error={isSubmit && !title?.trim()}
                        helperText={isSubmit && !title?.trim() ? "Title is required." : ""}
                    />

                    {/* Description */}
                    <TextField
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        variant="outlined"
                        placeholder="Add a description"
                        multiline
                        rows={2}
                    />

                    {/* Video File Upload */}
                    <Box>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            Video File
                        </Typography>
                        <label htmlFor="video-upload">
                            <UploadArea className="uploadAreaStyle" sx={{ border: isSubmit && !videoFile && "1px solid #f44336" }}>
                                <Typography variant="body2" color="textSecondary">
                                    {videoFile ? videoFile.name : 'Click to upload'}
                                </Typography>
                                <input
                                    type="file"
                                    id="video-upload"
                                    accept="video/*"
                                    onChange={handleVideoUpload}
                                    style={{ display: 'none' }}
                                />
                            </UploadArea>
                            {isSubmit && !videoFile ?
                                <Typography variant="body2" color="#f44336">
                                    Video is required.
                                </Typography>
                                : ""}
                        </label>
                    </Box>

                    {/* Thumbnail Upload */}
                    <Box>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            Thumbnail
                        </Typography>
                        <label htmlFor="thumbnail-upload">
                            <UploadArea className="uploadAreaStyle">
                                <Typography variant="body2" color="textSecondary">
                                    {thumbnail ? thumbnail.name : 'Upload a thumbnail (optional)'}
                                </Typography>
                                <input
                                    type="file"
                                    id="thumbnail-upload"
                                    accept="image/*"
                                    onChange={handleThumbnailUpload}
                                    style={{ display: 'none' }}
                                />
                            </UploadArea>
                        </label>
                    </Box>

                    {/* Publish Toggle */}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isPublish}
                                onChange={(e) => setIsPublish(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Publish Immediately"
                    />

                    {/* Footer Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                        <Button variant="outlined" onClick={handleClosePopup}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Upload Video
                        </Button>
                    </Box>
                </ModalContent>
            </Modal>
        </>

    );
};

export default VideoUploadModal;