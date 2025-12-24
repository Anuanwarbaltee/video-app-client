import React, { useState } from "react";
import ReactPlayer from "react-player";
import { Videoservice } from "../../Services/Videoservice";
import UseLocalStorage from "../Hooks/UseLocalStorage";
import { UserService } from "../../Services/UserSercive";

const ReactPlayers = ({ url, width = "100%", height = "360px", controls = true, playing = true, videoId }) => {
    const [user, setUser] = UseLocalStorage("User", "")
    const [viewCounted, setViewCounted] = useState(false);
    const [isWatch, setIsWatch] = useState(false);

    const handleProgress = async (video) => {
        handleToggleView(video)
        if (videoId && !isWatch && video.played >= 0.25) {
            let data = {
                videoId: videoId,
                userId: user?._id
            }
            try {
                let res = await UserService.addWatchHistory(data)
                res.success(
                    setIsWatch(true)
                )
            } catch (error) {
                console.log(error)
            }
        }
    }

    const handleToggleView = async (video) => {
        if (!viewCounted && video.played >= 0.25) {
            setViewCounted(true)
            try {
                let res = await Videoservice.incrementViews(videoId)
            } catch (error) {
                console.log(error)
            }
        }
    }



    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px",
            background: "#000",
            borderRadius: "12px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
            maxWidth: width
        }}>
            <ReactPlayer
                url={url}
                width="100%"
                height={height}
                controls={controls}
                playing={playing}
                onProgress={handleProgress}
                style={{ borderRadius: "12px", overflow: "hidden" }}
            />
        </div>
    );
};

export default ReactPlayers;
