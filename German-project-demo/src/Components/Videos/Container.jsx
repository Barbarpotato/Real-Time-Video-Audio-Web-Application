import React, { useState, useRef, useEffect } from 'react'
import {
    useMeeting,
    Constants,
    usePubSub,
} from "@videosdk.live/react-sdk";
import ViewerView from './VIewerView';
import FlyingEmojisOverlay from '../../FlyingEmojiOverlay';
import SpeakerView from './SpeakerView';

function Container(props) {
    const [joined, setJoined] = useState(null);
    const { join, localParticipant, changeMode } = useMeeting();
    const mMeeting = useMeeting({
        onMeetingJoined: () => {
            if (mMeetingRef.current.localParticipant.mode == "CONFERENCE") {
                mMeetingRef.current.localParticipant.pin();
            }
            setJoined("JOINED");
        },
        onMeetingLeft: () => {
            props.onMeetingLeave();
        },
        onParticipantModeChanged: (data) => {
            const localParticipant = mMeetingRef.current.localParticipant;
            if (data.participantId == localParticipant.id) {
                if (data.mode == Constants.modes.CONFERENCE) {
                    localParticipant.pin();
                } else {
                    localParticipant.unpin();
                }
            }
        },
        onError: (error) => {
            alert(error.message);
        },
        onHlsStateChanged: (data) => {
            console.log("HLS State Changed", data);
        },
    });
    const joinMeeting = () => {
        setJoined("JOINING");
        join();
    };

    const mMeetingRef = useRef(mMeeting);
    useEffect(() => {
        mMeetingRef.current = mMeeting;
    }, [mMeeting]);

    const [joinLivestreamRequest, setJoinLivestreamRequest] = useState();

    const pubsub = usePubSub(`CHANGE_MODE_${localParticipant?.id}`, {
        onMessageReceived: (pubSubMessage) => {
            setJoinLivestreamRequest(pubSubMessage);
        },
    });

    return (
        <div className="container">
            <FlyingEmojisOverlay />
            <h3>Meeting Id: {props.meetingId}</h3>
            {joined && joined == "JOINED" ? (
                mMeeting.localParticipant.mode == Constants.modes.CONFERENCE ? (
                    <SpeakerView />
                ) : mMeeting.localParticipant.mode == Constants.modes.VIEWER ? (
                    <>
                        {joinLivestreamRequest && (
                            <div>
                                {joinLivestreamRequest.senderName} requested you to join
                                Livestream
                                <button
                                    onClick={() => {
                                        changeMode(joinLivestreamRequest.message);
                                        setJoinLivestreamRequest(null);
                                    }}
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => {
                                        setJoinLivestreamRequest(null);
                                    }}
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                        <ViewerView />
                    </>
                ) : null
            ) : joined && joined == "JOINING" ? (
                <p>Joining the meeting...</p>
            ) : (
                <button onClick={joinMeeting}>Join</button>
            )}
        </div>
    );
}

export default Container