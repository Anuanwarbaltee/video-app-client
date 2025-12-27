import React, { useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Videoservice } from "../../Services/Videoservice";
import UseLocalStorage from "../Hooks/UseLocalStorage";
import { UserService } from "../../Services/UserSercive";

const WATCH_THRESHOLD = 0.25;

const ReactPlayers = ({
    url,
    width = "100%",
    height = "360px",
    controls = true,
    playing = true,
    videoId
}) => {
    const [user] = UseLocalStorage("User", "");
    const [viewCounted, setViewCounted] = useState(false);
    const [watchRecorded, setWatchRecorded] = useState(false);

    const handleProgress = useCallback(
        async ({ played }) => {

            if (!videoId || played < WATCH_THRESHOLD) return;

            //  Increment views 
            if (!viewCounted) {
                setViewCounted(true);
                try {
                    await Videoservice.incrementViews(videoId);
                } catch (error) {
                    console.error("View increment failed", error);
                }
            }

            // Add watch history 
            if (!watchRecorded && user?._id) {
                setWatchRecorded(true);
                try {
                    await UserService.addWatchHistory({
                        videoId,
                        userId: user._id
                    });
                } catch (error) {
                    console.error("Watch history failed", error);
                }
            }
        },
        [videoId, user?._id, viewCounted, watchRecorded]
    );

    useEffect(() => {
        setViewCounted(false),
            setWatchRecorded(false)
    }, [videoId])

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px",
                background: "#000",
                borderRadius: "12px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                maxWidth: width
            }}
        >
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
