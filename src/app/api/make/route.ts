import dbConnect from "@/lib/dbConnect";
import User from "@/models/userModel";
import { generateRandomUsername } from "@/utils/utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("SSID")?.value;
    console.log(userId);

    await dbConnect();

    let user = userId
      ? await User.findById(userId).select("username imageUrl")
      : null;

    if (!user) {
      user = new User({
        username: generateRandomUsername(),
        imageUrl: "https://imagedump.vercel.app/notFound.jpg",
      });
      await user.save();

      const response = NextResponse.json(user, { status: 200 });
      response.cookies.set("SSID", user._id.toString(), {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 365,
      });

      return response;
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error during GET request:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
