const { default: mongoose } = require("mongoose");
const Channel = require("../Model/channel_model");
const User = require("../Model/user_model");

exports.createChannel = async (request, response, next) => {
  try {
    const { name, members, userId, desc, visibility } = request.body;
    console.log(request.body);

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
      desc,
      members,
      admin: userId,
      creator: `${admin.fname} ${admin.lname}`,
      visibility: visibility,
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
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const searchValue = req.query.search || ""; // Default to empty string if not provided
    const skip = (page - 1) * limit;

    const query = {
      members: userId,
      ...(searchValue && {
        $or: [{ name: { $regex: searchValue, $options: "i" } }],
      }),
    };
    const channels = await Channel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ updatedAt: -1 });

    const totalCount = await Channel.countDocuments(query);

    return res.status(200).json({
      status: true,
      message: "Channels retrieved successfully",
      data: channels,
      metadata: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount, 
      },
    });
  } catch (error) {
    console.error("Error getting user channels:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllChannels = async (req, res) => {
  try {
    const channels = await Channel.find({ visibility: "public" }).sort({
      updatedAt: -1,
    });
    if (!channels || channels.length === 0) {
      return res.status(404).json({ message: "No channels found" });
    }
    return res.status(200).json({ channels });
  } catch (error) {
    console.error("Error getting all channels:", error);
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
    const filteredMembers = membersUser.filter(
      (member) => member._id.toString() !== channels.admin._id.toString()
    );
    const combinedMembers = [channels.admin, ...filteredMembers];

    return res.status(200).json({ combinedMembers });
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

exports.leavegroup = async (req, res, next) => {
  try {
    const { channelId, userId } = req.body;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    if (!channel.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User is not a member of this channel" });
    }
    channel.members = channel.members.filter(
      (member) => member.toString() !== userId
    );
    await channel.save();
    res.status(200).json({ message: "User left the channel successfully" });
  } catch (error) {
    console.error("Error leaving group:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.addMember = async (req, res, next) => {
  try {
    const { channelId, userId } = req.body;
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    if (channel.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User is already a member of this Group" });
    }
    channel.members.push(userId);
    await channel.save();
    res.status(200).json({ message: "User added to the channel successfully" });
  } catch (error) {
    console.error("Error adding member:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
