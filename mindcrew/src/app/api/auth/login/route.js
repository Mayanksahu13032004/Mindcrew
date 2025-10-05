import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Skip if MongoDB URI missing (build time)
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI not set. Skipping build-time DB call.");
      return NextResponse.json({ message: "Build check" });
    }

    await connectDB();

    const { email, password } = await req.json();
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ message: "Login successful", user });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
