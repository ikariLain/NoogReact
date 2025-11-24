import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useEffect, useState } from 'react';
import {
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

async function waitForNewRecording(streamCall: Call, timeout = 60000, interval = 2000): Promise<string> {
  const startTime = Date.now();
  const initial = await streamCall.queryRecordings();
  const initialCount = initial.recordings?.length ?? 0;
  console.log(`Initial recordings: ${initialCount}`);

  while (Date.now() - startTime < timeout) {
    const response = await streamCall.queryRecordings();
    const count = response.recordings?.length ?? 0;

    if (count > initialCount && response.recordings) {
      // Sortera på start_time
      const sorted = [...response.recordings].sort(
        (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );
      const latest = sorted[sorted.length - 1];

      if (latest.url) {
        console.log("Recording is ready:", latest.url);
        return latest.url;
      }
      console.log("Recording detected but URL not ready yet...");
    }
    await new Promise(res => setTimeout(res, interval));
  }
  throw new Error("No new processed recording found within timeout");
}

export default function VideoCall() {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const { user, token, callId, apiKey, error, isLoading } = useUser();
  //const recordingStartTimeRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user || !token || !callId || !apiKey) {
      console.error("No user, token, callId or apiKey available");
      return;
    }

    const streamClient = new StreamVideoClient({ apiKey, user, token });
    const streamCall = streamClient.call('default', callId);

    streamCall.join({ create: true })
      .then(() => {
        console.log("✅ Joined call:", callId);
        setCall(streamCall);
        setClient(streamClient);

        // Event listener för när recording stoppas
        streamCall.on('call.recording_stopped', async () => {
          console.log("Recording stopped, waiting for ready recording...");
          try {
            const url = await waitForNewRecording(streamCall, 120000, 4000); // 2 min timeout
            await SendRecordingUrl(url, callId);
          } catch (err) {
            console.error("Failed to get processed recording:", err);
          }
        });
      })
      .catch(err => console.error("❌ Failed to join call:", err));

    return () => {
      streamClient.disconnectUser();
    };
  }, [user, token, callId, apiKey, isLoading]);

  if (isLoading) return <p>Loading user...</p>;
  if (error) return <p>Error loading call: {error.message}</p>;
  if (!client || !call) return <p>Initializing call...</p>;

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