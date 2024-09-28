import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({}, { timestamps: true });

const Room = mongoose.models?.Room || mongoose.model("Room", roomSchema);

export default Room;
