import React, { useRef, useEffect } from 'react'
import {
    useMeeting,
    usePubSub,
} from "@videosdk.live/react-sdk";
import Hls from "hls.js";

function ViewerView() {
    // States to store downstream url and current HLS state
    const playerRef = useRef(null);
    const { hlsUrls, hlsState } = useMeeting();
    const { publish } = usePubSub("REACTION");
    //highlight-start
    function sendEmoji(emoji) {
        publish(emoji);
        // Dispatch custom event here so the local user can see their own emoji
        window.dispatchEvent(
            new CustomEvent("reaction_added", { detail: { emoji } })
        );
    }
    useEffect(() => {
        if (hlsUrls.downstreamUrl && hlsState == "HLS_PLAYABLE") {
            if (Hls.isSupported()) {
                const hls = new Hls({
                    capLevelToPlayerSize: true,
                    maxLoadingDelay: 4,
                    minAutoBitrate: 0,
                    autoStartLoad: true,
                    defaultAudioCodec: "mp4a.40.2",
                });

                let player = document.querySelector("#hlsPlayer");

                hls.loadSource(hlsUrls.downstreamUrl);
                hls.attachMedia(player);
            } else {
                if (typeof playerRef.current?.play === "function") {
                    playerRef.current.src = hlsUrls.downstreamUrl;
                    playerRef.current.play();
                }
            }
        }
    }, [hlsUrls, hlsState]);

    return (
        <div>
            <div>
                <button
                    onClick={() => {
                        sendEmoji("confetti");
                        publish("confetti");
                    }}
                >
                    Send 🎉 Reaction
                </button>

                <button
                    onClick={() => {
                        sendEmoji("clap");
                        publish("clap");
                    }}
                >
                    Send 👏 Reaction
                </button>
            </div>
            {hlsState != "HLS_PLAYABLE" ? (
                <div>
                    <p>HLS has not started yet or is stopped</p>
                </div>
            ) : (
                hlsState == "HLS_PLAYABLE" && (
                    <div>
                        <video
                            ref={playerRef}
                            id="hlsPlayer"
                            autoPlay={true}
                            controls
                            style={{ width: "100%", height: "100%" }}
                            playsinline
                            playsInline
                            muted={true}
                            playing
                            onError={(err) => {
                                console.log(err, "hls video error");
                            }}
                        ></video>
                    </div>
                )
            )}
        </div>
    );
}

export default ViewerView