import { deployed_apiLink } from "../Api_Links";

export async function SendRecordingUrl(
  audioUrl: string,
  projectGroupId: string,
  language?: string
) {
  try {
    // Bygg JSON-body
    const body = {
      audioUrl,
      projectGroupId,
      language: language ?? "swedish",
    };

    console.log("📤 Sending recording via POST body...");
    console.log("📦 JSON body to send:", JSON.stringify(body));

    console.log("Type of projectGroupId:", typeof projectGroupId);
    console.log("Value of projectGroupId:", projectGroupId);


    const response = await fetch(`${deployed_apiLink}/api/Orchestrate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("⏳ Request sent, waiting for response...");

    if (!response.ok) {
      console.error("❌ Backend returned status:", response.status);
      throw new Error(`Failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Response from backend:", data);
    return data;
  } catch (error) {
    console.error("❌ Error sending recording URL:", error);
  }
}
