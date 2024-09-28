"use client";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
const userId = Cookies.get("SSID");
const search = new URLSearchParams(
  typeof window !== "undefined" ? window.location.search : ""
);
export const socket = io("http://localhost:4000", {
  query: { userId, roomId: search.get("room") },
});
