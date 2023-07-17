import React, { useState, useEffect } from 'react'
import { MeetingProvider, MeetingConsumer, } from "@videosdk.live/react-sdk";
import { authToken, createMeeting } from './lib/VideoAPI';
import Container from './Components/Videos/Container';
import JoinScreen from './Components/Videos/JoinScreen';
import {
  Chat, Channel, ChannelHeader, MessageInput,
  VirtualizedMessageList, Window
} from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import { useClient } from './hooks/useClient';
import 'stream-chat-react/dist/css/v2/index.css';
import './layout.css'

const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZGl2aW5lLWxha2UtOCJ9.Nm2sjbf78e3d4TFI7QSeb0uzM22ctEVd8Cj1oBUQezs';

const client = StreamChat.getInstance("ux49e2xequrw");

const user = {
  id: 'divine-lake-8',
  name: 'divine-lake-8',
  image: 'https://getstream.io/random_png/?id=divine-lake-8&name=divine-lake-8',
};

function App() {

  //? Video
  const [meetingId, setMeetingId] = useState(null);
  const [mode, setMode] = useState("CONFERENCE");

  //? CHAT
  const chatClient = useClient({ apiKey: 'xs2z2wy8gc9j', userData: user, tokenOrProvider: userToken });
  const [channel, setChannel] = useState(undefined);

  const getMeetingAndToken = async (id) => {
    const meetingId =
      id == null ? await createMeeting({ token: authToken }) : id;
    setMeetingId(meetingId);
  };

  const onMeetingLeave = () => {
    setMeetingId(null);
  };

  useEffect(() => {
    if (!chatClient || channel) return;

    const spaceChannel = chatClient.channel('livestream', 'check', {
      image: 'https://goo.gl/Zefkbx',
      name: 'SpaceX launch discussion',
    });

    setChannel(spaceChannel);
  }, [chatClient]);

  if (!chatClient) return null;

  return authToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: "C.V. Raman",
        mode: mode,
      }}
      token={authToken}
    >
      <MeetingConsumer>
        {() => (
          <React.Fragment>
            <Container meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
            <Chat client={chatClient} theme='str-chat__theme-dark'>
              <Channel channel={channel}>
                <Window>
                  <ChannelHeader live />
                  <VirtualizedMessageList />
                  <MessageInput focus />
                </Window>
              </Channel>
            </Chat>
          </React.Fragment>
        )}
      </MeetingConsumer>
    </MeetingProvider>
  ) : (
    <JoinScreen getMeetingAndToken={getMeetingAndToken} setMode={setMode} />
  );
}

export default App;