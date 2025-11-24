import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useEffect, useState } from 'react';
import  {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  StreamTheme,
  SpeakerLayout,
  CallControls,
  Call
} from '@stream-io/video-react-sdk';
import { useUser } from '../Service/useUser';
import { SendRecordingUrl } from "../Endpoints/RecordingEndpoint";





export default function VideoCall() {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<any>(null);
  const { user, token, callId, apiKey, error, isLoading } = useUser();

  async function waitForRecordingUrl(streamCall: Call, previousUrl?: string, timeout = 20000, interval = 2000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const response = await streamCall.queryRecordings();

    if (response.recordings && response.recordings.length > 0) {
      const latest = response.recordings[response.recordings.length - 1];

      // Om vi inte har en tidigare URL, returnera den första vi hittar
      // Annars, returnera bara om det är en ny inspelning
      if (latest.url && latest.url !== previousUrl) {
        return latest.url;
      }
    }

    console.log("⏳ Waiting for new recording URL...");
    await new Promise(resolve => setTimeout(resolve, interval));
  }

  throw new Error("No new recording URL found within timeout");
}


  useEffect(() => {

    if (!user || !token || !callId || !apiKey) {
      console.error("No user, token, callId or apiKey available:", { user, token, callId, apiKey });
      return;
    }

    const streamClient = new StreamVideoClient({ apiKey, user, token });
    const streamCall = streamClient.call('default', callId);

    streamCall.join({ create: true })
      .then(() => {
        console.log("✅ Joined call:", callId);
        setCall(streamCall);
        setClient(streamClient);

        // Lyssna på recording-events
        streamCall.on('call.recording_started', () => {
          console.log("🎥 Recording started");
        });

        streamCall.on('call.recording_stopped', async () => {
          console.log("🛑 Recording stopped");

         try {
            // 🔥 Vänta tills Stream har bearbetat inspelningen
            const recordingUrl = await waitForRecordingUrl(streamCall);

            console.log("✅ Final Recording URL:", recordingUrl);

            // 🔥 Skicka till ditt .NET Orchestrate API
            await SendRecordingUrl(recordingUrl, callId);

          } catch (error) {
            console.error("❌ Failed to get recording URL:", error);
          }
        });
      })
      .catch(err => console.error("❌ Failed to join call:", err));

    return () => {
      streamClient.disconnectUser();
    };
  }, [user, token, callId, apiKey, isLoading]);

  if (isLoading)
    return <p>Loading user...</p>;
  if (error)
    return <p>Error loading call: {error.message}</p>
  if (!client || !call)
    return <p>Initializing call...</p>;

  return (
    <StreamVideo client={client}>
      <StreamTheme>
        <StreamCall call={call}>
          <SpeakerLayout />
          <CallControls />
        </StreamCall>
      </StreamTheme>
    </StreamVideo>
  );
}

