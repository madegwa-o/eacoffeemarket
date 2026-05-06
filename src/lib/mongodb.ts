import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("Missing MONGODB_URI");

const globalWithMongoose = global as typeof globalThis & { mongooseConn?: Promise<typeof mongoose> };

export function connectDB() {
  if (!globalWithMongoose.mongooseConn) {
    globalWithMongoose.mongooseConn = mongoose.connect(MONGODB_URI, { dbName: process.env.MONGODB_DB || "eacoffee" });
  }
  return globalWithMongoose.mongooseConn;
}
