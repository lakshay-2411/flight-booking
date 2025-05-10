// src/services/amadeusAuth.ts
import axios from "axios";

const AMADEUS_API_KEY = "zNUAB6ZM6jVI69NFK4zpsYMqh5aiM81r";
const AMADEUS_API_SECRET = "5UeA0f9HlRjJX5Bk";

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
