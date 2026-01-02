import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

export async function setup() {
  const mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();

  // import app after setting MONGO_URI so db.js reads it
  const mod = await import("../app.js");
  const app = mod.default;

  // ensure mongoose connects (app/config/db will connect too)
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  return { app, mongod, mongoose };
}

export async function teardown(mongod) {
  try {
    await mongoose.disconnect();
  } finally {
    if (mongod) await mongod.stop();
  }
}
