import dbConnect from "@/lib/dbConnect";
import Queue from "@/models/queueModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { songData, playing } = await req.json();
    const search = req.nextUrl.searchParams;
    const roomId = search.get("roomId");
    if (!roomId) {
      throw new Error("RoomId not provided");
    }
    await dbConnect();

    const makeQueue = await Queue.findOneAndUpdate(
      { roomId, songData },
      {
        roomId,
        playing,
        songData,
      },
      { upsert: true, new: true }
    );
    await Queue.deleteMany({ roomId, playing: true });

    if (!makeQueue) throw new Error("Queue not created");

    return NextResponse.json(makeQueue, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message }, { status: 500 });
  }
}
