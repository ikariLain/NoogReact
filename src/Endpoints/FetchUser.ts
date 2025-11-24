import type { UserResponse } from "../Models/UserResponse";
import { deployed_apiLink } from "../Api_Links";

export async function fetchUser(timeoutMs = 3000): Promise<UserResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = new URL(window.location.href);

    const callIdFromUrl = url.searchParams.get("callId");
    const userIdFromUrl = url.searchParams.get("userId");
    const tokenFromUrl = url.searchParams.get("token");
    const nameFromUrl = url.searchParams.get("name");
    const imageFromUrl = url.searchParams.get("image");



    // 1️⃣ Om URL innehåller token → använd direkt (magic join)
    if (callIdFromUrl && userIdFromUrl && tokenFromUrl) {
      return {
        id: userIdFromUrl,
        token: tokenFromUrl,
        callId: callIdFromUrl,
        apiKey: import.meta.env.VITE_STREAM_API_KEY || "api missing ",
        name: nameFromUrl || "Guest User",
        image: imageFromUrl || undefined
      };
    }

    // 2️⃣ Annars anropa backend för att generera token
    if (!callIdFromUrl || !userIdFromUrl) {
      throw new Error("Missing callId or userId in URL to generate token");
    }

    const response = await fetch(
      `${deployed_apiLink}/api/calls/${callIdFromUrl}/join`, // Din backend endpoint som genererar token
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: userIdFromUrl }),
        signal: controller.signal
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: UserResponse = await response.json();

    if (!data.id || !data.token || !data.callId || !data.apiKey) {
      throw new Error("Incomplete user data from backend");
    }

    return data;
  } catch (err) {
    console.error("Error fetching user and generating token:", err);
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
