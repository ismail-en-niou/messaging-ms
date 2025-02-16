const { Server } = require("socket.io");

const io = new Server(3333, {
  cors: {
    origin: "https://studious-goldfish-9pwrwvp777x3qqq-5174.app.github.dev",
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
    const user = onlineUsers.find(user => user.userId === message.recipientId);

    if (user) {
        io.to(user.socketId).emit("getMessage", message);
    }
});


  // Handle disconnection
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    console.log(`❌ User disconnected: ${socket.id}`);
    
    // Send updated list to all clients
    io.emit("updateOnlineUsers", onlineUsers);
    console.log("✅ Online Users:", onlineUsers);
  });
});

console.log("🚀 Socket.io server running on port 3000");
