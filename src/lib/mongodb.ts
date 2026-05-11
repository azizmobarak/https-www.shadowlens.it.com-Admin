import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://brandinimartil:AnVd0GZgZamPEQ1C@icare.6roef7u.mongodb.net/shadow_ai?retryWrites=true&w=majority";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
