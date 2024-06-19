import { Auth } from "@vk-ecosystem/sdk";
import "./App.css";
import { useAuth } from "./utils/useAuth";
import { useMessenger } from "./utils/useMessenger";
import { useState } from "react";

function App() {
  const { getAndSetSuperAppToken } = useAuth();

  const { openMessenger, openMessengerWithPeerId } = useMessenger();

  const [peerId, setPeerId] = useState("");

  const handlePeerIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPeerId(event.currentTarget.value);
  };

  const openWithPeerId = () => {
    if (peerId) {
      openMessengerWithPeerId(+peerId);
    }
  };

  return (
    <div className="card">
      <button onClick={() => Auth.login()}>Запустить авторизацию</button>

      <button onClick={getAndSetSuperAppToken}>Get & Set tokens</button>

      <button onClick={openMessenger}>Открыть виджет ВК мессенжера</button>

      <label>
        Peer Id&nbsp;
        <input type="text" name="peer_id" onChange={handlePeerIdChange} />
      </label>
      <button disabled={!peerId} onClick={openWithPeerId}>
        Открыть виджет ВК мессенжера c peer_id
      </button>
    </div>
  );
}

export default App;
