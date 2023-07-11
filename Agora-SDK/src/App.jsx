import React, { useState } from 'react'
import { createClient } from "agora-rtc-react";
import ChannelForm from './Components/ChannelForm';
import VideoCall from './Components/VideoCall';

const useClient = createClient({
  mode: 'rtc',
  codec: 'vp8'
})

function App() {
  const [inCall, setInCall] = useState(false);
  const [channelName, setChannelName] = useState("testing");

  return (
    <React.Fragment>
      <h1 className="heading">Agora SDK DEMO EXAMPLE</h1>
      {inCall ?
        <VideoCall useClient={useClient} setInCall={setInCall} channelName={channelName} />
        :
        <ChannelForm setInCall={setInCall} setChannelName={setChannelName} />
      }
    </React.Fragment>
  )
}

export default App
