import dotenv from "dotenv";
dotenv.config();
console.log("Loaded MONGODB_URI:", process.env.MONGODB_URI); // Debug line
import express from "express";
import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing");
  await mongoose.connect(uri, { });
  console.log("MongoDB connected");
};
