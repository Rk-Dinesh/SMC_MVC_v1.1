const { default: mongoose } = require("mongoose");
const Channel = require("../Model/channel_model");
const User = require("../Model/user_model");

exports.createChannel = async (request, response, next) => {
  try {
    const { name, members, userId, desc } = request.body;

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
      desc: desc,
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
      members: userId ,
    }).sort({ updatedAt: -1 });

    return res.status(200).json({ channels });
  } catch (error) {
    console.error("Error getting user channels:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getChannel = async (req, res) => {
  try {
    const { channelId } = req.query;
    const channels = await Channel.findById(channelId).populate([
      {
        path: "admin",
        select: "fname lname email _id verifyTokenExpires ",
  
      },
      {
        path: "members",
        select: "fname lname email _id verifyTokenExpires",
      },
    ]);

    if (!channels) {
      return res.status(404).json({ message: "Channel not found" });
    }
    const membersUser = channels.members;
    const filteredMembers = membersUser.filter(member => member._id.toString() !== channels.admin._id.toString());
    const combinedMembers = [channels.admin, ...filteredMembers];

    return res.status(200).json({combinedMembers });
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

exports.leavegroup = async (req, res,next) => {
  try {
    const { channelId, userId } = req.body;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    if (!channel.members.includes(userId)) {
      return res.status(400).json({ message: "User is not a member of this channel" });
    }
    channel.members = channel.members.filter((member) => member.toString() !== userId);
    await channel.save();
    res.status(200).json({ message: "User left the channel successfully" });
  } catch (error) {
    console.error("Error leaving group:", error);
    return res.status(500).json({ message: "Internal Server Error" });
    
  }
}
