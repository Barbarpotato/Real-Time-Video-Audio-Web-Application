import { useMeeting, Constants } from "@videosdk.live/react-sdk";
import React from 'react'
import Controls from './Controls'
import ParticipantView from "./ParticipantView";
import ViewerList from "./ViewerList";

function SpeakerView() {
    const { participants, hlsState } = useMeeting();
    const speakers = [...participants.values()].filter((participant) => {
        return participant.mode == Constants.modes.CONFERENCE;
    });
    return (
        <div>
            <p>Current HLS State: {hlsState}</p>
            <Controls />
            {speakers.map((participant) => (
                <ParticipantView participantId={participant.id} key={participant.id} />
            ))}
            <ViewerList />
        </div>
    );
}

export default SpeakerView;