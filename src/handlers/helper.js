import { CLIENT_VERSION } from "../constants.js";
import { getGameAssets } from "../init/assets.js";
import { createStage, setStage } from "../models/stage.model.js";
import { getUsers, removeUser } from "../models/user.model.js";
import handlerMappings from "./handler-mapping.js";

export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id);
  console.log(`User disconnected: ${socket.id}`);
  console.log("Current users: ", getUsers());
};

export const handleConnection = (socket, uuid) => {
  console.log(`User connected: ${uuid} with socket ID ${socket.id}`);
  console.log("Current users: ", getUsers());

  createStage(uuid);

  socket.emit("connection", { uuid });
};

export const handlerEvent = (io, socket, data) => {
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit("response", { status: "fail", message: "Client version mismatch." });
    return;
  }

  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit("response", { status: "fail", message: "Handler not found." });
    return;
  }

  const response = handler(data.userId, data.payload);
  if (response.payload) response.handlerId = data.handlerId;

  if (response.broadcast) {
    io.emit("response", "broadcast");
    return;
  }

  socket.emit("response", response);
};
