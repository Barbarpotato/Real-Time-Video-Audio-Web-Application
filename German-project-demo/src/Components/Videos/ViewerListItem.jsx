import React from 'react'
import {
    useParticipant,
    usePubSub,
} from "@videosdk.live/react-sdk";


function ViewerListItem({ participantId }) {
    const { displayName } = useParticipant(participantId);
    const { publish } = usePubSub(`CHANGE_MODE_${participantId}`);
    const onClickRequestJoinLiveStream = () => {
        publish("CONFERENCE");
    };
    return (
        <div>
            {displayName}{" "}
            <button
                onClick={() => {
                    onClickRequestJoinLiveStream();
                }}
            >
                Request to join Livestream
            </button>
        </div>
    );
}

export default ViewerListItem