import Redis from "ioredis";

function getRedisUrl() {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  } else {
    throw new Error("REDIS URL is not available");
  }
}
export const redis = new Redis(getRedisUrl());
