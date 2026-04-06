let io;

const initSocket = (server) => {
  const socketIO = require("socket.io");
  io = socketIO(server, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);
  });
};

const getIO = () => io;

module.exports = { initSocket, getIO };