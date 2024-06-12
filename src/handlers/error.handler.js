const errorHandler = (err, socket) => {
  console.error(err);
  socket.emit("response", { status: "fail", message: err.message });
};

export default errorHandler;
