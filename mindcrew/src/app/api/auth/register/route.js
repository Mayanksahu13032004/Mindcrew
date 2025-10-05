import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose.js";
import User from "@/models/User";

export async function POST(req) {
  await connectDB();
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "Email already exists" }, { status: 409 });
  }

  const user = new User({ name, email, password });
  await user.save();

  return NextResponse.json({
    message: "User registered successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
}
