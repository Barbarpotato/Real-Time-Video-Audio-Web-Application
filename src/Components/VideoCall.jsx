import React, { useEffect, useState } from 'react'
import { createMicrophoneAndCameraTracks } from "agora-rtc-react";
import Controls from './Controls';
import Videos from './Videos';

const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

const APP_ID = '3b938cc1aa47475aa3403fb2ed5901a3'
const TOKEN = "007eJxTYPB55umnPl1TeK/EnFPXV6tV7vm66Ne+mGP9KnsnFSz/XjJFgcE4ydLYIjnZMDHRxNzE3DQx0djEwDgtySg1xdTSwDDRmN9zVUpDICPDBUVpRkYGCATx2RlKUotLMvPSGRgAD80hdA=="
const CHANNEL = "testing"

function VideoCall({ useClient, setInCall, channelName }) {

    const [users, setUsers] = useState([])
    const [start, setStart] = useState(false)
    const client = useClient()
    const { ready, tracks } = useMicrophoneAndCameraTracks()

    useEffect(() => {
        // function to initialise the SDK
        let init = async (name) => {
            client.on("user-published", async (user, mediaType) => {
                await client.subscribe(user, mediaType);
                console.log("subscribe success");
                if (mediaType === "video") {
                    setUsers((prevUsers) => {
                        return [...prevUsers, user];
                    });
                }
                if (mediaType === "audio") {
                    user.audioTrack?.play();
                }
            });

            client.on("user-unpublished", (user, type) => {
                console.log("unpublished", user, type);
                if (type === "audio") {
                    user.audioTrack?.stop();
                }
                if (type === "video") {
                    setUsers((prevUsers) => {
                        return prevUsers.filter((User) => User.uid !== user.uid);
                    });
                }
            });

            client.on("user-left", (user) => {
                console.log("leaving", user);
                setUsers((prevUsers) => {
                    return prevUsers.filter((User) => User.uid !== user.uid);
                });
            });

            await client.join(APP_ID, CHANNEL, TOKEN, null);
            if (tracks) await client.publish([tracks[0], tracks[1]]);
            setStart(true);

        };

        if (ready && tracks) {
            console.log("init ready");
            init(channelName);
        }

    }, [channelName, client, ready, tracks]);

    return (
        <div>
            {
                ready && tracks && (
                    <Controls useClient={useClient} tracks={tracks} setStart={setStart} setInCall={setInCall} />
                )
            }
            {start && tracks && <Videos users={users} tracks={tracks} />}
        </div >
    );
};

export default VideoCall