const { Server } = require("socket.io");

const PORT = 3333;
const io = new Server(PORT, {
  cors: {
    origin: ["https://socket.mandomati.com", "http://localhost:3333" , "https://studious-goldfish-9pwrwvp777x3qqq-3333.app.github.dev/"], // Ensure localhost includes a valid port
    methods: ["GET", "POST"],
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log(`🔗 New connection: ${socket.id}`);

  // Handle adding users
  socket.on("addNewUser", (userId) => {
    if (!onlineUsers.some((user) => user.userId === userId)) {
      onlineUsers.push({ userId, socketId: socket.id });
    }
    console.log("✅ Online Users:", onlineUsers);

    // Send updated list to all clients
    io.emit("updateOnlineUsers", onlineUsers);
  });

  // Handle sending messages
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find((user) => user.userId === message.recipientId);

    if (user) {
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        timestamp: new Date(),
      });
    }
  });
  // Handling the 'markAsRead' event
  socket.on("markAsRead", (notificationId) => {
  // Find the notification by ID and set isRead to true
  const notification = onlineUsers.find((user) => user.socketId === socket.id);

  if (notification) {
    // Send back the updated notification to the client
    io.to(socket.id).emit("notificationUpdated", {
      notificationId,
      isRead: true,
    });
  }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    console.log(`❌ User disconnected: ${socket.id}`);

    // Send updated list to all clients
    io.emit("updateOnlineUsers", onlineUsers);
    console.log("✅ Updated Online Users:", onlineUsers);
  });
});

console.log(`🚀 Socket.io server running on port ${PORT}`);
