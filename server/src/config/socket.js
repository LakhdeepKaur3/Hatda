exports = module.exports = function(io) {
  // Set socket.io listeners.
  io.on("connection", socket => {
    console.log("User connected");

    socket.on("enter conversation", message => {
      socket.join(message);
      console.log("joined " + message);
    });

    socket.on("leave conversation", message => {
      socket.leave(message);
      console.log("left " + message);
    });

    socket.on("new message", message => {
      io.sockets.in(message).emit("refresh messages", message);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
    socket.on("connection", function(socket) {
      socket.on("new_notification", function(data) {
        console.log(data.title, data.message);
        io.sockets.emit("show_notification", {
          title: data.title,
          message: data.message,
          icon: data.icon
        });
      });
    });
    socket.on("send to server", function(data) {
      socket.broadcast("notification", "test data");
    });
    socket.on("send to server", function(data) {
      socketId = getSocketIdFromUserId(user_id);
      io.to(socketId).emit("notification", "test data");
    });
  });
};
