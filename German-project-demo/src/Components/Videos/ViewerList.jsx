import React from 'react'
import {
    useMeeting,
    Constants,
} from "@videosdk.live/react-sdk";
import ViewerListItem from './ViewerListItem';

function ViewerList() {
    const { participants } = useMeeting();

    //Filtering only viewer participant
    const viewers = [...participants.values()].filter((participant) => {
        return participant.mode == Constants.modes.VIEWER;
    });

    return (
        <div>
            <p>Viewer list: </p>
            {viewers.map((participant) => {
                return <ViewerListItem participantId={participant.id} />;
            })}
        </div>
    );
}

export default ViewerList;