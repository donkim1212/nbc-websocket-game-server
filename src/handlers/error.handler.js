const errorHandler = async (err, socket) => {
  console.error(err);
  socket.emit("response", { status: "fail", message: err.message });
  socket.emit("response", { status: "fail", message: "You are disconnected from the server." });
  socket.disconnect(true);
};

export default errorHandler;
