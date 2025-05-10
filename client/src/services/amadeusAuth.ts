// src/services/amadeusAuth.ts
import axios from "axios";

const AMADEUS_API_KEY = import.meta.env.VITE_AMADEUS_API_KEY;
const AMADEUS_API_SECRET = import.meta.env.VITE_AMADEUS_API_SECRET;

if (!AMADEUS_API_KEY || !AMADEUS_API_SECRET) {
  console.log("Amadeus API credentials are not set in the environment variables.");
}

let token: string | null = null;
let tokenExpiry: number | null = null;

export const getAccessToken = async (): Promise<string> => {
  const now = Date.now();
  if (token && tokenExpiry && now < tokenExpiry) {
    return token;
  }

  const response = await axios.post(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: AMADEUS_API_KEY,
      client_secret: AMADEUS_API_SECRET,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  token = response.data.access_token;
  tokenExpiry = now + response.data.expires_in * 1000 - 60000; // Refresh 1 minute before expiry
  if (!token) {
    throw new Error("Failed to retrieve access token");
  }
  return token;
};
