import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import RoomUser from "@/models/roomUsers";

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters from the URL
    const { searchParams } = request.nextUrl;
    const roomId = searchParams.get("roomId");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const userId = request.cookies.get("SSID")?.value;
    if (!roomId) {
      return NextResponse.json(
        { message: "roomId is required" },
        { status: 400 },
      );
    }
    // Connect to the database

    await dbConnect();

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Find the total number of documents for pagination metadata
    const totalUsers = await RoomUser.countDocuments({ roomId, active: true });

    // Fetch the users based on roomId, active status, and pagination
    const roomUsers = await RoomUser.find({
      roomId,
      active: true,
      userId: { $ne: userId },
    })
      .select("userId")
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .populate({
        path: "userId",
        select: "username imageUrl",
      });
    // Return the paginated response with metadata
    return NextResponse.json(
      {
        totalUsers,
        currentPage: pageNumber,
        roomUsers,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: "no listeners" }, { status: 500 });
  }
}
