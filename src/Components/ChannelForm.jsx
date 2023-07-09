import React from 'react'

const APP_ID = '3b938cc1aa47475aa3403fb2ed5901a3'

function ChannelForm({ setInCall, setChannelName }) {
    return (
        <form className="join">
            {APP_ID === '' && <p style={{ color: 'red' }}>Please enter your Agora App ID in App.tsx and refresh the page</p>}
            <input type="text"
                placeholder="Enter Channel Name"
                onChange={(e) => setChannelName(e.target.value)}
            />
            <button onClick={(e) => {
                e.preventDefault();
                setInCall(true);
            }}>
                Join
            </button>
        </form>
    )
}

export default ChannelForm