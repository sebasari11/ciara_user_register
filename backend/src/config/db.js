import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("Falta MONGO_URI en .env");
    process.exit(1);
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log("✅ Conectado a MongoDB");
}