const { default: mongoose } = require("mongoose");
const Channel = require("../Model/channel_model");
const User = require("../Model/user_model");


exports.createChannel = async (request, response, next) => {
    try {
      const { name, members,userId,desc } = request.body;

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
  
      const newChannel = new Channel({
        name,
        members,
        admin: userId,
        creator: `${admin.fname} ${admin.lname}`,
        desc:desc,  
      });
  
      await newChannel.save();
  
      return response.status(201).json({ channel: newChannel });
    } catch (error) {
      console.error("Error creating channel:", error);
      return response.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  exports.getUserChannels = async (req, res) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.query.userId);
      const channels = await Channel.find({
        $or: [{ admin: userId }, { members: userId }],
      }).sort({ updatedAt: -1 });
  
      return res.status(200).json({ channels });
    } catch (error) {
      console.error("Error getting user channels:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  exports.getChannelMessages = async (req, res, next) => {
    try {
      const { channelId } = req.params;
  
      const channel = await Channel.findById(channelId).populate({
        path: "messages",
        populate: {
          path: "sender",
          select: "fname lname email _id ",
        },
      });
  
      if (!channel) {
        return res.status(404).json({ message: "Channel not found" });
      }
  
      const messages = channel.messages;
      return res.status(200).json({ messages });
    } catch (error) {
      console.error("Error getting channel messages:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };