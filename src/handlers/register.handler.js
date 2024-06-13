import { v4 as uuidv4 } from "uuid";
import { addUser } from "../models/user.model.js";
import { handleConnection, handleDisconnect, handlerEvent } from "./helper.js";

const registerHandler = (io) => {
  // io.use(async function (socket, next) {
  //   console.log("=============");
  //   console.log(socket.data);
  //   console.log("=============");
  //   next();
  // });
  io.on("connection", async (socket) => {
    const userUUID = uuidv4();
    addUser({ userId: userUUID, socketId: socket.id });
    await handleConnection(socket, userUUID);
    // console.log("===== ", socket.data);
    socket.on("event", (data) => handlerEvent(io, socket, data));
    socket.on("disconnect", (socket) => handleDisconnect(socket, userUUID));
  });
};

export default registerHandler;
