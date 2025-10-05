 import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongoose.js";

import User from "@/models/User";



export async function POST(req) {
 try {

    await connectDB();



    const { email, password } = await req.json();



    if (!email || !password) {

      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    }



    const user = await User.findOne({ email });

    if (!user || user.password !== password) {

      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    }



    return NextResponse.json({

      message: "Login successful",

      user: {

        id: user._id,

        name: user.name,

        email: user.email,

      },

    });

  } catch (err) {

    console.error("Login API error:", err);

    return NextResponse.json({ error: "Server error" }, { status: 500 });

  }

}