import { useEffect } from 'react'
import {
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore
} from "@100mslive/react-sdk";
import "./styles.css";
import JoinForm from './Components/JoinForm'
import Peer from './Components/Peer';
import Conference from './Components/Conference';
import Header from './Components/Header';

function Component() {
  const peers = useHMSStore(selectPeers);
  return <Peer peers={peers} />;
}

function App() {

  const isConnected = useHMSStore(selectIsConnectedToRoom);

  const hmsActions = useHMSActions();

  useEffect(() => {
    window.onunload = () => {
      if (isConnected) {
        hmsActions.leave();
      }
    };
  }, [hmsActions, isConnected]);

  return (
    <div className="App">
      {isConnected ? (
        <>
          <Header />
          <Conference />
          <Footer />
        </>
      ) : (
        <JoinForm />
      )}
    </div>
  );
}

export default App
