import { Redis } from '@upstash/redis';

// Upstash Redis REST API credentials from Vercel KV environment or fallback
const UPSTASH_REDIS_REST_URL = 
  import.meta.env.VITE_KV_REST_API_URL || 
  import.meta.env.VITE_UPSTASH_REDIS_REST_URL || 
  "https://green-cave-9999.upstash.io";

const UPSTASH_REDIS_REST_TOKEN = 
  import.meta.env.VITE_KV_REST_API_TOKEN || 
  import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN || 
  "mock_token";

export const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
});

// Helper functions for KV Storage operations
export const kvStorage = {
  async getUsers() {
    try {
      const users = await redis.get('moccamana_users');
      return users || [];
    } catch (e) {
      console.warn('Upstash KV fallback to memory:', e);
      return null;
    }
  },
  async setUsers(usersList) {
    try {
      await redis.set('moccamana_users', usersList);
    } catch (e) {
      console.warn('Upstash KV set error:', e);
    }
  },
  async getUserTrips(username) {
    try {
      const trips = await redis.get(`moccamana_trips_${username}`);
      return trips || null;
    } catch (e) {
      return null;
    }
  },
  async setUserTrips(username, trips) {
    try {
      await redis.set(`moccamana_trips_${username}`, trips);
    } catch (e) {}
  }
};
