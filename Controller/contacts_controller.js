const User = require("../Model/user_model");
const Message = require("../Model/message_model");
const mongoose = require("mongoose");

exports.getAllContacts = async (request, response, next) => {
  try {
    const users = await User.find(
      { _id: { $ne: request.userId } },
      "fname lname _id"
    );

    const contacts = users.map((user) => ({
      label: `${user.fname} ${user.fname}`,
      value: user._id,
    }));

    return response.status(200).json({ contacts });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error.");
  }
};

exports.searchContacts = async (request, response, next) => {
  try {
    const { searchTerm } = request.body;

    if (searchTerm === undefined || searchTerm === null) {
      return response.status(400).send("Search Term is required.");
    }

    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const regex = new RegExp(sanitizedSearchTerm, "i");

    const contacts = await User.find({
      $and: [
        { _id: { $ne: request.userId } },
        {
          $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
        },
      ],
    });
    return response.status(200).json({ contacts });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error.");
  }
};

exports.getContactsForList = async (req, res, next) => {
  try {
    let { userId } = req;
    userId = new mongoose.Types.ObjectId(userId);

    if (!userId) {
      return res.status(400).send("User ID is required.");
    }
    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,

          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.fname",
          lastName: "$contactInfo.fname",
        //   image: "$contactInfo.image",
        //   color: "$contactInfo.color",
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

    return res.status(200).json({ contacts });
  } catch (error) {
    console.error("Error getting user contacts:", error);
    return res.status(500).send("Internal Server Error");
  }
};
