import React, { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import './layout.css'
import { Chat, Channel, ChannelHeader, MessageInput, VirtualizedMessageList, Window } from 'stream-chat-react';

// we'll reuse `useClient` hook from the "Add a Channel List" example
import { useClient } from './hooks/useClient';

import 'stream-chat-react/dist/css/v2/index.css';

const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZGl2aW5lLWxha2UtOCJ9.Nm2sjbf78e3d4TFI7QSeb0uzM22ctEVd8Cj1oBUQezs';

const client = StreamChat.getInstance("ux49e2xequrw");

const user = {
  id: 'divine-lake-8',
  name: 'divine-lake-8',
  image: 'https://getstream.io/random_png/?id=divine-lake-8&name=divine-lake-8',
};

const App = () => {
  const chatClient = useClient({ apiKey: 'xs2z2wy8gc9j', userData: user, tokenOrProvider: userToken });

  const [channel, setChannel] = useState(undefined);

  useEffect(() => {
    if (!chatClient || channel) return;

    const spaceChannel = chatClient.channel('livestream', 'check', {
      image: 'https://goo.gl/Zefkbx',
      name: 'SpaceX launch discussion',
    });

    setChannel(spaceChannel);
  }, [chatClient]);

  if (!chatClient) return null;

  const handleDeleteChannel = async () => {
    try {
      await client.channel("livestream", 'check').delete();
      console.log('Channel deleted successfully.');
    } catch (error) {
      console.error('Error deleting channel:', error);
    }
  }

  return (
    <React.Fragment>
      <Chat client={chatClient} theme='str-chat__theme-dark'>
        <Channel channel={channel}>
          <Window>
            <ChannelHeader live />
            <VirtualizedMessageList />
            <MessageInput focus />
          </Window>
        </Channel>
      </Chat>
      <button onClick={handleDeleteChannel}>test</button>
    </React.Fragment>
  );
};

export default App