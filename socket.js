const { Server: SocketIOServer } = require("socket.io");
const Message = require("./Model/message_model");
const Channel = require("./Model/channel_model");
const pvsp = require("./Model/pvsp_model");
const User = require("./Model/user_model");

exports.setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
    },
  });

  const userSocketMap = new Map();

  const addChannelNotify = async (channel) => {
    if (channel && channel.members) {
      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("new-channel-added", channel);
        }
      });
    }
  };

  const addChatNotify = async (p2p) => {
    if (p2p && p2p.members) {
      p2p.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("new-chat-added", p2p);
        }
      });
    }
  };

  const sendMessage = async (message) => {
    const recipientSocketId = userSocketMap.get(message.recipient);
    const senderSocketId = userSocketMap.get(message.sender);

    // Create the message
    const createdMessage = await Message.create(message);

    // Find the created message by its ID and populate sender and recipient details
    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email fname lname  ")
      .populate("recipient", "id email fname lname  ")
      .exec();

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveMessage", messageData);
    }

    // Optionally, send the message back to the sender (e.g., for message confirmation)
    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData);
    }
  };

  const sendP2PMessage = async (message,socket) => {
    const { P2PId, sender,recipient, content, messageType, fileUrl } = message;

    const receiverChat = await User.findById(recipient);
  
    if (receiverChat.blockedUsers.includes(sender)) {
      // Send error back through the socket
      return socket.emit("chat-error", {
        status: 403,
        message: "You are blocked by this user.",
      });
    }

    // Create and save the message
    const createdMessage = await Message.create({
      sender,
      recipient, 
      content,
      messageType,
      timestamp: new Date(),
      fileUrl,
    });

    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email fname lname ")
      .exec();

    // Add message to the channel
    await pvsp.findByIdAndUpdate(P2PId, {
      $push: { messages: createdMessage._id },
    });

    // Fetch all members of the channel
    const channel = await pvsp.findById(P2PId).populate("members");

    const finalData = { ...messageData._doc, P2PId: channel._id };
    if (channel && channel.members) {
      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member._id.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("recieve-chat-message", finalData);
        }
      });
      const adminSocketId = userSocketMap.get(channel.admin._id.toString());
      if (adminSocketId) {
        io.to(adminSocketId).emit("recieve-chat-message", finalData);
      }
    }
  };

  const sendChannelMessage = async (message) => {
    const { channelId, sender, content, messageType, fileUrl } = message;

    // Create and save the message
    const createdMessage = await Message.create({
      sender,
      recipient: null, // Channel messages don't have a single recipient
      content,
      messageType,
      timestamp: new Date(),
      fileUrl,
    });

    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email fname lname ")
      .exec();

    // Add message to the channel
    await Channel.findByIdAndUpdate(channelId, {
      $push: { messages: createdMessage._id },
    });

    // Fetch all members of the channel
    const channel = await Channel.findById(channelId).populate("members");

    const finalData = { ...messageData._doc, channelId: channel._id };
    if (channel && channel.members) {
      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member._id.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("recieve-channel-message", finalData);
        }
      });
      const adminSocketId = userSocketMap.get(channel.admin._id.toString());
      if (adminSocketId) {
        io.to(adminSocketId).emit("recieve-channel-message", finalData);
      }
    }
  };

  const disconnect = (socket) => {
    console.log("Client disconnected", socket.id);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
    } else {
      console.log("User ID not provided during connection.");
    }

    socket.on("add-channel-notify", addChannelNotify);

    socket.on("add-chat-notify", addChatNotify);

    socket.on("sendMessage", sendMessage);

   // socket.on("send-pvsp-message", sendP2PMessage);
    socket.on("send-pvsp-message", async (message) => {
      try {
        await sendP2PMessage(message, socket);
      } catch (error) {
        socket.emit("chat-error", {
          status: 403,
          message: "You are blocked by this user.",
        });
      }
    });

    socket.on("send-channel-message", sendChannelMessage);

    socket.on("disconnect", () => disconnect(socket));
  });
};



