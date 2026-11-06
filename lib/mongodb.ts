import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

// Kept on globalThis so hot reloads in dev reuse one connection instead of
// opening a new one every time this module is re-evaluated.
const cache: MongooseCache = (globalThis.mongooseCache ??= {
  conn: null,
  promise: null,
});

export default async function connectToDatabase(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;

  // Checked here rather than at import time so that `next build` doesn't
  // need the variable for modules that merely import this file.
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Add it to .env.local.");
  }

  cache.promise ??= mongoose.connect(uri, { bufferCommands: false });

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    // Clear the failed attempt so the next call can retry.
    cache.promise = null;
    throw error;
  }

  return cache.conn;
}
