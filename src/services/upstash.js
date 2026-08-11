import { Redis } from '@upstash/redis';

// Upstash Redis REST API credentials
const UPSTASH_REDIS_REST_URL = import.meta.env.VITE_UPSTASH_REDIS_REST_URL || "https://green-cave-9999.upstash.io";
const UPSTASH_REDIS_REST_TOKEN = import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN || "mock_token";

export const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
});
