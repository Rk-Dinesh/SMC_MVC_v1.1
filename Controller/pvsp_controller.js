const { default: mongoose } = require("mongoose");
const User = require("../Model/user_model");
const pvsp = require("../Model/pvsp_model");

exports.createChat = async (request, response, next) => {
  try {
    const { members, userId } = request.body;

    const admin = await User.findById(userId);
    if (!admin) {
      return response.status(400).json({ message: "Admin user not found." });
    }

    const validMembers = await User.find({ _id: { $in: members } });

    if (validMembers.length !== members.length) {
      return response
        .status(400)
        .json({ message: "Some members are not valid users." });
    }

    const newChat = new pvsp({
      members,
      admin: userId,
    });

    await newChat.save();

    return response.status(201).json({ chat: newChat });
  } catch (error) {
    console.error("Error creating chat:", error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getUserChats1 = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.query.userId);
    const chats = await pvsp
      .find({
        members: userId,
      })
      .sort({ updatedAt: -1 });

    return res.status(200).json({ chats });
  } catch (error) {
    console.error("Error getting user channels:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getUserChats2 = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.query.userId);
    const chats = await pvsp
      .find({
        members: userId,
      })
      .sort({ updatedAt: -1 });

    // Remove the userId from the members array in each chat
    const modifiedChats = chats.map((chat) => {
      const members = chat.members.filter(
        (member) => member.toString() !== userId.toString()
      );
      return {
        ...chat.toObject(),
        members,
      };
    });

    return res.status(200).json({ chats: modifiedChats });
  } catch (error) {
    console.error("Error getting user channels:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getUserChats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.query.userId);

    // Fetch chats that include the userId in members
    const chats = await pvsp
      .find({
        members: userId,
      })
      .sort({ updatedAt: -1 })
      .populate({
        path: "members",
        select: "fname lname email _id verifyTokenExpires about",
      }); // Populate members

    // Remove the userId from the members array in each chat
    const modifiedChats = chats.map((chat) => {
      // Filter out the userId from the members
      const filteredMembers = chat.members.filter(
        (member) => member._id.toString() !== userId.toString()
      );
      return {
        ...chat.toObject(), // Convert Mongoose document to plain object
        members: filteredMembers, // Update members without the given userId
      };
    });

    return res.status(200).json({ chats: modifiedChats });
  } catch (error) {
    console.error("Error getting user channels:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getChatId = async (req, res, next) => {
  try {
    const { userId, contactId } = req.body;
    if (!userId || !contactId) {
      return res
        .status(400)
        .json({ message: "User ID and Contact ID are required." });
    }
    let chat = await pvsp
      .findOne({
        members: { $all: [userId, contactId] },
      })
      .populate({
        path: "members",
        select: "fname lname email _id verifyTokenExpires about",
      });
      if (!chat) {
        chat = new pvsp({
          members: [userId, contactId], 
          admin: userId,
        });
        await chat.save();

        console.log(chat);
        
       
        await chat.populate({
          path: "members",
          select: "fname lname email _id verifyTokenExpires about",
        });
      }

    const filteredMembers = chat.members.filter(
      (member) => member._id.toString() !== userId.toString()
    );
    const filteredChat = {
      ...chat.toObject(),
      members: filteredMembers,
    };

    return res.status(200).json({ chat: filteredChat });
  } catch (error) {
    console.error("Error getting chat ID:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getChatMessages = async (req, res, next) => {
  try {
    const { P2PId } = req.params;

    const channel = await pvsp.findById(P2PId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "fname lname email _id ",
      },
    });

    if (!channel) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const messages = channel.messages;
    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Error getting channel messages:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
