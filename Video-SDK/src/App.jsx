import React, { useState, useRef, useEffect, useMemo } from 'react'
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant,
  Constants,
} from "@videosdk.live/react-sdk";
import { authToken, createMeeting } from './API';
import ReactPlayer from "react-player";

function JoinScreen({ getMeetingAndToken, setMode }) {
  const [meetingId, setMeetingId] = useState(null);
  //? Set the mode of joining participant and set the meeting id or generate new one
  const onClick = async (mode) => {
    setMode(mode);
    await getMeetingAndToken(meetingId);
  };
  return (
    <div className="container">
      <button onClick={() => onClick("CONFERENCE")}>Create Meeting</button>
      <br />
      <br />
      {" or "}
      <br />
      <br />
      <input
        type="text"
        placeholder="Enter Meeting Id"
        onChange={(e) => {
          setMeetingId(e.target.value);
        }}
      />
      <br />
      <br />
      <button onClick={() => onClick("CONFERENCE")}>Join as Host</button>
      {" | "}
      <button onClick={() => onClick("VIEWER")}>Join as Viewer</button>
    </div>
  );
}

function ParticipantView(props) {
  const micRef = useRef(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(props.participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  //Playing the audio in the <audio>
  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <div>
      <p>
        Participant: {displayName} | Webcam: {webcamOn ? "ON" : "OFF"} | Mic:{" "}
        {micOn ? "ON" : "OFF"}
      </p>
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
      {webcamOn && (
        <ReactPlayer
          //
          playsinline // very very imp prop
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          //
          url={videoStream}
          //
          height={"300px"}
          width={"300px"}
          onError={(err) => {
            console.log(err, "participant video error");
          }}
        />
      )}
    </div>
  );
}

function Controls() {
  const { leave, toggleMic, toggleWebcam, startHls, stopHls } = useMeeting();
  return (
    <div>
      <button onClick={() => leave()}>Leave</button>
      &emsp;|&emsp;
      <button onClick={() => toggleMic()}>toggleMic</button>
      <button onClick={() => toggleWebcam()}>toggleWebcam</button>
      &emsp;|&emsp;
      <button
        onClick={() => {
          //We will start the HLS in SPOTLIGHT mode and PIN as
          //priority so only speakers are visible in the HLS stream
          startHls({
            layout: {
              type: "SPOTLIGHT",
              priority: "PIN",
              gridSize: "20",
            },
            theme: "LIGHT",
            mode: "video-and-audio",
            quality: "high",
            orientation: "landscape",
          });
        }}
      >
        Start HLS
      </button>
      <button onClick={() => stopHls()}>Stop HLS</button>
    </div>
  );
}

function SpeakerView() {
  //Get the participants and hlsState from useMeeting
  const { participants, hlsState } = useMeeting();

  //Filtering the host/speakers from all the participants
  const speakers = useMemo(() => {
    const speakerParticipants = [...participants.values()].filter(
      (participant) => {
        return participant.mode == Constants.modes.CONFERENCE;
      }
    );
    return speakerParticipants;
  }, [participants]);
  return (
    <div>
      <p>Current HLS State: {hlsState}</p>
      {/* Controls for the meeting */}
      <Controls />

      {/* Rendring all the HOST participants */}
      {speakers.map((participant) => (
        <ParticipantView participantId={participant.id} key={participant.id} />
      ))}
    </div>
  );
}

function ViewerView() {
  return null;
}

function Container(props) {
  const [joined, setJoined] = useState(null);
  //? Get the method which will be used to join the meeting.
  const { join } = useMeeting();
  const mMeeting = useMeeting({
    //? callback for when meeting is joined successfully
    onMeetingJoined: () => {
      if (mMeetingRef.current.localParticipant.mode == "CONFERENCE") {
        mMeetingRef.current.localParticipant.pin();
      }
      setJoined("JOINED");
    },
    //? callback for when meeting is left
    onMeetingLeft: () => {
      props.onMeetingLeave();
    },
    //? callback for when there is error in meeting
    onError: (error) => {
      alert(error.message);
    },
  });

  //? We will create a ref to meeting object so that when used inside the
  //? Callback functions, meeting state is maintained
  const mMeetingRef = useRef(mMeeting);
  useEffect(() => {
    mMeetingRef.current = mMeeting;
  }, [mMeeting]);

  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };


  return (
    <div className="container">
      <h3>Meeting Id: {props.meetingId}</h3>
      {joined && joined == "JOINED" ? (
        mMeeting.localParticipant.mode == Constants.modes.CONFERENCE ? (
          <SpeakerView />
        ) : mMeeting.localParticipant.mode == Constants.modes.VIEWER ? (
          <ViewerView />
        ) : null
      ) : joined && joined == "JOINING" ? (
        <p>Joining the meeting...</p>
      ) : (
        <button onClick={joinMeeting}>Join</button>
      )}
    </div>
  );
}

function App() {

  const [meetingId, setMeetingId] = useState(null);

  //? State to handle the mode of the participant i.e. CONFERNCE or VIEWER
  const [mode, setMode] = useState("CONFERENCE");

  const getMeetingAndToken = async (id) => {
    const meetingId = id == null ? await createMeeting({ token: authToken }) : id
    setMeetingId(meetingId);
  };

  const onMeetingLeave = () => {
    setMeetingId(null);
  };

  return authToken && meetingId ?
    (
      <MeetingProvider
        config={{
          meetingId,
          micEnabled: true,
          webcamEnabled: true,
          name: "C.V. Raman",
          //? These will be the mode of the participant CONFERENCE or VIEWER
          mode: mode,
        }}
        token={authToken}>
        <MeetingConsumer>
          {() => (<Container meetingId={meetingId} onMeetingLeave={onMeetingLeave} />)}
        </MeetingConsumer>
      </MeetingProvider>
    )
    :
    (
      <JoinScreen getMeetingAndToken={getMeetingAndToken} setMode={setMode} />
    );
}

export default App